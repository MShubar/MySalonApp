import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BiArrowBack } from 'react-icons/bi'
import { FaGlobe } from 'react-icons/fa'

const TopBar = () => {
  const navigate = useNavigate()
  const { i18n } = useTranslation()

  const handleLanguageToggle = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en')
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: 10,
        left: 10,
        right: 10,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 1
      }}
    >
      <button
        onClick={() => navigate(-1)}
        className="btn btn-link text-dark p-0"
      >
        <BiArrowBack size={24} />
      </button>
      <button
        onClick={handleLanguageToggle}
        className="btn btn-dark btn-sm rounded-pill d-flex align-items-center gap-2"
      >
        <span>{i18n.language === 'en' ? 'العربية' : 'English'}</span>
        <FaGlobe />
      </button>
    </div>
  )
}

export default TopBar
