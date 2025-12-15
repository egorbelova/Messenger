// contexts/UserContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiFetch } from '../utils/apiFetch';

export interface User {
  id: number;
  email: string;
  nickname: string;
  avatar: string;
  photo: string;
  description: string;
  dateOfRegistration: string;
}

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface UserContextType extends UserState {
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
  login: (userData: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<UserState>({
    user: null,
    loading: true,
    error: null,
  });

  const fetchUser = async () => {
    setState({ user: null, loading: true, error: null });

    try {
      const response = await apiFetch('/api/getGeneralInfo/');
      if (response.status === 401) throw new Error('Unauthorized');

      const data = await response.json();

      if (!data.success || !data.user) {
        throw new Error(data.error || 'Invalid response');
      }

      setState({
        user: {
          id: data.user.id,
          email: data.user.email,
          nickname: data.user.username,
          avatar: data.user.image || '',
          photo: data.user.image || '',
          description: '',
          dateOfRegistration: data.user.date_joined,
        },
        loading: false,
        error: null,
      });
    } catch (err) {
      setState({
        user: null,
        loading: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = (userData: User) => {
    setState({ user: userData, loading: false, error: null });
  };

  const logout = () => {
    setState({ user: null, loading: false, error: null });
  };

  const value: UserContextType = {
    ...state,
    isAuthenticated: !!state.user,
    refreshUser: fetchUser,
    login,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be inside UserProvider');
  return ctx;
};
