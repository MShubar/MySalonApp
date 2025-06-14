import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Cart = () => {
  const { t } = useTranslation()
  const [cart, setCart] = useState([])

  const navigate = useNavigate()

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
        await axios.patch(`http://localhost:5000/${type}/${id}/increase`)
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
        await axios.patch(`http://localhost:5000/${type}/${id}/increase`)
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

  return (
    <div className="container mt-4" style={{ color: '#ddd' }}>
      <h2
        className="mb-5 text-center"
        style={{ color: '#80b3ff', fontWeight: 700 }}
      >
        🛒 {t('Your Cart')}
      </h2>

      {groupedCart.length === 0 ? (
        <div className="text-center">
          <p className="text-muted fst-italic">{t('Cart is empty')}</p>
        </div>
      ) : (
        <div className="row g-4">
          {groupedCart.map((item) => (
            <div key={item.id + item.type} className="col-md-6 col-lg-4">
              <div
                className="card h-100 shadow"
                style={{
                  background: 'linear-gradient(145deg, #1a1a1a, #222)',
                  border: '1px solid #2a2a2a',
                  borderRadius: '15px',
                  color: '#f0f0f0'
                }}
              >
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.name || item.title}
                    className="card-img-top"
                    style={{ height: '180px', objectFit: 'cover' }}
                  />
                )}

                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="card-title" style={{ color: '#4f8ef7' }}>
                      {item.name || item.title}
                    </h5>
                    <p
                      style={{
                        fontSize: '0.95rem',
                        color: '#e0e0e0',
                        lineHeight: '1.4'
                      }}
                    >
                      {item.description || t('No description available')}
                    </p>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <span
                      className="fw-bold"
                      style={{ color: '#9fd3ff', fontSize: '1.1rem' }}
                    >
                      {(parseFloat(item.price) * item.quantity).toFixed(2)} BD
                    </span>
                    <div className="d-flex align-items-center gap-2">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => decreaseQuantity(item.id, item.type)}
                      >
                        –
                      </button>
                      <span className="px-2">{item.quantity}</span>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => increaseQuantity(item)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    className="btn btn-sm btn-outline-danger mt-3"
                    onClick={() => removeAllOfItem(item.id, item.type)}
                  >
                    <i className="bi bi-trash me-1" />
                    {t('Remove All')}
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="col-12 text-end mt-5">
            <h3 className="fw-bold" style={{ color: '#6fb9ff' }}>
              {t('Total')}: {total.toFixed(2)} BD
            </h3>
            <button
              className="btn btn-lg btn-primary mt-3 px-4 shadow-sm"
              onClick={() => navigate('/checkout')}
            >
              <i className="bi bi-credit-card-2-front-fill me-2"></i>
              {t('Checkout')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
