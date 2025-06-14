import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function Edit() {
  const [typeName, setTypeName] = useState('')
  const [image, setImage] = useState(null)
  const { id } = useParams() // Get the type ID from URL params
  const navigate = useNavigate()

  useEffect(() => {
    const fetchType = async () => {
      try {
        const res = await fetch(`http://localhost:5000/types/${id}`)
        const data = await res.json()

        if (res.ok) {
          setTypeName(data.type_name)
          // Display current image if it exists
          setImage(data.image ? data.image : null)
        }
      } catch (err) {
        console.error('Error fetching service type:', err)
      }
    }

    fetchType()
  }, [id])

  const handleImageChange = (e) => {
    setImage(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('type_name', typeName)
    if (image) formData.append('image', image)

    try {
      const res = await fetch(`http://localhost:5000/types/${id}`, {
        method: 'PUT',
        body: formData
      })

      if (res.ok) {
        navigate('/getTypes', {
          state: { success: 'Type updated successfully!' }
        })
      } else {
        alert('Failed to update service type')
      }
    } catch (err) {
      console.error('Error updating service type:', err)
    }
  }

  return (
    <div className="container mt-4">
      <h2>Edit Service Type</h2>
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
          {image && (
            <div className="mt-2">
              <img
                src={`http://localhost:5000/${image}`}
                alt="Current type"
                width="100"
                height="100"
              />
            </div>
          )}
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Update Service Type
        </button>
      </form>
    </div>
  )
}

export default Edit
