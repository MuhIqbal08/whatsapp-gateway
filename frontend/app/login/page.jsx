"use client";
import api, { setAccessToken } from "@/lib/axios";
import { assets } from "@/lib/assets";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { Slide, toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);
  // const [accessToken, setAccessToken] = React.useState(null);
  const router = useRouter();

  const { setUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      // simpan access token ke memory
      setAccessToken(res.data.accessToken);

      // ambil user
      const me = await api.get("/auth/me");

      // simpan user ke context
      setUser(me.data.user);

      toast.success("Login berhasil", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Slide,
      });

      router.push("/user/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialsResponse) => {
    setGoogleLoading(true);

    try {
      const res = await api.post("/auth/google", {
        token: credentialsResponse.credential,
      });

      setAccessToken(res.data.accessToken);

      const me = await api.get("/auth/me");
      setUser(me.data.user);

      toast.success("Login berhasil", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Slide,
      });

      router.push("/user/dashboard");
    } catch (error) {
      toast.error("Google login failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <div className="flex min-h-screen flex-col md:flex-row">
        {/* Left Section - Form */}
        <div className="flex w-full md:w-1/2 items-center justify-center p-6 md:p-8">
          <div className="w-full max-w-md space-y-8">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Image
                src={assets.logo}
                alt="ChatDash Logo"
                width={32}
                height={32}
                className="h-8 w-8"
                priority
              />
              <h1 className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-xl font-semibold text-transparent">
                ChatDash
              </h1>
            </div>

            {/* Form Container */}
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <h2 className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-3xl font-bold text-transparent">
                  Sign In
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Login your account
                </p>
              </div>

              <div className="space-y-4">
                {/* Google Login Button */}
                <GoogleLogin
                  // type="button"
                  onSuccess={handleGoogleLogin}
                  onError={() => alert("Google Login Error")}
                  disabled={googleLoading || loading}
                  className="group relative w-full overflow-hidden rounded-lg border border-gray-100 bg-white p-3 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-300 hover:border-gray-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-gray-500 dark:focus:ring-offset-gray-900"
                >
                  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-50 to-red-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-blue-950/30 dark:to-red-950/30" />

                  <div className="flex items-center justify-center gap-3">
                    {googleLoading ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
                    ) : (
                      <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                    )}
                    <span className="relative">
                      {googleLoading ? "Connecting..." : "Continue with Google"}
                    </span>
                  </div>
                </GoogleLogin>

                {/* Divider */}
                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-gray-300 dark:border-gray-600" />
                  <span className="mx-4 flex-shrink text-sm text-gray-500 dark:text-gray-400">
                    OR
                  </span>
                  <div className="flex-grow border-t border-gray-300 dark:border-gray-600" />
                </div>

                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500/20"
                    placeholder="Email Address"
                    required
                    autoComplete="email"
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading || googleLoading}
                  />
                </div>

                {/* Password Input */}
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500/20"
                    placeholder="Password"
                    required
                    minLength={8}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading || googleLoading}
                  />
                </div>

                {/* Submit Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleLogin(e);
                  }}
                  disabled={loading || googleLoading}
                  className="w-full rounded-lg bg-gradient-to-r from-emerald-400 to-cyan-400 p-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-offset-gray-900"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Loading...
                    </span>
                  ) : (
                    "Login"
                  )}
                </button>

                {/* Sign Up Link */}
                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                  Doesnt have an account?{" "}
                  <Link
                    href="/register"
                    className="font-medium text-emerald-500 hover:text-emerald-600 focus:outline-none focus:underline dark:text-cyan-400 dark:hover:text-cyan-300"
                  >
                    Sign Up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Hero */}
        <div className="hidden w-1/2 items-center justify-center bg-gradient-to-br from-emerald-400 to-cyan-400 p-12 md:flex">
          <div className="max-w-md space-y-6 text-white">
            <h2 className="text-4xl font-bold leading-tight">
              Welcome to ChatDash
            </h2>
            <p className="text-lg opacity-90">
              Join thousands of users who are already experiencing the future of
              communication.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <svg
                  className="h-6 w-6 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Secure and encrypted messages</span>
              </li>
              <li className="flex items-center gap-3">
                <svg
                  className="h-6 w-6 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Real-time collaboration</span>
              </li>
              <li className="flex items-center gap-3">
                <svg
                  className="h-6 w-6 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Cross-platform support</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;
