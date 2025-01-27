import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { JwtService } from "~/state/services/jwt.service";
import { User } from "~/models/user.model";
import { AuthService } from "~/state/services/auth.service";

export interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (
    email: string,
    password: string,
    onSuccess: () => void,
  ) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  accessToken: null,
  refreshToken: null,
  login: async () => {},
  logout: () => {},
  isLoading: true,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedAccessToken = localStorage.getItem("at");
    const storedRefreshToken = localStorage.getItem("rt");
    const storedUser = localStorage.getItem("user");

    if (storedAccessToken && storedRefreshToken && storedUser) {
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);

  function saveAuthData(accessToken: string, refreshToken: string, userData: User) {
    setAccessToken(accessToken);
    setUser(userData);
    localStorage.setItem("at", accessToken);
    localStorage.setItem("rt", refreshToken);
    localStorage.setItem("user", JSON.stringify(userData));
  }

  function clearAuthData() {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem("at");
    localStorage.removeItem("rt");
    localStorage.removeItem("user");
  }

  const login = async (
    email: string,
    password: string,
    onSuccess: () => void,
  ): Promise<void> => {
    try {
      const { accessToken, refreshToken } = await AuthService.authorize(email, password);
      const user = JwtService.getUserFromToken(accessToken);
      saveAuthData(accessToken, refreshToken, user);
      onSuccess();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const logout = () => {
    clearAuthData();
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, refreshToken, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
