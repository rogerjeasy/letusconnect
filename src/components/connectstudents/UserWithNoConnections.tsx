"use client";
import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Users, UserPlus, UserCheck, Network, Clock } from "lucide-react";
import { User, useUserStore } from "@/store/userStore";
import SendRequestComponent from './SendRequestComponent';

import { toast } from "react-toastify";
import { ConnectionRequestResponse, SentRequest } from "@/store/userConnections";
import { getConnectionRequests } from "@/services/connection.service";
import { handleError } from "@/helpers/api";

interface UserWithNoConnectionsPageProps {
  user: User | null | undefined;
  onRequestComplete?: () => void;
}

const UserWithNoConnectionsPage: React.FC<UserWithNoConnectionsPageProps> = ({
  user,
  onRequestComplete
}) => {
  const router = useRouter();
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const username = user?.username || "This user";
  const profileUrl = user?.uid ? `/profile/${user.uid}` : "/users-directory";
  const currentUser = useUserStore((state) => state.user);
  const [sentRequestIDs, setSentRequestIDs] = useState<string[]>([]);
  const myUid = currentUser?.uid;
  const [hasPendingRequest, setHasPendingRequest] = useState(false);

  const handleRequestSent = (request: SentRequest) => {
    // toast.success(`Connection request sent to ${username}!`);
  };

  const fetchMyConnections = useCallback(async () => {
    if (!myUid) return;
    try {
      const response = await getConnectionRequests(myUid);
      const userConnections: ConnectionRequestResponse = response;
      const sentRequestKeys = Object.keys(userConnections.sentRequests);
      setSentRequestIDs(sentRequestKeys);
    } catch (error) {
      handleError(error);
    }
  }, [myUid]);

  useEffect(() => {
    if (!myUid) {
      return;
    }
    fetchMyConnections();
  }, [myUid, fetchMyConnections]);

  useEffect(() => {
    if (user?.uid && sentRequestIDs.length > 0) {
      const hasRequest = sentRequestIDs.includes(user.uid);
      setHasPendingRequest(hasRequest);
    }
  }, [user?.uid, sentRequestIDs]);

  const handleConnectClick = () => {
    if (!user?.uid) {
      toast.error("Cannot send request: User information is missing");
      return;
    }
    setIsRequestModalOpen(true);
  };

  const renderConnectionStatus = () => {
    if (hasPendingRequest || (user?.uid && sentRequestIDs.includes(user.uid))) {
      return (
        <div className="bg-yellow-50 rounded-xl p-6 text-center border border-yellow-100">
          <div className="flex flex-col items-center gap-4">
            <div className="p-3 bg-yellow-100/50 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-gray-700 font-medium mb-2">
                Connection Request Pending
              </p>
              <p className="text-gray-600 text-sm">
                You've already sent a connection request to {username}. Please wait for their response.
              </p>
            </div>
            <div>
              <Button
                size="lg"
                className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-white font-medium
                          hover:from-yellow-600 hover:to-yellow-500 transform hover:scale-[1.02] transition-all
                          shadow-lg hover:shadow-xl"
                onPress={() => router.push("/connections?status=sent")}
              >
                {/* <Clock className="h-5 w-5 mr-2" /> */}
                View Sent Requests
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl p-6 text-center border border-blue-100">
        <div className="flex flex-col items-center gap-4">
          <div className="p-3 bg-blue-100/50 rounded-full">
            <Network className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-gray-700 font-medium mb-2">
              Be the First to Connect!
            </p>
            <p className="text-gray-600 text-sm">
              Want to be one of {username}&apos;s first connections?
            </p>
          </div>
          {user?.uid && (
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium
                        hover:from-blue-700 hover:to-blue-600 transform hover:scale-[1.02] transition-all
                        shadow-lg hover:shadow-xl w-full sm:w-auto"
              onPress={handleConnectClick}
            >
              <UserCheck className="h-5 w-5 mr-2" />
              Send Connection Request
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="min-h-[50vh] bg-gradient-to-b from-white to-blue-50/50 py-8 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-2xl mx-auto shadow-xl hover:shadow-2xl transition-all duration-300 border-none">
          <CardHeader className="text-center pb-2 pt-8">
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-100 rounded-full blur-2xl opacity-70" />
                <div className="bg-white/50 p-4 rounded-full backdrop-blur-sm">
                  <Users className="h-16 w-16 text-blue-600 relative animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  No Connections Yet
                </CardTitle>
                <p className="text-gray-600 text-base sm:text-lg px-4">
                  {username} hasn&apos;t made any connections on the platform yet
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-8">
            <div className="space-y-6">
              {renderConnectionStatus()}
              
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 font-medium border-2 border-blue-200
                              hover:bg-blue-50 transform hover:scale-[1.02] transition-all"
                    onPress={() => router.push(profileUrl)}
                  >
                    <UserPlus className="h-5 w-5 mr-2" />
                    View Full Profile
                  </Button>
                  <Button
                    size="lg"
                    variant="bordered"
                    className="border-blue-200 text-blue-600 font-medium hover:bg-blue-50 transition-all"
                    onPress={() => router.push("/users-directory")}
                  >
                    Browse Other Users
                  </Button>
                </div>
                
                <div className="text-center mt-6">
                  <Badge 
                    variant="outline" 
                    className="text-sm py-2 px-4 border-blue-200 text-gray-600 bg-blue-50/30"
                  >
                    Growing your network opens new opportunities
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Send Request Modal */}
      {user?.uid && (
        <SendRequestComponent
          isOpen={isRequestModalOpen}
          onOpenChange={setIsRequestModalOpen}
          targetUid={user.uid}
          targetUsername={username}
          onRequestSent={handleRequestSent}
          onRequestComplete={onRequestComplete}
        />
      )}
    </>
  );
};

export default UserWithNoConnectionsPage;