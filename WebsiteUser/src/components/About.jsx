import React from 'react'
import { Helmet } from 'react-helmet'

const About = () => (
  <div className="container text-light py-5 text-center">
    <Helmet>
      <title>About MySalon</title>
      <meta
        name="description"
        content="Learn more about MySalon and our commitment to premium beauty services."
      />
    </Helmet>
    <h2 className="mb-3">About MySalon</h2>
    <p className="lead">
      MySalon brings modern style and professional care together under one roof.
      Book with us and enjoy a premium beauty experience.
    </p>
  </div>
)

export default About
