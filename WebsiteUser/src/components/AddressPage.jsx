import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
})

const LocationPicker = ({ setLatLng }) => {
  useMapEvents({
    click(e) {
      setLatLng([e.latlng.lat, e.latlng.lng])
    }
  })
  return null
}

const AddressPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [latLng, setLatLng] = useState([26.2285, 50.586])
  const [buildingNumber, setBuildingNumber] = useState('')
  const [apartmentNumber, setApartmentNumber] = useState('')
  const [street, setStreet] = useState('')
  const [block, setBlock] = useState('')
  const [note, setNote] = useState('')

  const handleNext = () => {
    if (!buildingNumber || !street || !block) {
      return alert(t('Please fill all required fields'))
    }

    const addressInfo = {
      latLng,
      buildingNumber,
      apartmentNumber,
      street,
      block,
      note
    }

    localStorage.setItem('deliveryAddress', JSON.stringify(addressInfo))
    navigate('/checkout')
  }

  return (
    <div className="container mt-5" style={{ color: '#ddd' }}>
      <h2 className="text-center mb-4" style={{ color: '#80b3ff' }}>
        {t('Enter Your Address')}
      </h2>

      <MapContainer
        center={latLng}
        zoom={13}
        style={{ height: '300px', borderRadius: '10px' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationPicker setLatLng={setLatLng} />
        <Marker position={latLng} />
      </MapContainer>

      <div className="row mt-4 g-2">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder={t('Building Number')}
            value={buildingNumber}
            onChange={(e) => setBuildingNumber(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder={t('Apartment Number')}
            value={apartmentNumber}
            onChange={(e) => setApartmentNumber(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder={t('Street')}
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder={t('Block')}
            value={block}
            onChange={(e) => setBlock(e.target.value)}
          />
        </div>
        <div className="col-12">
          <textarea
            className="form-control"
            placeholder={t('Additional Notes')}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </div>

      <div className="text-end mt-3">
        <button className="btn btn-primary px-4" onClick={handleNext}>
          {t('Continue to Checkout')}
        </button>
      </div>
    </div>
  )
}

export default AddressPage
