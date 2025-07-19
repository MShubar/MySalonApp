import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Navbar from './Navbar'

describe('Navbar', () => {
  test('renders brand title', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    )
    expect(screen.getByText('Salon Admin')).toBeInTheDocument()
  })

  test('toggles menu', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    )
    const button = screen.getByLabelText('Toggle navigation')
    fireEvent.click(button)
    expect(screen.getByRole('navigation').querySelector('.show')).toBeTruthy()
  })
})
