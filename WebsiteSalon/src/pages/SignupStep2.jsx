import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

function SignupStep2() {
  const [name, setName] = useState('');
  const [types, setTypes] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_URL}/types`).then((res) => setTypes(res.data));
    axios.get(`${API_URL}/services`).then((res) => {
      console.log('SERVICES RESPONSE:', res.data);
      setServices(res.data);
    });
  }, []);

  const handleNext = () => {
    localStorage.setItem(
      'signupStep2',
      JSON.stringify({ name, selectedTypes, selectedServices })
    );
    navigate('/signup/step3');
  };

  return (
    <div className="d-flex vh-100 justify-content-center align-items-center bg-light">
      <div
        className="card shadow p-4"
        style={{ maxWidth: '600px', width: '100%' }}
      >
        <h3 className="mb-4 text-center">Sign Up - Step 2/3</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleNext();
          }}
        >
          <div className="mb-3">
            <label className="form-label">Salon Name</label>
            <input
              type="text"
              className="form-control"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Salon Types</label>
            <div className="d-flex flex-wrap">
              {types.map((t) => (
                <div key={t.id} className="form-check me-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`type-${t.id}`}
                    value={t.id}
                    onChange={(e) =>
                      setSelectedTypes((prev) =>
                        e.target.checked
                          ? [...prev, t.id]
                          : prev.filter((id) => id !== t.id)
                      )
                    }
                  />
                  <label className="form-check-label" htmlFor={`type-${t.id}`}>
                    {t.type_name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label">Services Offered</label>
            <div className="d-flex flex-wrap">
              {services.map((s) => (
                <div key={s.id} className="form-check me-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`service-${s.id}`}
                    value={s.id}
                    onChange={(e) =>
                      setSelectedServices((prev) =>
                        e.target.checked
                          ? [...prev, s.id]
                          : prev.filter((id) => id !== s.id)
                      )
                    }
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`service-${s.id}`}
                  >
                    {s.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="d-flex justify-content-between">
            <button type="submit" className="btn btn-primary">
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignupStep2;
