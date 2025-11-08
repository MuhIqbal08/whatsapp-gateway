"use client";
import api from "@/lib/axios";
import { assets } from "@/public/assets";
import { AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FormEvent } from "react";
import z from "zod";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(8, "Password is required"),
});

type LoginInput = z.infer<typeof loginSchema>;

interface LoginResponse {
  token: string;
  user?: {
    // uuid: string;
    name: string;
    email: string;
  };
}

const LoginPage: React.FC = () => {
  const [form, setForm] = React.useState<LoginInput>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = React.useState<Partial<LoginInput>>({});
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const validation = loginSchema.safeParse(form);
    if (!validation.success) {
      const fieldErrors: Partial<LoginInput> = {};
      validation.error.issues.forEach((err) => {
        const fieldName = err.path[0] as keyof LoginInput;
        fieldErrors[fieldName] = err.message;
      });
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }
    try {
      const res = await api.post("/auth/login", validation.data);
      const { token } = res.data;

      localStorage.setItem("token", token);
      router.push("/user/dashboard");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      alert(
        error?.response?.data?.message ||
          "Login gagal, silahkan periksa lagi data anda"
      );
    } finally {
      setLoading(false);
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
                Sign In
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Login your account
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="sr-only">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`block w-full rounded-lg border p-3 text-sm transition-colors ${
                    errors.email
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-300 bg-gray-50 focus:border-emerald-500 focus:ring-emerald-500/20 dark:border-gray-600 dark:bg-gray-700"
                  } dark:text-white dark:placeholder-gray-400`}
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
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
                  className={`block w-full rounded-lg border p-3 text-sm transition-colors ${
                    errors.password
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-300 bg-gray-50 focus:border-emerald-500 focus:ring-emerald-500/20 dark:border-gray-600 dark:bg-gray-700"
                  } dark:text-white dark:placeholder-gray-400`}
                  required
                  //   autoComplete="new-password"
                  minLength={8}
                  value={form.password}
                  onChange={handleChange}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full rounded-lg bg-linear-to-r from-emerald-400 to-cyan-400 p-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 active:scale-[0.98] dark:focus:ring-offset-gray-900"
              >
                {loading ? "Loading..." : "Login"}
              </button>

              {/* Sign In Link */}
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                Doesnt have an account?{" "}
                <Link
                  href="/register"
                  className="font-medium text-emerald-500 hover:text-emerald-600 focus:outline-none focus:underline dark:text-cyan-400 dark:hover:text-cyan-300"
                >
                  Sign Up
                </Link>
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
            Join thousands of users who are already experiencing the future of
            communication.
          </p>
          <ul className="space-y-3">
            {[
              "Secure and encrypted messages",
              "Real-time collaboration",
              "Instant notifications",
            ].map((text) => (
              <li key={text} className="flex items-center gap-3">
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
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
