import { useEffect, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'

function Get() {
  const [users, setUsers] = useState([])
  const [successMessage, setSuccessMessage] = useState('')
  const [userToDelete, setUserToDelete] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    fetch('http://localhost:5000/users')
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error('Error:', err))
  }, [])

  useEffect(() => {
    if (location.state?.success) {
      setSuccessMessage(location.state.success)
      setTimeout(() => setSuccessMessage(''), 3000)
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  const confirmDelete = async () => {
    if (!userToDelete) return
    try {
      const res = await fetch(
        `http://localhost:5000/users/${userToDelete.id}`,
        {
          method: 'DELETE'
        }
      )
      if (res.ok) {
        setUsers(users.filter((u) => u.id !== userToDelete.id))
        setSuccessMessage('User deleted successfully!')
      } else {
        alert('Failed to delete user')
      }
    } catch (err) {
      console.error('Error deleting user:', err)
      alert('Error occurred while deleting user')
    } finally {
      setUserToDelete(null)
    }
  }

  const handleEdit = (id) => navigate(`/editUsers/${id}`)

  return (
    <>
      {/* Modal Overlay */}
      {userToDelete && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2>Confirm Deletion</h2>
            <p>
              Are you sure you want to delete{' '}
              <strong>{userToDelete.username}</strong>?
            </p>
            <div className="modal-buttons">
              <button className="btn-action delete" onClick={confirmDelete}>
                Confirm Delete
              </button>
              <button
                className="btn-action"
                onClick={() => setUserToDelete(null)}
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
          userToDelete ? 'blur-background' : ''
        }`}
      >
        {successMessage && (
          <div className="success-banner">{successMessage}</div>
        )}

        <div className="customer-table-header">
          <h2>All Registered Users</h2>
          <Link to="/createUsers" className="add-button">
            +
          </Link>
        </div>

        <table className="customer-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td className="action-buttons">
                  <button
                    className="btn-action warning"
                    onClick={() => handleEdit(user.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-action delete"
                    onClick={() => setUserToDelete(user)}
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
