"use client";
import dynamic from 'next/dynamic';
import LoginFormSkeleton from '@/components/auth/LoginFormSkeleton';

const LoginForm = dynamic(() => import("@/components/auth/Login"), {
  ssr: false,
  loading: () => <LoginFormSkeleton />
});

export default function LoginPage() {
  return (
    <div>
      <LoginForm />
    </div>
  );
}
