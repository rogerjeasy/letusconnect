"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { sendChatMessage } from "@/services/chatgpt.service";

export default function NotFound() {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchChatResponse = async () => {
      setLoading(true);

      const currentPath = window.location.pathname;

      try {
        const response = await sendChatMessage(
          `Generate a helpful response for the 404 page for the path: ${currentPath}`
        );

        setMessage(response.response); 
      } catch (error) {
        console.error("Error fetching chat response:", error);
        setMessage("Sorry, we couldn't fetch a helpful response at this time.");
      } finally {
        setLoading(false);
      }
    };

    fetchChatResponse();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-xl p-8 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">404</h2>
        {loading ? (
          <p className="text-xl text-gray-600 mb-8">Loading a helpful response...</p>
        ) : (
          <p className="text-xl text-gray-600 mb-8">{message}</p>
        )}
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
