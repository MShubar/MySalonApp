// main.jsx or index.jsx
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import 'normalize.css'
import './i18n'
import './App.css'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ErrorBoundary>
      <AppProvider>
        <App />
      </AppProvider>
    </ErrorBoundary>
  </BrowserRouter>
)
