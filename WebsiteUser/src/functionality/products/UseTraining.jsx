import { useState, useContext } from 'react';
import useFetch from '../../hooks/useFetch';
import { API_URL } from '../../config';
import { UserContext } from '../../context/UserContext'; // Import UserContext

const useTraining = (salon) => {
  const { user } = useContext(UserContext); // Access user from UserContext
  const [filters, setFilters] = useState({
    price: '',
    duration: '',
    salon: '',
  });
  const [viewEnrolled, setViewEnrolled] = useState(false);

  // Fetch training programs with the filters applied
  const {
    data: trainingPrograms = [],
    loading: loadingTrainingPrograms,
    error: errorTrainingPrograms,
    refetch: refetchTrainingPrograms,
  } = useFetch(
    `${API_URL}/trainings?${new URLSearchParams(filters).toString()}`,
    [filters]
  );

  // Fetch enrolled programs based on the user or salon
  const {
    data: enrolledPrograms = [],
    loading: loadingEnrolledPrograms,
    error: errorEnrolledPrograms,
    refetch: refetchEnrolledPrograms,
  } = useFetch(
    user?.id
      ? `${API_URL}/trainings/user/${user.id}` // Fetch for specific user
      : salon?.id
      ? `${API_URL}/trainings/salon/${salon.id}` // Fetch for specific salon
      : null,
    [user, salon] // Only refetch when user or salon changes
  );

  const loading = loadingTrainingPrograms || loadingEnrolledPrograms;
  const error = errorTrainingPrograms || errorEnrolledPrograms;

  return {
    trainingPrograms,
    enrolledPrograms,
    filters,
    setFilters,
    viewEnrolled,
    setViewEnrolled,
    loading,
    error,
    retry: refetchTrainingPrograms, // Retry function for refetching data
  };
};

export default useTraining;
