import React from 'react'
import { Helmet } from 'react-helmet'

const Privacy = () => (
  <div className="container text-light py-5">
    <Helmet>
      <title>Privacy Policy</title>
    </Helmet>
    <h2 className="text-center mb-3">Privacy Policy</h2>
    <p>
      This website collects only the information necessary to manage your
      bookings and orders. We do not share your data with third parties.
    </p>
  </div>
)

export default Privacy
