import React from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import useFetch from '../../hooks/useFetch'

const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
  color: #f0f8ff;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`

const Card = styled.div`
  background-color: #1f1f1f;
  border: 1px solid #333;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  padding: 1.5rem;
`

const Heading = styled.h2`
  margin-bottom: 1rem;
  text-transform: capitalize;
  color: #f0f8ff;
`

const Text = styled.p`
  margin: 0.5rem 0;
`
const Status = styled.span`
  color: ${({ $status }) =>
    $status === 'cancelled'
      ? '#f44336'
      : $status === 'completed'
      ? '#4caf50'
      : '#f0e68c'};
  text-transform: capitalize;
`

const ItemList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 1rem;
`

const Item = styled.li`
  display: flex;
  align-items: center;
  background-color: #2a2a2a;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 0.75rem;
`

const ItemImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 10px;
  border: 1px solid #444;
`

const Placeholder = styled.div`
  width: 50px;
  height: 50px;
  background-color: #555;
  border-radius: 8px;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-size: 0.8rem;
`

const CancelButton = styled.button`
  background: #dc3545;
  border: none;
  color: #fff;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;

  &:hover {
    background: #c82333;
  }
`

const OrderDetailsPage = () => {
  const { t } = useTranslation()
  const { id } = useParams()
  const { state } = useLocation()

  const {
    data: orderData,
    loading,
    error
  } = useFetch(
    state?.order
      ? null
      : id
      ? `http://localhost:5000/orders/order/${id}`
      : null,
    [id]
  )

  const order = state?.order || orderData

  const groupOrderItems = (items) => {
    const grouped = {}
    items.forEach((item) => {
      const key = item.id || item.name
      if (!grouped[key]) {
        grouped[key] = { ...item, quantity: Number(item.quantity) }
      } else {
        grouped[key].quantity += Number(item.quantity)
      }
    })
    return Object.values(grouped)
  }

  const handleCancelOrder = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/orders/order/${id}/cancel`,
        { method: 'PATCH' }
      )
      if (!res.ok) throw new Error(`HTTP error ${res.status}`)
      window.location.reload()
    } catch (err) {
      console.error('Error cancelling order:', err)
      alert(t('Failed to cancel order.'))
    }
  }

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })

  if (loading) {
    return (
      <Container>
        <Text>{t('Loading order details...')}</Text>
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <Text style={{ color: '#f44336' }}>
          {t('Failed to load order details.')}
        </Text>
      </Container>
    )
  }

  if (!order) {
    return (
      <Container>
        <Text>{t('No order found.')}</Text>
      </Container>
    )
  }

  return (
    <Container>
      <Helmet>
        <title>{`${t('Order')} #${order.id || t('Unknown')} ${t(
          'Details'
        )}`}</title>
      </Helmet>

      <Card>
        <Heading>
          {t('Order')} #{order.id || t('Unknown')}
        </Heading>

        <Text>
          <strong>{t('Status')}:</strong>{' '}
          <Status $status={order.status?.toLowerCase()}>
            {t(order.status?.toLowerCase() || 'unknown')}
          </Status>
        </Text>

        <Text>
          <strong>{t('Payment Method')}:</strong> {order.payment_method}
        </Text>

        <Text>
          <strong>{t('Delivery Time')}:</strong> {order.delivery_time}
        </Text>

        <Text>
          <strong>{t('Created At')}:</strong> {formatDate(order.created_at)}
        </Text>

        <Text style={{ color: '#f0e68c', fontWeight: '600' }}>
          {t('Total')}: {Number(order.total).toFixed(2)} BHD
        </Text>

        <h4 style={{ marginTop: '1rem' }}>{t('Items')}:</h4>

        {order.items && order.items.length > 0 ? (
          <ItemList>
            {groupOrderItems(order.items).map((item, idx) => (
              <Item key={idx}>
                {item.image_url ? (
                  <ItemImage
                    src={item.image_url}
                    alt={item.name || t('Item')}
                  />
                ) : (
                  <Placeholder>{t('No Image')}</Placeholder>
                )}
                <div>
                  <strong>{item.name || t('Unnamed Item')}</strong> x{' '}
                  {item.quantity || 1}
                  {item.price && (
                    <span style={{ color: '#f0e68c', marginLeft: '8px' }}>
                      {Number(item.price).toFixed(2)} BHD
                    </span>
                  )}
                </div>
              </Item>
            ))}
          </ItemList>
        ) : (
          <Text>{t('No items found for this order.')}</Text>
        )}

        {order.status?.toLowerCase() !== 'cancelled' &&
          order.status?.toLowerCase() !== 'completed' && (
            <CancelButton onClick={handleCancelOrder}>
              {t('Cancel Order')}
            </CancelButton>
          )}
      </Card>
    </Container>
  )
}

export default OrderDetailsPage
