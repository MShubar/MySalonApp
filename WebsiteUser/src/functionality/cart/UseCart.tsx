import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { API_URL } from '../../config'

const useCart = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [cart, setCart] = useState([])

  useEffect(() => {
    const stored = localStorage.getItem('cart')
    if (stored) {
      try {
        setCart(JSON.parse(stored))
      } catch (error) {
        console.error('Error parsing cart:', error)
      }
    }
  }, [])

  const updateCartStorage = (updated) => {
    setCart(updated)
    localStorage.setItem('cart', JSON.stringify(updated))
  }

  const increaseQuantity = (item) => {
    updateCartStorage([...cart, item])
  }

  const decreaseQuantity = async (id, type) => {
    const index = cart.findIndex((i) => i.id === id)
    if (index !== -1) {
      const updated = [...cart]
      updated.splice(index, 1)
      updateCartStorage(updated)
      try {
        await axios.patch(`${API_URL}/${type}/${id}/increase`)
      } catch (err) {
        console.error('Failed to restore quantity', err)
      }
    }
  }

  const removeAllOfItem = async (id, type) => {
    const itemsToRemove = cart.filter((item) => item.id === id)
    const quantityToRestore = itemsToRemove.length

    const updated = cart.filter((item) => item.id !== id)
    updateCartStorage(updated)

    try {
      for (let i = 0; i < quantityToRestore; i++) {
        await axios.patch(`${API_URL}/${type}/${id}/increase`)
      }
    } catch (err) {
      console.error('Failed to restore quantity for removed item', err)
    }
  }

  const groupedCart = cart.reduce((acc, item) => {
    const existing = acc.find((i) => i.id === item.id && i.type === item.type)
    if (existing) {
      existing.quantity += 1
    } else {
      acc.push({ ...item, quantity: 1 })
    }
    return acc
  }, [])

  const total = groupedCart.reduce((sum, item) => {
    return sum + (parseFloat(item.price) || 0) * item.quantity
  }, 0)

  const goToCheckout = () => {
    navigate('/checkout')
  }

  return {
    t,
    groupedCart,
    total,
    increaseQuantity,
    decreaseQuantity,
    removeAllOfItem,
    goToCheckout
  }
}

export default useCart
