import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { API_URL } from '../../config'

const useNavbar = ({ userType, setUser }) => {
  const { t, i18n } = useTranslation()
  const [types, setTypes] = useState([])
  const [currentIcon, setCurrentIcon] = useState(null)

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    axios
      .get(`${API_URL}/types`)
      .then((res) => {
        setTypes(res.data)
        const selected = res.data.find((t) => t.type_name === userType)
        if (selected) setCurrentIcon(selected.image_url)
      })
      .catch((err) => {
        console.error('Failed to fetch user types:', err)
      })
  }, [userType])

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en'
    i18n.changeLanguage(newLang)
    document.body.dir = newLang === 'ar' ? 'rtl' : 'ltr'
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setUser(null)
    navigate('/')
  }

  const navLinks = [
    { to: '/', label: 'Nearest Salons' },
    { to: '/bookings', label: 'Bookings & Orders' },
    { to: '/products', label: 'Products' },
    { to: '/packages', label: 'Packages' },
    { to: '/favorites', label: 'Favorites' },
    { to: '/about', label: 'About' },
    ...(userType === 'women' || userType === 'men'
      ? [{ to: '/training', label: 'training' }]
      : [])
  ]

  return {
    t,
    i18n,
    types,
    currentIcon,
    setCurrentIcon,
    toggleLanguage,
    handleLogout,
    navLinks,
    navigate,
    location
  }
}

export default useNavbar
