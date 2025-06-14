import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Spinner } from 'react-bootstrap'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [sortOption, setSortOption] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const { t } = useTranslation()

  useEffect(() => {
    axios
      .get('http://localhost:5000/product')
      .then((res) => {
        setProducts(res.data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching products:', error)
        setLoading(false)
      })
  }, [])

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

  const handleAddToCart = async (product) => {
    if (product.quantity <= 0) {
      setSuccessMessage(t('Out of stock'))
      setTimeout(() => setSuccessMessage(null), 3000)
      return
    }

    const item = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      image_url: product.image_url,
      type: 'product'
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || []
    localStorage.setItem('cart', JSON.stringify([...cart, item]))

    try {
      await axios.patch(`http://localhost:5000/product/${product.id}/decrease`)
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity - 1 } : p
        )
      )
      setSuccessMessage(`${product.name} ${t('added to cart')}`)
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      console.error('Error updating quantity:', err)
      setSuccessMessage(t('Failed to update quantity'))
      setTimeout(() => setSuccessMessage(null), 3000)
    }
  }

  return (
    <div
      className="container mt-4"
      style={{
        color: '#ddd',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}
    >
      <Helmet>
        <title>{t('Products')}</title>
      </Helmet>

      <h2
        className="text-center mb-4"
        style={{ color: '#222', fontWeight: '700' }}
      >
        {t('Products')}
      </h2>

      {successMessage && (
        <div
          className="text-center mb-3"
          style={{
            background: '#d4edda',
            color: '#155724',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #c3e6cb'
          }}
        >
          <i className="bi bi-check-circle me-2"></i>
          {successMessage}
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
        <button
          className="btn btn-outline-primary btn-sm mb-2"
          onClick={() => setShowFilters(!showFilters)}
          aria-expanded={showFilters}
        >
          <i className="bi bi-funnel-fill me-1"></i> {t('Filters')}
        </button>
        {showFilters && (
          <div className="d-flex flex-wrap gap-2 mb-2">
            {['priceHigh', 'priceLow', 'name'].map((option) => (
              <button
                key={option}
                onClick={() => handleSort(option)}
                className={`btn btn-sm ${
                  sortOption === option
                    ? 'btn-primary'
                    : 'btn-outline-secondary'
                }`}
              >
                {option === 'priceHigh' && t('High to low')}
                {option === 'priceLow' && t('Low to high')}
                {option === 'name' && t('A-Z')}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <Spinner animation="border" variant="light" />
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-muted fst-italic">
          {t('no_products_found')}
        </p>
      ) : (
        <div
          className="product-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px'
          }}
        >
          {getSortedProducts().map((product) => (
            <div
              key={product.id}
              className="card h-100 shadow-sm"
              style={{
                backgroundColor: '#1f1f1f',
                color: '#ddd',
                border: '1px solid #333'
              }}
            >
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="card-img-top"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              ) : (
                <div
                  className="d-flex justify-content-center align-items-center bg-secondary text-white"
                  style={{ height: '200px', fontSize: '72px' }}
                >
                  {product.name.charAt(0)}
                </div>
              )}

              <div className="card-body d-flex flex-column">
                <div
                  className="mb-2"
                  style={{ fontSize: '14px', color: '#ccc' }}
                >
                  {product.salon_name}
                </div>
                <h5 className="card-title mb-2" style={{ color: '#a3c1f7' }}>
                  {product.name}
                </h5>
                <p className="card-text" style={{ color: '#bbb', flexGrow: 1 }}>
                  {product.description}
                </p>
                <div
                  className="d-flex align-items-center mb-2"
                  style={{ color: '#ffd166' }}
                >
                  <i className="bi bi-box-seam me-2"></i>
                  <span style={{ fontSize: '0.95rem' }}>
                    {t('Quantity Available')}:{' '}
                    <strong>{product.quantity}</strong>
                  </span>
                </div>
                <div style={{ color: '#8fc1f7', fontWeight: '600' }}>
                  {t('Price')}: {product.price} {t('BD')}
                </div>
                <div className="mt-3 d-flex gap-2">
                  <button className="btn btn-outline-primary flex-fill">
                    {t('View')}
                  </button>
                  <button
                    className="btn btn-success flex-fill"
                    onClick={() => handleAddToCart(product)}
                  >
                    {t('Add')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Products
