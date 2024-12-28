"use client";

import React, { useState, useEffect } from "react";
import { Spinner, Button } from "@nextui-org/react";

const SessionCheck = ({ onRetry }: { onRetry: () => void }) => {
  const [isTakingLong, setIsTakingLong] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsTakingLong(true);
    }, 5000); // Timeout for feedback

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="relative flex items-center justify-center min-h-screen w-full bg-gray-100">
      {/* Content */}
      <div className="relative z-10 text-gray-800 text-center px-4">
        {/* Header */}
        <div className="mb-6 flex flex-col items-center">
          <h1 className="text-3xl font-bold text-blue-600">Let Us Connect</h1>
        </div>

        {/* Message */}
        <p className="text-lg mb-8">Checking your session, please wait...</p>

        {/* Loading Indicator */}
        <Spinner size="lg" color="primary" className="mb-8" />

        {/* Footer */}
        {!isTakingLong && (
          <p className="text-sm text-gray-600">Your patience is appreciated!</p>
        )}

        {/* Timeout Feedback */}
        {isTakingLong && (
          <div className="mt-8">
            <p className="text-sm mb-4 text-red-600">This is taking longer than expected.</p>
            <div className="flex flex-col items-center gap-4">
              <Button onClick={onRetry} color="primary">
                Retry
              </Button>
              <Button
                color="primary"
                onClick={() => (window.location.href = "/support")}
              >
                Contact Support
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionCheck;

