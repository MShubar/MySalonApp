import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import usePaymentSuccess from '../../functionality/cart/UsePaymentSuccessful'
import { Helmet } from 'react-helmet'

const Container = styled.div`
  max-width: 600px;
  margin: 4rem auto;
  padding: 1rem;
  text-align: center;
  color: var(--text-light);
`

const Card = styled.div`
  background: var(--background);
  padding: 2.5rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
`

const Heading = styled.h2`
  margin-bottom: 1rem;
  color: var(--success);
`

const Text = styled.p`
  margin: 0.5rem 0;
`

const BackButton = styled(Link)`
  display: inline-block;
  margin-top: 1.5rem;
  padding: 0.6rem 1.5rem;
  border: 1px solid var(--primary);
  color: var(--primary);
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.3s ease, color 0.3s ease;

  &:hover {
    background: var(--primary);
    color: var(--white);
  }
`
const PaymentSuccess = () => {
  const { amount, orderId } = usePaymentSuccess()

  return (
    <Container>
      <Helmet>
        <title>Payment Successful</title>
      </Helmet>
      <Card>
        <Heading>✅ Payment Successful</Heading>
        <Text>Thank you for your purchase!</Text>
        {amount && (
          <Text>
            <strong>Amount Paid:</strong> {amount} BHD
          </Text>
        )}
        {orderId && (
          <Text>
            <strong>Order ID:</strong> {orderId}
          </Text>
        )}
        <BackButton to="/">Back to Home</BackButton>
      </Card>
    </Container>
  )
}

export default PaymentSuccess
