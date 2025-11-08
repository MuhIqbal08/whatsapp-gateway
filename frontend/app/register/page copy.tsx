'use client'
import api from "@/lib/axios";
import { assets } from "@/public/assets";
import Image from "next/image";
import React from "react";

const RegisterPage = () => {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
        const res = await api.post('/auth/register', {
            name,
            email,
            password,
            confirmPassword
        })
        alert(res.data.message || "Register Berhasil!")
        window.location.href = '/login'
    } catch (error) {
        console.error(error)
        alert(error.response.data.message)
    }
  };

  return (
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
            <h1 className="bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-xl font-semibold text-transparent">
              ChatDash
            </h1>
          </div>

          {/* Form Container */}
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-3xl font-bold text-transparent">
                Sign Up
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Create your account to get started
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Name Input */}
              <div>
                <label htmlFor="name" className="sr-only">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500/20"
                  placeholder="Full Name"
                  required
                  autoComplete="name"
                  onChange={(e) => setName(e.target.value)}
                />
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
                //   autoComplete="new-password"
                  minLength={8}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Confirm Password Input */}
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500/20"
                  placeholder="Confirm password"
                  required
                //   autoComplete="new-password"
                  minLength={8}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full rounded-lg bg-linear-to-r from-emerald-400 to-cyan-400 p-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 active:scale-[0.98] dark:focus:ring-offset-gray-900"
              >
                Create Account
              </button>

              {/* Sign In Link */}
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="font-medium text-emerald-500 hover:text-emerald-600 focus:outline-none focus:underline dark:text-cyan-400 dark:hover:text-cyan-300"
                >
                  Sign In
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Right Section - Hero */}
      <div className="hidden w-1/2 items-center justify-center bg-linear-to-br from-emerald-400 to-cyan-400 p-12 md:flex">
        <div className="max-w-md space-y-6 text-white">
          <h2 className="text-4xl font-bold leading-tight">
            Welcome to ChatDash
          </h2>
          <p className="text-lg opacity-90">
            Join thousands of users who are already experiencing the future of communication.
          </p>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <svg className="h-6 w-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Secure and encrypted messages</span>
            </li>
            <li className="flex items-center gap-3">
              <svg className="h-6 w-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Real-time collaboration</span>
            </li>
            <li className="flex items-center gap-3">
              <svg className="h-6 w-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Cross-platform support</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;