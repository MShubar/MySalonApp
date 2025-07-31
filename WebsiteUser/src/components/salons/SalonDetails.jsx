import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import LoadingSpinner from '../LoadingSpinner';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import useSalonDetails from '../../functionality/salons/UseSalonDetails';
import ServerError from '../ServerError';
import Breadcrumbs from '../layout/Breadcrumbs';
import NoDataView from '../NoDataView';
// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const SalonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState({});

  const { salon, loading, error, retry, isMobile, latitude, longitude } =
    useSalonDetails(id);

  const toggleExpanded = (sid) =>
    setExpanded((prev) => ({ ...prev, [sid]: !prev[sid] }));

  if (loading) {
    return <LoadingSpinner style={styles.centered} />;
  }

  if (error) {
    if (error.response?.status === 500) {
      return <ServerError onRetry={retry} />;
    }
    return (
      <p style={{ textAlign: 'center', color: '#bbb' }}>
        {t('Salon not found')}
      </p>
    );
  }

  if (!salon) {
    return <NoDataView message={t('Salon not found')} />;
  }

  const layoutStyle = isMobile ? styles.containerMobile : styles.container;
  const imageStyle = isMobile ? styles.imageMobile : styles.image;

  return (
    <>
      <Helmet>
        <title>{salon ? salon.name : t('Salon Details')}</title>
      </Helmet>
      <Breadcrumbs
        items={[{ label: t('Home'), to: '/' }, { label: salon.name }]}
      />
      <div style={layoutStyle}>
        <div style={styles.imageSection}>
          {salon.image_url ? (
            <img
              src={salon.image_url}
              alt={`Image of ${salon.name} salon`}
              style={imageStyle}
              onError={(e) => (e.target.style.display = 'none')}
            />
          ) : (
            <div
              style={{
                ...imageStyle,
                backgroundColor: '#444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ddd',
                fontSize: '2rem',
              }}
            >
              {salon.name.charAt(0)}
            </div>
          )}
        </div>

        <div style={styles.infoSection}>
          <Button
            variant="outline-light"
            onClick={() => navigate(-1)}
            style={{ marginBottom: '1rem', alignSelf: 'flex-start' }}
          >
            ← {t('Back')}
          </Button>

          <h2 style={styles.title}>{salon.name}</h2>

          <div style={styles.detailRow}>
            <strong style={{ color: '#f0e68c' }}>{t('Rating')}:</strong>{' '}
            <span style={{ color: '#ddd' }}>{salon.rating} ⭐</span>
          </div>

          <div style={styles.detailRow}>
            <strong style={{ color: '#f0e68c' }}>{t('Address')}:</strong>{' '}
            <span style={{ color: '#ddd' }}>
              {latitude && longitude
                ? `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
                : t('N/A')}
            </span>
          </div>

          {salon.opening_time && salon.closing_time && (
            <div style={styles.detailRow}>
              <strong style={{ color: '#f0e68c' }}>
                {t('Opening Hours')}:
              </strong>{' '}
              <span style={{ color: '#ddd' }}>
                {salon.opening_time.slice(0, 5)} -{' '}
                {salon.closing_time.slice(0, 5)}
              </span>
            </div>
          )}

          {salon.services && salon.services.length > 0 ? (
            <div style={styles.servicesContainer}>
              <strong style={{ color: '#f0e68c' }}>{t('Services')}:</strong>
              <div className="mt-2 d-flex flex-column gap-2">
                {salon.services.map((service) => {
                  const desc = service.description || '';
                  const isLong = desc.length > 100;
                  const isOpen = expanded[service.id];
                  return (
                    <div
                      key={service.id}
                      style={{
                        borderRadius: '12px',
                        backgroundColor: '#254d8f',
                        color: '#f0f8ff',
                        padding: '0.5rem 0.75rem',
                      }}
                    >
                      <strong>{t(service.name)}</strong>
                      {desc && (
                        <p
                          style={{ margin: '0.25rem 0 0', fontSize: '0.85rem' }}
                        >
                          {isOpen || !isLong
                            ? desc
                            : desc.slice(0, 100) + '...'}
                          {isLong && (
                            <button
                              onClick={() => toggleExpanded(service.id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#a3c1f7',
                                marginLeft: '4px',
                                cursor: 'pointer',
                                padding: 0,
                              }}
                            >
                              {isOpen ? t('Show Less') : t('Show More')}
                            </button>
                          )}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="fst-italic text-muted" style={{ fontSize: '1rem' }}>
              {t('No services available')}
            </p>
          )}

          {latitude && longitude && (
            <MapContainer
              center={[latitude, longitude]}
              zoom={14}
              scrollWheelZoom={false}
              style={{
                height: '300px',
                width: '100%',
                borderRadius: '12px',
                marginTop: '1rem',
              }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <Marker position={[latitude, longitude]} />
            </MapContainer>
          )}

          <button
            style={styles.bookButton}
            onClick={() => navigate(`/salon/${salon.id}/book`)}
          >
            {t('Book Now')}
          </button>
        </div>
      </div>
    </>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    gap: '2rem',
    backgroundColor: '#1f1f1f',
    color: '#f0f8ff',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 24px rgba(0, 123, 255, 0.1)',
    marginTop: '2rem',
  },
  containerMobile: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#1f1f1f',
    color: '#f0f8ff',
    padding: '1rem',
    borderRadius: '12px',
    boxShadow: '0 4px 24px rgba(0, 123, 255, 0.1)',
    marginTop: '1rem',
  },
  imageSection: { flex: 1 },
  image: {
    width: '100%',
    height: '400px',
    objectFit: 'cover',
    borderRadius: '12px',
    boxShadow: '0 0 10px rgba(0, 123, 255, 0.4)',
  },
  imageMobile: {
    width: '100%',
    height: '250px',
    objectFit: 'cover',
    borderRadius: '12px',
    marginBottom: '1rem',
  },
  infoSection: {
    flex: 2,
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: '2rem',
    color: '#a3c1f7',
    marginBottom: '1rem',
  },
  servicesContainer: {
    marginBottom: '1rem',
    fontSize: '1rem',
  },
  detailRow: {
    fontSize: '1rem',
    marginBottom: '0.5rem',
  },
  bookButton: {
    backgroundColor: '#00bcd4',
    border: 'none',
    padding: '0.75rem 2rem',
    fontWeight: 'bold',
    borderRadius: '8px',
    color: '#fff',
    marginTop: '2rem',
    cursor: 'pointer',
    alignSelf: 'flex-start',
    boxShadow: '0 0 15px rgba(0, 188, 212, 0.6)',
    transition: 'all 0.3s ease',
  },
  centered: {
    display: 'flex',
    height: '60vh',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default SalonDetails;
