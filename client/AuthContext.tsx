"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

type User = {
  id: string;
  name: string;
  email: string;
  streak?: string;
  mock_interviews?: string,
  problems_solved?: string
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  getUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const getUser = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
        { 
          withCredentials: true , 
          headers: { 'Cache-Control': 'no-cache' }
        }
      );
      setUser(res.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Call once on load
  useEffect(() => {
    getUser();
  }, []);

  // Logout
  const logout = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
        {},
        { withCredentials: true}
      );

      await getUser();
      setUser(null);
      localStorage.removeItem("user_info");

    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout, getUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};