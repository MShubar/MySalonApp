import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function Get() {
  const [packages, setPackages] = useState([])
  const [packageToDelete, setPackageToDelete] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetch('http://localhost:5000/package')
      .then((res) => res.json())
      .then((data) => setPackages(data))
      .catch((err) => console.error('Error:', err))
  }, [])

  const handleEdit = (id) => {
    navigate(`/editPackages/${id}`)
  }

  const confirmDelete = async () => {
    if (!packageToDelete) return

    try {
      const res = await fetch(
        `http://localhost:5000/package/${packageToDelete.id}`,
        {
          method: 'DELETE'
        }
      )

      if (res.ok) {
        setPackages(packages.filter((pkg) => pkg.id !== packageToDelete.id))
        setSuccessMessage('Package deleted successfully!')
        setTimeout(() => setSuccessMessage(''), 3000)
      } else {
        alert('Failed to delete package')
      }
    } catch (err) {
      console.error('Error deleting package:', err)
    } finally {
      setPackageToDelete(null)
    }
  }

  return (
    <>
      {/* Modal */}
      {packageToDelete && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2>Confirm Deletion</h2>
            <p>
              Are you sure you want to delete the package{' '}
              <strong>{packageToDelete.title}</strong>?
            </p>
            <div className="modal-buttons">
              <button className="btn-action delete" onClick={confirmDelete}>
                Confirm Delete
              </button>
              <button
                className="btn-action"
                onClick={() => setPackageToDelete(null)}
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
          packageToDelete ? 'blur-background' : ''
        }`}
      >
        {successMessage && (
          <div className="success-banner">{successMessage}</div>
        )}

        <div className="customer-table-header">
          <h2>All Packages</h2>
          <Link to="/createPackages" className="add-button">
            +
          </Link>
        </div>

        <table className="customer-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Price</th>
              <th>Salon</th>
              <th>Image</th> {/* NEW */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg) => (
              <tr key={pkg.id}>
                <td>{pkg.title}</td>
                <td>{pkg.description}</td>
                <td>{pkg.price}</td>
                <td>{pkg.salon_name}</td>
                <td>
                  {pkg.image_url && (
                    <img
                      src={pkg.image_url}
                      alt={pkg.title}
                      style={{
                        width: '100px',
                        height: 'auto',
                        borderRadius: '8px'
                      }}
                    />
                  )}
                </td>
                <td>
                  <button
                    className="btn-action"
                    onClick={() => handleEdit(pkg.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-action delete"
                    onClick={() => setPackageToDelete(pkg)}
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
