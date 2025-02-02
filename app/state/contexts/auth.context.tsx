import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { User } from "~/models/user.model";
import { AuthService } from "~/state/api/auth.service";
import { useUserService } from "~/state/hooks/api/useUserService";
import { useAuthService } from "~/state/hooks/api/useAuthService";

export interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
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

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const userService = useUserService();
  const authService = useAuthService();
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedAccessToken = localStorage.getItem("at");
    const storedRefreshToken = localStorage.getItem("rt");

    if (!storedAccessToken || !storedRefreshToken) {
      setIsLoading(false);

      return;
    }

    setAccessToken(storedAccessToken);
    setRefreshToken(storedRefreshToken);

    userService
      .getCurrent()
      .then((user) => {
        setUser(user);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [userService]);

  function saveAuthData(accessToken: string, refreshToken: string) {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    localStorage.setItem("at", accessToken);
    localStorage.setItem("rt", refreshToken);

    userService.getCurrent().then(setUser);
  }

  function clearAuthData() {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    localStorage.removeItem("at");
    localStorage.removeItem("rt");
  }

  const signIn = async (email: string, password: string): Promise<void> => {
    return authService
      .signIn({ email, password })
      .then(({ accessToken, refreshToken }) => {
        saveAuthData(accessToken, refreshToken);
      });
  };

  const signOut = async () => {
    return new AuthService().signOut().then(() => {
      clearAuthData();
    });
  };

  return (
    <AuthContext.Provider
      value={{ user, accessToken, refreshToken, signIn, signOut, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
