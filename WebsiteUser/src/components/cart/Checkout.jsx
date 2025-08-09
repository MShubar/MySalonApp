import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import styled from 'styled-components';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import useCheckout from '../../functionality/cart/UseCheckout';
import { Helmet } from 'react-helmet';
import ButtonWithIcon from '../ButtonWithIcon';
import { useNavigate } from 'react-router-dom';

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
  direction: ${(props) => (props.$isRTL ? 'rtl' : 'ltr')};
  text-align: ${(props) => (props.$isRTL ? 'right' : 'left')};
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

const SectionTitle = styled.h5`
  color: #80b3ff;
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
  display: ${(props) => (props.show ? 'block' : 'none')};
`;

const SuccessAlert = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #198754;
  text-align: center;
  font-weight: 600;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  z-index: 9999;
  color: #fff;
  font-size: 1.2rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  display: ${(props) => (props.show ? 'block' : 'none')};
`;

const PaymentOption = styled.div`
  flex: 1 1 150px;
  padding: 1rem;
  text-align: center;
  border-radius: 8px;
  cursor: pointer;
  background: ${(props) => (props.selected ? '#0d6efd' : '#343a40')};
  color: ${(props) => (props.selected ? '#fff' : '#f8f9fa')};

  &:hover {
    background: #0d6efd;
    color: #fff;
  }
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  color: #bbb;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  color: #ffd166;
  font-size: 1.25rem;
  margin: 1rem 0;
`;

const Checkout = () => {
  const {
    t,
    address,
    paymentMethod,
    setPaymentMethod,
    successMsg,
    logoutMsg,
    subtotal,
    tax,
    deliveryFee,
    total,
    deliveryTime,
    placeOrder,
    paymentStatus, // Add paymentStatus from the hook (whether it's successful or failed)
  } = useCheckout();

  const navigate = useNavigate();

  const getPaymentMessage = () => {
    if (paymentStatus === 'success') {
      return t('Payment Successful. Your order has been placed.');
    }
    if (paymentStatus === 'failed') {
      return t('Payment failed. Please try again.');
    }
    return t('Processing your payment...');
  };

  return (
    <PageContainer $isRTL={t('dir') === 'rtl'}>
      <Helmet>
        <title>{t('Checkout')}</title>
      </Helmet>

      {logoutMsg && (
        <AlertOverlay show={true}>
          {typeof logoutMsg === 'string'
            ? logoutMsg
            : t('You must be logged in to place an order')}
        </AlertOverlay>
      )}

      {paymentStatus && (
        <SuccessAlert show={true}>{getPaymentMessage()}</SuccessAlert>
      )}

      <Heading>{t('Checkout')}</Heading>

      {/* Delivery Address Card */}
      <Card>
        <SectionTitle>
          <i className="bi bi-geo-alt-fill me-2"></i> {t('Delivery Address')}
        </SectionTitle>
        {address ? (
          <>
            <div style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
              <div>
                <strong>{t('Building')}:</strong> {address.buildingNumber}
              </div>
              <div>
                <strong>{t('Apt')}:</strong> {address.apartmentNumber || '—'}
              </div>
              <div>
                <strong>{t('Street')}:</strong> {address.street}
              </div>
              <div>
                <strong>{t('Block')}:</strong> {address.block}
              </div>
              {address.note && (
                <div>
                  <strong>{t('Note')}:</strong> {address.note}
                </div>
              )}
            </div>

            <div
              style={{
                height: '200px',
                borderRadius: '10px',
                overflow: 'hidden',
                marginBottom: '1rem',
              }}
            >
              <MapContainer
                center={address.latLng}
                zoom={15}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={address.latLng} />
              </MapContainer>
            </div>

            <ButtonWithIcon
              onClick={() => navigate('/address')}
              type="book"
              width="100%"
            >
              {t('Change Address')}
            </ButtonWithIcon>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#ffc107' }}>{t('No address selected')}</p>

            <ButtonWithIcon
              onClick={() => (window.location.href = '/address')}
              type="book"
              width="100%"
            >
              {t('Choose Address')}
            </ButtonWithIcon>
          </div>
        )}
      </Card>

      {/* Payment Method Card */}
      <Card>
        <SectionTitle>{t('Payment Method')}</SectionTitle>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <PaymentOption
            selected={paymentMethod === 'benefit'}
            onClick={() => setPaymentMethod('benefit')}
          >
            <i className="bi bi-credit-card-2-front-fill fs-4 mb-2"></i>
            <div>{t('Benefit')}</div>
          </PaymentOption>
          <PaymentOption
            selected={paymentMethod === 'cash'}
            onClick={() => setPaymentMethod('cash')}
          >
            <i className="bi bi-cash-stack fs-4 mb-2"></i>
            <div>{t('Cash on Delivery')}</div>
          </PaymentOption>
        </div>
      </Card>

      {/* Order Summary Card */}
      <Card>
        <SectionTitle>
          <i className="bi bi-receipt-cutoff me-2"></i> {t('Order Summary')}
        </SectionTitle>

        <SummaryRow>
          <span>{t('Subtotal')}</span>
          <span>
            {subtotal.toFixed(2)} {t('BHD')}
          </span>
        </SummaryRow>
        <SummaryRow>
          <span>{t('VAT (10%)')}</span>
          <span>
            {tax.toFixed(2)} {t('BHD')}
          </span>
        </SummaryRow>
        <SummaryRow>
          <span>{t('Delivery Fee')}</span>
          <span>
            {deliveryFee.toFixed(2)} {t('BHD')}
          </span>
        </SummaryRow>

        <TotalRow>
          <span>{t('Total')}</span>
          <span>
            {total.toFixed(2)} {t('BHD')}
          </span>
        </TotalRow>

        <p style={{ color: '#aaa', marginBottom: '1rem' }}>
          <i className="bi bi-clock me-2"></i>
          {t('Estimated delivery time')}: {deliveryTime}
        </p>

        <ButtonWithIcon onClick={placeOrder} type="book" width="100%">
          {' '}
          {t('Place Order')}
        </ButtonWithIcon>
      </Card>
    </PageContainer>
  );
};

export default Checkout;
