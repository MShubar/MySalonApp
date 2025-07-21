import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../config'

function Create() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false) // To show loading state
  const [error, setError] = useState('') // To show error messages
  // Initialize navigation before using it in submit handler
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Early exit if any field is empty
    if (!username || !password || !email) {
      setError('All fields are required!')
      return
    }

    setLoading(true) // Set loading state to true
    setError('') // Clear previous errors

    try {
      const res = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, email })
      })

      if (res.ok) {
        setUsername('')
        setPassword('')
        setEmail('')
        navigate('/getUsers', {
          state: { success: 'User updated successfully!' }
        })
      } else {
        const data = await res.json()
        setError(data.message || 'Failed to register user')
      }
    } catch (err) {
      console.error('Error registering user:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false) // Set loading state back to false
    }
  }

  return (
    <div className="container mt-4">
      <h2>Register New User</h2>
      {error && <div className="alert alert-danger">{error}</div>}{' '}
      {/* Error message display */}
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
        <div className="form-group mt-2">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary mt-3"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register User'}
        </button>
      </form>
    </div>
  )
}

export default Create
