import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Create() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [salonId, setSalonId] = useState('')
  const [quantity, setQuantity] = useState('')
  const [image, setImage] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleImageChange = (e) => {
    setImage(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      !name.trim() ||
      !description.trim() ||
      !price ||
      !salonId ||
      !quantity
    ) {
      setError('All fields are required.')
      return
    }

    const formData = new FormData()
    formData.append('name', name)
    formData.append('description', description)
    formData.append('price', price)
    formData.append('salon_id', salonId)
    formData.append('quantity', quantity)
    if (image) formData.append('image', image)

    try {
      const res = await fetch('http://localhost:5000/product', {
        method: 'POST',
        body: formData
      })

      if (res.ok) {
        navigate('/getProduct', {
          state: { success: 'Product added successfully!' }
        })
        setName('')
        setDescription('')
        setPrice('')
        setSalonId('')
        setQuantity('')
        setImage(null)
        setError('')
      } else {
        const errData = await res.json()
        setError(errData.message || 'Failed to create product.')
      }
    } catch (err) {
      console.error('Error creating product:', err)
      setError('Server error. Please try again later.')
    }
  }

  return (
    <div className="container mt-4">
      <h2>Create New Product</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
          <label>Quantity</label>
          <input
            type="number"
            className="form-control"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
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
          Create Product
        </button>
      </form>
    </div>
  )
}

export default Create
