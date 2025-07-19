import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '../config'

const Gets = () => {
  const [admins, setAdmins] = useState([])
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [adminToDelete, setAdminToDelete] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await axios.get(`${API_URL}/admins`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAdmins(response.data)
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('authToken')
        window.location.href = '/'
      } else {
        setError('Error fetching admins: ' + err.message)
      }
    }
  }

  const confirmDelete = async () => {
    if (!adminToDelete) return
    try {
      const token = localStorage.getItem('authToken')
      await axios.delete(`${API_URL}/admins/${adminToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAdmins(admins.filter((a) => a.id !== adminToDelete.id))
      setSuccessMessage('Admin deleted successfully!')
    } catch (err) {
      console.error('Delete Error:', err)
      alert('Failed to delete admin')
    } finally {
      setAdminToDelete(null)
    }
  }

  useEffect(() => {
    fetchAdmins()
    if (location.state?.success) {
      setSuccessMessage(location.state.success)
      setTimeout(() => setSuccessMessage(''), 3000)
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  if (error) return <div className="error-banner">{error}</div>

  return (
    <>
      {/* Delete Confirmation Modal */}
      {adminToDelete && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2>Confirm Deletion</h2>
            <p>
              Are you sure you want to delete{' '}
              <strong>{adminToDelete.username}</strong>?
            </p>
            <div className="modal-buttons">
              <button className="btn-action delete" onClick={confirmDelete}>
                Confirm Delete
              </button>
              <button
                className="btn-action"
                onClick={() => setAdminToDelete(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Table */}
      <div
        className={`customer-table-container ${
          adminToDelete ? 'blur-background' : ''
        }`}
      >
        {successMessage && (
          <div className="success-banner">{successMessage}</div>
        )}

        <div className="customer-table-header">
          <h2>Admin List</h2>
          <Link to="/createAdmins" className="add-button">
            +
          </Link>
        </div>

        <table className="customer-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td>{admin.username}</td>
                <td className="action-buttons">
                  <button
                    className="btn-action warning"
                    onClick={() => navigate(`/editAdmins/${admin.id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-action delete"
                    onClick={() => setAdminToDelete(admin)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Gets
