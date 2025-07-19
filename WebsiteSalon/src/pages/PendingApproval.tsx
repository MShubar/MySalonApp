import React from 'react'
import { Link } from 'react-router-dom'

function PendingApproval() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>⏳ Pending Approval</h2>
        <p style={styles.message}>
          Your salon registration is under review by the admin.
        </p>
        <p style={styles.note}>Please check back later.</p>
        <Link to="/login" style={styles.link}>
          ← Back to Login
        </Link>
      </div>
    </div>
  )
}

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#f2f4f8'
  },
  card: {
    padding: '2rem 3rem',
    borderRadius: '8px',
    background: '#fff',
    boxShadow: '0 0 15px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  title: {
    marginBottom: '1rem',
    color: '#333'
  },
  message: {
    fontSize: '16px',
    color: '#555'
  },
  note: {
    marginTop: '0.5rem',
    color: '#777',
    fontStyle: 'italic'
  },
  link: {
    display: 'inline-block',
    marginTop: '1.5rem',
    color: '#007bff',
    textDecoration: 'none'
  }
}

export default PendingApproval
