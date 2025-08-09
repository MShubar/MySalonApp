import { useState, useEffect, useContext } from 'react';
import { API_URL } from '../../config';
import useFetch from '../../hooks/useFetch';
import { UserContext } from '../../context/UserContext'; // Import UserContext

export default function useNearestSalons(userType) {
  const { user } = useContext(UserContext); // Access user from UserContext
  const [userLocation, setUserLocation] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [minRating, setMinRating] = useState(0);
  const [maxDistance, setMaxDistance] = useState(100);
  const [sortBy, setSortBy] = useState('distance');

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        () => {
          // Handle geolocation error silently without logging to console
          setUserLocation(null); // Optionally set to a default location or null
        }
      );
    }
  }, []);

  // Fetch all salons nearby
  const {
    data: salonsData = [],
    loading,
    error,
    refetch,
  } = useFetch(
    userLocation
      ? `${API_URL}/salons?userLat=${userLocation.latitude}&userLng=${userLocation.longitude}&type=${userType}`
      : null,
    [userLocation, userType] // Fetch data when either userLocation or userType changes
  );

  // Enrich salon data with calculated distance
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const R = 6371; // Radius of Earth in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  };

  const salons = Array.isArray(salonsData)
    ? salonsData.map((salon) => {
        const distance =
          salon.latitude && salon.longitude && userLocation
            ? calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                salon.latitude,
                salon.longitude
              )
            : null;
        return { ...salon, distance };
      })
    : [];

  // Fetch favorite salon IDs from API
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user?.id || !userType) return;

      try {
        const res = await fetch(
          `${API_URL}/favorites/${user.id}?type=${userType}`
        );
        const data = await res.json();
        const ids = Array.isArray(data)
          ? data.map((salon) => Number(salon.id)) // assuming `id` is the salon ID
          : [];
        setFavorites(new Set(ids));
      } catch (err) {
        // Handle error silently without logging to console
        setFavorites(new Set()); // Fallback to an empty set in case of error
      }
    };

    fetchFavorites();
  }, [user?.id, userType]);

  // Toggle favorite salon
  const toggleFavorite = async (salonId) => {
    try {
      await fetch(
        `${API_URL}/favorites/users/${user.id}/favorites/${salonId}`,
        {
          method: 'POST',
        }
      );

      setFavorites((prev) => {
        const updated = new Set(prev);
        const numId = Number(salonId);
        if (updated.has(numId)) {
          updated.delete(numId);
        } else {
          updated.add(numId);
        }
        return updated;
      });

      refetch(); // optional: refresh salon list after toggle
    } catch (err) {
      // Error is silently handled without logging
    }
  };

  // Filter based on distance and rating
  const filtered = salons.filter((s) => {
    const meetsRating = s.rating >= minRating;
    const meetsDistance =
      s.distance !== null ? s.distance <= maxDistance : false;
    return meetsRating && meetsDistance;
  });

  // Sort filtered list based on selected criteria (distance or rating)
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'distance') {
      if (a.distance === null) return 1;
      if (b.distance === null) return -1;
      return a.distance - b.distance;
    } else if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    return 0;
  });

  return {
    loading,
    error,
    salons: sorted,
    favorites, // this is a Set of salon IDs
    minRating,
    setMinRating,
    maxDistance,
    setMaxDistance,
    sortBy,
    setSortBy,
    toggleFavorite,
    retry: refetch,
  };
}
