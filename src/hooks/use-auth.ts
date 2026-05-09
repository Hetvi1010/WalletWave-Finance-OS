"use client";

import { useCallback, useState } from "react";
import { clearSession, getStoredToken, getStoredUser, storeSession } from "@/lib/auth";
import { api } from "@/lib/api";
import { User } from "@/types";

function getInitialUser() {
  const token = getStoredToken();
  const storedUser = getStoredUser();

  return token && storedUser ? storedUser : null;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(getInitialUser);

  const login = useCallback(async (email: string, password: string) => {
    const response = await api.login({ email, password });
    storeSession(response.token, response.user);
    setUser(response.user);
    return response.user;
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const response = await api.signup({ name, email, password });
    storeSession(response.token, response.user);
    setUser(response.user);
    return response.user;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  return { user, loading: false, login, signup, logout };
}
