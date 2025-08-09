import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { API_URL } from '../../config';
import { UserContext } from '../../context/UserContext'; // Import UserContext

const useEditProfile = () => {
  const { t } = useTranslation();
  const { user } = useContext(UserContext); // Access userId from UserContext
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    photo: '',
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      if (!user) return; // Ensure user is loaded from context
      setLoading(true);
      setError('');
      setSuccess('');
      try {
        const res = await axios.get(`${API_URL}/users/${user.id}`); // Use user.id from UserContext
        setFormData({
          username: res.data.username || '',
          email: res.data.email || '',
          photo: res.data.photo || '',
        });
        setAvatarUrl(res.data.avatar_url || '');
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(t('Failed to load user data'));
      } finally {
        setLoading(false);
      }
    };
    if (user && user.id) {
      fetchUser();
    }
  }, [user, t]);

  const handleChange = ({ name, value }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (file) => {
    setAvatar(file);
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    if (!formData.username || !formData.email) {
      setError(t('Username and email are required'));
      return;
    }

    try {
      const data = new FormData();
      data.append('username', formData.username);
      data.append('email', formData.email);
      if (avatar) data.append('avatar', avatar);
      const res = await axios.put(`${API_URL}/users/${user.id}`, data); // Use user.id from UserContext
      setSuccess(t('Profile updated successfully!'));
      if (res.data && res.data.user && res.data.user.avatar_url) {
        setAvatarUrl(res.data.user.avatar_url);
      }
    } catch (err) {
      setError(err.response?.data?.message || t('Failed to update profile'));
    }
  };

  return {
    t,
    formData,
    avatar,
    avatarUrl,
    loading,
    error,
    success,
    handleChange,
    handleAvatarChange,
    handleSubmit,
  };
};

export default useEditProfile;
