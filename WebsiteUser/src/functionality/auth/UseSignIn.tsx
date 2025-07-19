import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const useSignIn = ({ setUser }) => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSignIn = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      const data = await res.json()

      if (res.ok) {
        localStorage.setItem('token', data.token)
        const userFromToken = { id: data.id, username: data.username }
        localStorage.setItem('user', JSON.stringify(userFromToken))
        setUser(userFromToken)
        navigate('/')
      } else {
        setError(data.message || t('Invalid credentials'))
      }
    } catch (err) {
      console.error('useSignIn.js: Error during login:', err)
      setError(t('Something went wrong'))
    }
  }

  return {
    t,
    username,
    setUsername,
    password,
    setPassword,
    error,
    handleSignIn
  }
}

export default useSignIn
