import React, { useState } from 'react'
import { Spinner } from 'react-bootstrap'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import useProducts from '../../functionality/products/UseProducts'

const Container = styled.div`
  color: #ddd;
`

const Header = styled.h2`
  color: #222;
  font-weight: 700;
`

const SuccessOverlay = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #28a745;
  color: #fff;
  padding: 16px 32px;
  border-radius: 12px;
  z-index: 9999;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  text-align: center;
  font-size: 1.1rem;
  font-weight: 500;
`

const CardStyled = styled.div`
  border: 1px solid #333;
  border-radius: 12px;
  overflow: hidden;
  opacity: ${(props) => (props.$soldOut ? 0.5 : 1)};
  background-color: #1f1f1f;
  color: #ddd;
`

const ProductImage = styled.img`
  height: 180px;
  object-fit: cover;
  border-bottom: 1px solid #444;
`

const Placeholder = styled.div`
  height: 180px;
  font-size: 48px;
`

const ProductTitle = styled.h5`
  color: #a3c1f7;
  font-weight: 600;
`

const ProductDescription = styled.p`
  font-size: 0.9rem;
  color: #bbb;
  min-height: 48px;
`

const Price = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #f0e68c;
`

const Products = () => {
  const { t } = useTranslation()
  const [showFilters, setShowFilters] = useState(false)

  const {
    products,
    loading,
    error,
    sortOption,
    successMessage,
    handleSort,
    getSortedProducts,
    adjustQty,
    handleAddToCart
  } = useProducts(t)

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <Spinner animation="border" variant="light" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center mt-5 text-danger">
        {t('Failed to load products')}
      </div>
    )
  }

  return (
    <Container className="container mt-4">
      <Helmet>
        <title>{t('Products')}</title>
      </Helmet>

      <Header className="text-center mb-4"> {t('Products')} </Header>

      {successMessage && (
        <SuccessOverlay>
          <i className="bi bi-check-circle me-2"></i>
          {successMessage}
        </SuccessOverlay>
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

      {products.length === 0 ? (
        <p className="text-center text-muted fst-italic">
          {t('no_products_found')}
        </p>
      ) : (
        <div className="row">
          {getSortedProducts().map((product) => (
            <div key={product.id} className="col-6 mb-4">
              <CardStyled
                className="card h-100 shadow-sm"
                $soldOut={product.quantity <= 0}
              >
                <div style={{ position: 'relative' }}>
                  {product.image_url ? (
                    <ProductImage
                      src={product.image_url}
                      alt={product.name}
                      className="card-img-top"
                    />
                  ) : (
                    <Placeholder className="d-flex justify-content-center align-items-center bg-secondary text-white">
                      {product.name.charAt(0)}
                    </Placeholder>
                  )}
                  {product.quantity <= 0 && (
                    <span className="badge bg-danger position-absolute top-0 end-0 m-2">
                      {t('Sold Out')}
                    </span>
                  )}
                </div>

                <div className="card-body d-flex flex-column">
                  <ProductTitle className="card-title mb-2">
                    {product.name}
                  </ProductTitle>

                  <ProductDescription className="card-text mb-2">
                    {product.description?.length > 60
                      ? product.description.slice(0, 60) + '...'
                      : product.description}
                  </ProductDescription>

                  <div style={{ minHeight: '80px' }}>
                    <div className="mb-2">
                      <span className="badge bg-info text-dark">
                        {t('Available')}: {product.quantity}
                      </span>
                    </div>
                    <div className="mb-3">
                      <div className="d-flex align-items-center justify-content-between">
                        <small style={{ color: '#ccc' }}>{t('Adding')}</small>
                        <div className="d-flex align-items-center">
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => adjustQty(product.id, -1)}
                            disabled={product.selectedQty <= 1}
                          >
                            –
                          </button>
                          <span className="mx-2">
                            {product.selectedQty || 1}
                          </span>
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => adjustQty(product.id, 1)}
                            disabled={product.selectedQty >= product.quantity}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Price className="mb-2">
                    {Number(product.price).toFixed(2)} BHD
                  </Price>

                  <button
                    className="btn btn-success w-100 mt-auto"
                    onClick={() =>
                      handleAddToCart(product, product.selectedQty || 1)
                    }
                    disabled={product.quantity <= 0}
                  >
                    <i className="bi bi-cart-plus me-2"></i> {t('Add to Cart')}
                  </button>
                </div>
              </CardStyled>
            </div>
          ))}
        </div>
      )}
    </Container>
  )
}

export default Products
