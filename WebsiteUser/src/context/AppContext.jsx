import { createContext, useEffect, useState } from 'react'

export const AppContext = createContext(null)

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [cart, setCartState] = useState([])
  const [authLoaded, setAuthLoaded] = useState(false)
  const [cartLoaded, setCartLoaded] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser && storedUser !== 'undefined') {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        setUser(null)
      }
    } else {
      setUser(null)
    }
    setAuthLoaded(true)
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem('cart')
    if (stored) {
      try {
        setCartState(JSON.parse(stored))
      } catch {
        setCartState([])
      }
    }
    setCartLoaded(true)
  }, [])

  const setCart = (updated) => {
    setCartState(updated)
    localStorage.setItem('cart', JSON.stringify(updated))
  }

  return (
    <AppContext.Provider value={{ user, setUser, cart, setCart, authLoaded, cartLoaded }}>
      {children}
    </AppContext.Provider>
  )
}
