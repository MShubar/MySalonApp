import React, { useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import usePackages from '../../functionality/products/UsePackages';
import ServerError from '../ServerError';

const Packages = () => {
  const { t } = useTranslation();
  const [showFilters, setShowFilters] = useState(false);
  const [isGridView, setIsGridView] = useState(true);

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
        <div className="d-flex gap-2 mb-2">
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => setShowFilters(!showFilters)}
            aria-expanded={showFilters}
          >
            <i className="bi bi-funnel-fill me-1"></i> {t('Filters')}
          </button>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => setIsGridView((prev) => !prev)}
            aria-label={
              isGridView ? 'Switch to list view' : 'Switch to grid view'
            }
          >
            <i className={`bi ${isGridView ? 'bi-list' : 'bi-grid'} me-1`}></i>
            {isGridView ? t('List View') : t('Grid View')}
          </button>
        </div>
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
            <div
              key={pack.id}
              className={`${isGridView ? 'col-6' : 'col-12'} mb-4`}
            >
              <div
                className={`card h-100 shadow-sm ${isGridView ? '' : 'd-md-flex flex-md-row'}`}
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
                      alt={pack.title}
                      className={`card-img-top ${isGridView ? '' : 'h-100'}`}
                      style={{
                        height: isGridView ? '180px' : '100%',
                        width: isGridView ? '100%' : '180px',
                        objectFit: 'cover',
                        borderBottom: isGridView ? '1px solid #444' : '',
                        borderRight: isGridView ? '' : '1px solid #444',
                      }}
                    />
                  ) : (
                    <div
                      className="d-flex justify-content-center align-items-center bg-secondary text-white"
                      style={{
                        height: '180px',
                        width: isGridView ? '100%' : '180px',
                        fontSize: '48px',
                        borderRight: isGridView ? '' : '1px solid #444',
                      }}
                    >
                      {pack.title.charAt(0)}
                    </div>
                  )}
                  {pack.quantity <= 0 && (
                    <span className="badge bg-danger position-absolute top-0 end-0 m-2">
                      {t('Sold Out')}
                    </span>
                  )}
                </div>

                <div
                  className={`card-body d-flex flex-column ${isGridView ? '' : 'flex-grow-1'}`}
                >
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
                    {Number(pack.price).toFixed(2)} BHD
                  </div>

                  <button
                    className="btn btn-success w-100 mt-auto"
                    onClick={() => handleAddToCart(pack, pack.selectedQty || 1)}
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
