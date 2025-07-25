import { useState, useEffect } from 'react'
import useFetch from '../../hooks/useFetch'
import { API_URL } from '../../config'

export default function useProductDetails(id) {
  const {
    data: fetched,
    loading,
    error,
    retry
  } = useFetch(id ? `${API_URL}/product/${id}` : null, [id])

  const [product, setProduct] = useState(null)
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth < 768
  )

  useEffect(() => {
    if (fetched) {
      setProduct({
        id: fetched.id,
        name: fetched.name,
        description: fetched.description,
        price: fetched.price,
        quantity: fetched.quantity,
        image_url: fetched.image_url,
        salon_name: fetched.salon_name,
        images: fetched.images, // include images if available
      })
    }
  }, [fetched])

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return { product, loading, error, retry, isMobile }
}
