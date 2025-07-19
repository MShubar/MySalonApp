import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import NotFound from './NotFound'

test('renders 404 page', () => {
  render(
    <BrowserRouter>
      <NotFound />
    </BrowserRouter>
  )
  expect(screen.getByText(/404/)).toBeInTheDocument()
})
