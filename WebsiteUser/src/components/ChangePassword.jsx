import React, { useState } from 'react'
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap'
import axios from 'axios'

function ChangePassword({ userId }) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Handle input changes
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const { currentPassword, newPassword, confirmNewPassword } = formData

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError('All fields are required')
      return
    }

    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match')
      return
    }

    setLoading(true)
    try {
      // Assuming your backend endpoint for changing password is /api/users/:id/change-password
      await axios.put(`http://localhost:5000/users/${userId}/change-password`, {
        currentPassword,
        newPassword
      })
      setSuccess('Password changed successfully!')
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container
      className="mt-5 p-4 rounded"
      style={{ maxWidth: 600, color: '#f0f0f0' }}
    >
      <h2 className="mb-4 fw-bold" style={{ color: '#222' }}>
        Change Password
      </h2>

      <Card
        className="p-4"
        style={{ backgroundColor: '#2a2a2a', color: '#fff' }}
      >
        <Form onSubmit={handleSubmit}>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form.Group className="mb-3" controlId="currentPassword">
            <Form.Label>Current Password</Form.Label>
            <Form.Control
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              required
              placeholder="Enter current password"
              style={{
                backgroundColor: '#1e1e1e',
                borderColor: '#444',
                color: '#fff'
              }}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="newPassword">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              placeholder="Enter new password"
              style={{
                backgroundColor: '#1e1e1e',
                borderColor: '#444',
                color: '#fff'
              }}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="confirmNewPassword">
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control
              type="password"
              name="confirmNewPassword"
              value={formData.confirmNewPassword}
              onChange={handleChange}
              required
              placeholder="Confirm new password"
              style={{
                backgroundColor: '#1e1e1e',
                borderColor: '#444',
                color: '#fff'
              }}
            />
          </Form.Group>

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <Spinner
                animation="border"
                size="sm"
                variant="light"
                className="me-2"
              />
            ) : null}
            Change Password
          </Button>
        </Form>
      </Card>
    </Container>
  )
}

export default ChangePassword
