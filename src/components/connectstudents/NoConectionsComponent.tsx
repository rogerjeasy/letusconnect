"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";

const NoConnectionsPage: React.FC = () => {
  const router = useRouter();

  return (
    <div className="container mx-auto p-8 flex flex-col items-center justify-center h-screen">
      <Card className="max-w-md w-full text-center shadow-md">
        <CardHeader>
          <div className="flex flex-col items-center gap-4">
            <Users className="h-16 w-16 text-blue-500" />
            <CardTitle className="text-2xl font-bold text-gray-800">No Connections Found</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            It looks like you have not made any connections yet. Start networking and grow your circle!
          </p>
          <div className="flex flex-col gap-3">
            <Button
              size="lg"
              className="bg-blue-600 text-white hover:bg-blue-700"
              onPress={() => router.push("/users-directory")}
            >
              Find Connections
            </Button>
            <Badge variant="outline" className="text-gray-600">
              Discover users in your field, send requests, and build your professional network.
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NoConnectionsPage;
