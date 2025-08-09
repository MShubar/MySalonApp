import { useState, useContext } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { API_URL } from '../../config';
import { UserContext } from '../../context/UserContext';

const useChangePassword = () => {
  const { t } = useTranslation();
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target || e;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    const { currentPassword, newPassword, confirmNewPassword } = formData;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError(t('All fields are required'));
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError(t('New passwords do not match'));
      return;
    }

    setLoading(true);
    try {
      await axios.put(`${API_URL}/users/${user.id}/change-password`, {
        currentPassword,
        newPassword,
      });
      setSuccess(t('Password changed successfully!'));
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || t('Failed to change password'));
    } finally {
      setLoading(false);
    }
  };

  return {
    t,
    formData,
    loading,
    error,
    success,
    handleChange,
    handleSubmit,
  };
};

export default useChangePassword;
