import React, { useEffect } from 'react'
import { Container, Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
function Account() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  useEffect(() => {
    document.body.style.backgroundColor = '#121212'
    return () => {
      document.body.style.backgroundColor = ''
    }
  }, [])

  return (
    <Container
      className="mt-5 p-4 rounded"
      style={{
        maxWidth: 600,
        color: '#f0f0f0'
      }}
    >
      <h2 className="mb-4 fw-bold" style={{ color: '#222' }}>
        {t('Account Settings')}
      </h2>

      <Card
        className="mb-3 border-0"
        onClick={() => navigate('/edit-profile')}
        style={{
          backgroundColor: '#2a2a2a',
          color: '#fff',
          cursor: 'pointer'
        }}
      >
        <Card.Body className="fw-medium">{t('Edit Profile')}</Card.Body>
      </Card>

      <Card
        className="mb-3 border-0"
        onClick={() => navigate('/change-password')}
        style={{
          backgroundColor: '#2a2a2a',
          color: '#fff',
          cursor: 'pointer'
        }}
      >
        <Card.Body className="fw-medium">{t('Change Password')}</Card.Body>
      </Card>
    </Container>
  )
}

export default Account
