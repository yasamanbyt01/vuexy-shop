import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

import {
  login as loginRequest,
  register as registerRequest,
} from "../services/auth";

import type { AuthUser, LoginRequest, RegisterRequest } from "../types/auth";

const AUTH_STORAGE_KEY = "vuexy_auth";

interface StoredAuth {
  token: string;
  user: AuthUser;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (data: LoginRequest, rememberMe?: boolean) => Promise<void>;
  register: (data: RegisterRequest) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const getStoredAuth = (): StoredAuth | null => {
  const localAuth = localStorage.getItem(AUTH_STORAGE_KEY);

  if (localAuth) {
    try {
      return JSON.parse(localAuth) as StoredAuth;
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }

  const sessionAuth = sessionStorage.getItem(AUTH_STORAGE_KEY);

  if (sessionAuth) {
    try {
      return JSON.parse(sessionAuth) as StoredAuth;
    } catch {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }

  return null;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = useState<StoredAuth | null>(getStoredAuth);

  const login = async (data: LoginRequest, rememberMe = false) => {
    const response = await loginRequest(data);

    const storedAuth: StoredAuth = {
      token: response.access_token,
      user: response.user,
    };

    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);

    const storage = rememberMe ? localStorage : sessionStorage;

    storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(storedAuth));

    setAuth(storedAuth);
  };

  const register = async (data: RegisterRequest) => {
    return registerRequest(data);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);

    setAuth(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user: auth?.user ?? null,
        token: auth?.token ?? null,
        isAuthenticated: auth !== null,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }

  return context;
};
