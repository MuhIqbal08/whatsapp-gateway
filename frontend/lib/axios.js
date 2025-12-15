import axios from "axios";

// Base URL API kamu
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true, // penting jika backend pakai cookie authentication
});

// Ambil token dari cookie (bukan localStorage)
const getTokenFromCookie = () => {
  if (typeof document !== "undefined") {
    const match = document.cookie.match(new RegExp("(^| )token=([^;]+)"));
    return match ? match[2] : null;
  }
  return null;
};

// Interceptor untuk otomatis attach token
api.interceptors.request.use((config) => {
  const token = getTokenFromCookie();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
