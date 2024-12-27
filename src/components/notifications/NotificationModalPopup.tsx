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
import {
  FaEnvelope,
  FaCalendar,
  FaBell,
  FaExclamation,
  FaCog,
} from "react-icons/fa";

interface NotificationModalPopupProps {
  isOpen: boolean;
  notification: {
    id: string;
    title: string;
    content: string;
    type: string;
    time: string;
    priority: string;
  };
  onClose: () => void;
  onAction: (id: string, action: string) => void;
}

export default function NotificationModalPopup({
  isOpen,
  notification,
  onClose,
  onAction,
}: NotificationModalPopupProps) {
  const { id, title, content, type, time, priority } = notification;

  const getIconForType = (type: string) => {
    switch (type) {
      case "message":
        return <FaEnvelope className="text-blue-500" />;
      case "event":
        return <FaCalendar className="text-green-500" />;
      case "reminder":
        return <FaBell className="text-yellow-500" />;
      case "system":
        return <FaCog className="text-gray-500" />;
      case "custom":
        return <FaExclamation className="text-red-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

  const renderActions = () => {
    switch (type) {
      case "message":
        return (
          <Button color="primary" onPress={() => onAction(id, "reply")}>
            Reply
          </Button>
        );
      case "event":
        return (
          <Button color="success" onPress={() => onAction(id, "join")}>
            Join Event
          </Button>
        );
      case "reminder":
        return (
          <Button color="warning" onPress={() => onAction(id, "snooze")}>
            Snooze
          </Button>
        );
      case "system":
        return (
          <Button color="default" onPress={() => onAction(id, "dismiss")}>
            Dismiss
          </Button>
        );
      case "custom":
        return (
          <Button color="secondary" onPress={() => onAction(id, "view-details")}>
            View Details
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      backdrop="opaque"
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
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
        <ModalHeader className="flex flex-col gap-1 text-center">
          <div className="flex items-center gap-2">
            <Avatar
              icon={getIconForType(type)}
              size="lg"
              className="flex-shrink-0 bg-gray-100 text-center p-2 rounded-full text-2xl"
            />
            <h3 className="text-lg font-bold">{title}</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <p className="text-gray-600 mb-4">{content}</p>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Type: {type}</p>
            <p className="text-sm text-gray-500">Priority: {priority}</p>
            <p className="text-sm text-gray-500">Received: {time}</p>
          </div>
        </ModalBody>
        <ModalFooter>
          {renderActions()}
          <Button color="danger" variant="light" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
