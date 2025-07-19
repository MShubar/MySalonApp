import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../config'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// Fix Leaflet's default icon issue
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
})

function LocationPicker({ setLocation }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng
      setLocation(`${lat},${lng}`)
    }
  })
  return null
}

function Create() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [image, setImage] = useState(null)
  const [rating, setRating] = useState('')
  const [location, setLocation] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name || !email || !password || !image || !rating || !location) {
      setError('Please fill all fields and select a location on the map.')
      return
    }

    setLoading(true)
    setError('')

    const [latitude, longitude] = location.split(',')

    const formData = new FormData()
    formData.append('name', name)
    formData.append('email', email)
    formData.append('password', password)
    formData.append('image', image)
    formData.append('rating', Number(rating))
    formData.append('location', JSON.stringify({ latitude, longitude }))

    try {
      const res = await fetch(`${API_URL}/salons/register`, {
        method: 'POST',
        body: formData
      })

      if (res.ok) {
        setName('')
        setEmail('')
        setPassword('')
        setImage(null)
        setRating('')
        setLocation('')
        setError('')
        navigate('/getSalons')
      } else {
        const errorData = await res.json()
        setError(errorData.message || 'Failed to register salon')
      }
    } catch (err) {
      console.error('Error registering salon:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mt-4">
      <h2>Create New Salon</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label>Salon Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group mt-2">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group mt-2">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group mt-2">
          <label>Salon Image</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
        </div>

        <div className="form-group mt-2">
          <label>Rating (1 to 5)</label>
          <input
            type="number"
            className="form-control"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            min="1"
            max="5"
            required
          />
        </div>

        <div className="form-group mt-2">
          <label>Location (Click on the map to select)</label>
          <MapContainer
            center={[26.2, 50.6]}
            zoom={12}
            scrollWheelZoom={true}
            style={{ height: '300px', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <LocationPicker setLocation={setLocation} />
            {location && <Marker position={location.split(',').map(Number)} />}
          </MapContainer>
          <input
            type="text"
            className="form-control mt-2"
            value={location}
            readOnly
            placeholder="Latitude,Longitude"
            required
          />
        </div>

        <button
          type="submit"
          className={`btn mt-3 ${loading ? 'btn-secondary' : 'btn-success'}`}
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register Salon'}
        </button>
      </form>
    </div>
  )
}

export default Create
