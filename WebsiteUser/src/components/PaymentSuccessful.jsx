import React from 'react'
import { useLocation, Link } from 'react-router-dom'

const PaymentSuccess = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const amount = queryParams.get('amount')
  const orderId = queryParams.get('orderId')

  return (
    <div className="container mt-5 text-center text-light">
      <div className="p-5 rounded" style={{ background: '#1f1f1f' }}>
        <h2 className="mb-3 text-success">✅ Payment Successful</h2>
        <p className="mb-2">Thank you for your purchase!</p>
        {amount && (
          <p className="mb-1">
            <strong>Amount Paid:</strong> {amount} BHD
          </p>
        )}
        {orderId && (
          <p className="mb-3">
            <strong>Order ID:</strong> {orderId}
          </p>
        )}
        <Link to="/" className="btn btn-outline-primary mt-3">
          Back to Home
        </Link>
      </div>
    </div>
  )
}

export default PaymentSuccess
