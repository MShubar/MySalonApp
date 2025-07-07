import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import moment from 'moment'

export const useSalonBooking = ({ salonId, userId, t, navigate }) => {
  const [salon, setSalon] = useState(null)
  const [loading, setLoading] = useState(true)
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'))
  const [time, setTime] = useState('')
  const [services, setServices] = useState([])
  const [selectedServices, setSelectedServices] = useState([])
  const [notes, setNotes] = useState('')
  const [total, setTotal] = useState(0)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [timeSlots, setTimeSlots] = useState([])
  const [bookedSlots, setBookedSlots] = useState([])

  const generateTimeSlots = (openTime, closeTime) => {
    const slots = []
    let current = moment(openTime, 'HH:mm:ss')
    const closing = moment(closeTime, 'HH:mm:ss')

    while (current < closing) {
      slots.push(current.format('HH:mm'))
      current.add(30, 'minutes')
    }
    return slots
  }

  useEffect(() => {
    const fetchSalonAndServices = async () => {
      try {
        const [salonRes, servicesRes] = await Promise.all([
          axios.get(`http://localhost:5000/salons/${salonId}`),
          axios.get(`http://localhost:5000/services/salon/${salonId}`)
        ])
        const salonData = salonRes.data
        const slots = generateTimeSlots(
          salonData.opening_time || '09:00:00',
          salonData.closing_time || '18:00:00'
        )
        setTimeSlots(slots)
        setSalon(salonData)
        setServices(servicesRes.data)
      } catch (err) {
        console.error(err)
        setError(t('Failed to load salon data'))
      } finally {
        setLoading(false)
      }
    }
    fetchSalonAndServices()
  }, [salonId, t])

  useEffect(() => {
    if (!date) return
    const fetchBookedSlots = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/bookings/${salonId}/${date}/slots`
        )
        setBookedSlots(res.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchBookedSlots()
  }, [date, salonId])

  useEffect(() => {
    const totalPrice = selectedServices.reduce((sum, sid) => {
      const service = services.find((s) => s.id === sid)
      return sum + (Number(service?.price) || 0)
    }, 0)
    setTotal(totalPrice)
  }, [selectedServices, services])

  const totalDuration = useMemo(() => {
    return selectedServices.reduce((sum, sid) => {
      const service = services.find((s) => s.id === sid)
      return sum + (Number(service?.duration) || 0)
    }, 0)
  }, [selectedServices, services])

  const slotsWithStatus = useMemo(() => {
    return timeSlots.map((slot) => {
      const slotStart = moment(`${date} ${slot}`, 'YYYY-MM-DD HH:mm:ss')
      const slotEnd = slotStart.clone().add(totalDuration || 0, 'minutes')

      const isPast =
        moment(date).isSame(moment(), 'day') && slotStart.isBefore(moment())

      const hasBookingConflict = bookedSlots.some((b) => {
        const bookedStart = moment(`${date} ${b.start}`, 'YYYY-MM-DD HH:mm:ss')
        const bookedEnd = bookedStart.clone().add(b.duration, 'minutes')
        return slotStart.isBefore(bookedEnd) && slotEnd.isAfter(bookedStart)
      })

      let withinSelectedRange = false
      if (time && totalDuration > 0) {
        const selectedStart = moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm:ss')
        const selectedEnd = selectedStart.clone().add(totalDuration, 'minutes')

        withinSelectedRange =
          slotStart.isSameOrAfter(selectedStart) &&
          slotStart.isBefore(selectedEnd)
      }

      const disabled = isPast || (totalDuration > 0 && hasBookingConflict)

      return {
        time: slot,
        disabled,
        withinSelectedRange
      }
    })
  }, [timeSlots, date, totalDuration, bookedSlots, time])

  useEffect(() => {
    const available = slotsWithStatus.filter((s) => !s.disabled)
    if (!date || available.length === 0) return
    if (!available.some((s) => s.time === time)) {
      setTime(available[0]?.time || '')
    }
  }, [date, slotsWithStatus, time, totalDuration])

  const handleBookingSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!date || !time) {
      setError(t('Please select a date and time'))
      return
    }

    if (selectedServices.length === 0) {
      setError(t('Please select at least one service'))
      return
    }

    try {
      await axios.post(`http://localhost:5000/bookings`, {
        user_id: userId,
        salon_id: salonId,
        service: selectedServices.join(','),
        booking_date: date,
        booking_time: time,
        notes,
        amount: total,
        duration: totalDuration
      })
      setSuccess(t('Booking successful!'))
      setTimeout(() => navigate('/'), 2000)
    } catch (err) {
      setError(t('Failed to book. Please try again.'))
      console.error(err)
    }
  }

  return {
    salon,
    loading,
    date,
    setDate,
    time,
    setTime,
    services,
    selectedServices,
    setSelectedServices,
    notes,
    setNotes,
    total,
    error,
    success,
    slotsWithStatus,
    handleBookingSubmit
  }
}
