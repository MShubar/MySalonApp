import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function Edit() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false) // Loading state for the submit button
  const [error, setError] = useState('') // To show error messages
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await fetch(`http://localhost:5000/admins/${id}`)
        const data = await res.json()

        if (res.ok) {
          setUsername(data.username)
          setPassword(data.password)
        } else {
          alert('Failed to fetch admin data')
        }
      } catch (err) {
        console.error('Error fetching admin:', err)
      }
    }

    fetchAdmin()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Early exit if any field is empty
    if (!username || !password) {
      setError('All fields are required!')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch(`http://localhost:5000/admins/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })

      if (res.ok) {
        navigate('/getAdmins', {
          state: { success: 'Admin updated successfully!' }
        })
      } else {
        const data = await res.json()
        setError(data.message || 'Failed to update admin')
      }
    } catch (err) {
      console.error('Error updating admin:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false) // Set loading state back to false
    }
  }

  return (
    <div className="container mt-4">
      <h2>Edit Admin</h2>
      {error && <div className="alert alert-danger">{error}</div>}{' '}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group mt-2">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary mt-3"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Admin'}
        </button>
      </form>
    </div>
  )
}

export default Edit
