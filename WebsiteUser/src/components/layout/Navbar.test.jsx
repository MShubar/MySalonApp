import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Navbar from './Navbar'
import { vi } from 'vitest'

vi.mock('../../functionality/layout/UseNavbar', () => ({
  default: () => ({
    t: (s) => s,
    i18n: { language: 'en' },
    types: [],
    currentIcon: null,
    setCurrentIcon: vi.fn(),
    toggleLanguage: vi.fn(),
    handleLogout: vi.fn(),
    navLinks: [],
    location: { pathname: '/' }
  })
}))

test('renders navigation bar', () => {
  render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  )
  expect(screen.getByLabelText('Main Navigation')).toBeInTheDocument()
})
