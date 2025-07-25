import React, { useEffect, useState } from 'react'
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from 'chart.js'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import { API_URL } from '../config'
import capitalizeName from '../utils/capitalizeName'

ChartJS.register(
  BarElement,
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
)

export default function DashboardPage() {
  const [bookings, setBookings] = useState([])
  const { auth } = useAuth()

  useEffect(() => {
    axios.get(`${API_URL}/bookings`).then((res) => {
      const filtered = res.data.filter((b) => b.salon_name === auth.name)
      setBookings(filtered)
    })
  }, [auth.name])

  // Format and group bookings
  const bookingsPerDay = {}
  const serviceCount = {}

  bookings.forEach((b) => {
    const formattedDate = new Date(b.booking_date).toLocaleDateString()
    bookingsPerDay[formattedDate] = (bookingsPerDay[formattedDate] || 0) + 1
    serviceCount[b.service_name] = (serviceCount[b.service_name] || 0) + 1
  })

  const totalBookings = bookings.length
  const totalServices = Object.keys(serviceCount).length
  const mostPopularService =
    Object.entries(serviceCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
  const busiestDay =
    Object.entries(bookingsPerDay).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'

  // Chart Configs
  const barData = {
    labels: Object.keys(bookingsPerDay),
    datasets: [
      {
        label: 'Bookings per Day',
        data: Object.values(bookingsPerDay),
        backgroundColor: 'rgba(54, 162, 235, 0.7)'
      }
    ]
  }

  const pieData = {
    labels: Object.keys(serviceCount),
    datasets: [
      {
        data: Object.values(serviceCount),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#7b68ee', '#4bc0c0']
      }
    ]
  }

  const lineData = {
    labels: Object.keys(bookingsPerDay),
    datasets: [
      {
        label: 'Booking Trend',
        data: Object.values(bookingsPerDay),
        fill: false,
        borderColor: '#4bc0c0',
        tension: 0.4
      }
    ]
  }

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2 className="mb-4 text-center">Welcome, {capitalizeName(auth.name)}</h2>

        {/* Analytics Summary Cards */}
        <div className="row text-center mb-4 g-3">
          <div className="col-sm-6 col-lg-3">
            <div className="card p-3 shadow-sm h-100">
              <h6>Total Bookings</h6>
              <h2 className="text-primary">{totalBookings}</h2>
            </div>
          </div>
          <div className="col-sm-6 col-lg-3">
            <div className="card p-3 shadow-sm h-100">
              <h6>Services Offered</h6>
              <h2 className="text-success">{totalServices}</h2>
            </div>
          </div>
          <div className="col-sm-6 col-lg-3">
            <div className="card p-3 shadow-sm h-100">
              <h6>Popular Service</h6>
              <p className="fs-5 fw-bold">{mostPopularService}</p>
            </div>
          </div>
          <div className="col-sm-6 col-lg-3">
            <div className="card p-3 shadow-sm h-100">
              <h6>Busiest Day</h6>
              <p className="fs-5 fw-bold">{busiestDay}</p>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card p-3 shadow-sm">
              <h6 className="text-center">Bookings per Day</h6>
              <Bar data={barData} />
            </div>
          </div>
          <div className="col-md-6">
            <div className="card p-3 shadow-sm">
              <h6 className="text-center">Service Distribution</h6>
              <Pie data={pieData} />
            </div>
          </div>
          <div className="col-md-6">
            <div className="card p-3 shadow-sm">
              <h6 className="text-center">Booking Trend</h6>
              <Line data={lineData} />
            </div>
          </div>
          <div className="col-md-6">
            <div className="card p-3 shadow-sm">
              <h6 className="text-center">Service Breakdown</h6>
              <Doughnut data={pieData} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
