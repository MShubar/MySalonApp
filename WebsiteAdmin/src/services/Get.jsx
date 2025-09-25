import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../config';

// Get Services Component
function Get() {
  const [services, setServices] = useState([]);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/services`)
      .then((res) => res.json())
      .then((data) => {
        setServices(data);
      })
      .catch((err) => console.error('Error:', err));
  }, []);

  const handleEdit = (id) => {
    navigate(`/editService/${id}`);
  };

  const confirmDelete = async () => {
    if (!serviceToDelete) return;

    try {
      const res = await fetch(`${API_URL}/services/${serviceToDelete.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setServices(services.filter((service) => service.id !== serviceToDelete.id));
        setSuccessMessage('Service deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        alert('Failed to delete service');
      }
    } catch (err) {
      console.error('Error deleting service:', err);
    } finally {
      setServiceToDelete(null);
    }
  };

  return (
    <>
      {serviceToDelete && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2>Confirm Deletion</h2>
            <p>
              Are you sure you want to delete the service{' '}
              <strong>{serviceToDelete.name}</strong>?
            </p>
            <div className="modal-buttons">
              <button className="btn-action delete" onClick={confirmDelete}>
                Confirm Delete
              </button>
              <button className="btn-action" onClick={() => setServiceToDelete(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`customer-table-container ${serviceToDelete ? 'blur-background' : ''}`}>
        {successMessage && <div className="success-banner">{successMessage}</div>}

        <div className="customer-table-header">
          <h2>All Services</h2>
          <Link to="/createService" className="add-button">
            +
          </Link>
        </div>

        <table className="customer-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Duration</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id}>
                <td>{service.name}</td>
                <td>{service.price}</td>
                <td>{service.duration}</td>
                <td>
                  <button className="btn-action" onClick={() => handleEdit(service.id)}>
                    Edit
                  </button>
                  <button
                    className="btn-action delete"
                    onClick={() => setServiceToDelete(service)}
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
  );
}

export default Get
