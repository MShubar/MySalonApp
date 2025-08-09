// src/context/AppContext.js
import React from 'react';
import { UserProvider } from './UserContext';
import { CartProvider } from './CartContext';

export const AppProvider = ({ children }) => {
  return (
    <UserProvider>
      <CartProvider>{children}</CartProvider>
    </UserProvider>
  );
};
