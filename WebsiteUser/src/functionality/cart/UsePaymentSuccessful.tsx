import { useLocation } from 'react-router-dom'

const usePaymentSuccess = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const amount = queryParams.get('amount')
  const orderId = queryParams.get('orderId')

  return {
    amount,
    orderId
  }
}

export default usePaymentSuccess
