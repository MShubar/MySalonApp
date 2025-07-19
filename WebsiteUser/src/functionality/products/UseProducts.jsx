import { useState, useEffect } from 'react'
import useFetch from '../../hooks/useFetch'
import { API_URL } from '../../config'

export default function useProducts(t) {
  const {
    data: fetchedProducts = [],
    loading,
    error
  } = useFetch(`${API_URL}/product`, [])

  const [products, setProducts] = useState([])
  const [sortOption, setSortOption] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    if (Array.isArray(fetchedProducts)) {
      setProducts(fetchedProducts.map((p) => ({ ...p, selectedQty: 1 })))
    }
  }, [fetchedProducts])

  const handleSort = (option) => setSortOption(option)

  const getSortedProducts = () => {
    const sorted = [...products]
    if (sortOption === 'priceHigh')
      return sorted.sort((a, b) => b.price - a.price)
    if (sortOption === 'priceLow')
      return sorted.sort((a, b) => a.price - b.price)
    if (sortOption === 'name')
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    return sorted
  }

  const adjustQty = (id, delta) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newQty = Math.min(
            Math.max((p.selectedQty || 1) + delta, 1),
            p.quantity
          )
          return { ...p, selectedQty: newQty }
        }
        return p
      })
    )
  }

  const handleAddToCart = async (product, qty = 1) => {
    if (product.quantity < qty) {
      showOverlay(t('Not enough stock available'))
      return
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || []
    const itemsToAdd = Array.from({ length: qty }, () => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      image_url: product.image_url,
      type: 'product'
    }))
    localStorage.setItem('cart', JSON.stringify([...cart, ...itemsToAdd]))

    try {
      await fetch(`${API_URL}/product/${product.id}/decrease`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qty })
      })
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id
            ? { ...p, quantity: p.quantity - qty, selectedQty: 1 }
            : p
        )
      )
      showOverlay(`${product.name} x${qty} ${t('added to cart')}`)
    } catch (err) {
      console.error('Error updating quantity:', err)
      showOverlay(t('Failed to update quantity'))
    }
  }

  const showOverlay = (message) => {
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(null), 2500)
  }

  return {
    products,
    loading,
    error,
    sortOption,
    successMessage,
    handleSort,
    getSortedProducts,
    adjustQty,
    handleAddToCart
  }
}
