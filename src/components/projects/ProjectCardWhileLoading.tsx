"use client";

import React from "react";
import { Card, CardHeader, CardBody, CardFooter, Skeleton, Avatar, Button } from "@nextui-org/react";

const ProjectCardWhileLoading: React.FC = () => {
  return (
    <Card className="w-85 h-85 flex flex-col justify-between shadow-lg relative overflow-visible p-4">
      {/* Card Header with Avatar Placeholder */}
      <CardHeader className="flex items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-full">
          <Avatar className="w-12 h-12" />
        </Skeleton>
        <div className="flex-1 space-y-2">
          <Skeleton className="w-3/5 h-4 rounded-lg" />
          <Skeleton className="w-2/5 h-3 rounded-lg" />
        </div>
      </CardHeader>

      {/* Card Body with Text Placeholders */}
      <CardBody className="flex-grow space-y-3">
        <Skeleton className="h-4 w-full rounded-lg" />
        <Skeleton className="h-4 w-4/5 rounded-lg" />
        <Skeleton className="h-4 w-3/5 rounded-lg" />
        <Skeleton className="h-4 w-2/5 rounded-lg" />
        <Skeleton className="h-4 w-full rounded-lg" />
      </CardBody>

      {/* Card Footer with Button Placeholders */}
      <CardFooter className="flex gap-2">
        <Skeleton className="w-1/2 h-10 rounded-lg">
          <Button disabled className="w-full" />
        </Skeleton>
        <Skeleton className="w-1/3 h-10 rounded-lg">
          <Button disabled className="w-full" />
        </Skeleton>
      </CardFooter>
    </Card>
  );
};

export default ProjectCardWhileLoading;