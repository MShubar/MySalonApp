import React from 'react';
import { useParams } from 'react-router-dom';
import { Spinner, Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { FaFacebook, FaTwitter } from 'react-icons/fa';
import useFetch from '../../hooks/useFetch';
import { API_URL } from '../../config';
import ServerError from '../ServerError';

const ProductDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();

  const {
    data: product,
    loading,
    error,
    retry,
  } = useFetch(id ? `${API_URL}/product/${id}` : null, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <Spinner animation="border" variant="light" />
      </div>
    );
  }

  if (error) {
    if (error.response?.status === 500) {
      return <ServerError onRetry={retry} />;
    }
    return (
      <p className="text-center text-danger">{t('Failed to load product')}</p>
    );
  }

  if (!product) {
    return (
      <p className="text-center text-muted fst-italic">
        {t('Product not found')}
      </p>
    );
  }

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
    <div className="container mt-4" style={{ color: '#ddd' }}>
      <Helmet>
        <title>{product.name}</title>
      </Helmet>

      <Button variant="outline-light" onClick={() => window.history.back()}>
        ← {t('Back')}
      </Button>

      <h2 className="mt-3" style={{ color: '#a3c1f7', fontWeight: '600' }}>
        {product.name}
      </h2>

      {product.image_url && (
        <img
          src={product.image_url}
          alt={product.name}
          className="img-fluid mb-3"
          style={{
            maxHeight: '300px',
            objectFit: 'cover',
            borderRadius: '12px',
          }}
        />
      )}

      <p className="mb-2">{product.description}</p>
      <p className="fw-bold mb-3">{Number(product.price).toFixed(2)} BHD</p>

      <div className="d-flex gap-2">
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
      </div>
    </div>
  );
};

export default ProductDetails;
