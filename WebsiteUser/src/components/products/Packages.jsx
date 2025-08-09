import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import LoadingView from '../LoadingView';
import usePackages from '../../functionality/products/UsePackages';
import ServerError from '../ServerError';
import FilterButton from '../FilterButton';
import SearchBar from '../SearchBar';
import { useSearchFilter } from '../../functionality/UseSearchFilter';
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
  text-align: center;
  margin-bottom: 2rem;
`;

const SuccessMessage = styled.div`
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

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
`;

const CheckOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  border-radius: 50%;
  padding: 10px;
  z-index: 100;
`;

const PackageCard = styled.div`
  border: 1px solid #333;
  border-radius: 12px;
  overflow: hidden;
  opacity: ${(props) =>
    props.$soldOut
      ? 0.5
      : 1}; /* Use $soldOut to avoid it being passed to the DOM */
  background-color: #1f1f1f;
  color: #ddd;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 16px; /* Padding for the inner content */
  transition: all 0.3s ease;
`;

const PackageImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-bottom: 1px solid #444;
`;

const PackagePlaceholder = styled.div`
  height: 180px;
  font-size: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #444;
  color: #fff;
`;

const PackageTitle = styled.h5`
  color: #a3c1f7;
  font-weight: 600;
  margin-top: 1rem;
`;

const PackageDescription = styled.p`
  font-size: 0.9rem;
  color: #bbb;
  min-height: 48px;
`;

const Price = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #f0e68c;
  margin-top: 0.5rem;
`;

const QuantityBadge = styled.span`
  background-color: #17a2b8;
  color: #000;
  padding: 5px 10px;
  border-radius: 8px;
  margin-top: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: space-between;
  width: 100%;
  flex-wrap: wrap;
  margin-top: 1rem;
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
const Packages = () => {
  const { t } = useTranslation();
  const [showFilters, setShowFilters] = useState(false);
  const [addedIds, setAddedIds] = useState([]);

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

  const showCheckmark = (id) => {
    setAddedIds((prev) => [...prev, id]);
    setTimeout(
      () => setAddedIds((prev) => prev.filter((itemId) => itemId !== id)),
      1000
    );
  };

  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'BHD',
  });

  // Use the search filter hook to filter the packages
  const {
    searchQuery,
    setSearchQuery,
    filteredData: filteredPackages,
  } = useSearchFilter(packages, 'title');

  return (
    <Container>
      {loading ? (
        <ResponsiveGrid>
          {Array.from({ length: 6 }).map((_, idx) => (
            <SkeletonLoader />
          ))}
        </ResponsiveGrid>
      ) : error ? (
        error.response?.status === 500 ? (
          <ServerError onRetry={retry} />
        ) : (
          <ErrorComponent
            message="Failed to load salons. Please try again later."
            onRetry={retry}
            loading={loading}
          />
        )
      ) : filteredPackages.length === 0 ? (
        <NoDataView message={'No Packages Found'} />
      ) : (
        <>
          <Helmet>
            <title>{t('Packages')}</title>
            <meta
              name="description"
              content="Check out special packages and offers from MySalon."
            />
          </Helmet>

          <Header>{t('Packages')}</Header>

          {successMessage && (
            <SuccessMessage>
              <i className="bi bi-check-circle me-2"></i>
              {successMessage}
            </SuccessMessage>
          )}

          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery} // Using the setSearchQuery from useSearchFilter
            placeholderKey={t('Search packages')}
          />

          <FilterContainer>
            <FilterButton
              showFilters={showFilters}
              toggleFilters={() => setShowFilters(!showFilters)}
            />
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
          </FilterContainer>

          <div className="row">
            {filteredPackages.map((pack, idx) => (
              <div key={pack.id} className="col-6 mb-4">
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
                  <PackageCard $soldOut={pack.quantity <= 0}>
                    <div style={{ position: 'relative' }}>
                      {pack.image_url ? (
                        <PackageImage
                          src={pack.image_url}
                          alt={`${pack.title} package image`}
                        />
                      ) : (
                        <PackagePlaceholder>
                          {pack.title.charAt(0)}
                        </PackagePlaceholder>
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
                      <PackageTitle>{pack.title}</PackageTitle>
                      <PackageDescription>
                        {pack.description?.length > 60
                          ? `${pack.description.slice(0, 60)}...`
                          : pack.description}
                      </PackageDescription>

                      <div>
                        <QuantityBadge>
                          {t('Available')}: {pack.quantity}
                        </QuantityBadge>
                      </div>

                      <ButtonGroup>
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
                      </ButtonGroup>

                      <Price>{currencyFormatter.format(pack.price)}</Price>

                      <ButtonWithIcon
                        type="addtocart"
                        onClick={() => {
                          handleAddToCart(pack, pack.selectedQty || 1);
                          showCheckmark(pack.id);
                        }}
                        width="100%"
                      >
                        {t('Add to Cart')}
                      </ButtonWithIcon>
                    </div>
                  </PackageCard>
                </motion.div>
              </div>
            ))}
          </div>
        </>
      )}
    </Container>
  );
};

export default Packages;
