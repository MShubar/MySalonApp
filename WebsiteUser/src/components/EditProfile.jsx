import React, { useState, useEffect } from 'react'
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap'
import axios from 'axios'

function EditProfile({ userId }) {
  const [formData, setFormData] = useState({
    username: '',
    email: ''
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Set dark background on mount
  useEffect(() => {
    document.body.style.backgroundColor = '#121212'
    return () => {
      document.body.style.backgroundColor = ''
    }
  }, [])

  // Fetch user data on userId change
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true)
      setError('')
      setSuccess('')
      try {
        const res = await axios.get(`http://localhost:5000/users/${userId}`)
        setFormData({
          username: res.data.username || '',
          email: res.data.email || ''
        })
      } catch (err) {
        console.error('Error fetching user data:', err)
        setError('Failed to load user data')
      } finally {
        setLoading(false)
      }
    }
    if (userId) {
      fetchUser()
    }
  }, [userId])

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.username || !formData.email) {
      setError('Username and email are required')
      return
    }

    try {
      await axios.put(`http://localhost:5000/users/${userId}`, formData)
      setSuccess('Profile updated successfully!')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile')
    }
  }

  return (
    <Container
      className="mt-5 p-4 rounded"
      style={{ maxWidth: 600, color: '#f0f0f0' }}
    >
      <h2 className="mb-4 fw-bold" style={{ color: '#222' }}>
        Edit Profile
      </h2>

      <Card
        className="p-4"
        style={{ backgroundColor: '#2a2a2a', color: '#fff' }}
      >
        {loading ? (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" variant="light" />
          </div>
        ) : (
          <Form onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Enter username"
                style={{
                  backgroundColor: '#1e1e1e',
                  borderColor: '#444',
                  color: '#fff'
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter email"
                style={{
                  backgroundColor: '#1e1e1e',
                  borderColor: '#444',
                  color: '#fff'
                }}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        )}
      </Card>
    </Container>
  )
}

export default EditProfile
