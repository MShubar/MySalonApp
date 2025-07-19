import { useState } from 'react'
import useFetch from '../../hooks/useFetch'
import { API_URL } from '../../config'

const useMyBookings = (t, user) => {
  const [showFilters, setShowFilters] = useState(false)
  const [activeTypeFilter, setActiveTypeFilter] = useState('All')
  const [activeDateFilter, setActiveDateFilter] = useState('All')
  const [activeStatusFilter, setActiveStatusFilter] = useState('All')

  const {
    data: bookingsData = [],
    loading: bookingsLoading,
    error: bookingsError
  } = useFetch(user?.id ? `${API_URL}/bookings` : null, [user?.id])

  const {
    data: ordersData = [],
    loading: ordersLoading,
    error: ordersError
  } = useFetch(user?.id ? `${API_URL}/orders/${user.id}` : null, [
    user?.id
  ])
  const bookingsArray = Array.isArray(bookingsData) ? bookingsData : []
  const ordersArray = Array.isArray(ordersData) ? ordersData : []

  const bookings = bookingsArray
    .filter((b) => user && b.user_name === user.username)
    .map((b) => ({ ...b, type: 'booking' }))

  const orders = ordersArray.map((o) => ({ ...o, type: 'order' }))

  const statusPriority = {
    pending: 1,
    active: 2,
    completed: 3,
    delivered: 4,
    cancelled: 5,
    complaint: 6
  }

  const combinedData = [...bookings, ...orders].sort((a, b) => {
    const prioA = statusPriority[(a.status || '').toLowerCase()] || 99
    const prioB = statusPriority[(b.status || '').toLowerCase()] || 99
    if (prioA !== prioB) return prioA - prioB

    const dateA = new Date(a.created_at || a.booking_date)
    const dateB = new Date(b.created_at || b.booking_date)
    return dateB - dateA
  })

  const filterByType = (item) => {
    if (activeTypeFilter === 'All') return true
    if (activeTypeFilter === 'Bookings') return item.type === 'booking'
    if (activeTypeFilter === 'Orders') return item.type === 'order'
    return true
  }

  const filterByDate = (item) => {
    const today = new Date()
    const itemDate = new Date(item.created_at || item.booking_date)
    itemDate.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)

    switch (activeDateFilter) {
      case 'Today':
        return itemDate.getTime() === today.getTime()
      case 'Upcoming':
        return itemDate.getTime() >= today.getTime()
      case 'Past':
        return itemDate.getTime() < today.getTime()
      case 'All':
      default:
        return true
    }
  }

  const filterByStatus = (item) => {
    if (activeStatusFilter === 'All') return true
    const status = item.status?.toLowerCase() || ''
    return status === activeStatusFilter.toLowerCase()
  }

  const filteredData = combinedData.filter(
    (item) => filterByType(item) && filterByDate(item) && filterByStatus(item)
  )

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })

  const formatTime = (timeStr) => timeStr?.slice(0, 5)

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

  const handleRequestCancel = async (id, setBookings) => {
    if (!id) return
    try {
      const response = await fetch(
        `${API_URL}/bookings/${id}/cancel`,
        {
          method: 'PATCH'
        }
      )
      if (response.ok) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: 'Cancelled' } : b))
        )
      } else {
        console.error('Failed to cancel booking')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleRequestCancelOrder = async (orderId, setOrders) => {
    if (!orderId) return
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        setOrders((prev) => prev.filter((o) => o.id !== orderId))
      } else {
        console.error('Failed to cancel order')
      }
    } catch (err) {
      console.error(err)
    }
  }

  return {
    showFilters,
    setShowFilters,
    activeTypeFilter,
    setActiveTypeFilter,
    activeDateFilter,
    setActiveDateFilter,
    activeStatusFilter,
    setActiveStatusFilter,
    bookingsLoading,
    ordersLoading,
    bookingsError,
    ordersError,
    filteredData,
    formatDate,
    formatTime,
    groupOrderItems,
    handleRequestCancel,
    handleRequestCancelOrder
  }
}

export default useMyBookings
