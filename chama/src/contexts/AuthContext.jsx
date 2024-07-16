import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      sessionStorage.setItem('user_role', parsedUser.role);
      sessionStorage.setItem('user_id', parsedUser.id);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    sessionStorage.setItem('user_role', userData.role);
    sessionStorage.setItem('user_id', userData.id);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    sessionStorage.removeItem('user_role');
    sessionStorage.removeItem('user_id');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);



