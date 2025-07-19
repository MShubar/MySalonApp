import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { API_URL } from '../config'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// Fix Leaflet marker icon issue
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

function Edit() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rating, setRating] = useState('')
  const [location, setLocation] = useState('')
  const [image, setImage] = useState(null)
  const [existingImage, setExistingImage] = useState('')
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    const fetchSalon = async () => {
      try {
        const res = await fetch(`${API_URL}/salons/${id}`)
        const data = await res.json()

        if (res.ok && data) {
          setName(data.name || '')
          setEmail(data.email || '')
          setPassword(data.password || '')
          setRating(data.rating || '')
          if (data.location && typeof data.location === 'object') {
            const lat = data.location.latitude || data.location.lat
            const lng = data.location.longitude || data.location.lng
            setLocation(`${lat},${lng}`)
          } else {
            setLocation('')
          }
          setExistingImage(data.image || '')
        } else {
          alert('Failed to fetch salon data')
        }
      } catch (err) {
        console.error('Error fetching salon:', err)
      }
    }

    fetchSalon()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('name', name)
    formData.append('email', email)
    formData.append('password', password)
    formData.append('rating', rating)
    if (location) formData.append('location', location)
    if (image) formData.append('image', image)

    try {
      const res = await fetch(`${API_URL}/salons/${id}`, {
        method: 'PUT',
        body: formData
      })

      if (res.ok) {
        navigate('/getSalons', {
          state: { success: 'Salon updated successfully!' }
        })
      } else {
        alert('Failed to update salon')
      }
    } catch (err) {
      console.error('Error updating salon:', err)
    }
  }

  return (
    <div className="container mt-4">
      <h2>Edit Salon</h2>
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
          <label>Rating</label>
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
          <label>Location (Click on the map to update)</label>
          <MapContainer
            center={location ? location.split(',').map(Number) : [26.2, 50.6]}
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

        <div className="form-group mt-2">
          <label>Update Image (optional)</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
          {existingImage && (
            <small className="form-text text-muted">
              Current: {existingImage}
            </small>
          )}
        </div>

        <button type="submit" className="btn btn-primary mt-3">
          Update Salon
        </button>
      </form>
    </div>
  )
}

export default Edit
