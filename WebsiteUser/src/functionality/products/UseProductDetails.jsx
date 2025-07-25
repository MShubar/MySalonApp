import { useEffect, useState } from 'react'
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

  useEffect(() => {
    if (fetched) {
      setProduct({
        id: fetched.id,
        name: fetched.name,
        description: fetched.description,
        price: fetched.price,
        quantity: fetched.quantity,
        image_url: fetched.image_url,
        salon_name: fetched.salon_name
      })
    }
  }, [fetched])

  return { product, loading, error, retry }
}
