'use client';

import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: () => void;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  initialUser: User | null;
}

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [isLoading, setIsLoading] = useState<boolean>(initialUser === null);
  const router = useRouter();

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const checkSession = useCallback(async () => {
    if (!backendUrl) {
      console.error("Frontend: Backend URL is not configured for checkSession.");
      setUser(null);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${backendUrl}/auth/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        console.log('Session check (client): User data fetched', userData.email);
      } else {
        setUser(null);
        if (response.status === 401) {
          console.log('Session check (client): No active session or token expired.');
        } else {
          console.error('Session check (client): Failed to fetch profile:', response.status, await response.text());
        }
      }
    } catch (error) {
      console.error('Session check (client): Error fetching profile:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    if (initialUser === null) {
      checkSession();
    }
  }, [checkSession, initialUser]);

  const login = () => {
    if (!backendUrl) {
      console.error("Frontend: Backend URL is not configured for login.");
      return;
    }
    window.location.href = `${backendUrl}/auth/google`;
  };

  const logout = async () => {
    if (!backendUrl) {
      console.error("Frontend: Backend URL is not configured for logout.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${backendUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        setUser(null);
        console.log('Logout successful (client).');
        router.push('/login');
      } else {
        console.error('Logout failed (client):', response.status, await response.text());
        setUser(null);
        router.push('/login');
      }
    } catch (error) {
      console.error('Error during logout (client):', error);
      setUser(null);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
}