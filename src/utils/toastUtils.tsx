import React from "react";
import { toast } from "react-toastify";

/**
 * Function to display a custom toast notification for a message.
 * @param message - The message content to display.
 * @param sender - The sender's name.
 * @param senderAvatar - The sender's avatar URL.
 */
const displayMessageToast = (message: string, sender: string, senderAvatar: string) => {
  toast(
    <div className="flex items-start">
      <img
        src={senderAvatar}
        alt={sender}
        className="h-10 w-10 rounded-full mr-3"
      />
      <div>
        <p className="font-medium text-gray-900">{sender}</p>
        <p className="text-sm text-gray-500">{message}</p>
      </div>
    </div>,
    {
      className: "bg-white shadow-lg rounded-lg p-4 flex items-center",
    //   bodyClassName: "text-sm",
      closeButton: false,
    }
  );
};

export default displayMessageToast;