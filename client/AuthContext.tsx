"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

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
  logout: () => Promise<boolean>;
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
          timeout: 10000,
          withCredentials: true,
          headers: { "Cache-Control": "no-cache" }
        }
      );
      setUser(res.data.user);
    } catch (error) {
      setUser(null);
      if (axios.isAxiosError(error) && ![401, 403].includes(error.response?.status ?? 0)) {
        toast.error("We couldn’t verify your session. Check your connection and refresh.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Call once on load
  useEffect(() => {
    getUser();
  }, []);

  // Logout
  const logout = async (): Promise<boolean> => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
        {},
        { timeout: 10000, withCredentials: true }
      );

      setUser(null);
      localStorage.removeItem("user_info");
      return true;
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("We couldn’t sign you out. Please try again.");
      return false;
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