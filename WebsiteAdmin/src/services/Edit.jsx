import { useEffect, useState } from "react";
import { API_URL } from "../config";
import { useNavigate, useParams } from "react-router-dom";

function Edit() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await fetch(`${API_URL}/service/${id}`);
        const data = await res.json();

        if (res.ok) {
          setName(data.name);
          setPrice(data.price);
          setDuration(data.duration);
        } else {
          alert('Failed to fetch service data');
        }
      } catch (err) {
        console.error('Error fetching service:', err);
      }
    };

    fetchService();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('duration', duration);

    try {
      const res = await fetch(`${API_URL}/service/${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (res.ok) {
        navigate('/getService', {
          state: { success: 'Service updated successfully!' },
        });
      } else {
        alert('Failed to update service');
      }
    } catch (err) {
      console.error('Error updating service:', err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Edit Service</h2>
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
          <label>Duration (minutes)</label>
          <input
            type="number"
            className="form-control"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Update Service
        </button>
      </form>
    </div>
  );
}

export default Edit
