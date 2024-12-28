import React, {createContext, useState, useEffect, ReactNode, useContext} from 'react';
import {JwtService} from "~/state/services/jwt.service";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  authToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface AfterAuthContextType {
  user: User;
  authToken: string;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const initialState = {
    user: null,
    authToken: null,
    login: async () => {},
    logout: () => {}
  };

export const AuthContext = createContext<AuthContextType>(initialState);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setAuthToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  function saveAuthData(token: string, userData: User) {
    setAuthToken(token);
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  }

  function clearAuthData() {
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost/api/v1/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error('Login failed');
      }
      const responseBody = await response.json();
      const userData = JwtService.getUserFromToken(responseBody.token);
      saveAuthData(responseBody.token, userData);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const logout = () => {
    clearAuthData();
  };

  return (
    <AuthContext.Provider value={{user, authToken, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  return useContext<AuthContextType>(AuthContext);
}
