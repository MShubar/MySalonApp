import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import TopBar from './TopBar'

const SignIn = ({ setUser }) => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSignIn = async (e) => {
    e.preventDefault()

    try {
      const res = await fetch('http://localhost:5000/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      const data = await res.json()

      if (res.ok) {
        localStorage.setItem('token', data.token)
        const userFromToken = { id: data.id, username: data.username }
        localStorage.setItem('user', JSON.stringify(userFromToken))
        setUser(userFromToken)
        navigate('/')
      } else {
        setError(data.message || 'Invalid credentials')
      }
    } catch (err) {
      console.error('Signin.jsx: Error during login:', err)
      setError('Something went wrong')
    }
  }

  return (
    <div className="container pt-5">
      <TopBar />
      <div
        className="col-md-6 mx-auto card bg-dark text-light p-4 border-0 shadow-lg"
        style={{
          borderRadius: '1rem',
          boxShadow: '0 10px 30px rgba(79, 142, 247, 0.2)'
        }}
      >
        <h3 className="fw-bold mb-4 text-center" style={{ color: '#4f8ef7' }}>
          {t('Sign In')}
        </h3>

        <form onSubmit={handleSignIn}>
          <div className="mb-3">
            <label className="form-label text-light">{t('Username')}</label>
            <input
              type="text"
              className="form-control bg-dark text-light border-secondary"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              style={{ borderRadius: '0.5rem' }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-light">{t('Password')}</label>
            <input
              type="password"
              className="form-control bg-dark text-light border-secondary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              style={{ borderRadius: '0.5rem' }}
            />
          </div>

          {error && (
            <div className="text-danger small mb-3 fst-italic">{error}</div>
          )}

          <button
            type="submit"
            className="btn w-100 fw-semibold"
            style={{
              backgroundColor: '#4f8ef7',
              color: '#fff',
              borderRadius: '0.5rem',
              transition: 'background-color 0.3s ease',
              boxShadow: '0 4px 10px rgba(79, 142, 247, 0.4)'
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = '#3a75d8')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = '#4f8ef7')
            }
          >
            {t('Sign In')}
          </button>
        </form>
      </div>
    </div>
  )
}

export default SignIn
