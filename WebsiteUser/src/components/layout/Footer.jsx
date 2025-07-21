import React from 'react'

const Footer = () => (
  <footer className="mt-auto py-3" style={{ backgroundColor: '#121212', color: '#ddd' }}>
    <div className="container text-center">
      <a
        href="https://facebook.com/mysalon"
        className="text-decoration-none text-light mx-3"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook"
      >
        <i className="bi bi-facebook fs-3"></i>
      </a>
      <a
        href="https://instagram.com/mysalon"
        className="text-decoration-none text-light mx-3"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
      >
        <i className="bi bi-instagram fs-3"></i>
      </a>
    </div>
  </footer>
)

export default Footer
