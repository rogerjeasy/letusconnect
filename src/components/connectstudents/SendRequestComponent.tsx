"use client";
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { sendConnectionRequest } from "@/services/connection.service";
import { handleError } from "@/helpers/api";
import { Time } from "@internationalized/date";
import { SentRequest } from "@/store/userConnections";
import { useUserStore } from "@/store/userStore";
import { useRouter, usePathname } from "next/navigation";

interface SendRequestComponentProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  targetUid: string;
  targetUsername?: string;
  onRequestSent?: (request: SentRequest) => void;
  onRequestComplete?: () => void;
}

const SendRequestComponent: React.FC<SendRequestComponentProps> = ({
  isOpen,
  onOpenChange,
  targetUid,
  targetUsername = "",
  onRequestSent,
  onRequestComplete
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const currentUser = useUserStore(state => state.user);

  const handleRedirectToLogin = () => {
    // Encode the current path to handle special characters
    const returnUrl = encodeURIComponent(pathname);
    router.push(`/login?returnUrl=${returnUrl}`);
  };

  const handleSendRequest = async () => {
    if (!currentUser) {
      setIsLoginDialogOpen(true);
      return;
    }

    setLoading(true);
    try {
      await sendConnectionRequest(targetUid, message);
     
      const now = new Date();
      const newRequest: SentRequest = {
        toUid: targetUid,
        sentAt: now.toISOString(),
        message: message,
        status: 'pending',
        accepted: {
          hour: now.getHours(),
          minute: now.getMinutes(),
          second: now.getSeconds()
        } as Time
      };
      onRequestSent?.(newRequest);
      toast.success("Connection request sent successfully!");
     
      handleClose();
      onRequestComplete?.();
    } catch (error) {
      toast.error("Failed to send connection request. " + handleError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setMessage("");
    onOpenChange(false);
  };

  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
        <AlertDialogContent className="w-[95%] sm:w-[85%] md:w-[65%] lg:w-[50%] xl:w-[40%] p-4 sm:p-6 md:p-8 gap-4 sm:gap-6">
          <AlertDialogHeader className="space-y-2 sm:space-y-3">
            <AlertDialogTitle className="text-lg sm:text-xl md:text-2xl">
              Send Connection Request {targetUsername}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm sm:text-base">
              Add a personal message to your connection request (optional)
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[100px] my-2 sm:my-4 text-sm sm:text-base"
          />
          <AlertDialogFooter className="sm:space-x-2 flex flex-col sm:flex-row gap-2 sm:gap-0 mt-2 sm:mt-4">
            <AlertDialogCancel
              onClick={handleClose}
              className="w-full sm:w-auto"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSendRequest}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? "Sending..." : "Send Request"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Login Dialog */}
      <AlertDialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
        <AlertDialogContent className="w-[95%] sm:w-[85%] md:w-[65%] lg:w-[50%] xl:w-[40%] p-4 sm:p-6 md:p-8 gap-4 sm:gap-6">
          <AlertDialogHeader className="space-y-2 sm:space-y-3">
            <AlertDialogTitle className="text-lg sm:text-xl md:text-2xl">
              Login Required
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm sm:text-base">
              Please login to connect with other users.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:space-x-2 flex flex-col sm:flex-row gap-2 sm:gap-0">
            <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRedirectToLogin}
              className="w-full sm:w-auto"
            >
              Login
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SendRequestComponent;