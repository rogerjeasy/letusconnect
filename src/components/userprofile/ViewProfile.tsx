"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Avatar,
} from "@nextui-org/react";
import { useUserStore } from "../../store/userStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type ViewUserProfileProps = {
    isOpen: boolean;
    onClose: () => void;
  };
  
  export default function ViewUserProfile({ isOpen, onClose }: ViewUserProfileProps) {
  const { user } = useUserStore();
  const router = useRouter();
  const avatarPicture = user?.profilePicture;

  // Protect the page
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  const handleUpdateProfileRoute = () => {
    router.push("/settings");
    };

  return (
    <>
      <Modal
      backdrop="opaque"
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      classNames={{
        backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
      }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              {/* Modal Header */}
              <ModalHeader className="flex flex-col gap-1 text-center">
                <Avatar
                  src={avatarPicture}
                  alt={user?.username || "User Avatar"}
                  size="sm"
                  className="border-2 border-white"
                >
                  {avatarPicture && user?.username?.charAt(0).toUpperCase()}
                </Avatar>
                <h1 className="text-xl font-bold mt-4">
                  {user?.firstName} {user?.lastName || ""}
                </h1>
                <p className="text-sm text-gray-400">{user?.bio || "No bio available."}</p>
              </ModalHeader>

              {/* Modal Body */}
              <ModalBody>
                <div className="flex flex-col gap-2">
                  <p>
                    <strong>Email:</strong> {user?.email}
                  </p>
                  <p>
                    <strong>Username:</strong> {user?.username}
                  </p>
                  <p>
                    <strong>Role:</strong> {user?.role || "N/A"}
                  </p>
                  <p>
                    <strong>Areas of Expertise:</strong>{" "}
                    {user?.areasOfExpertise?.join(", ") || "N/A"}
                  </p>
                  <p>
                    <strong>Interests:</strong> {user?.interests?.join(", ") || "N/A"}
                  </p>
                </div>
              </ModalBody>

              {/* Modal Footer */}
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                Close
                </Button>
                <Button color="primary" onPress={handleUpdateProfileRoute}>
                  Update Profile
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}