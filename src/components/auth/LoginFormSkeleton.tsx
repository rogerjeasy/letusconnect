"use client";
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const LoginFormSkeleton = () => {
  return (
    <div
      className="min-h-screen w-full flex flex-col justify-center items-center bg-cover bg-center overflow-y-auto"
      style={{ backgroundImage: "url('https://images.pexels.com/photos/6146970/pexels-photo-6146970.jpeg')" }}
    >
      <Card className="w-full max-w-md" style={{ backgroundColor: "#faf6e9" }}>
        <CardHeader className="space-y-4">
          {/* Logo Skeleton */}
          <div className="flex justify-center">
            <Skeleton className="h-16 w-16 rounded-full" />
          </div>
          {/* Title and Subtitle Skeletons */}
          <div className="text-center space-y-2">
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-4">
            {/* Email/Username Field Skeleton */}
            <div className="space-y-2 relative">
              <Skeleton className="h-4 w-24 absolute -top-2 left-3 z-10" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Password Field Skeleton */}
            <div className="space-y-2 relative">
              <Skeleton className="h-4 w-16 absolute -top-2 left-3 z-10" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Remember Me and Forgot Password Skeleton */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-28" />
            </div>

            {/* Sign In Button Skeleton */}
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Separator */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <Skeleton className="h-4 w-32 bg-[#faf6e9]" />
            </div>
          </div>

          {/* Social Login Buttons Skeleton */}
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>

        <CardFooter className="flex justify-center">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default LoginFormSkeleton