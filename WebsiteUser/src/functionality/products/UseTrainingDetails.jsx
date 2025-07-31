// src/functionality/products/useTrainingDetails.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';

const useTrainingDetails = (trainingId) => {
  const [training, setTraining] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTraining = async () => {
      try {
        const res = await axios.get(`${API_URL}/trainings/${trainingId}`);
        setTraining(res.data);
      } catch (err) {
        setError('Failed to load training details');
      } finally {
        setLoading(false);
      }
    };

    if (trainingId) {
      fetchTraining();
    }
  }, [trainingId]);

  return { training, loading, error };
};

export default useTrainingDetails;
