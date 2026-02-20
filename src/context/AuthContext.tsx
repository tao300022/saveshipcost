import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  authLogin,
  authRegister,
  getCurrentUser,
  saveSession,
  clearSession,
  SessionUser,
} from '../services/storage';

interface AuthContextType {
  user: SessionUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => 'ok' | 'invalid';
  register: (email: string, username: string, password: string) => 'ok' | 'email_exists';
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SessionUser | null>(getCurrentUser);

  const login = (email: string, password: string): 'ok' | 'invalid' => {
    const found = authLogin(email, password);
    if (!found) return 'invalid';
    saveSession(found);
    setUser(found);
    return 'ok';
  };

  const register = (
    email: string,
    username: string,
    password: string,
  ): 'ok' | 'email_exists' => {
    const result = authRegister(email, username, password);
    return result;
  };

  const logout = () => {
    clearSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
