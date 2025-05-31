"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { motion } from "framer-motion";
import { FiEye, FiEyeOff, FiCheck, FiX } from "react-icons/fi";
import { useTheme } from "next-themes";
import { BsSun, BsMoon } from "react-icons/bs";
import { Loader2 } from "lucide-react";

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [debouncedUsername] = useDebounceValue(username, 300);
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (!debouncedUsername) {
        setUsernameMessage("");
        setIsCheckingUsername(false);
        return;
      }

      if (debouncedUsername.length < 3) {
        setUsernameMessage("Username must be at least 3 characters long");
        setIsCheckingUsername(false);
        return;
      }
      if (debouncedUsername.length > 20) {
        setUsernameMessage("Username must be at most 20 characters long");
        setIsCheckingUsername(false);
        return;
      }

      setIsCheckingUsername(true);
      setUsernameMessage("");
      try {
        const response = await axios.get(
          `/api/users/check-username-unique?username=${debouncedUsername}`
        );
        setUsernameMessage(response.data.message);
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        if (axiosError.response?.status === 400) {
          setUsernameMessage(
            "Username can only contain letters, numbers, and underscores"
          );
        } else {
          setUsernameMessage(
            axiosError.response?.data.message || "Error checking username"
          );
        }
      } finally {
        setIsCheckingUsername(false);
      }
    };
    checkUsernameUnique();
  }, [debouncedUsername]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/users/sign-up", data);
      toast.success(response.data.message);
    //  router.(`/verify/${username}`);
        router.replace(`/verify/${username}`);


    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: theme === "dark" ? "#1f2937" : "#fff",
            color: theme === "dark" ? "#fff" : "#111827",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            borderRadius: "12px",
          },
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-4 right-4 z-50"
      >
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-white dark:bg-gray-700 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <BsSun className="w-5 h-5 text-yellow-400" />
          ) : (
            <BsMoon className="w-5 h-5 text-indigo-600" />
          )}
        </button>
      </motion.div>

      <div className="w-full max-w-md p-8 mx-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700"
        >
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-center">
            <h1 className="text-3xl font-bold text-white">
              Join Our Feedback Community
            </h1>
            <p className="text-indigo-100 mt-2">
              Create your account in seconds
            </p>
          </div>

          <div className="p-6">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Username Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Username
                  {username && usernameMessage && (
                    <span
                      className={`ml-2 text-xs ${usernameMessage.includes("available") ? "text-green-500" : "text-red-500"}`}
                    >
                      {isCheckingUsername ? (
                        <span className="inline-flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-1 h-3 w-3 text-gray-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Checking...
                        </span>
                      ) : usernameMessage.includes("available") ? (
                        <span className="inline-flex items-center">
                          <FiCheck className="mr-1" /> Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center">
                          <FiX className="mr-1" /> {usernameMessage}
                        </span>
                      )}
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  {...form.register("username")}
                  value={username}
                  onChange={(e) => {
                    form.setValue("username", e.target.value);
                    setUsername(e.target.value);
                  }}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="username"
                />

                {form.formState.errors.username && (
                  <p className="text-red-500 text-xs mt-1">
                    {form.formState.errors.username.message}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  {...form.register("email")}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="your@email.com"
                />
                {form.formState.errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...form.register("password")}
                    className="w-full px-4 py-3 pr-10 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-lg shadow-md transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/sign-in"
                  className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
