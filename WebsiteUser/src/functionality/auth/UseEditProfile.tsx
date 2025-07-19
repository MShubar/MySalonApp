import { useState, useEffect } from 'react'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { API_URL } from '../../config'

const useEditProfile = ({ userId }) => {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    username: '',
    email: ''
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true)
      setError('')
      setSuccess('')
      try {
        const res = await axios.get(`${API_URL}/users/${userId}`)
        setFormData({
          username: res.data.username || '',
          email: res.data.email || ''
        })
      } catch (err) {
        console.error('Error fetching user data:', err)
        setError(t('Failed to load user data'))
      } finally {
        setLoading(false)
      }
    }
    if (userId) {
      fetchUser()
    }
  }, [userId, t])

  const handleChange = ({ name, value }) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    setError('')
    setSuccess('')

    if (!formData.username || !formData.email) {
      setError(t('Username and email are required'))
      return
    }

    try {
      await axios.put(`${API_URL}/users/${userId}`, formData)
      setSuccess(t('Profile updated successfully!'))
    } catch (err) {
      setError(err.response?.data?.message || t('Failed to update profile'))
    }
  }

  return {
    t,
    formData,
    loading,
    error,
    success,
    handleChange,
    handleSubmit
  }
}

export default useEditProfile
