import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

type Role = "super_admin" | "company_admin" | "employee";

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  companyId?: string;
  companyName?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("perfy_employee_token");
    const savedUser = localStorage.getItem("perfy_employee_session");
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setIsInitialized(true);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) return false;

      const data = await response.json();
      
      if (data.user.role !== "employee") return false;

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("perfy_employee_session", JSON.stringify(data.user));
      localStorage.setItem("perfy_employee_token", data.token);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("perfy_employee_session");
    localStorage.removeItem("perfy_employee_token");
  };

  if (!isInitialized) return null;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}