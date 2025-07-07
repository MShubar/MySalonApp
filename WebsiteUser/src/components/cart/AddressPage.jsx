import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import styled from 'styled-components'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import useAddressPage from '../../functionality/cart/UseAddressPage'

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

const PageContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  color: #ddd;
  padding: 1rem;
`

const Heading = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
  color: #80b3ff;
`

const StyledMapContainer = styled(MapContainer)`
  height: 300px;
  border-radius: 10px;
`

const FormRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1.5rem;
`

const InputGroup = styled.div`
  flex: 1 1 45%;
`

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #555;
  border-radius: 5px;
  background-color: #222;
  color: #ddd;
  &:focus {
    outline: none;
    border-color: #80b3ff;
  }
`

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #555;
  border-radius: 5px;
  background-color: #222;
  color: #ddd;
  min-height: 100px;
  margin-top: 1rem;
  &:focus {
    outline: none;
    border-color: #80b3ff;
  }
`

const ButtonContainer = styled.div`
  text-align: end;
  margin-top: 1.5rem;
`

const Button = styled.button`
  background-color: #007bff;
  color: #fff;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  &:hover {
    background-color: #0056b3;
  }
`

const LocationPicker = ({ setLatLng }) => {
  useMapEvents({
    click(e) {
      setLatLng([e.latlng.lat, e.latlng.lng])
    }
  })
  return null
}

const AddressPage = () => {
  const {
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
  } = useAddressPage()

  return (
    <PageContainer>
      <Heading>{t('Enter Your Address')}</Heading>

      <StyledMapContainer center={latLng} zoom={13}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationPicker setLatLng={setLatLng} />
        <Marker position={latLng} />
      </StyledMapContainer>

      <FormRow>
        <InputGroup>
          <Input
            type="text"
            placeholder={t('Building Number')}
            value={buildingNumber}
            onChange={(e) => setBuildingNumber(e.target.value)}
          />
        </InputGroup>
        <InputGroup>
          <Input
            type="text"
            placeholder={t('Apartment Number')}
            value={apartmentNumber}
            onChange={(e) => setApartmentNumber(e.target.value)}
          />
        </InputGroup>
        <InputGroup>
          <Input
            type="text"
            placeholder={t('Street')}
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />
        </InputGroup>
        <InputGroup>
          <Input
            type="text"
            placeholder={t('Block')}
            value={block}
            onChange={(e) => setBlock(e.target.value)}
          />
        </InputGroup>
        <InputGroup style={{ flex: '1 1 100%' }}>
          <TextArea
            placeholder={t('Additional Notes')}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </InputGroup>
      </FormRow>

      <ButtonContainer>
        <Button onClick={handleNext}>{t('Continue to Checkout')}</Button>
      </ButtonContainer>
    </PageContainer>
  )
}

export default AddressPage
