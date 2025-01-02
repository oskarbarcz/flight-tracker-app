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
  token: string | null;
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
  token: null,
  login: async () => {},
  logout: () => {},
  isLoading: true,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);

  function saveAuthData(token: string, userData: User) {
    setToken(token);
    setUser(userData);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
  }

  function clearAuthData() {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  const login = async (
    email: string,
    password: string,
    onSuccess: () => void,
  ): Promise<void> => {
    try {
      const token = await AuthService.authorize(email, password);
      const user = JwtService.getUserFromToken(token);
      saveAuthData(token, user);
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
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
