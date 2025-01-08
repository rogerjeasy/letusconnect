"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { sendChatMessage } from "@/services/chatgpt.service";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { HomeIcon, AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { Spinner } from "@nextui-org/react";

export default function NotFound() {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const currentUser = useUserStore((state) => state.user);

  useEffect(() => {
    const fetchChatResponse = async () => {
      setLoading(true);
      setError(false);
      const currentPath = window.location.pathname;
     
      try {
        const conversation = await sendChatMessage(
          `Generate a helpful response for the 404 page for the path: ${currentPath}`
        );
        
        const latestMessage = conversation.messages[conversation.messages.length - 1];
        setMessage(latestMessage.response);
      } catch (error) {
        console.error("Error fetching chat response:", error);
        setError(true);
        setMessage("We couldn't generate a custom message at this time.");
      } finally {
        setLoading(false);
      }
    };

    fetchChatResponse();
  }, []);


  const homePath = currentUser ? "/dashboard" : "/";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-2xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative flex flex-col items-center"
            >
              <Spinner size="lg" className="text-blue-600" />
              <p className="text-gray-600 animate-pulse mt-4">Loading custom message...</p>
            </motion.div>
          </div>
        ) : (
          <>
            <CardHeader>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center"
              >
                <span className="text-8xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  404
                </span>
                <h2 className="text-2xl font-semibold mt-4 text-gray-800">
                  Page Not Found
                </h2>
              </motion.div>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6">
              {error ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              ) : (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-lg text-center text-gray-600"
                >
                  {message}
                </motion.p>
              )}
            </CardContent>
            <CardFooter className="flex justify-center gap-4 pb-8">
              <Link href={homePath} className="contents">
                <Button variant="default" size="lg" className="gap-2">
                  <HomeIcon className="h-4 w-4" />
                  <span>{currentUser ? "Go to Dashboard" : "Return Home"}</span>
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="gap-2"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Go Back</span>
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}