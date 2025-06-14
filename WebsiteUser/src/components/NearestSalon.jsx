import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Spinner } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const NearestSalon = ({ userType, userId }) => {
  const [salons, setSalons] = useState([])
  const [favorites, setFavorites] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [userLocation, setUserLocation] = useState(null)
  const { t } = useTranslation()
  const [showFilters, setShowFilters] = useState(false)
  const navigate = useNavigate()

  // Filter states
  const [minRating, setMinRating] = useState(0) // minimum rating filter
  const [maxDistance, setMaxDistance] = useState(100) // max distance in km filter

  // Sort state: 'distance' or 'rating'
  const [sortBy, setSortBy] = useState('distance')

  // Haversine formula to calculate distance in km
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRadians = (deg) => (deg * Math.PI) / 180
    const R = 6371 // Radius of Earth in km
    const dLat = toRadians(lat2 - lat1)
    const dLon = toRadians(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  // Get user geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        },
        (error) => {
          console.error('Error getting user location:', error)
          setLoading(false)
        }
      )
    } else {
      console.error('Geolocation is not supported')
      setLoading(false)
    }
  }, [])

  // Fetch salons and calculate distance
  useEffect(() => {
    if (!userType || !userLocation) return

    const fetchSalons = async () => {
      try {
        const response = await axios.get('http://localhost:5000/salons', {
          params: {
            userLat: userLocation.latitude,
            userLng: userLocation.longitude,
            type: userType
          }
        })

        const salonsWithDistance = response.data.map((salon) => {
          const distance =
            salon.latitude && salon.longitude
              ? calculateDistance(
                  userLocation.latitude,
                  userLocation.longitude,
                  salon.latitude,
                  salon.longitude
                )
              : null
          return { ...salon, distance }
        })

        setSalons(salonsWithDistance)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching salons:', error)
        setLoading(false)
      }
    }

    fetchSalons()
  }, [userType, userLocation])

  // Fetch user's favorite salons
  useEffect(() => {
    if (!userId) return

    const fetchFavorites = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/favorites/${userId}`
        )
        const favoriteSalonIds = response.data.map((fav) =>
          Number(fav.salon_id)
        )
        setFavorites(new Set(favoriteSalonIds))
      } catch (error) {
        console.error('Error fetching favorites:', error)
      }
    }

    fetchFavorites()
  }, [userId])

  const toggleFavorite = async (salonId) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/favorites/${salonId}`,
        { userId }
      )
      setFavorites(new Set(response.data.favorites))
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-4">
        <Spinner animation="border" variant="light" />
      </div>
    )
  }

  // Filter salons based on minRating and maxDistance filters
  const filteredSalons = salons.filter((salon) => {
    const meetsRating = salon.rating >= minRating
    const meetsDistance =
      salon.distance !== null ? salon.distance <= maxDistance : false
    return meetsRating && meetsDistance
  })

  // Sort filtered salons by current sort option
  const sortedSalons = [...filteredSalons].sort((a, b) => {
    if (sortBy === 'distance') {
      // Sort by distance ascending (nearest first)
      // If distance is null, put those last
      if (a.distance === null) return 1
      if (b.distance === null) return -1
      return a.distance - b.distance
    } else if (sortBy === 'rating') {
      // Sort by rating descending (highest first)
      return b.rating - a.rating
    }
    return 0
  })

  return (
    <div className="container mt-4" style={{ color: '#ddd' }}>
      <Helmet>
        <title>Nearest Salons</title>
      </Helmet>
      <h1 className="text-center" style={{ color: '#222' }}>
        {t('Nearest Salons')}
      </h1>

      <div className="d-flex justify-content-between mb-3 align-items-center gap-2 flex-wrap">
        <button
          className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
          onClick={() => setShowFilters(!showFilters)}
          aria-expanded={showFilters}
          style={{
            fontWeight: 600,
            boxShadow: '0 0 8px rgba(79, 142, 247, 0.4)',
            transition: 'all 0.3s ease'
          }}
        >
          <i className="bi bi-funnel-fill fs-5"></i> {t('Filters')}
        </button>

        {/* Sort Button */}
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() =>
            setSortBy((prev) => (prev === 'distance' ? 'rating' : 'distance'))
          }
          title={t(
            sortBy === 'distance'
              ? 'Sort by Rating (High to Low)'
              : 'Sort by Distance (Near to Far)'
          )}
          style={{
            fontWeight: 600,
            boxShadow: '0 0 8px rgba(150, 150, 150, 0.4)',
            transition: 'all 0.3s ease'
          }}
        >
          {sortBy === 'distance' ? (
            <>
              <i className="bi bi-sort-numeric-up"></i> {t('Sort by Distance')}
            </>
          ) : (
            <>
              <i className="bi bi-star-fill"></i> {t('Sort by Rating')}
            </>
          )}
        </button>
      </div>

      {/* Filters UI */}
      {showFilters && (
        <div
          className="mb-4 p-3 border rounded"
          style={{ backgroundColor: '#2a2a2a' }}
        >
          <div className="mb-3">
            <label
              htmlFor="minRating"
              className="form-label"
              style={{ color: '#ccc' }}
            >
              {t('Minimum Rating')}
            </label>
            <select
              id="minRating"
              className="form-select"
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
            >
              {[0, 1, 2, 3, 4, 5].map((star) => (
                <option key={star} value={star}>
                  {star === 0 ? t('No minimum') : `${star} ⭐`}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label
              htmlFor="maxDistance"
              className="form-label"
              style={{ color: '#ccc' }}
            >
              {t('Maximum Distance (km)')}
            </label>
            <input
              id="maxDistance"
              type="number"
              className="form-control"
              min={0}
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
            />
          </div>
        </div>
      )}

      {sortedSalons.length === 0 ? (
        <p className="text-center text-muted fst-italic">
          {t('No Salons Found')}
        </p>
      ) : (
        <div className="row">
          {sortedSalons.map((salon) => {
            const isFavorited = favorites.has(salon.id)
            return (
              <motion.div
                key={salon.id}
                className="col-md-4 mb-4"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }} // triggers when 20% of card is visible
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                <div
                  className="card h-100 shadow-sm"
                  style={{
                    backgroundColor: '#1f1f1f',
                    color: '#ddd',
                    border: '1px solid #333'
                  }}
                >
                  {salon.image_url ? (
                    <img
                      src={salon.image_url}
                      alt={`${salon.name} logo`}
                      className="card-img-top"
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      className="d-flex justify-content-center align-items-center bg-secondary"
                      style={{ height: '200px', fontSize: '72px' }}
                    >
                      {salon.name.charAt(0)}
                    </div>
                  )}

                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title" style={{ color: '#a3c1f7' }}>
                      {salon.name}
                    </h5>
                    {salon.services && salon.services.length > 0 ? (
                      <div
                        className="mb-2"
                        style={{ color: '#ccc', fontSize: '0.95rem' }}
                      >
                        {t('Services')}:
                        <div className="mt-1 d-flex flex-wrap gap-2">
                          {salon.services.map((service, i) => (
                            <span
                              key={i}
                              className="badge bg-primary-subtle text-primary px-2 py-1"
                              style={{
                                borderRadius: '20px',
                                backgroundColor: '#254d8f',
                                fontSize: '0.8rem'
                              }}
                            >
                              {service.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="card-text fst-italic text-muted">
                        {t('No services available')}
                      </p>
                    )}

                    <div style={{ fontWeight: '600' }}>
                      ⭐ {salon.rating} •{' '}
                      {salon.distance !== null
                        ? `${salon.distance.toFixed(2)} ${t('km')}`
                        : 'Unknown distance'}
                    </div>

                    <div className="mt-3 d-flex gap-2 align-items-center">
                      <button
                        onClick={() => toggleFavorite(salon.id)}
                        className="btn btn-link p-0"
                        style={{
                          color: isFavorited ? '#ffc107' : '#6c757d',
                          fontSize: '1.5rem'
                        }}
                        aria-label={
                          isFavorited
                            ? t('Remove from favorites')
                            : t('Add to favorites')
                        }
                      >
                        <i
                          className={
                            isFavorited ? 'bi bi-star-fill' : 'bi bi-star'
                          }
                        ></i>
                      </button>
                      <button
                        className="btn btn-outline-primary flex-fill"
                        onClick={() => navigate(`/salon/${salon.id}`)}
                      >
                        {t('View')}
                      </button>
                      <button
                        className="btn btn-success flex-fill"
                        onClick={() => navigate(`/salon/${salon.id}/book`)}
                      >
                        {t('Book')}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default NearestSalon
