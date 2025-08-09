import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import styled from 'styled-components';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import useAddressPage from '../../functionality/cart/UseAddressPage';
import { Helmet } from 'react-helmet';
import ButtonWithIcon from '../ButtonWithIcon';

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const PageContainer = styled.div`
  max-width: 1000px;
  margin: 2rem auto;
  color: #ddd;
  padding: 0 1rem;
`;

const Heading = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  color: #222;
  font-weight: 700;
`;

const Card = styled.div`
  background: #2a2a2a;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
`;

const StyledMapContainer = styled(MapContainer)`
  height: 300px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h5`
  color: #80b3ff;
  margin-bottom: 1rem;
`;

const MapContainerStyled = styled(MapContainer)`
  height: 200px;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 1rem;
`;

const AlertOverlay = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #dc3545;
  color: #fff;
  padding: 20px 40px;
  border-radius: 12px;
  z-index: 9999;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  text-align: center;
  font-size: 1.2rem;
  font-weight: 500;
`;

const SuccessAlert = styled.div`
  background: #198754;
  text-align: center;
  font-weight: 600;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const FormRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const InputGroup = styled.div`
  flex: 1 1 45%;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 5px;
  background-color: var(--input-background);
  color: var(--text-muted);
  &:focus {
    outline: none;
    border-color: var(--accent);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 5px;
  background-color: var(--input-background);
  color: var(--text-muted);
  min-height: 100px;
  margin-top: 1rem;
  &:focus {
    outline: none;
    border-color: var(--accent);
  }
`;

const ButtonContainer = styled.div`
  text-align: end;
  margin-top: 1.5rem;
`;

const LocationPicker = ({ setLatLng }) => {
  useMapEvents({
    click(e) {
      setLatLng([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

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
    handleNext,
  } = useAddressPage();

  return (
    <PageContainer>
      <Helmet>
        <title>{t('Enter Your Address')}</title>
      </Helmet>
      <Heading>{t('Enter Your Address')}</Heading>

      <Card>
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
      </Card>

      <ButtonContainer>
        <ButtonWithIcon onClick={handleNext} type="book" width="100%">
          {t('Continue to Checkout')}
        </ButtonWithIcon>
      </ButtonContainer>
    </PageContainer>
  );
};

export default AddressPage;
