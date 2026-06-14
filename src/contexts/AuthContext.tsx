"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "@/services/axiosInstance";

export type UserRole = "candidate" | "employer" | "admin";

export interface User {
  _id: string;
  email: string;
  role: UserRole;
  status: "active" | "blocked";
  name?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface CandidateProfile {
  _id: string;
  user: string;
  name: string;
  phone?: string;
  avatarUrl?: string;
  title?: string;
  skills?: string[];
  experience?: Array<{
    company: string;
    role: string;
    startDate: string;
    endDate?: string;
    description?: string;
  }>;
  education?: Array<{
    institution: string;
    degree: string;
    startDate: string;
    endDate?: string;
  }>;
  resumeUrl?: string;
  cvState?: any;
}

export interface EmployerProfile {
  _id: string;
  user: string;
  name: string;
  phone?: string;
  avatarUrl?: string;
  company?: {
    _id: string;
    name: string;
    logo?: string;
    description?: string;
    website?: string;
    location?: string;
    industry?: string;
  };
}

export interface AuthContextType {
  user: User | null;
  profile: CandidateProfile | EmployerProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<CandidateProfile | EmployerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const response = await axiosInstance.get("/auth/me");
      if (response.data?.success) {
        setUser(response.data.data.user);
        setProfile(response.data.data.profile);
      } else {
        setUser(null);
        setProfile(null);
      }
    } catch (error) {
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (credentials: any) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/login", credentials);
      if (response.data?.success) {
        setUser(response.data.data.user);
        setProfile(response.data.data.profile);
      }
    } catch (error) {
      setUser(null);
      setProfile(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: any) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/register", data);
      if (response.data?.success) {
        setUser(response.data.data.user);
        setProfile(response.data.data.profile);
      }
    } catch (error) {
      setUser(null);
      setProfile(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      setProfile(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser: fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
