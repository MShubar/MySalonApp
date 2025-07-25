import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../config'
import Button from '../../../src/shared/ui/Button'

function Create() {
  const [typeName, setTypeName] = useState('')
  const [image, setImage] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleImageChange = (e) => {
    setImage(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!typeName.trim()) {
      setError('Type name is required.')
      return
    }

    const formData = new FormData()
    formData.append('type_name', typeName)
    if (image) formData.append('image', image)

    try {
      const res = await fetch(`${API_URL}/types`, {
        method: 'POST',
        body: formData
      })

      if (res.ok) {
        navigate('/getTypes', {
          state: { success: 'Type created successfully!' }
        })
      } else {
        const errData = await res.json()
        setError(errData.message || 'Failed to create type.')
      }
    } catch (err) {
      console.error('Error creating type:', err)
      setError('Server error. Please try again later.')
    }
  }

  return (
    <div className="container mt-4">
      <h2>Create New Service Type</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Type Name</label>
          <input
            type="text"
            className="form-control"
            value={typeName}
            onChange={(e) => setTypeName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Image</label>
          <input
            type="file"
            className="form-control"
            onChange={handleImageChange}
            accept="image/*"
          />
        </div>
        {error && <div className="alert alert-danger mt-2">{error}</div>}
        <Button type="submit" className="btn btn-primary mt-3">
          Create Type
        </Button>
      </form>
    </div>
  )
}

export default Create
