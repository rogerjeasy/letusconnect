"use client";

import dynamic from 'next/dynamic';
import RegistrationFormSkeleton from "@/components/auth/RegistrationFormSkeleton";

const RegistrationForm = dynamic(
  () => import('@/components/auth/RegisterComponent'),
  {
    ssr: false,
    loading: () => <RegistrationFormSkeleton />
  }
);

export default function RegisterPage() {
  return (
    <div>
      <RegistrationForm />
    </div>
  );
}