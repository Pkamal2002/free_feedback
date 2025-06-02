"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [debouncedUsername] = useDebounceValue(username, 300);
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (!debouncedUsername) {
        setUsernameMessage("");
        setIsCheckingUsername(false);
        return;
      }

      if (debouncedUsername.length < 3) {
        setUsernameMessage("Username must be at least 3 characters");
        setIsCheckingUsername(false);
        return;
      }

      if (debouncedUsername.length > 20) {
        setUsernameMessage("Username must be at most 20 characters");
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
        setUsernameMessage(
          axiosError.response?.data.message || "Error checking username"
        );
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
      router.replace(`/verify/${data.username}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Username */}
            <div>
              <Label htmlFor="username">
                Username{" "}
                {usernameMessage && (
                  <span
                    className={`ml-2 text-xs ${
                      usernameMessage.includes("available")
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {isCheckingUsername ? "Checking..." : usernameMessage}
                  </span>
                )}
              </Label>
              <Input
                id="username"
                placeholder="username"
                {...form.register("username")}
                onChange={(e) => {
                  form.setValue("username", e.target.value);
                  setUsername(e.target.value);
                }}
              />
              {form.formState.errors.username && (
                <p className="text-red-500 text-xs mt-1">
                  {form.formState.errors.username.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...form.register("password")}
                  className="pr-20"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? "Hide" : "Show"}
                </Button>
              </div>
              {form.formState.errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
