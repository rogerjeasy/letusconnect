"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Users, UserPlus, Search, Network } from "lucide-react";

const NoConnectionsPage: React.FC = () => {
  const router = useRouter();

  const features = [
    {
      icon: <Search className="h-5 w-5" />,
      text: "Find professionals in your industry"
    },
    {
      icon: <UserPlus className="h-5 w-5" />,
      text: "Connect with like-minded individuals"
    },
    {
      icon: <Network className="h-5 w-5" />,
      text: "Build your professional network"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-2xl mx-auto shadow-xl hover:shadow-2xl transition-all duration-300 border-none">
        <CardHeader className="text-center pb-2 pt-8">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-100 rounded-full blur-xl opacity-70 animate-pulse" />
              <Users className="h-20 w-20 text-blue-600 relative animate-bounce-slow" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Start Building Your Network
              </CardTitle>
              <p className="text-gray-600 text-lg">
                Your professional journey begins with meaningful connections
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-8">
          <div className="space-y-8">
            {/* Features Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-lg bg-blue-50/50 hover:bg-blue-100/50 transition-colors duration-300"
                >
                  <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                    {feature.icon}
                  </div>
                  <p className="text-sm text-gray-700">{feature.text}</p>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium 
                          hover:from-blue-700 hover:to-blue-600 transform hover:scale-[1.02] transition-all 
                          duration-300 h-12"
                onPress={() => router.push("/users-directory")}
              >
                <Search className="h-5 w-5 mr-2" />
                Explore Connections
              </Button>

              <div className="text-center">
                <Badge 
                  variant="outline" 
                  className="text-sm py-2 px-4 border-blue-200 text-gray-600 bg-blue-50/30"
                >
                  Join thousands of professionals growing their network every day
                </Badge>
              </div>

              <p className="text-center text-sm text-gray-500 mt-4">
                Finding the right connections can open up new opportunities for growth and collaboration
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NoConnectionsPage;
