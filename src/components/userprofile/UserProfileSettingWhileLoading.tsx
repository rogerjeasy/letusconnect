import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { User, Briefcase, School, MapPin } from 'lucide-react';

const UserProfileSettingWhileLoading = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
      <div className="w-full max-w-4xl mx-auto mt-10 flex flex-col gap-6">
        {/* Profile Card Loading State */}
        <Card>
          <CardHeader className="flex justify-between items-center p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="p-6 space-y-6">
            {/* Basic Info Section */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Your UserID:</p>
                <Skeleton className="h-8 w-full" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Verified Profile</p>
                <Skeleton className="h-8 w-full" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Created</p>
                <Skeleton className="h-8 w-full" />
              </div>
            </div>

            {/* User Information */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Username</p>
                <Skeleton className="h-8 w-full" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">First Name</p>
                <Skeleton className="h-8 w-full" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Last Name</p>
                <Skeleton className="h-8 w-full" />
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Role</p>
                <Skeleton className="h-8 w-full" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Phone Code</p>
                <Skeleton className="h-8 w-full" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Phone Number</p>
                <Skeleton className="h-8 w-full" />
              </div>
            </div>

            {/* Bio Section */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Bio</p>
              <Skeleton className="h-24 w-full" />
            </div>

            {/* Skills Section */}
            <div className="space-y-2">
              <p className="text-large font-bold">Skills</p>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-8 w-24 rounded-full" />
                ))}
              </div>
            </div>

            {/* Languages Section */}
            <div className="space-y-2">
              <p className="text-large font-bold">Languages</p>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-8 w-24 rounded-full" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Education Card Loading State */}
        <Card>
          <CardHeader className="flex items-center gap-2 p-4">
            <School className="h-5 w-5" />
            <p className="text-lg font-semibold">University Details</p>
          </CardHeader>
          <Separator />
          <CardContent className="p-6 space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">University</p>
                    <Skeleton className="h-8 w-full" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Program</p>
                    <Skeleton className="h-8 w-full" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Start Year</p>
                    <Skeleton className="h-8 w-full" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">End Year</p>
                    <Skeleton className="h-8 w-full" />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Work Experience Card Loading State */}
        <Card>
          <CardHeader className="flex items-center gap-2 p-4">
            <Briefcase className="h-5 w-5" />
            <p className="text-md font-bold">Work Experience</p>
          </CardHeader>
          <Separator />
          <CardContent className="p-6 space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Company</p>
                    <Skeleton className="h-8 w-full" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Position</p>
                    <Skeleton className="h-8 w-full" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Start Date</p>
                    <Skeleton className="h-8 w-full" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">End Date</p>
                    <Skeleton className="h-8 w-full" />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Address Card Loading State */}
        <Card>
          <CardHeader className="flex items-center gap-2 p-4">
            <MapPin className="h-5 w-5" />
            <p className="text-md font-bold">Current Address</p>
          </CardHeader>
          <Separator />
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Country</p>
                <Skeleton className="h-8 w-full" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">State</p>
                <Skeleton className="h-8 w-full" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">City</p>
                <Skeleton className="h-8 w-full" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Postal Code</p>
                <Skeleton className="h-8 w-full" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">House Number</p>
                <Skeleton className="h-8 w-full" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Apartment</p>
                <Skeleton className="h-8 w-full" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Street</p>
                <Skeleton className="h-8 w-full" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Region</p>
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfileSettingWhileLoading;