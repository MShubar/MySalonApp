import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Spinner, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
})

const SalonDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [salon, setSalon] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const { t } = useTranslation()

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const fetchSalon = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/salons/${id}`)
        setSalon(res.data)
      } catch (error) {
        console.error('Error fetching salon details:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSalon()
  }, [id])

  if (loading) {
    return (
      <div style={styles.centered}>
        <Spinner animation="border" variant="info" />
      </div>
    )
  }

  if (!salon) {
    return (
      <p style={{ textAlign: 'center', color: '#bbb' }}>
        {t('Salon not found')}
      </p>
    )
  }

  const layoutStyle = isMobile ? styles.containerMobile : styles.container
  const imageStyle = isMobile ? styles.imageMobile : styles.image
  const latitude =
    salon.latitude || salon.location?.latitude || salon.location?.lat
  const longitude =
    salon.longitude || salon.location?.longitude || salon.location?.lng

  return (
    <div style={layoutStyle}>
      <div style={styles.imageSection}>
        {salon.image_url && (
          <img
            src={salon.image_url}
            alt={salon.name}
            style={imageStyle}
            onError={(e) => (e.target.style.display = 'none')}
          />
        )}
      </div>

      <div style={styles.infoSection}>
        <Button
          variant="outline-light"
          onClick={() => navigate(-1)}
          style={{ marginBottom: '1rem' }}
        >
          ← {t('Back')}
        </Button>

        <h2 style={styles.title}>{salon.name}</h2>
        {salon.services && salon.services.length > 0 ? (
          <div
            style={{ color: '#ccc', fontSize: '1rem', marginBottom: '1rem' }}
          >
            <strong>{t('Services')}:</strong>
            <div className="mt-2 d-flex flex-wrap gap-2">
              {salon.services.map((service, i) => (
                <span
                  key={i}
                  className="badge bg-primary-subtle text-primary px-3 py-2"
                  style={{
                    borderRadius: '20px',
                    backgroundColor: '#254d8f',
                    fontSize: '0.9rem'
                  }}
                >
                  {service.name}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <p className="fst-italic text-muted" style={{ fontSize: '1rem' }}>
            {t('No services available')}
          </p>
        )}
        <p>
          <strong>{t('Rating')}:</strong> {salon.rating} ⭐
        </p>

        {latitude && longitude && (
          <MapContainer
            center={[latitude, longitude]}
            zoom={14}
            scrollWheelZoom={false}
            style={{
              height: '300px',
              width: '100%',
              borderRadius: '12px',
              marginTop: '1rem'
            }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <Marker position={[latitude, longitude]} />
          </MapContainer>
        )}

        <button style={styles.bookButton} onClick={() => alert('Booked!')}>
          {t('Book Now')}
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    gap: '2rem',
    backgroundColor: '#111',
    color: '#eee',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 24px rgba(0, 123, 255, 0.1)',
    marginTop: '2rem'
  },
  containerMobile: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#111',
    color: '#eee',
    padding: '1rem',
    borderRadius: '12px',
    boxShadow: '0 4px 24px rgba(0, 123, 255, 0.1)',
    marginTop: '1rem'
  },
  imageSection: {
    width: '100%'
  },
  image: {
    width: '100%',
    height: '400px',
    objectFit: 'cover',
    borderRadius: '12px',
    boxShadow: '0 0 10px rgba(0, 123, 255, 0.4)'
  },
  imageMobile: {
    width: '100%',
    height: '250px',
    objectFit: 'cover',
    borderRadius: '12px',
    marginBottom: '1rem'
  },
  infoSection: {
    flex: 2,
    display: 'flex',
    flexDirection: 'column'
  },
  title: {
    fontSize: '2rem',
    color: '#61dafb',
    marginBottom: '1rem'
  },
  description: {
    fontSize: '1.1rem',
    marginBottom: '1rem'
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
    boxShadow: '0 0 15px rgba(0, 188, 212, 0.6)',
    transition: 'all 0.3s ease'
  },
  centered: {
    display: 'flex',
    height: '60vh',
    justifyContent: 'center',
    alignItems: 'center'
  }
}

export default SalonDetails
