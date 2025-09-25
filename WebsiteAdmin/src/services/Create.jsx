import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

function Create() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !price || !duration) {
      setError('All fields are required.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('duration', duration);

    try {
      const res = await fetch(`${API_URL}/service`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        navigate('/getService', {
          state: { success: 'Service added successfully!' },
        });
        setName('');
        setPrice('');
        setDuration('');
        setError('');
      } else {
        const errData = await res.json();
        setError(errData.message || 'Failed to create service.');
      }
    } catch (err) {
      console.error('Error creating service:', err);
      setError('Server error. Please try again later.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create New Service</h2>
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
        {error && <div className="alert alert-danger mt-2">{error}</div>}
        <button type="submit" className="btn btn-primary mt-3">
          Create Service
        </button>
      </form>
    </div>
  );
}

export default Create;