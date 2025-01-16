"use client";

import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

const RegistrationFormSkeleton = () => {
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-cover bg-center p-4 overflow-y-auto">
      <Card className="w-full max-w-xl">
        <CardHeader className="space-y-1">
          <div className="flex justify-center">
            <Skeleton className="h-16 w-16 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Form fields skeleton */}
          <div className="space-y-4">
            {/* Email field */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-10 w-full" />
            </div>
            
            {/* Username field */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            
            {/* Password field */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            
            {/* Confirm Password field */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            
            {/* Program Selection field */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Submit button skeleton */}
          <Skeleton className="h-10 w-full" />

          {/* Separator */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center">
              <Skeleton className="h-4 w-32" />
            </div>
          </div>

          {/* Social login buttons skeleton */}
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Skeleton className="h-4 w-64" />
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegistrationFormSkeleton;