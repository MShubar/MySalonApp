import React, { useState } from 'react'
import LoadingSpinner from '../LoadingSpinner'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import usePackages from '../../functionality/products/UsePackages'
import ServerError from '../ServerError'

const CheckOverlay = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  background: #28a745;
  color: #fff;
  border-radius: 50%;
  padding: 4px;
  font-size: 1.1rem;
  animation: fadeOut 1s forwards;

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`

const Packages = () => {
  const { t } = useTranslation()
  const [showFilters, setShowFilters] = useState(false)
  const [addedIds, setAddedIds] = useState([])

  const showCheckmark = (id) => {
    setAddedIds((prev) => [...prev, id])
    setTimeout(
      () => setAddedIds((prev) => prev.filter((itemId) => itemId !== id)),
      1000
    )
  }
  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'BHD',
  });

  const {
    packages,
    loading,
    error,
    retry,
    successMessage,
    sortOption,
    handleSort,
    getSortedPackages,
    adjustQty,
    handleAddToCart,
  } = usePackages(t);

    return (
      <div className="container mt-4" style={{ color: '#ddd' }}>
        <Helmet>
          <title>{t('Packages')}</title>
          <meta
            name="description"
            content="Check out special packages and offers from MySalon."
          />
        </Helmet>

      <h2
        className="text-center mb-4"
        style={{ color: '#222', fontWeight: '700' }}
      >
        {t('Packages')}
      </h2>

      {successMessage && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#28a745',
            color: '#fff',
            padding: '16px 32px',
            borderRadius: '12px',
            zIndex: 9999,
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            textAlign: 'center',
            fontSize: '1.1rem',
            fontWeight: '500',
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
          <div className="mb-2" style={{ minWidth: 160 }}>
            <select
              className="form-select form-select-sm"
              value={sortOption}
              onChange={(e) => handleSort(e.target.value)}
            >
              <option value="">{t('Filters')}</option>
              <option value="priceHigh">{t('High to low')}</option>
              <option value="priceLow">{t('Low to high')}</option>
              <option value="newest">{t('Newest')}</option>
            </select>
          </div>
        )}
      </div>

      {loading ? (
        <LoadingSpinner className="my-5" />
      ) : error ? (
        error.response?.status === 500 ? (
          <ServerError onRetry={retry} />
        ) : (
          <p className="text-center text-danger">
            {t('Failed to load packages')}
          </p>
        )
      ) : packages.length === 0 ? (
        <p className="text-center text-muted fst-italic">
          {t('no_packages_found')}
        </p>
      ) : (
        <div className="row">
          {getSortedPackages().map((pack) => (
            <div key={pack.id} className="col-6 mb-4">
              <div
                className="card h-100 shadow-sm"
                style={{
                  border: '1px solid #333',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  opacity: pack.quantity <= 0 ? 0.5 : 1,
                  backgroundColor: '#1f1f1f',
                  color: '#ddd',
                }}
              >
                <div style={{ position: 'relative' }}>
                  {pack.image_url ? (
                    <img
                      src={pack.image_url}
                      alt={`${pack.title} package image`}
                      className="card-img-top"
                      style={{
                        height: '180px',
                        objectFit: 'cover',
                        borderBottom: '1px solid #444',
                      }}
                    />
                  ) : (
                    <div
                      className="d-flex justify-content-center align-items-center bg-secondary text-white"
                      style={{ height: '180px', fontSize: '48px' }}
                    >
                      {pack.title.charAt(0)}
                    </div>
                  )}
                  {pack.quantity <= 0 && (
                    <span className="badge bg-danger position-absolute top-0 end-0 m-2">
                      {t('Sold Out')}
                    </span>
                  )}
                  {addedIds.includes(pack.id) && (
                    <CheckOverlay>
                      <i className="bi bi-check-lg"></i>
                    </CheckOverlay>
                  )}
                </div>

                <div className="card-body d-flex flex-column">
                  <h5
                    className="card-title mb-2"
                    style={{ color: '#a3c1f7', fontWeight: '600' }}
                  >
                    {pack.title}
                  </h5>

                  <p
                    className="card-text mb-2"
                    style={{
                      fontSize: '0.9rem',
                      color: '#bbb',
                      minHeight: '48px',
                    }}
                  >
                    {pack.description?.length > 60
                      ? pack.description.slice(0, 60) + '...'
                      : pack.description}
                  </p>

                  <div style={{ minHeight: '80px' }}>
                    <div className="mb-2">
                      <span className="badge bg-info text-dark">
                        {t('Available')}: {pack.quantity}
                      </span>
                    </div>
                    <div className="mb-3">
                      <div className="d-flex align-items-center justify-content-between">
                        <small style={{ color: '#ccc' }}>{t('Adding')}</small>
                        <div className="d-flex align-items-center">
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => adjustQty(pack.id, -1)}
                            disabled={pack.selectedQty <= 1}
                          >
                            –
                          </button>
                          <span className="mx-2">{pack.selectedQty || 1}</span>
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => adjustQty(pack.id, 1)}
                            disabled={pack.selectedQty >= pack.quantity}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="mb-2"
                    style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#f0e68c',
                    }}
                  >
                    {currencyFormatter.format(pack.price)}
                  </div>

                  <button
                    className="btn btn-success w-100 mt-auto"
                    onClick={() => {
                      handleAddToCart(pack, pack.selectedQty || 1)
                      showCheckmark(pack.id)
                    }}
                    disabled={pack.quantity <= 0}
                  >
                    <i className="bi bi-cart-plus me-2"></i> {t('Add to Cart')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Packages;
