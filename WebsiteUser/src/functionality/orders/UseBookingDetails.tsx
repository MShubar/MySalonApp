import { useState, useEffect } from 'react'
import useFetch from '../../hooks/useFetch'
import { API_URL } from '../../config'

const useBookingDetails = (id, t) => {
  const [cancelError, setCancelError] = useState(null)

  const {
    data: bookingData,
    loading,
    error
  } = useFetch(`${API_URL}/bookings/${id}`, [id])

  const [booking, setBooking] = useState(null)

  useEffect(() => {
    if (bookingData) {
      setBooking({
        id: bookingData.id || id,
        salon_name: bookingData.salon_name || t('Unknown Salon'),
        status: bookingData.status || t('Unknown'),
        booking_date: bookingData.booking_date || '',
        booking_time: bookingData.booking_time || '',
        total: bookingData.total || 0,
        services: (bookingData.service_name || '')
          .split(',')
          .map((s) => s.trim())
      })
    }
  }, [bookingData, id, t])

  const handleCancelBooking = async () => {
    setCancelError(null)
    try {
      const res = await fetch(`${API_URL}/bookings/${id}/cancel`, {
        method: 'PATCH'
      })
      if (!res.ok) throw new Error(`HTTP error ${res.status}`)
      const updated = await res.json()
      setBooking((prev) => ({
        ...prev,
        status: updated.status || t('Cancelled')
      }))
    } catch (err) {
      console.error('Error cancelling booking:', err)
      setCancelError(t('Failed to cancel booking.'))
    }
  }

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })

  return {
    booking,
    loading,
    error,
    cancelError,
    handleCancelBooking,
    formatDate
  }
}

export default useBookingDetails
