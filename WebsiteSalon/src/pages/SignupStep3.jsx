import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
})

function LocationPicker({ setLatitude, setLongitude }) {
  useMapEvents({
    click(e) {
      setLatitude(e.latlng.lat)
      setLongitude(e.latlng.lng)
    }
  })
  return null
}

function SignupStep3() {
  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)
  const [image, setImage] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async () => {
    const step1 = JSON.parse(localStorage.getItem('signupStep1'))
    const step2 = JSON.parse(localStorage.getItem('signupStep2'))
    if (!step1 || !step2 || !image || !latitude || !longitude)
      return alert('Missing data')

    const formData = new FormData()
    formData.append('name', step2.name)
    formData.append('email', step1.email)
    formData.append('password', step1.password)
    formData.append('rating', 5)
    formData.append(
      'location',
      JSON.stringify({ lat: latitude, lng: longitude })
    )
    formData.append('image', image)

    try {
      const res = await axios.post(
        'http://localhost:5000/salons/register',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      )

      await axios.post('http://localhost:5000/types/assign', {
        salonId: res.data.salon.id,
        typeIds: step2.selectedTypes
      })

      await axios.post(
        `http://localhost:5000/services/salon/${res.data.salon.id}`,
        {
          serviceIds: step2.selectedServices
        }
      )

      navigate('/pending')
    } catch (err) {
      alert('Signup failed')
    }
  }

  return (
    <div className="d-flex vh-100 justify-content-center align-items-center bg-light">
      <div
        className="card shadow p-4"
        style={{ maxWidth: '600px', width: '100%' }}
      >
        <h3 className="mb-4 text-center">Sign Up - Step 3/3</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
        >
          <div className="mb-3">
            <label className="form-label">Select Salon Location</label>
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
              <LocationPicker
                setLatitude={setLatitude}
                setLongitude={setLongitude}
              />
              {latitude && longitude && (
                <Marker position={[latitude, longitude]} />
              )}
            </MapContainer>
          </div>
          <div className="mb-4">
            <label className="form-label">Salon Image</label>
            <input
              type="file"
              className="form-control"
              required
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>
          <div className="d-flex justify-content-between">
            <button type="submit" className="btn btn-success">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignupStep3
