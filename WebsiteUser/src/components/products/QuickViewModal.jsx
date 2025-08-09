import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const QuickViewModal = ({ show, onHide, product, onAddToCart }) => {
  const { t } = useTranslation()
  if (!product) return null
  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'BHD'
  })
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="bg-dark border-secondary">
        <Modal.Title style={{ color: '#a3c1f7' }}>{product.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-light">
        {product.image_url && (
          <img
            src={product.image_url}
            alt={product.name}
            className="img-fluid rounded mb-3"
          />
        )}
        <p>{product.description}</p>
        <div className="fw-semibold mb-2">
          {currencyFormatter.format(product.price)}
        </div>
        {product.quantity !== undefined && (
          <div className="mb-3">
            <span className="badge bg-info text-dark">
              {t('Available')}: {product.quantity}
            </span>
          </div>
        )}
        <Button
          variant="success"
          className="w-100"
          onClick={() => onAddToCart(product, product.selectedQty || 1)}
          disabled={product.quantity <= 0}
        >
          <i className="bi bi-cart-plus me-2"></i> {t('Add to Cart')}
        </Button>
        
      </Modal.Body>
      <Modal.Footer className="bg-dark border-secondary">
        <Button variant="secondary" onClick={onHide}>
          {t('Close')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

QuickViewModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  product: PropTypes.object,
  onAddToCart: PropTypes.func.isRequired
}

export default QuickViewModal
