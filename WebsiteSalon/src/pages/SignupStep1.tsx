import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SignupStep1() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const navigate = useNavigate()

  const handleNext = () => {
    if (password !== confirmPassword) return alert('Passwords do not match')
    localStorage.setItem('signupStep1', JSON.stringify({ email, password }))
    navigate('/signup/step2')
  }

  return (
    <div className="d-flex vh-100 justify-content-center align-items-center bg-light">
      <div
        className="card shadow p-4"
        style={{ maxWidth: '500px', width: '100%' }}
      >
        <h3 className="mb-4 text-center">Sign Up - Step 1/3</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleNext()
          }}
        >
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
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="d-flex justify-content-between">
            <button type="submit" className="btn btn-primary">
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
