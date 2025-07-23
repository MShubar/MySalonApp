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
  const [avatar, setAvatar] = useState(null)
  const [avatarUrl, setAvatarUrl] = useState('')
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
        setAvatarUrl(res.data.avatar_url || '')
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

  const handleAvatarChange = (file) => {
    setAvatar(file)
  }

  const handleSubmit = async () => {
    setError('')
    setSuccess('')

    if (!formData.username || !formData.email) {
      setError(t('Username and email are required'))
      return
    }

    try {
      const data = new FormData()
      data.append('username', formData.username)
      data.append('email', formData.email)
      if (avatar) data.append('avatar', avatar)
      const res = await axios.put(`${API_URL}/users/${userId}`, data)
      setSuccess(t('Profile updated successfully!'))
      if (res.data && res.data.user && res.data.user.avatar_url) {
        setAvatarUrl(res.data.user.avatar_url)
      }
    } catch (err) {
      setError(err.response?.data?.message || t('Failed to update profile'))
    }
  }

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
    handleSubmit
  }
}

export default useEditProfile
