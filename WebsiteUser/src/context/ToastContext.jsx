import { createContext } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const ToastContext = createContext({
  success: () => {},
  error: () => {}
})

export const ToastProvider = ({ children }) => {
  const success = (msg) => toast.success(msg)
  const error = (msg) => toast.error(msg)

  return (
    <ToastContext.Provider value={{ success, error }}>
      {children}
      <ToastContainer position="top-right" autoClose={2500} hideProgressBar />
    </ToastContext.Provider>
  )
}
