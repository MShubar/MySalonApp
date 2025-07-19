import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { API_URL } from '../config'

function Get() {
  const [types, setTypes] = useState([])
  const [typeToDelete, setTypeToDelete] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`${API_URL}/types`) // Make sure your backend is running at this URL
      .then((res) => res.json())
      .then((data) => {
        setTypes(data)
      })
      .catch((err) => console.error('Error:', err))
  }, [])

  const handleEdit = (id) => {
    navigate(`/editTypes/${id}`)
  }

  const confirmDelete = async () => {
    if (!typeToDelete) return

    try {
      const res = await fetch(
        `${API_URL}/types/${typeToDelete.id}`,
        {
          method: 'DELETE'
        }
      )

      if (res.ok) {
        setTypes(types.filter((type) => type.id !== typeToDelete.id))
        setSuccessMessage('Type deleted successfully!')
        setTimeout(() => setSuccessMessage(''), 3000)
      } else {
        alert('Failed to delete type')
      }
    } catch (err) {
      console.error('Error deleting type:', err)
    } finally {
      setTypeToDelete(null)
    }
  }

  return (
    <>
      {/* Modal */}
      {typeToDelete && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2>Confirm Deletion</h2>
            <p>
              Are you sure you want to delete the service type{' '}
              <strong>{typeToDelete.type_name}</strong>?
            </p>
            <div className="modal-buttons">
              <button className="btn-action delete" onClick={confirmDelete}>
                Confirm Delete
              </button>
              <button
                className="btn-action"
                onClick={() => setTypeToDelete(null)}
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
          typeToDelete ? 'blur-background' : ''
        }`}
      >
        {successMessage && (
          <div className="success-banner">{successMessage}</div>
        )}

        <div className="customer-table-header">
          <h2>All Service Types</h2>
          <Link to="/createTypes" className="add-button">
            +
          </Link>
        </div>

        <table className="customer-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Type Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {types.map((type) => (
              <tr key={type.id}>
                <td>
                  {type.image_url ? (
                    <img
                      src={type.image_url}
                      alt={type.type_name}
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
                <td>{type.type_name}</td>
                <td>
                  <button
                    className="btn-action"
                    onClick={() => handleEdit(type.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-action delete"
                    onClick={() => setTypeToDelete(type)}
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

export default Get
