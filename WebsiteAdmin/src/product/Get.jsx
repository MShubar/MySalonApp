import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function Get() {
  const [products, setProducts] = useState([])
  const [productToDelete, setProductToDelete] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetch('http://localhost:5000/product')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data)
      })
      .catch((err) => console.error('Error:', err))
  }, [])

  const handleEdit = (id) => {
    navigate(`/editProduct/${id}`)
  }

  // Handle delete confirmation modal
  const confirmDelete = async () => {
    if (!productToDelete) return

    try {
      const res = await fetch(
        `http://localhost:5000/product/${productToDelete.id}`,
        {
          method: 'DELETE'
        }
      )

      if (res.ok) {
        setProducts(
          products.filter((product) => product.id !== productToDelete.id)
        )
        setSuccessMessage('Product deleted successfully!')
        setTimeout(() => setSuccessMessage(''), 3000)
      } else {
        alert('Failed to delete product')
      }
    } catch (err) {
      console.error('Error deleting product:', err)
    } finally {
      setProductToDelete(null)
    }
  }

  return (
    <>
      {/* Modal */}
      {productToDelete && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2>Confirm Deletion</h2>
            <p>
              Are you sure you want to delete the product{' '}
              <strong>{productToDelete.name}</strong>?
            </p>
            <div className="modal-buttons">
              <button className="btn-action delete" onClick={confirmDelete}>
                Confirm Delete
              </button>
              <button
                className="btn-action"
                onClick={() => setProductToDelete(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div
        className={`customer-table-container ${
          productToDelete ? 'blur-background' : ''
        }`}
      >
        {successMessage && (
          <div className="success-banner">{successMessage}</div>
        )}

        <div className="customer-table-header">
          <h2>All Products</h2>
          <Link to="/createProduct" className="add-button">
            +
          </Link>
        </div>

        <table className="customer-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Salon</th>
              <th>Image</th> {/* NEW */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.price}</td>
                <td>{product.salon_name}</td>
                <td>
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      style={{
                        width: '100px',
                        height: 'auto',
                        borderRadius: '8px'
                      }}
                    />
                  )}
                </td>
                <td>
                  <button
                    className="btn-action"
                    onClick={() => handleEdit(product.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-action delete"
                    onClick={() => setProductToDelete(product)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Get
