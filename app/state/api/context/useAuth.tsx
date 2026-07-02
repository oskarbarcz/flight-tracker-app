import React, { createContext, type ReactNode, useContext, useEffect, useState } from "react";
import type { User } from "~/models/user.model";
import { clearTokens, readAccessToken, readRefreshToken, saveTokens } from "~/shared/lib/tokenStorage";
import { useApi } from "~/state/api/context/useApi";

export interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  isLoading: boolean;
}

export const UseAuth = createContext<AuthContextType>({
  user: null,
  accessToken: null,
  refreshToken: null,
  signIn: async () => {},
  signOut: () => {},
  isLoading: true,
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { userService, authService } = useApi();
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedAccessToken = readAccessToken();
    const storedRefreshToken = readRefreshToken();

    if (!storedAccessToken || !storedRefreshToken) {
      setIsLoading(false);

      return;
    }

    setAccessToken(storedAccessToken);
    setRefreshToken(storedRefreshToken);

    userService
      .fetchCurrent()
      .then((user) => {
        setUser(user);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [userService]);

  function saveAuthData(accessToken: string, refreshToken: string): Promise<void> {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    saveTokens(accessToken, refreshToken);

    return userService.fetchCurrent().then(setUser);
  }

  function clearAuthData() {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    clearTokens();
  }

  const signIn = async (email: string, password: string): Promise<void> => {
    const { accessToken, refreshToken } = await authService.signIn({ email, password });
    await saveAuthData(accessToken, refreshToken);
  };

  const signOut = async () => {
    return authService.signOut().then(() => {
      clearAuthData();
    });
  };

  return (
    <UseAuth.Provider value={{ user, accessToken, refreshToken, signIn, signOut, isLoading }}>
      {children}
    </UseAuth.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(UseAuth);
  if (!context) throw new Error("useApi must be used within a ApiProvider");
  return context;
}
