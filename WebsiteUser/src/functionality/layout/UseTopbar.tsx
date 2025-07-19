import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const useTopBar = () => {
  const navigate = useNavigate()
  const { i18n } = useTranslation()

  const goBack = () => navigate(-1)

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en')
  }

  return {
    goBack,
    currentLang: i18n.language,
    toggleLanguage
  }
}

export default useTopBar
