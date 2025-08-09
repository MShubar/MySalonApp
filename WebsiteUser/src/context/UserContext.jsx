// src/context/UserContext.js
import { createContext, useEffect, useState } from 'react';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'undefined') {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setAuthLoaded(true);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, authLoaded }}>
      {children}
    </UserContext.Provider>
  );
};
