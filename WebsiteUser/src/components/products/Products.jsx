import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import useProducts from '../../functionality/products/UseProducts';
import ServerError from '../ServerError';
import FilterButton from '../FilterButton';
import SearchBar from '../SearchBar';
import NoDataView from '../NoDataView';
import ButtonWithIcon from '../ButtonWithIcon';
import { motion } from 'framer-motion';
import { SkeletonLoader } from '../SkeletonLoader';
import ErrorComponent from '../ErrorComponent';

const Container = styled.div`
  color: #ddd;
`;

const Header = styled.h2`
  color: #222;
  font-weight: 700;
`;

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
`;

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
`;

const CardStyled = styled.div`
  border: 1px solid #333;
  border-radius: 12px;
  overflow: hidden;
  opacity: ${(props) => (props.$soldOut ? 0.5 : 1)};
  background-color: #1f1f1f;
  color: #ddd;
  cursor: pointer;
  display: flex;
  flex-direction: column;
`;

const CardBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem;
`;

const ProductImage = styled.img`
  height: 180px;
  object-fit: cover;
  border-bottom: 1px solid #444;
`;

const Placeholder = styled.div`
  height: 180px;
  font-size: 48px;
`;

const ProductTitle = styled.h5`
  color: #a3c1f7;
  font-weight: 600;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ProductDescription = styled.p`
  font-size: 0.9rem;
  color: #bbb;
  min-height: 48px;
`;

const Price = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #f0e68c;
`;

const ResponsiveGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;

  @media (min-width: 576px) {
    grid-template-columns: repeat(1, 1fr);
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Products = () => {
  const { t } = useTranslation();
  const [showFilters, setShowFilters] = useState(false);
  const [addedIds, setAddedIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    loading,
    error,
    retry,
    sortOption,
    successMessage,
    handleSort,
    getSortedProducts,
    adjustQty,
    handleAddToCart,
  } = useProducts(t);

  const showCheckmark = (id) => {
    setAddedIds((prev) => [...prev, id]);
    setTimeout(
      () => setAddedIds((prev) => prev.filter((itemId) => itemId !== id)),
      1000
    );
  };

  const filteredProducts = useMemo(() => {
    const sortedProducts = getSortedProducts();
    return sortedProducts.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [getSortedProducts, searchQuery]);

  if (loading)
    return (
      <ResponsiveGrid>
        {Array.from({ length: 6 }).map((_, idx) => (
          <SkeletonLoader />
        ))}
      </ResponsiveGrid>
    );
  if (error) {
    if (error.response?.status === 500) return <ServerError onRetry={retry} />;
    return (
      <ErrorComponent
        message="Failed to load salons. Please try again later."
        onRetry={retry}
        loading={loading}
      />
    );
  }

  return (
    <Container className="container mt-4">
      <Helmet>
        <title>{t('Products')}</title>
        <meta
          name="description"
          content="Browse our range of beauty products available at MySalon."
        />
      </Helmet>

      <Header className="text-center mb-4">{t('Products')}</Header>

      {successMessage && (
        <SuccessOverlay>
          <i className="bi bi-check-circle me-2"></i>
          {successMessage}
        </SuccessOverlay>
      )}

      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholderKey="Search products"
      />

      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
        <div className="d-flex gap-2 mb-2">
          <FilterButton
            showFilters={showFilters}
            toggleFilters={() => setShowFilters(!showFilters)}
          />
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

      {filteredProducts.length === 0 ? (
        <NoDataView message={t('No Products Found')} />
      ) : (
        <ProductGrid>
          {filteredProducts.map((product, idx) => (
            <div key={product.id} style={{ marginBottom: '1rem' }}>
              <motion.div
                className="card h-100 shadow-sm"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                  delay: idx * 0.04,
                }}
              >
                <CardStyled
                  className="card h-100 shadow-sm"
                  $soldOut={product.quantity <= 0}
                >
                  <Link
                    to={`/products/${product.id}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
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
                      {addedIds.includes(product.id) && (
                        <CheckOverlay>
                          <i className="bi bi-check-lg"></i>
                        </CheckOverlay>
                      )}
                    </div>
                  </Link>

                  <CardBody>
                    <div style={{ flex: 1 }}>
                      <ProductTitle className="card-title mb-2">
                        <Link
                          to={`/products/${product.id}`}
                          style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                          {product.name}
                        </Link>
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
                            <ButtonWithIcon
                              type="adjust"
                              adjustQty={(delta) =>
                                adjustQty(product.id, delta)
                              }
                              quantity={product.selectedQty || 1}
                              width="auto"
                            >
                              {product.selectedQty || 1}
                            </ButtonWithIcon>
                          </div>
                        </div>
                      </div>

                      <Price className="mb-2">
                        {t('priceWithCurrency', {
                          price: Number(product.price).toFixed(2),
                        })}
                      </Price>
                    </div>

                    <ButtonWithIcon
                      type="addtocart"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product, product.selectedQty || 1);
                        showCheckmark(product.id);
                      }}
                      disabled={product.quantity <= 0}
                      width="100%"
                    >
                      {t('Add to Cart')}
                    </ButtonWithIcon>
                  </CardBody>
                </CardStyled>
              </motion.div>
            </div>
          ))}
        </ProductGrid>
      )}
    </Container>
  );
};

export default Products;
