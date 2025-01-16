"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Github, Mail, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { api, handleError } from '@/helpers/api';
import { login } from '@/services/auth.service';
import { useUserStore } from '@/store/userStore';
import { setAuthToken } from '@/helpers/tokenManagement';
import { Spinner } from '@nextui-org/react';

const loginSchema = z.object({
  emailOrUsername: z
    .string()
    .min(3, 'Email or username is required')
    .max(100, 'Email or username is too long'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPageComponent = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrUsername: '',
      password: '',
    },
  });

  const emailOrUsernameValue = watch('emailOrUsername');
  const passwordValue = watch('password');

  const handleSuccessfulLogin = () => {
    try {
      const returnUrl = searchParams.get('returnUrl');
      if (returnUrl) {
        const decodedUrl = decodeURIComponent(returnUrl);
        router.push(decodedUrl);
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Navigation error:', error);
      router.push('/dashboard');
    }
  };

  const onSubmit = async (data: LoginFormValues) => {
    if (loading) return; 
    
    setLoading(true);
    setSubmissionError(null);
    clearErrors();

    try {
      const { user, token } = await login(data);
      
      setAuthToken(token);
      useUserStore.setState({
        user,
        token,
        isAuthenticated: true,
        loading: false,
        hasChecked: true
      });
      
      toast.success("Login successful!");
      handleSuccessfulLogin();
    } catch (error) {
      const errorMessage = handleError(error);
      setSubmissionError(errorMessage || "An unexpected error occurred. Please try again.");
      
      // Clean up authentication state on error
      if (typeof window !== 'undefined') {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
      delete api.defaults.headers.common['Authorization'];
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col justify-center items-center bg-cover bg-center overflow-y-auto"
      style={{ backgroundImage: "url('https://images.pexels.com/photos/6146970/pexels-photo-6146970.jpeg')" }}
    >
      <Card className="w-full max-w-md" style={{ backgroundColor: "#faf6e9" }}>
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <Image
              src="/favicon.ico"
              alt="LetUsConnect Logo"
              width={64}
              height={64}
              className="h-16 w-16"
            />
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {submissionError && (
              <div 
                className="p-3 mb-4 text-sm text-red-500 rounded-lg bg-red-50 border border-red-200"
                role="alert"
              >
                <div className="flex items-center justify-center">
                  <svg 
                    className="w-4 h-4 mr-2 fill-current" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z"/>
                  </svg>
                  {submissionError}
                </div>
              </div>
            )}
            <div className="relative space-y-2">
              <Label 
                htmlFor="emailOrUsername"
                style={{ backgroundColor: "#faf6e9" }}
                className={`absolute left-3 transition-all duration-200 ${
                  isEmailFocused || emailOrUsernameValue
                    ? '-top-2.5 text-xs bg-white px-1 text-primary z-10'
                    : 'top-3 text-muted-foreground'
                }`}
              >
                Email or username
              </Label>
              <Input
                id="emailOrUsername"
                type="text"
                {...register('emailOrUsername')}
                className={`pt-4 ${errors.emailOrUsername ? 'border-red-500' : ''}`}
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
              />
              {errors.emailOrUsername && (
                <p className="text-sm text-red-500">
                  {errors.emailOrUsername.message}
                </p>
              )}
            </div>

            <div className="relative space-y-2">
              <Label 
                htmlFor="password"
                style={{ backgroundColor: "#faf6e9" }}
                className={`absolute left-3 transition-all duration-200 ${
                  isPasswordFocused || passwordValue
                    ? '-top-2.5 text-xs bg-white px-1 text-primary z-10'
                    : 'top-3 text-muted-foreground'
                }`}
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className={`pt-4 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm">
                <input type="checkbox" className="rounded border-gray-300" />
                <span>Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? <Spinner size="sm" color="white" /> : 'Sign in'}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground" style={{ backgroundColor: "#faf6e9" }}>
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="w-full hover:bg-[#24292F]/90 hover:text-white transition-colors group"
            >
              <Github className="mr-2 h-4 w-4 text-[#24292F] group-hover:text-white transition-colors" />
              Github
            </Button>
            <Button 
              variant="outline" 
              className="w-full hover:bg-[#4285F4]/90 hover:text-white transition-colors"
            >
              <div className="bg-white rounded-sm p-0.5">
                <svg className="mr-2 h-3 w-3" aria-hidden="true" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              </div>
              Google
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Register here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPageComponent;