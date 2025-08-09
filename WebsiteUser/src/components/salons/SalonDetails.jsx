import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import useSalonDetails from '../../functionality/salons/UseSalonDetails';
import ServerError from '../ServerError';
import NoDataView from '../NoDataView';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet marker icon issue
import L from 'leaflet';
import LoadingSpinner from '../LoadingSpinner';
import ButtonWithIcon from '../ButtonWithIcon';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Styled components
const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2rem;
  background-color: #1f1f1f;
  color: #f0f8ff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 123, 255, 0.1);
  margin-top: 3rem; /* Space between the TopBar and the component */
  width: 100%;
  @media (max-width: 768px) {
    flex-direction: column;
    margin-top: 6rem; /* Adjust for mobile */
  }
`;

const ImageSection = styled.div`
  flex: 1;
  width: 100%;
`;

const SalonImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 123, 255, 0.4);
  @media (max-width: 768px) {
    height: 250px;
  }
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 400px;
  background-color: #444;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ddd;
  font-size: 2rem;
  border-radius: 12px;
  @media (max-width: 768px) {
    height: 250px;
  }
`;

const InfoSection = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  color: #f0f8ff;
`;

const Title = styled.h2`
  font-size: 2rem;
  color: #a3c1f7;
  margin-bottom: 1rem;
`;

const Label = styled.span`
  font-weight: 600;
  color: #f0e68c;
`;

const Status = styled.span`
  color: ${(props) =>
    props.$status === 'cancelled'
      ? '#f44336'
      : props.$status === 'completed'
      ? '#4caf50'
      : '#f0e68c'}};
  text-transform: capitalize;
`;

const DetailRow = styled.div`
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: #ddd;
`;

const ServicesContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const ServiceList = styled.ul`
  list-style: none;
  padding: 0;
  margin-left: 0;
`;

const ServiceItem = styled.li`
  background-color: #2a2a2a;
  padding: 12px 16px;
  border-radius: 10px;
  margin-bottom: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #333;
  }

  & strong {
    font-size: 1.1rem;
    color: #f0f8ff;
  }

  & p {
    color: #ccc;
    font-size: 0.9rem;
    margin-top: 0.5rem;
  }
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: #a3c1f7;
  margin-top: 8px;
  cursor: pointer;
  padding: 0;
  font-size: 0.9rem;

  &:hover {
    text-decoration: underline;
  }
`;

const ShowMoreButton = styled.button`
  background-color: #f0e68c;
  color: #1f1f1f;
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 15px;

  &:hover {
    background-color: #d9c04d;
  }
`;

const InfoText = styled.p`
  color: #ccc;
`;

const MapContainerStyled = styled(MapContainer)`
  margin-bottom: 20px; /* Space between the map and the button */
  border-radius: 12px;
  height: 300px;
  width: 100%;
`;

const ButtonWithSpacing = styled(ButtonWithIcon)`
  margin-top: 20px; /* Space between the map and the button */
`;

const SalonDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState({});
  const [showAllServices, setShowAllServices] = useState(false);

  const { salon, loading, error, retry, latitude, longitude } =
    useSalonDetails(id);

  const toggleExpanded = (sid) =>
    setExpanded((prev) => ({ ...prev, [sid]: !prev[sid] }));

  const toggleShowAllServices = () => setShowAllServices(!showAllServices);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    if (error.response?.status === 500) {
      return <ServerError onRetry={retry} />;
    }
    return <NoDataView message={t('Salon not found')} />;
  }

  if (!salon) {
    return <NoDataView message={t('Salon not found')} />;
  }

  const servicesToShow = showAllServices
    ? salon.services
    : salon.services.slice(0, 3);

  return (
    <Container>
      <Helmet>
        <title>{salon ? salon.name : t('Salon Details')}</title>
      </Helmet>

      <ImageSection>
        {salon.image_url ? (
          <SalonImage
            src={salon.image_url}
            alt={`Image of ${salon.name} salon`}
            onError={(e) => (e.target.style.display = 'none')}
          />
        ) : (
          <ImagePlaceholder>{salon.name.charAt(0)}</ImagePlaceholder>
        )}
      </ImageSection>

      <InfoSection>
        <Title>{salon.name}</Title>

        <DetailRow>
          <Label>{t('Rating')}:</Label> {salon.rating} ⭐
        </DetailRow>

        <DetailRow>
          <Label>{t('Address')}:</Label>{' '}
          {latitude && longitude
            ? `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
            : t('N/A')}
        </DetailRow>

        {salon.opening_time && salon.closing_time && (
          <DetailRow>
            <Label>{t('Opening Hours')}:</Label>{' '}
            {salon.opening_time.slice(0, 5)} - {salon.closing_time.slice(0, 5)}
          </DetailRow>
        )}

        {salon.services && salon.services.length > 0 ? (
          <ServicesContainer>
            <Label>{t('Services')}:</Label>
            <ServiceList>
              {servicesToShow.map((service) => {
                const desc = service.description || '';
                const isLong = desc.length > 100;
                const isOpen = expanded[service.id];
                return (
                  <ServiceItem key={service.id}>
                    <strong>{t(service.name)}</strong>
                    {desc && (
                      <p>
                        {isOpen || !isLong ? desc : `${desc.slice(0, 100)}...`}
                        {isLong && (
                          <ToggleButton
                            onClick={() => toggleExpanded(service.id)}
                          >
                            {isOpen ? t('Show Less') : t('Show More')}
                          </ToggleButton>
                        )}
                      </p>
                    )}
                  </ServiceItem>
                );
              })}
            </ServiceList>

            {!showAllServices && salon.services.length > 3 && (
              <ShowMoreButton onClick={toggleShowAllServices}>
                {t('More Services')}
              </ShowMoreButton>
            )}
          </ServicesContainer>
        ) : (
          <InfoText>{t('No services available')}</InfoText>
        )}

        {latitude && longitude && (
          <MapContainerStyled
            center={[latitude, longitude]}
            zoom={14}
            scrollWheelZoom={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution={''} // Remove the attribution text
              noWrap={true} // Prevent wraparound of tiles
            />
            <Marker position={[latitude, longitude]} />
          </MapContainerStyled>
        )}

        <ButtonWithSpacing
          onClick={() => navigate(`/salon/${salon.id}/book`)}
          type="book"
          width="100%"
        >
          {t('Book Now')}
        </ButtonWithSpacing>
      </InfoSection>
    </Container>
  );
};

export default SalonDetails;
