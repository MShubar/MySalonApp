import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { API_URL } from '../config'

function Edit() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const { id } = useParams() // Get the user ID from URL params
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/users/${id}`)
        const data = await res.json()

        if (res.ok) {
          setUsername(data.username)
          setEmail(data.email)
          setPassword(data.password)
        } else {
          alert('Failed to fetch user data')
        }
      } catch (err) {
        console.error('Error fetching user:', err)
      }
    }

    fetchUser()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, email })
      })

      if (res.ok) {
        navigate('/getUsers', {
          state: { success: 'User updated successfully!' }
        })
      } else {
        alert('Failed to update user')
      }
    } catch (err) {
      console.error('Error updating user:', err)
    }
  }

  return (
    <div className="container mt-4">
      <h2>Edit User</h2>
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
        <button type="submit" className="btn btn-primary mt-3">
          Update User
        </button>
      </form>
    </div>
  )
}

export default Edit
