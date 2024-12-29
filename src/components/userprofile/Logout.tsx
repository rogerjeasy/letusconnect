"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { useUserStore } from "../../store/userStore";
import { useRouter } from "next/navigation";

type LogoutProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

export default function Logout({ isOpen, onClose, onConfirm }: LogoutProps) {
  const { user } = useUserStore();

  if (!user) return null;

  const handleLogoutConfirm = async () => {
    try {
      await onConfirm();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      backdrop="opaque"
      classNames={{
        backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
      }}
    >
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1 text-center">
            Confirm Logout
          </ModalHeader>
          <ModalBody>
            <p className="text-center">
              Are you sure you want to log out? You will need to log in again to access your account.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              variant="light"
              onPress={onClose}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button 
              color="danger" 
              onPress={handleLogoutConfirm}
            >
              Log Out
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
}