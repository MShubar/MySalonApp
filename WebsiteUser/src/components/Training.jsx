import React from 'react'
import Navbar from './Navbar'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

function Training() {
  const [showFilters, setShowFilters] = useState(false)
  const { t } = useTranslation()
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="fw-bold mb-0">{t('training')}</h6>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => setShowFilters(!showFilters)}
          aria-expanded={showFilters}
        >
          <i className="bi bi-funnel-fill"></i>
        </button>
      </div>
    </div>
  )
}

export default Training
