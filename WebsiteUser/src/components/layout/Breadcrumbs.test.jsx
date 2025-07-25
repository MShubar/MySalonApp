import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Breadcrumbs from './Breadcrumbs'

test('renders breadcrumb items', () => {
  const items = [
    { label: 'Home', to: '/' },
    { label: 'Salon Name' }
  ]
  render(
    <BrowserRouter>
      <Breadcrumbs items={items} />
    </BrowserRouter>
  )
  expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
  expect(screen.getByText('Salon Name')).toBeInTheDocument()
})
