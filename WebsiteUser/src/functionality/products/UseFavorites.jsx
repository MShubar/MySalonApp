import { useState, useEffect } from 'react'

export default function useFavorites(userId, userType) {
  const [userLocation, setUserLocation] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        },
        (err) => console.error('Geolocation error:', err)
      )
    }
  }, [])

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!userId || !userLocation) return
      setLoading(true)
      try {
        const res = await fetch(
          `http://localhost:5000/favorites/${userId}?type=${userType}`
        )
        const data = await res.json()
        const array = Array.isArray(data) ? data : []
        const enriched = array.map((salon) => ({
          ...salon,
          distance:
            salon.latitude && salon.longitude
              ? calculateDistance(
                  userLocation.latitude,
                  userLocation.longitude,
                  salon.latitude,
                  salon.longitude
                )
              : null
        }))
        setFavorites(enriched)
      } catch (err) {
        console.error('Fetch favorites error:', err)
        setError(err.message || 'Failed to fetch')
      } finally {
        setLoading(false)
      }
    }
    fetchFavorites()
  }, [userId, userType, userLocation])

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (deg) => (deg * Math.PI) / 180
    const R = 6371
    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const toggleFavorite = async (salonId) => {
    try {
      await fetch(
        `http://localhost:5000/favorites/users/${userId}/favorites/${salonId}`,
        { method: 'POST' }
      )
      // re-fetch updated favorites
      setFavorites((prev) =>
        prev.map((s) =>
          s.id === salonId ? { ...s, isFavorite: !s.isFavorite } : s
        )
      )
    } catch (err) {
      console.error('Toggle favorite error:', err)
    }
  }

  return { favorites, loading, error, toggleFavorite, userLocation }
}
