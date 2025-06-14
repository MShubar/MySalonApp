import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function EditPackage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [salonId, setSalonId] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [quantity, setQuantity] = useState('')
  const [newImage, setNewImage] = useState(null)

  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPackage = async () => {
      const res = await fetch(`http://localhost:5000/package/${id}`)
      const data = await res.json()
      if (res.ok) {
        setTitle(data.title)
        setDescription(data.description)
        setPrice(data.price)
        setQuantity(data.quantity)
        setSalonId(data.salon_id)
        setImageUrl(data.image_url || '')
      } else {
        alert('Failed to fetch package')
      }
    }

    fetchPackage()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('price', price)
    formData.append('quantity', quantity)
    formData.append('salon_id', salonId)
    if (newImage) {
      formData.append('image', newImage)
    }

    const res = await fetch(`http://localhost:5000/package/${id}`, {
      method: 'PUT',
      body: formData
    })

    if (res.ok) {
      navigate('/getPackages', {
        state: { success: 'Package updated successfully!' }
      })
    } else {
      alert('Failed to update package')
    }
  }

  return (
    <div className="container mt-4">
      <h2>Edit Package</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
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
          Update Package
        </button>
      </form>
    </div>
  )
}

export default EditPackage
