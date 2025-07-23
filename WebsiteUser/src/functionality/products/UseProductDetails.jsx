import { useState, useEffect } from 'react'
import useFetch from '../../hooks/useFetch'
import { API_URL } from '../../config'

export default function useProductDetails(id) {
  const {
    data: product,
    loading,
    error,
    retry
  } = useFetch(id ? `${API_URL}/product/${id}` : null, [id])

  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return { product, loading, error, retry, isMobile }
}
