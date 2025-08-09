import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import { UserContext } from '../../context/UserContext'; // Import UserContext

const useTrainingDetails = (trainingId) => {
  const { user } = useContext(UserContext); // Access user from UserContext
  const [training, setTraining] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolled, setEnrolled] = useState(false); // Track if user has enrolled
  const [errorMessage, setErrorMessage] = useState('');

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

  const handleEnroll = async () => {
    if (!user) {
      setErrorMessage('Please login to enroll.');
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/trainings/${trainingId}/enroll-user`,
        { user_id: user.id, courseId: trainingId }
      );
      if (response.status === 200) {
        setEnrolled(true);
      }
    } catch (err) {
      setErrorMessage('Failed to enroll in the course.');
    }
  };

  return { training, loading, error, enrolled, handleEnroll, errorMessage };
};

export default useTrainingDetails;
