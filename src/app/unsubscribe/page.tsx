"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { handleError } from "@/helpers/api";
import ModalPopup from "@/components/forms/ModalPopup";
import { Button, Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
import { unsubscribeFromNewsletter } from "@/services/newsletter.service";

const UnsubscribePageContent: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    setEmail(emailParam);
  }, [searchParams]);

  const handleUnsubscribe = async () => {
    if (!email) return;

    setStatus("loading");
    setMessage("");
    setIsModalOpen(false);

    try {
      await unsubscribeFromNewsletter(email);
      setStatus("success");
      setMessage("✅ You have successfully unsubscribed from the newsletter.");
      setIsModalOpen(true);
    } catch (error) {
      const errorMessage = handleError(error);
      setStatus("error");
      setMessage(errorMessage || "❌ Failed to unsubscribe. Please try again.");
      setIsModalOpen(true);
    }
  };

  const handleCloseSuccess = () => {
    router.push("/");
  };

  const handleRetryOrContact = () => {
    if (status === "error") {
      handleUnsubscribe();
    }
  };

  const handleModalCancel = () => {
    if (status === "error") {
      router.push("/contact-us");
    } else {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-2xl rounded-lg">
        <CardHeader className="flex justify-center bg-red-500 text-white py-6 rounded-t-lg">
          <h2 className="text-2xl font-bold">Unsubscribe</h2>
        </CardHeader>
        <CardBody className="p-6 text-center">
          <p className="text-gray-700 mb-6">
            {email
              ? `Are you sure you want to unsubscribe from our newsletter?`
              : "Invalid request. Email not provided."}
          </p>
          <p className="font-semibold">{email}</p>
          {email && (
            <div className="mt-6 space-x-4">
              <Button
                color="danger"
                onPress={handleUnsubscribe}
                isDisabled={status === "loading"}
              >
                {status === "loading" ? "Unsubscribing..." : "Yes, Unsubscribe"}
              </Button>
              <Button color="default" variant="light" onPress={() => router.push("/")}>
                Cancel
              </Button>
            </div>
          )}
        </CardBody>
        <CardFooter className="text-center py-4">
          {status === "loading" && <p className="text-gray-600 text-sm">Processing...</p>}
        </CardFooter>
      </Card>

      {/* Modal Popup */}
      <ModalPopup
        isOpen={isModalOpen}
        title={status === "success" ? "✅ Unsubscribed Successfully" : "❌ Unsubscription Failed"}
        content={
          status === "success"
            ? "You have successfully unsubscribed from our newsletter."
            : "We couldn't process your request at the moment. Would you like to retry or visit our contact-us page?"
        }
        confirmLabel={status === "success" ? "OK" : "Retry"}
        onConfirm={status === "success" ? handleCloseSuccess : handleRetryOrContact}
        confirmColor={status === "success" ? "success" : "danger"}
        showCancelButton={status === "error"}
        cancelLabel="Contact Us"
        onCancel={handleModalCancel}
        cancelColor="secondary"
      />
    </div>
  );
};

// Wrap the main component in a Suspense boundary
const UnsubscribePage: React.FC = () => {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <UnsubscribePageContent />
    </Suspense>
  );
};

export default UnsubscribePage;