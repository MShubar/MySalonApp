import React from 'react'
import { Link } from 'react-router-dom'

const HeroSection = () => (
  <section className="container text-center py-5">
    <img
      src="https://via.placeholder.com/1200x300?text=MySalon+Banner"
      alt="Salon banner"
      className="img-fluid rounded mb-4 shadow"
      style={{ width: '100%', maxHeight: 300, objectFit: 'cover' }}
    />
    <h1 className="mb-3 text-light">Welcome to MySalon</h1>
    <p className="lead text-light mb-4">
      Discover premium beauty services near you.
    </p>
    <Link to="/signup" className="btn btn-primary btn-lg">
      Book Now
    </Link>
  </section>
)

export default HeroSection
