'use client';
import { createContext, useContext, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  setAuthenticated: (status: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {

 const isClient = typeof window !== 'undefined';

  const [isAuthenticated, setAuthenticatedState] = useState(() => {
    if (isClient) {
        const savedState = localStorage.getItem('isAuthenticated');
        return savedState !== null ? JSON.parse(savedState) : false;
    }
  });

  const setAuthenticated = (status: boolean) => {
    if (isClient) {
        setAuthenticatedState(status);
        localStorage.setItem('isAuthenticated', JSON.stringify(status));
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}