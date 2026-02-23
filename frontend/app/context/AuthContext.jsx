"use client";

import { createContext, useContext, useEffect, useState } from "react";
import api, { setAccessToken, clearAccessToken } from "@/lib/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Ambil access token baru dari refresh cookie
        const refreshRes = await api.get("/auth/refresh");
        setAccessToken(refreshRes.data.accessToken);

        // Ambil user
        const meRes = await api.get("/auth/me");
        setUser(meRes.data.user);

      } catch {
        clearAccessToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
