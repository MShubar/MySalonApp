import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import TopBar from './TopBar'

const SignUp = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleSignUp = async (e) => {
    e.preventDefault()

    if (!email || !username || !password || !confirmPassword) {
      setError('Please fill out all fields')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      const res = await fetch('http://localhost:5000/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password })
      })

      if (res.ok) {
        navigate('/signin')
      } else {
        const data = await res.json()
        setError(data.message || 'Registration failed')
      }
    } catch (err) {
      console.error('Signup.jsx: Error during registration:', err)
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
          {t('Sign Up')}
        </h3>

        <form onSubmit={handleSignUp}>
          <div className="mb-3">
            <label className="form-label text-light">{t('Username')}</label>
            <input
              type="text"
              className="form-control bg-dark text-light border-secondary"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t('Enter your username')}
              style={{ borderRadius: '0.5rem' }}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-light">
              {t('Email Address')}
            </label>
            <input
              type="email"
              className="form-control bg-dark text-light border-secondary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('Enter your email')}
              style={{ borderRadius: '0.5rem' }}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-light">{t('Password')}</label>
            <input
              type="password"
              className="form-control bg-dark text-light border-secondary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('Enter your password')}
              style={{ borderRadius: '0.5rem' }}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-light">
              {t('Confirm Password')}
            </label>
            <input
              type="password"
              className="form-control bg-dark text-light border-secondary"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t('Confirm your password')}
              style={{ borderRadius: '0.5rem' }}
              required
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
            {t('Sign Up')}
          </button>
        </form>

        <div className="text-center mt-3">
          <p>
            {t('Already have an account?')}{' '}
            <a
              href="/signin"
              className="text-decoration-none"
              style={{ color: '#4f8ef7' }}
            >
              {t('Sign In')}
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUp
