import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { API_URL } from '../config'

export default function SalonProfile() {
  const { auth, setAuth } = useAuth()
  const [name, setName] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [openingTime, setOpeningTime] = useState('')
  const [closingTime, setClosingTime] = useState('')

  useEffect(() => {
    if (!auth?.token) return
    axios
      .get(`${API_URL}/salons/me`, {
        headers: { Authorization: `Bearer ${auth.token}` }
      })
      .then((res) => {
        const data = res.data
        setName(data.name || '')
        setLatitude(data.latitude || '')
        setLongitude(data.longitude || '')
        setOpeningTime(data.opening_time?.slice(0, 5) || '')
        setClosingTime(data.closing_time?.slice(0, 5) || '')
      })
      .catch((err) => console.error('Failed to fetch profile:', err))
  }, [auth])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.put(
        `${API_URL}/salons/${auth.id}`,
        {
          name,
          location: { latitude, longitude },
          opening_time: openingTime,
          closing_time: closingTime
        },
        {
          headers: { Authorization: `Bearer ${auth.token}` }
        }
      )
      setAuth({
        ...auth,
        name,
        latitude,
        longitude,
        opening_time: openingTime,
        closing_time: closingTime
      })
      alert('Profile updated successfully')
    } catch (err) {
      console.error('Failed to update profile:', err)
      alert('Update failed')
    }
  }

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <h2 className="mb-4 text-center">Edit Profile</h2>
        <form
          onSubmit={handleSubmit}
          className="mx-auto"
          style={{ maxWidth: '500px' }}
        >
          <div className="mb-3">
            <label className="form-label">Salon Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Latitude</label>
            <input
              type="number"
              className="form-control"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              step="any"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Longitude</label>
            <input
              type="number"
              className="form-control"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              step="any"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Opening Time</label>
            <input
              type="time"
              className="form-control"
              value={openingTime}
              onChange={(e) => setOpeningTime(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Closing Time</label>
            <input
              type="time"
              className="form-control"
              value={closingTime}
              onChange={(e) => setClosingTime(e.target.value)}
              required
            />
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
