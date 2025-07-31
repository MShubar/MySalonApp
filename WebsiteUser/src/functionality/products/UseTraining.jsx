import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';

const useTraining = (user, salon) => {
  const [trainingPrograms, setTrainingPrograms] = useState([]);
  const [enrolledPrograms, setEnrolledPrograms] = useState([]);
  const [filters, setFilters] = useState({
    price: '',
    duration: '',
    salon: '',
  });
  const [viewEnrolled, setViewEnrolled] = useState(false);

  // Fetch all training programs
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const query = new URLSearchParams(filters).toString();
        const res = await axios.get(`${API_URL}/trainings?${query}`);
        console.log('✅ Fetched trainings:', res.data);
        setTrainingPrograms(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('❌ Failed to fetch training programs:', err);
      }
    };
    fetchPrograms();
  }, [filters]);

  // Fetch enrollments
  useEffect(() => {
    if (user?.id) {
      axios
        .get(`/trainings/user/${user.id}`)
        .then((res) => setEnrolledPrograms(res.data))
        .catch((err) =>
          console.error('❌ Failed to fetch user enrollments:', err)
        );
    } else if (salon?.id) {
      axios
        .get(`/trainings/salon/${salon.id}`)
        .then((res) => setEnrolledPrograms(res.data))
        .catch((err) =>
          console.error('❌ Failed to fetch salon enrollments:', err)
        );
    }
  }, [user, salon]);

  return {
    trainingPrograms,
    enrolledPrograms,
    filters,
    setFilters,
    viewEnrolled,
    setViewEnrolled,
  };
};

export default useTraining;
