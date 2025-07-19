import { useEffect, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { API_URL } from '../config'

function Get() {
  const [salons, setSalons] = useState([])
  const [successMessage, setSuccessMessage] = useState('')
  const [salonToDelete, setSalonToDelete] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  // Fetch salons and types and merge them
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salonRes, typeRes] = await Promise.all([
          fetch(`${API_URL}/salons`),
          fetch(`${API_URL}/types/type`) // this returns salons + types grouped
        ])
        const salonsData = await salonRes.json()
        const typesData = await typeRes.json()

        // Merge types into salons
        const salonsWithTypes = salonsData.map((salon) => {
          const match = typesData.find((t) => t.salonId === salon.id)
          return {
            ...salon,
            types: match ? match.types.map((type) => type.typeName) : []
          }
        })

        setSalons(salonsWithTypes)
      } catch (err) {
        console.error('Error fetching salons or types:', err)
      }
    }

    fetchData()
  }, [])

  // Show success message when navigating
  useEffect(() => {
    if (location.state?.success) {
      setSuccessMessage(location.state.success)
      setTimeout(() => setSuccessMessage(''), 3000)
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  // Approve or unapprove salon
  const handleApprove = async (id, isCurrentlyApproved) => {
    const endpoint = isCurrentlyApproved
      ? `${API_URL}/approval/unapprove`
      : `${API_URL}/approval/approve`

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ salonId: id, adminId: 1 }) // Replace with dynamic admin ID if available
      })

      if (res.ok) {
        const updatedSalons = salons.map((salon) =>
          salon.id === id
            ? { ...salon, is_approved: !isCurrentlyApproved }
            : salon
        )
        setSalons(updatedSalons)
        setSuccessMessage('Salon approval updated successfully!')
      } else {
        setSuccessMessage('Salon approval failed!')
      }
    } catch (err) {
      console.error('Error approving/unapproving salon:', err)
    }
  }

  // Confirm deletion of a salon
  const confirmDelete = async () => {
    if (!salonToDelete) return
    try {
      const res = await fetch(
        `${API_URL}/salons/${salonToDelete.id}`,
        { method: 'DELETE' }
      )
      if (res.ok) {
        setSalons(salons.filter((s) => s.id !== salonToDelete.id))
        setSuccessMessage('Salon deleted successfully!')
      } else {
        alert('Failed to delete salon')
      }
    } catch (err) {
      console.error('Error deleting salon:', err)
      alert('Error occurred while deleting salon')
    } finally {
      setSalonToDelete(null)
    }
  }
  const handleHistory = (salonId) => {
    navigate(`/approvalHistory/${salonId}`)
  }
  // Edit salon
  const handleEdit = (id) => navigate(`/editSalons/${id}`)

  return (
    <>
      {/* Modal Overlay */}
      {salonToDelete && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2>Confirm Deletion</h2>
            <p>
              Are you sure you want to delete{' '}
              <strong>{salonToDelete.name}</strong>?
            </p>
            <div className="modal-buttons">
              <button className="btn-action delete" onClick={confirmDelete}>
                Confirm Delete
              </button>
              <button
                className="btn-action"
                onClick={() => setSalonToDelete(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div
        className={`customer-table-container ${
          salonToDelete ? 'blur-background' : ''
        }`}
      >
        {successMessage && (
          <div className="success-banner">{successMessage}</div>
        )}

        <div className="customer-table-header">
          <h2>All Registered Salons</h2>
          <Link to="/createSalons" className="add-button">
            +
          </Link>
        </div>

        <table className="customer-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Email</th>
              <th>Rating</th>
              <th>Location</th>
              <th>Type</th> {/* Added the Type column */}
              <th>Approved</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {salons.map((salon) => (
              <tr key={salon.id}>
                <td>
                  {salon.image_url ? (
                    <img
                      src={salon.image_url}
                      alt={salon.name}
                      style={{
                        width: '30px',
                        height: '30px',
                        objectFit: 'cover',
                        borderRadius: '5px'
                      }}
                    />
                  ) : (
                    'No image'
                  )}
                </td>
                <td>{salon.name}</td>
                <td>{salon.email}</td>
                <td>{salon.rating}</td>
                <td>
                  {salon.latitude && salon.longitude
                    ? `${salon.latitude.toFixed(4)}, ${salon.longitude.toFixed(
                        4
                      )}`
                    : 'N/A'}
                </td>
                <td>{salon.types?.join(', ') || 'None'}</td>{' '}
                {/* Displaying types */}
                <td>{salon.is_approved ? 'Yes' : 'No'}</td>
                <td className="action-buttons">
                  <button
                    className={
                      salon.is_approved ? 'btn-action delete' : 'btn-action'
                    }
                    onClick={() => handleApprove(salon.id, salon.is_approved)}
                  >
                    {salon.is_approved ? 'Unapprove' : 'Approve'}
                  </button>
                  <button
                    className="btn-action warning"
                    onClick={() => handleEdit(salon.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-action delete"
                    onClick={() => setSalonToDelete(salon)}
                  >
                    Delete
                  </button>
                  <button
                    className="btn-action"
                    onClick={() => handleHistory(salon.id)}
                  >
                    History
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

export default Get
