import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Spinner } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import 'bootstrap/dist/css/bootstrap.min.css'

const Favorites = ({ userId }) => {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()

  useEffect(() => {
    if (!userId) return

    const fetchFavorites = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`http://localhost:5000/favorites/${userId}`)
        setFavorites(res.data)
        setLoading(false)
      } catch (err) {
        console.error('Error loading favorites', err)
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [userId])

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-4">
        <Spinner animation="border" variant="light" />
      </div>
    )
  }

  return (
    <div
      className="container mt-4"
      style={{
        color: '#ddd',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}
    >
      <h3 className="mb-4">{t('Favorites')}</h3>

      {favorites.length === 0 ? (
        <p className="text-center text-muted fst-italic">
          {t('No Salons Found')}
        </p>
      ) : (
        <div className="row">
          {favorites.map((salon) => (
            <div key={salon.id} className="col-md-4 mb-4">
              <div
                className="card h-100 shadow-sm"
                style={{
                  backgroundColor: '#1f1f1f',
                  color: '#ddd',
                  border: '1px solid #333'
                }}
                tabIndex={0}
                aria-label={`${salon.name}, ${t('Rating')}: ${salon.rating}, ${
                  salon.location
                }`}
              >
                {salon.image_url ? (
                  <img
                    src={salon.image_url}
                    alt={`${salon.name} logo`}
                    className="card-img-top"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    className="d-flex justify-content-center align-items-center bg-secondary"
                    style={{
                      height: '200px',
                      fontSize: '72px',
                      color: 'white'
                    }}
                    aria-hidden="true"
                  >
                    {salon.name.charAt(0)}
                  </div>
                )}

                <div className="card-body d-flex flex-column">
                  <h5 className="card-title" style={{ color: '#a3c1f7' }}>
                    {salon.name}
                  </h5>
                  <p
                    className="card-text"
                    style={{ color: '#bbb', flexGrow: 1 }}
                  >
                    {salon.description || t('No description available')}
                  </p>
                  <div style={{ color: '#8fc1f7', fontWeight: '600' }}>
                    ⭐ {salon.rating} • {salon.location}
                  </div>

                  <div className="mt-3 d-flex gap-2 align-items-center">
                    {/* You can add favorite toggle buttons here if needed */}

                    <button
                      className="btn btn-outline-primary flex-fill"
                      style={{
                        fontWeight: 600,
                        boxShadow: '0 0 8px rgba(79, 142, 247, 0.5)',
                        transition:
                          'background-color 0.3s ease, color 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#4f8ef7'
                        e.currentTarget.style.color = '#fff'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.color = '#4f8ef7'
                      }}
                    >
                      {t('View')}
                    </button>
                    <button
                      className="btn btn-success flex-fill"
                      style={{
                        fontWeight: 600,
                        boxShadow: '0 0 8px rgba(40, 167, 69, 0.5)',
                        transition:
                          'background-color 0.3s ease, color 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#28a745'
                        e.currentTarget.style.color = '#fff'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#198754'
                        e.currentTarget.style.color = '#fff'
                      }}
                    >
                      {t('Book')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Favorites
