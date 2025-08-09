import { useState, useEffect, useContext } from 'react';
import { API_URL } from '../../config';
import { UserContext } from '../../context/UserContext'; // Import UserContext

export default function useFavorites() {
  const { user } = useContext(UserContext); // Access user from UserContext
  const [userLocation, setUserLocation] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user?.id) return; // Ensure user is available
      try {
        const res = await fetch(
          `${API_URL}/favorites/${user.id}?type=${user.type}`
        );
        const data = await res.json();
        const ids = Array.isArray(data)
          ? data.map((salon) => Number(salon.id))
          : [];
        setFavorites(new Set(ids));
      } catch (err) {
        console.error('Fetching favorites failed:', err);
      }
    };

    fetchFavorites();
  }, [user]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (err) => console.error('Geolocation error:', err)
      );
    }
  }, []);

  const fetchFavorites = async () => {
    if (!user?.id || !userLocation) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/favorites/${user.id}?type=${user.type}`
      );
      const data = await res.json();
      const array = Array.isArray(data) ? data : [];
      const enriched = array.map((salon) => ({
        ...salon,
        distance:
          salon.latitude && salon.longitude
            ? calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                salon.latitude,
                salon.longitude
              )
            : null,
      }));
      setFavorites(enriched);
    } catch (err) {
      console.error('Fetch favorites error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [user, userLocation]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const R = 6371; // Radius of the Earth in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Returns the distance in km
  };

  const toggleFavorite = async (salonId) => {
    try {
      await fetch(
        `${API_URL}/favorites/users/${user.id}/favorites/${salonId}`,
        {
          method: 'POST',
        }
      );
      // re-fetch updated favorites
      setFavorites((prev) =>
        prev.map((s) =>
          s.id === salonId ? { ...s, isFavorite: !s.isFavorite } : s
        )
      );
    } catch (err) {
      console.error('Toggle favorite error:', err);
    }
  };

  return {
    favorites,
    loading,
    error,
    toggleFavorite,
    userLocation,
    retry: fetchFavorites,
  };
}
