"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

interface ModalPopupProps {
  isOpen: boolean;
  title?: string;
  content?: string | JSX.Element;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmColor?: "primary" | "success" | "warning" | "danger";
  cancelColor?: "default" | "secondary" | "danger";
  showCancelButton?: boolean; // New prop to control Cancel button visibility
}

export default function ModalPopup({
  isOpen,
  title = "Modal Title",
  content = "Default content goes here.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  confirmColor = "primary",
  cancelColor = "default",
  showCancelButton = false, // Default to false
}: ModalPopupProps) {
  return (
    <Modal
      backdrop="opaque"
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onCancel?.();
        }
      }}
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          },
        },
      }}
    >
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1 text-center">{title}</ModalHeader>
          <ModalBody>
            {typeof content === "string" ? <p>{content}</p> : content}
          </ModalBody>
          <ModalFooter>
            {showCancelButton && (
              <Button
                color={cancelColor}
                variant="light"
                onPress={onCancel}
              >
                {cancelLabel}
              </Button>
            )}
            {confirmLabel && (
              <Button
                color={confirmColor}
                onPress={onConfirm}
              >
                {confirmLabel}
              </Button>
            )}
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
}