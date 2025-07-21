import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-dark text-light py-4 mt-auto" role="contentinfo">
    <div className="container text-center">
      <nav
        className="mb-2 d-flex justify-content-center gap-3"
        aria-label="Footer"
      >
        <Link to="/about" className="text-light text-decoration-none">
          About
        </Link>
        <Link to="/contact" className="text-light text-decoration-none">
          Contact
        </Link>
        <Link to="/terms" className="text-light text-decoration-none">
          Terms
        </Link>
        <Link to="/privacy" className="text-light text-decoration-none">
          Privacy
        </Link>
      </nav>
      <small>&copy; {new Date().getFullYear()} MySalon</small>
    </div>
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
);

export default Footer;
