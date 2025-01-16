"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerSchema, type RegisterFormValues } from "@/schemas/registerSchema";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { toast } from 'react-toastify';
import { Spinner } from '@nextui-org/react';
import { Github, Eye, EyeOff } from 'lucide-react';
import { registerUser } from '@/services/auth.service';
import { useUserStore } from '@/store/userStore';
import { setAuthToken } from '@/helpers/tokenManagement';
import { ProgramCombobox } from '../utils/StudyProgram';
import SocialAuthButtons from './SocialAuthButtons';
import { cn } from '@/lib/utils';
import { u } from 'framer-motion/client';

const RegistrationComponent = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      program: undefined,
    },
    mode: "onChange",
  });

  const password = form.watch("password");
  const confirmPassword = form.watch("confirmPassword");

  const passwordsMatch = React.useMemo(() => {
    if (!confirmPassword) return true;
    return password === confirmPassword;
  }, [password, confirmPassword]);

  const onSubmit = async (data: RegisterFormValues) => {
    if (loading) return;
    setLoading(true);

    try {
      const { token, user } = await registerUser(data);
      useUserStore.setState({
        user,
        token,
        isAuthenticated: true,
        loading: false,
        hasChecked: true
      });

      // Then update localStorage
      setAuthToken(token);
      toast.success("Registration successful. Welcome to Let's Connect!");
      router.push('/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col justify-center items-center bg-cover bg-center p-4 overflow-y-auto"
      style={{ backgroundImage: "url('https://images.pexels.com/photos/6146970/pexels-photo-6146970.jpeg')" }}
    >
      <Card className="w-full max-w-xl" style={{ backgroundColor: "#faf6e9" }}>
        <CardHeader className="space-y-1">
          <div className="flex justify-center">
            <Image
              src="/favicon.ico"
              alt="Logo"
              width={64}
              height={64}
              className="h-16 w-16"
            />
          </div>
          <CardTitle className="text-2xl text-center">Create an account</CardTitle>
          <CardDescription className="text-center">
            Enter your information below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Choose a username"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                        <div className="relative">
                        <Input
                            placeholder="Create a password"
                            type={showPassword ? 'text' : 'password'}
                            {...field}
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
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                        <div className="relative">
                        <Input
                            placeholder="Confirm your password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            className={cn(
                            confirmPassword && !passwordsMatch ? "border-red-500 focus-visible:ring-red-500" : "",
                            confirmPassword && passwordsMatch ? "border-green-500 focus-visible:ring-green-500" : ""
                            )}
                            {...field}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                            ) : (
                            <Eye className="h-4 w-4" />
                            )}
                        </button>
                        </div>
                    </FormControl>
                    {confirmPassword && !passwordsMatch && (
                        <p className="text-sm font-medium text-red-500">
                        Passwords don't match
                        </p>
                    )}
                    {confirmPassword && passwordsMatch && (
                        <p className="text-sm font-medium text-green-500">
                        Passwords match
                        </p>
                    )}
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                    control={form.control}
                    name="program"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Study Program</FormLabel>
                        <FormControl>
                            <ProgramCombobox
                            value={field.value}
                            onChange={field.onChange}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Spinner size="sm" color="white" /> : "Register"}
              </Button>
            </form>
          </Form>

          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground" style={{ backgroundColor: "#faf6e9" }}>
                Or continue with
              </span>
            </div>
          </div>

          <SocialAuthButtons mode="register" className="mt-6" />
          
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
              </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegistrationComponent;