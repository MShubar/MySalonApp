import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { FaFacebook, FaTwitter } from 'react-icons/fa';
import useProductDetails from '../../functionality/products/UseProductDetails';
import ServerError from '../ServerError';
import capitalizeName from '../../utils/capitalizeName';
import NoDataView from '../NoDataView';
import ButtonWithIcon from '../ButtonWithIcon';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2rem;
  background-color: #1f1f1f;
  color: #f0f8ff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 123, 255, 0.1);
  margin-top: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1rem;
  }
`;

const ImageSection = styled.div`
  flex: 1;
  position: relative;
`;

const MainImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 123, 255, 0.4);
`;

const Thumbnails = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  overflow-x: scroll;
`;

const Thumb = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid ${({ $active }) => ($active ? '#00bcd4' : 'transparent')};
`;

const Placeholder = styled.div`
  width: 100%;
  height: 400px;
  background-color: #444;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ddd;
  font-size: 3rem;
  box-shadow: 0 0 10px rgba(0, 123, 255, 0.4);
`;

const InfoSection = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 1rem;
`;

const Title = styled.h2`
  font-size: 2.2rem;
  color: #a3c1f7;
  margin-bottom: 1rem;
  font-weight: 700;
`;

const Price = styled.div`
  font-size: 1.5rem;
  color: #f0e68c;
  font-weight: 600;
  margin-top: 0.5rem;
`;

const Description = styled.p`
  font-size: 1rem;
  color: #ccc;
  line-height: 1.5;
  margin-bottom: 1rem;
`;

const ShareButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { product, loading, error, retry, isMobile } = useProductDetails(id);

  const [activeIndex, setActiveIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setActiveIndex(0);
  }, [product]);

  const adjustQty = (delta) => {
    setQuantity((prevQuantity) => prevQuantity + delta);
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          height: '60vh',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Spinner animation="border" variant="info" />
      </div>
    );
  }

  if (error) {
    if (error.response?.status === 500) {
      return <ServerError onRetry={retry} />;
    }
    return (
      <p style={{ textAlign: 'center', color: '#bbb' }}>
        {t('Product not found')}
      </p>
    );
  }

  if (!product) {
    return <NoDataView message={'No Product Found'} />;
  }

  const images =
    product.images && Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : product.image_url
      ? [product.image_url]
      : [];

  const Layout = isMobile ? Container : Container;

  const shareUrl = window.location.href;
  const share = (platform) => {
    const url = encodeURIComponent(shareUrl);
    const text = encodeURIComponent(product.name || '');
    let link = '';
    if (platform === 'facebook') {
      link = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    } else if (platform === 'twitter') {
      link = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
    }
    window.open(link, '_blank', 'noopener');
  };

  return (
    <div className="container">
      <Helmet>
        <title>{product.name}</title>
      </Helmet>
      <Layout>
        <ImageSection>
          {images[activeIndex] ? (
            <MainImage src={images[activeIndex]} alt={product.name} />
          ) : (
            <Placeholder>{product?.name?.charAt(0) || '-'}</Placeholder>
          )}
          {images.length > 1 && (
            <Thumbnails>
              {images.map((img, idx) => (
                <Thumb
                  key={idx}
                  src={img}
                  alt={`thumb-${idx}`}
                  onClick={() => setActiveIndex(idx)}
                  $active={idx === activeIndex}
                />
              ))}
            </Thumbnails>
          )}
        </ImageSection>

        <InfoSection>
          <Title>{product.name}</Title>
          <Description>{product.description}</Description>
          <Price>{Number(product.price).toFixed(2)} BHD</Price>

          {product.quantity !== undefined && (
            <div style={{ marginTop: '0.5rem' }}>
              <strong>{t('Available')}:</strong> {product.quantity}
            </div>
          )}

          <div style={{ marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <ButtonWithIcon
                type="adjust"
                adjustQty={adjustQty}
                quantity={quantity}
                width="auto"
              >
                {quantity}
              </ButtonWithIcon>
            </div>
          </div>

          <ShareButtons>
            <button
              className="btn btn-primary"
              onClick={() => share('facebook')}
              aria-label="Share on Facebook"
            >
              <FaFacebook className="me-1" /> {t('Share')}
            </button>
            <button
              className="btn btn-info text-white"
              onClick={() => share('twitter')}
              aria-label="Share on Twitter"
            >
              <FaTwitter className="me-1" /> {t('Tweet')}
            </button>
          </ShareButtons>

          <ButtonWithIcon
            type="book"
            onClick={() => handleAddToCart(product, quantity)}
            width="100%"
          >
            {t('Add to Cart')}
          </ButtonWithIcon>
        </InfoSection>
      </Layout>
    </div>
  );
};

export default ProductDetails;
