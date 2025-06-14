import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Create() {
  const [password, setPassword] = useState('') // for both admin and salon password
  const [username, setUsername] = useState('') // for admin username
  const navigate = useNavigate()

  const handleAdminSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('http://localhost:5000/admins/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })

      if (res.ok) {
        setUsername('')
        setPassword('')
        navigate('/getAdmins', {
          state: { success: 'Admin updated successfully!' }
        })
      } else {
        alert('Failed to create admin')
      }
    } catch (err) {
      console.error('Error creating admin:', err)
    }
  }

  return (
    <div className="container mt-4">
      <h2>Create New Admin</h2>
      <form onSubmit={handleAdminSubmit}>
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
        <button type="submit" className="btn btn-success mt-3">
          Create Admin
        </button>
      </form>
    </div>
  )
}

export default Create
