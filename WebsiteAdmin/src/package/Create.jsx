import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Create() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState(null)
  const [price, setPrice] = useState('')
  const [salonId, setSalonId] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate() // ← fix: this should be called

  const handleImageChange = (e) => {
    setImage(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title.trim() || !description.trim() || !price || !salonId) {
      setError('All fields are required.')
      return
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('price', price)
    formData.append('salon_id', salonId)
    if (image) formData.append('image', image)

    try {
      const res = await fetch('http://localhost:5000/package', {
        method: 'POST',
        body: formData
      })

      if (res.ok) {
        navigate('/getPackages', {
          state: { success: 'Package added successfully!' }
        })
        setTitle('')
        setDescription('')
        setPrice('')
        setSalonId('')
        setImage(null)
        setError('')
      } else {
        const errData = await res.json()
        setError(errData.message || 'Failed to create package.')
      }
    } catch (err) {
      console.error('Error creating package:', err)
      setError('Server error. Please try again later.')
    }
  }

  return (
    <div className="container mt-4">
      <h2>Create New Package</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group mt-2">
          <label>Description</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group mt-2">
          <label>Price</label>
          <input
            type="number"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="form-group mt-2">
          <label>Salon ID</label>
          <input
            type="number"
            className="form-control"
            value={salonId}
            onChange={(e) => setSalonId(e.target.value)}
            required
          />
        </div>
        <div className="form-group mt-2">
          <label>Image</label>
          <input
            type="file"
            className="form-control"
            onChange={handleImageChange}
            accept="image/*"
          />
        </div>
        {error && <div className="alert alert-danger mt-2">{error}</div>}
        <button type="submit" className="btn btn-primary mt-3">
          Create Package
        </button>
      </form>
    </div>
  )
}

export default Create
