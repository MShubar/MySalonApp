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
  </footer>
);

export default Footer;
