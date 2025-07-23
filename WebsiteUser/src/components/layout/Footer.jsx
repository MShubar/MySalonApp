import React from 'react'

const Footer = () => (
  <footer className="bg-dark text-light mt-5 py-4 border-top">
    <div className="container text-center">
      <form
        action="/subscribe"
        method="POST"
        className="row g-2 justify-content-center"
      >
        <div className="col-auto">
          <label htmlFor="footer-email" className="visually-hidden">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="footer-email"
            name="email"
            placeholder="Enter email"
            required
          />
        </div>
        <div className="col-auto">
          <button type="submit" className="btn btn-primary">
            Subscribe
          </button>
        </div>
      </form>
    </div>
  </footer>
)

export default Footer
