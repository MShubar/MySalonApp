import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function Edit() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [salonId, setSalonId] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [newImage, setNewImage] = useState(null)
  const [quantity, setQuantity] = useState('')

  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/product/${id}`)
        const data = await res.json()

        if (res.ok) {
          setName(data.name)
          setDescription(data.description)
          setPrice(data.price)
          setQuantity(data.quantity)
          setSalonId(data.salon_id)
          setImageUrl(data.image_url || '')
        } else {
          alert('Failed to fetch product data')
        }
      } catch (err) {
        console.error('Error fetching product:', err)
      }
    }

    fetchProduct()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('name', name)
    formData.append('description', description)
    formData.append('price', price)
    formData.append('quantity', quantity)
    formData.append('salon_id', salonId)
    if (newImage) {
      formData.append('image', newImage)
    }

    try {
      const res = await fetch(`http://localhost:5000/product/${id}`, {
        method: 'PUT',
        body: formData
      })

      if (res.ok) {
        navigate('/getProduct', {
          state: { success: 'Product updated successfully!' }
        })
      } else {
        alert('Failed to update product')
      }
    } catch (err) {
      console.error('Error updating product:', err)
    }
  }

  return (
    <div className="container mt-4">
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit}>
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
          <label>Salon ID</label>
          <input
            type="number"
            className="form-control"
            value={salonId}
            onChange={(e) => setSalonId(e.target.value)}
            required
          />
        </div>

        {imageUrl && (
          <div className="form-group mt-3">
            <label>Current Image</label>
            <img
              src={imageUrl}
              alt="Current"
              style={{ width: '150px', borderRadius: '8px' }}
            />
          </div>
        )}

        <div className="form-group mt-3">
          <label>New Image (optional)</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setNewImage(e.target.files[0])}
            accept="image/*"
          />
        </div>

        <button type="submit" className="btn btn-primary mt-3">
          Update Product
        </button>
      </form>
    </div>
  )
}

export default Edit
