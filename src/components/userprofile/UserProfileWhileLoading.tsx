"use client";

import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const UserProfileWhileLoading = () => {
 return (
   <div className="container mx-auto p-4 space-y-6">
     <Card className="w-full max-w-4xl mx-auto mt-10">
       <CardHeader className="flex flex-col items-center text-center pb-4">
         <Skeleton className="h-24 w-24 rounded-full" />
         <div className="space-y-4 w-full mt-4">
           <Skeleton className="h-8 w-64 mx-auto" />
           <Skeleton className="h-6 w-48 mx-auto" />
           <div className="flex justify-center gap-4">
             <Skeleton className="h-5 w-32" />
             <Skeleton className="h-5 w-32" />
           </div>
         </div>
       </CardHeader>

       <CardContent className="space-y-4">
         {[...Array(5)].map((_, i) => (
           <Card key={i} className="mb-6">
             <CardHeader>
               <Skeleton className="h-6 w-32" />
             </CardHeader>
             <CardContent className="space-y-2">
               <Skeleton className="h-4 w-full" />
               <Skeleton className="h-4 w-3/4" />
               <div className="flex flex-wrap gap-2">
                 {[...Array(4)].map((_, j) => (
                   <Skeleton key={j} className="h-6 w-24" />
                 ))}
               </div>
             </CardContent>
           </Card>
         ))}
       </CardContent>
     </Card>
   </div>
 );
};

export default UserProfileWhileLoading;