import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const useAddressPage = () => {
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
      alert(t('Please fill all required fields'))
      return
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

  return {
    t,
    latLng,
    setLatLng,
    buildingNumber,
    setBuildingNumber,
    apartmentNumber,
    setApartmentNumber,
    street,
    setStreet,
    block,
    setBlock,
    note,
    setNote,
    handleNext
  }
}

export default useAddressPage
