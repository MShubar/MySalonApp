// src/context/CartContext.js
import { createContext, useEffect, useState } from 'react';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCartState] = useState([]);
  const [cartLoaded, setCartLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) {
      try {
        setCartState(JSON.parse(stored));
      } catch {
        setCartState([]);
      }
    }
    setCartLoaded(true);
  }, []);

  const setCart = (updated) => {
    setCartState(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  return (
    <CartContext.Provider value={{ cart, setCart, cartLoaded }}>
      {children}
    </CartContext.Provider>
  );
};
