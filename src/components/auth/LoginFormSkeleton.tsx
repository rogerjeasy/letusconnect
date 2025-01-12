"use client";

import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

const LoginFormSkeleton = () => {
  return (
    <div
      className="min-h-screen w-full flex flex-col justify-center items-center bg-cover bg-center overflow-y-auto"
      style={{ backgroundImage: "url('https://images.pexels.com/photos/6146970/pexels-photo-6146970.jpeg')" }}
    >
      <Card className="flex flex-row w-full max-w-4xl shadow-lg overflow-hidden">
        {/* Left Side: Image Skeleton */}
        <div className="w-1/2 relative">
          <Skeleton className="h-full w-full" />
        </div>

        {/* Right Side: Form Skeleton */}
        <div 
          className="w-1/2 p-8 space-y-6"
          style={{ backgroundColor: "#faf6e9" }}
        >
          {/* Title Skeleton */}
          <div className="flex justify-center">
            <Skeleton className="h-8 w-32" />
          </div>

          {/* Email Field Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Password Field Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Button Skeleton */}
          <div className="flex justify-center pt-4">
            <Skeleton className="h-10 w-32" />
          </div>

          {/* Register Link Skeleton */}
          <div className="flex justify-center items-center space-x-2 pt-4">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </Card>
    </div>
  )
}

export default LoginFormSkeleton