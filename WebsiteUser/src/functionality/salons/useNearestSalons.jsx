import { useState, useEffect } from 'react'
import useFetch from '../../hooks/useFetch'
import { API_URL } from '../../config'

export default function useNearestSalons(userType, userId) {
  const [userLocation, setUserLocation] = useState(null)
  const [favorites, setFavorites] = useState(new Set())
  const [minRating, setMinRating] = useState(0)
  const [maxDistance, setMaxDistance] = useState(100)
  const [sortBy, setSortBy] = useState('distance')

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          })
        },
        (err) => console.error('Geolocation error:', err)
      )
    } else {
      console.error('Geolocation not supported')
    }
  }, [])

  // Fetch salons
  const {
    data: salonsData = [],
    loading,
    error,
    refetch
  } = useFetch(
    userLocation
      ? `${API_URL}/salons?userLat=${userLocation.latitude}&userLng=${userLocation.longitude}&type=${userType}`
      : null,
    [userLocation, userType]
  )

  // Calculate distances
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (deg) => (deg * Math.PI) / 180
    const R = 6371
    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  }

  const salons = Array.isArray(salonsData)
    ? salonsData.map((salon) => {
        const distance =
          salon.latitude && salon.longitude && userLocation
            ? calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                salon.latitude,
                salon.longitude
              )
            : null
        return { ...salon, distance }
      })
    : []

  // Fetch favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!userId) return
      try {
        const res = await fetch(`${API_URL}/favorites/${userId}`)
        const data = await res.json()
        setFavorites(new Set(data.map((f) => Number(f.salon_id))))
      } catch (err) {
        console.error('Fetching favorites failed:', err)
      }
    }
    fetchFavorites()
  }, [userId])

  // Toggle favorite
  const toggleFavorite = async (salonId) => {
    try {
      await fetch(
        `${API_URL}/favorites/users/${userId}/favorites/${salonId}`,
        { method: 'POST' }
      )
      refetch()
    } catch (err) {
      console.error('Toggle favorite failed:', err)
    }
  }

  // Filter & sort
  const filtered = salons.filter((s) => {
    const meetsRating = s.rating >= minRating
    const meetsDistance =
      s.distance !== null ? s.distance <= maxDistance : false
    return meetsRating && meetsDistance
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'distance') {
      if (a.distance === null) return 1
      if (b.distance === null) return -1
      return a.distance - b.distance
    } else if (sortBy === 'rating') {
      return b.rating - a.rating
    }
    return 0
  })

  return {
    loading,
    error,
    salons: sorted,
    favorites,
    minRating,
    setMinRating,
    maxDistance,
    setMaxDistance,
    sortBy,
    setSortBy,
    toggleFavorite,
    retry: refetch
  }
}
