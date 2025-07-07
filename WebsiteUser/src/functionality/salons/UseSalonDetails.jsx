import { useState, useEffect } from 'react'
import useFetch from '../../hooks/useFetch'

export default function useSalonDetails(id) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  // Responsive check
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const {
    data: salon,
    loading,
    error
  } = useFetch(id ? `http://localhost:5000/salons/${id}` : null, [id])

  const latitude =
    salon?.latitude || salon?.location?.latitude || salon?.location?.lat
  const longitude =
    salon?.longitude || salon?.location?.longitude || salon?.location?.lng

  return {
    salon,
    loading,
    error,
    isMobile,
    latitude,
    longitude
  }
}
