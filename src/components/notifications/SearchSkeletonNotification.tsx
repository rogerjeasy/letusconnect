"use client";

import React from 'react';
import { Card, CardBody } from "@nextui-org/react";
import { Skeleton } from "@/components/ui/skeleton";

const SearchAndFilterSkeleton = () => {
  return (
    <div className="flex flex-col gap-8">
      <div className="mx-auto pt-16 w-full">
        <Card className="p-6 shadow-lg relative">
          {/* Stats Skeleton */}
          <div className="md:absolute md:top-4 md:left-4 md:z-20 w-full md:w-auto md:max-w-xs mb-6 md:mb-0">
            <Card className="p-4 bg-gray-50">
              <div className="space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <div className="flex justify-between gap-4">
                  <Skeleton className="h-10 w-20" />
                  <Skeleton className="h-10 w-20" />
                  <Skeleton className="h-10 w-20" />
                </div>
              </div>
            </Card>
          </div>

          {/* Settings Icon Skeleton */}
          <Skeleton className="absolute top-4 right-4 w-10 h-10 rounded-full" />

          <CardBody>
            <div className="md:mt-0">
              {/* Title Skeleton */}
              <div className="flex justify-center mb-6">
                <Skeleton className="h-8 w-64" />
              </div>

              {/* Search Bar Skeleton */}
              <div className="flex justify-center mb-6">
                <Skeleton className="h-12 w-full md:w-2/3 lg:w-1/2" />
              </div>

              {/* Filter Buttons Skeleton */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
                <Skeleton className="h-10 w-full sm:w-40" />
                <Skeleton className="h-10 w-full sm:w-40" />
                <Skeleton className="h-10 w-full sm:w-40" />
              </div>

              {/* Action Buttons Skeleton */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                <Skeleton className="h-10 w-full sm:w-32" />
                <Skeleton className="h-10 w-full sm:w-32" />
              </div>

              {/* Notification Groups Skeleton */}
              <div className="w-full mt-8 space-y-6">
                {[1, 2, 3].map((index) => (
                  <div key={index} className="space-y-4">
                    {/* Date Header */}
                    <Skeleton className="h-6 w-40" />
                    
                    {/* Notification Cards */}
                    <div className="space-y-4">
                      {[1, 2].map((cardIndex) => (
                        <Card key={cardIndex} className="w-full">
                          <CardBody className="p-4">
                            <div className="flex flex-col space-y-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  {/* Avatar */}
                                  <Skeleton className="h-12 w-12 rounded-full" />
                                  {/* Title and Time */}
                                  <div className="space-y-2">
                                    <Skeleton className="h-4 w-48" />
                                    <Skeleton className="h-3 w-24" />
                                  </div>
                                </div>
                                {/* Action Buttons */}
                                <div className="flex space-x-2">
                                  <Skeleton className="h-8 w-20" />
                                  <Skeleton className="h-8 w-20" />
                                </div>
                              </div>
                              {/* Content */}
                              <Skeleton className="h-4 w-3/4" />
                            </div>
                          </CardBody>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default SearchAndFilterSkeleton;