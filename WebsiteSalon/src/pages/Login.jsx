import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { setAuth } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:5000/salons/login', {
        email,
        password
      })
      const token = res.data.token
      const profile = await axios.get('http://localhost:5000/salons/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAuth({ ...profile.data, token })
      navigate(profile.data.is_approved ? '/dashboard' : '/pending')
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="d-flex vh-100 justify-content-center align-items-center bg-light">
      <div
        className="card shadow-sm p-4"
        style={{ maxWidth: '400px', width: '100%' }}
      >
        <h3 className="mb-4 text-center">Salon Login</h3>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="d-grid mb-3">
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </div>
          <div className="text-center">
            <span>Don't have an account? </span>
            <a href="/signup">Sign Up</a>
          </div>
        </form>
      </div>
    </div>
  )
}
