import { createContext, useState, ReactNode } from "react";
import { IUser } from "../types/auth";
import { login as loginApi } from "../api/auth/loginAPI";

interface AuthContextType {
  user: IUser | null;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const login = async (credentials: { username: string; password: string }) => {
    try {
      const userData = await loginApi(credentials);
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.error(error);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
