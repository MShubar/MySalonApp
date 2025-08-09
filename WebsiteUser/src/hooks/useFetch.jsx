import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useFetch = (url, deps = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!url) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(url);
      setData(response.data || []);
    } catch (err) {
      // Silently handle network errors without logging to console
      if (axios.isAxiosError(err)) {
        if (!err.response) {
          // If there's no response, this means it's a network issue (connection refused, server down, etc.)
          setError('Unable to connect to the server. Please try again later.');
        } else {
          // Handle any other error response from the API
          setError(err.message || 'An unexpected error occurred');
        }
      } else {
        // Catch any other error (e.g., unexpected errors)
        setError('An error occurred while fetching data.');
      }
      setData([]); // Clear any previous data on error
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData, ...deps]);

  return { data, loading, error, retry: fetchData, refetch: fetchData };
};

export default useFetch;
