import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { API_URL } from '../../config'

const useSignUp = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleSignUp = async () => {
    if (!email || !username || !password || !confirmPassword) {
      setError(t('Please fill out all fields'))
      return
    }

    if (password !== confirmPassword) {
      setError(t('Passwords do not match'))
      return
    }

    try {
      const res = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password })
      })

      if (res.ok) {
        navigate('/signin')
      } else {
        const data = await res.json()
        setError(data.message || t('Registration failed'))
      }
    } catch (err) {
      console.error('useSignUp.js: Error during registration:', err)
      setError(t('Something went wrong'))
    }
  }

  return {
    t,
    email,
    setEmail,
    username,
    setUsername,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    setError,
    handleSignUp
  }
}

export default useSignUp
