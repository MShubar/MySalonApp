import React, { useState } from 'react'
import { Spinner } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'
import styled from 'styled-components'
import 'bootstrap/dist/css/bootstrap.min.css'
import useFavorites from '../../functionality/products/UseFavorites'

const Container = styled.div`
  color: #ddd;
`

const Header = styled.h2`
  color: #222;
  font-weight: 700;
`

const FilterContainer = styled.div`
  background-color: #2a2a2a;
`

const CardStyled = styled.div`
  background-color: #242424;
  color: #f0f8ff;
  border: 1px solid #444;
  border-radius: 16px;
  overflow: hidden;
`

const CardImage = styled.img`
  height: 200px;
  object-fit: cover;
`

const Placeholder = styled.div`
  height: 200px;
  font-size: 72px;
  color: #ddd;
`

const CardTitle = styled.h5`
  color: #a3c1f7;
  font-weight: bold;
`

const RatingDistance = styled.div`
  font-size: 0.95rem;
`

const ServiceBadge = styled.span`
  border-radius: 20px;
  background-color: #254d8f;
  color: #f0f8ff;
  font-size: 0.8rem;
`

const Favorites = ({ userId, userType }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [minRating, setMinRating] = useState(0)
  const [maxDistance, setMaxDistance] = useState(100)
  const [sortBy, setSortBy] = useState('distance')
  const [showFilters, setShowFilters] = useState(false)

  const { favorites, loading, error, toggleFavorite } = useFavorites(
    userId,
    userType
  )

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-4">
        <Spinner animation="border" variant="light" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center mt-5 text-danger">
        {t('Failed to load favorites')}
      </div>
    )
  }

  const filteredFavorites = favorites.filter((salon) => {
    const meetsRating = salon.rating >= minRating
    const meetsDistance =
      salon.distance !== null ? salon.distance <= maxDistance : false
    return meetsRating && meetsDistance
  })

  const sortedFavorites = [...filteredFavorites].sort((a, b) => {
    if (sortBy === 'distance') {
      if (a.distance === null) return 1
      if (b.distance === null) return -1
      return a.distance - b.distance
    } else if (sortBy === 'rating') {
      return b.rating - a.rating
    }
    return 0
  })

  return (
    <Container className="container mt-4">
      <Helmet>
        <title>{t('Favorites')}</title>
      </Helmet>

      <Header className="text-center mb-4"> {t('Favorites')} </Header>

      {/* Filters and Sort Buttons */}
      <div className="d-flex justify-content-between mb-3 align-items-center gap-2 flex-wrap">
        <button
          className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
          onClick={() => setShowFilters(!showFilters)}
          aria-expanded={showFilters}
        >
          <i className="bi bi-funnel-fill fs-5"></i> {t('Filters')}
        </button>

        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() =>
            setSortBy((prev) => (prev === 'distance' ? 'rating' : 'distance'))
          }
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

      {showFilters && (
        <FilterContainer className="mb-4 p-3 border rounded">
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
        </FilterContainer>
      )}

      {sortedFavorites.length === 0 ? (
        <p className="text-center text-muted fst-italic">
          {t('No Salons Found')}
        </p>
      ) : (
        <div className="row">
          {sortedFavorites.map((salon) => (
            <Motion.div
              key={salon.id}
              className="col-md-4 mb-4"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <CardStyled className="card h-100 shadow-sm">
                {salon.image_url ? (
                  <CardImage
                    src={salon.image_url}
                    alt={`${salon.name} logo`}
                    className="card-img-top"
                  />
                ) : (
                  <Placeholder className="d-flex justify-content-center align-items-center bg-secondary">
                    {salon.name.charAt(0)}
                  </Placeholder>
                )}

                <div className="card-body d-flex flex-column">
                  <CardTitle className="card-title mb-2">
                    {salon.name}
                  </CardTitle>

                  <RatingDistance className="mb-2">
                    <strong style={{ color: '#f0e68c' }}>{t('Rating')}:</strong>{' '}
                    ⭐ {salon.rating} &nbsp;
                    <strong style={{ color: '#f0e68c' }}>
                      {t('Distance')}:
                    </strong>{' '}
                    {salon.distance !== null && salon.distance !== undefined
                      ? `${salon.distance.toFixed(2)} ${t('km')}`
                      : t('Unknown')}
                  </RatingDistance>

                  {salon.services && salon.services.length > 0 && (
                    <div className="mb-2">
                      <strong style={{ color: '#f0e68c' }}>
                        {t('Services')}:
                      </strong>
                      <div className="mt-1 d-flex flex-wrap gap-2">
                        {salon.services.map((service, i) => (
                          <ServiceBadge key={i} className="badge px-2 py-1">
                            {service.name}
                          </ServiceBadge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-auto d-flex gap-2">
                    <button
                      onClick={() => toggleFavorite(salon.id)}
                      className="btn btn-outline-warning flex-fill"
                    >
                      <i className="bi bi-star-fill"></i> {t('Saved')}
                    </button>
                    <button
                      className="btn btn-primary flex-fill"
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
              </CardStyled>
            </Motion.div>
          ))}
        </div>
      )}
    </Container>
  )
}

export default Favorites
