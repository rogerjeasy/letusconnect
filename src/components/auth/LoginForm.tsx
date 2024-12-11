"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Spinner, Button } from "@nextui-org/react";
import { useUserStore, generateRandomAvatar } from "../../store/userStore";
import { api, handleError } from "../../helpers/api";
import { useRouter } from "next/navigation";

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
  const avatarPicture = generateRandomAvatar();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    setLoading(true);
    try {
      const response = await api.post("/api/users/login", data);

      if (response.status === 200) {
        const { user, token } = response.data;
        user.profilePicture = user.profilePicture || avatarPicture;
        setUser(user, token);

        setSubmissionError(null);
        router.push("/dashboard");
      }
    } catch (error) {
      const errorMessage = handleError(error);
      setSubmissionError(errorMessage || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {submissionError && (
          <div className="mb-4 text-red-600 text-center">{submissionError}</div>
        )}

        {/* Email Field */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
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
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
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
  );
};

export default LoginForm;