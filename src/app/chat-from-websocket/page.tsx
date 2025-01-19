"use client";

import LoadingPage from "@/components/loadingpage/LoadingPage";

export default function ChatFromWebsocketPage() {
  return (
    <LoadingPage />
  );
}

// import ChatInterfaceWebsocket from "@/components/websocket/ChatInterface";

// export default function ChatFromWebsocketPage() {
//   return (
//     <div className="flex h-[calc(100vh-4rem)] bg-background">
//       <ChatInterfaceWebsocket />
//     </div>
//   );
// }