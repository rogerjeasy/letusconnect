"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Spinner, Button, Card } from "@nextui-org/react";
import Image from "next/image";
import { useUserStore } from "../../store/userStore";
import { api, handleError } from "../../helpers/api";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { login } from "@/services/auth.service";
import { setAuthToken } from "@/helpers/tokenManagement";

// Zod Schema for Form Validation
const loginSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const { setUser } = useUserStore();
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setSchoolExperience = useUserStore((state) => state.setSchoolExperience);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    setLoading(true);
    setSubmissionError(null);
  
    try {
      const { user, token } = await login(data);
  
        // Then update localStorage
        setAuthToken(token);
        useUserStore.setState({
        user,
        token,
        isAuthenticated: true,
        loading: false,
        hasChecked: true
      });

        // const educationData = await handleGetUserEducation(token);
        // if (educationData) {
        //   setSchoolExperience(educationData);
        // }
        
        toast.success("Login successful!");
  
        router.push("/dashboard");
    } catch (error) {
      const errorMessage = handleError(error);
      setSubmissionError(errorMessage || "An unexpected error occurred. Please try again.");
      
      // Clean up on error
      if (typeof window !== 'undefined') {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
      delete api.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col justify-center items-center bg-cover bg-center overflow-y-auto"
      style={{ backgroundImage: "url('https://images.pexels.com/photos/6146970/pexels-photo-6146970.jpeg')" }}
    >
      <Card className="flex flex-row w-full max-w-4xl shadow-lg overflow-hidden">
        {/* Left Side: Full Image */}
        <div className="w-1/2 relative">
          <Image
            src="/assets/logo-6.png"
            alt="App Logo"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>

        {/* Right Side: Login Form */}
        <div
          className="w-1/2 p-8"
          style={{ backgroundColor: "#faf6e9" }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

            {submissionError && (
              <div className="mb-4 text-red-600 text-center">{submissionError}</div>
            )}

            {/* Email Field */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
              <input
                {...register("email")}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.email ? "border-red-500" : ""
                }`}
                type="email"
                placeholder="Your Email"
              />
              {errors.email && (
                <p className="text-red-500 text-xs italic mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
              <input
                {...register("password")}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.password ? "border-red-500" : ""
                }`}
                type="password"
                placeholder="Your Password"
              />
              {errors.password && (
                <p className="text-red-500 text-xs italic mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button with Spinner */}
            <div className="flex flex-col items-center justify-center mt-6">
              <Button
                type="submit"
                color="primary"
                isDisabled={loading}
                className="w-full max-w-[200px] flex justify-center"
              >
                {loading ? <Spinner size="sm" color="white" /> : "Login"}
              </Button>
            </div>

            {/* Register Link */}
            <div className="text-center mt-4">
              <p className="text-gray-700 text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-blue-500 hover:underline">
                  Register here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default LoginForm;