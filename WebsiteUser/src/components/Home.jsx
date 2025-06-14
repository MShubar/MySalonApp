import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import TopBar from './TopBar'

const Home = () => {
  const { t } = useTranslation()

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Reusable TopBar */}
      <TopBar />

      {/* Bottom content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          marginTop: '50px'
        }}
      >
        <Link to="/signin" className="btn btn-dark mb-3 px-5 py-2">
          {t('Sign In')}
        </Link>
        <div className="text-dark mb-2">{t('Not a MySalon member?')}</div>
        <Link to="/signup" className="btn btn-dark px-5 py-2">
          {t('Sign Up')}
        </Link>
      </div>
    </div>
  )
}

export default Home
