import Pusher from "pusher-js";
import { getDomain } from "./getDomain";


export const getPusherInstance = () => {
  if (typeof window !== "undefined") {
    return new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      authEndpoint: `${getDomain()}/api/pusher/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      },
    });
  }
  return null;
};