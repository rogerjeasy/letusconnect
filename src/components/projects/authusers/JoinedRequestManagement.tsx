"use client";

import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Avatar,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { FaCheck, FaTimes, FaUserShield } from "react-icons/fa";
import ModalPopup from "@/components/forms/ModalPopup";
import { api, handleError } from "@/helpers/api";
import { JoinRequest, projectRoles } from "@/store/project";
import { lowerCase } from "lodash";
import { API_CONFIG } from "@/config/api.config";

interface JoinedRequestManagementProps {
  joinRequests?: JoinRequest[];
  projectId: string;
  onUpdate: () => void;
  onClose: () => void;
}

const JoinedRequestManagement = ({ joinRequests = [], projectId, onUpdate, onClose }: JoinedRequestManagementProps) => {
  const [selectedRequest, setSelectedRequest] = useState<JoinRequest | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>(projectRoles[0]);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle Accept Request
  const handleAccept = async () => {
    if (!selectedRequest) return;

    setLoading(true);
    try {
      await api.put(
        API_CONFIG.ENDPOINTS.PROJECTS.JOIN_REQUESTS(projectId, selectedRequest.userId),
        {
          action: "accept",
          userId: selectedRequest.userId,
          role: lowerCase(selectedRole),
          username: selectedRequest.username,
          email: selectedRequest.email,
          profilePicture: selectedRequest.profilePicture || "",
        }
      );
      onUpdate();
      setShowRoleModal(false);
      onClose();
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Reject Request
  const handleReject = async () => {
    if (!selectedRequest) return;

    setLoading(true);
    try {
      await api.put(
        API_CONFIG.ENDPOINTS.PROJECTS.JOIN_REQUESTS(projectId, selectedRequest.userId),
        { action: "reject",
          userId: selectedRequest.userId,
          username: selectedRequest.username,
          email: selectedRequest.email

         },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      onUpdate();
      setShowRejectModal(false);
      onClose();
    } catch (err) {
      const errorMessage = handleError(err);
      alert(`Failed to reject join request. ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Join Requests</h2>
      <Table aria-label="Join Requests Table" className="shadow-md">
        <TableHeader>
          <TableColumn>User Profile</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody emptyContent="No join requests available.">
            {joinRequests.map((request) => (
                <TableRow key={request.userId}>
                <TableCell>
                    <div className="flex items-center gap-4">
                    <Avatar src={request.profilePicture || ""} alt={request.username} />
                    <div>
                        <p className="font-semibold">{request.username}</p>
                        <p className="text-sm text-gray-500">{request.email}</p>
                    </div>
                    </div>
                </TableCell>
                <TableCell>
                    <div className="flex gap-2">
                    <Button
                        color="success"
                        size="sm"
                        startContent={<FaCheck />}
                        onPress={() => {
                        setSelectedRequest(request);
                        setShowRoleModal(true);
                        }}
                    >
                        Accept
                    </Button>
                    <Button
                        color="danger"
                        size="sm"
                        startContent={<FaTimes />}
                        onPress={() => {
                        setSelectedRequest(request);
                        setShowRejectModal(true);
                        }}
                    >
                        Reject
                    </Button>
                    </div>
                </TableCell>
                </TableRow>
            ))}
            </TableBody>

      </Table>

      {/* Modal for Accepting Request and Selecting Role */}
      <Modal isOpen={showRoleModal} onClose={() => setShowRoleModal(false)} size="md">
        <ModalContent>
          <ModalHeader>
            <FaUserShield className="mr-2" /> Assign Role
          </ModalHeader>
          <ModalBody>
            <p>
              Assign a role to <strong>{selectedRequest?.username}</strong>.
            </p>
            <Select
              label="Select Role"
              placeholder="Choose a role"
              selectedKeys={[selectedRole]}
              onSelectionChange={(keys) => setSelectedRole(Array.from(keys)[0] as string)}
            >
              {projectRoles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setShowRoleModal(false)}>
              Cancel
            </Button>
            <Button color="success" onPress={handleAccept} isLoading={loading}>
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal for Rejecting Request */}
      <ModalPopup
        isOpen={showRejectModal}
        title="Confirm Rejection"
        content={`Are you sure you want to reject the join request from ${selectedRequest?.username}?`}
        confirmLabel="Reject"
        confirmColor="danger"
        cancelLabel="Cancel"
        onConfirm={handleReject}
        onCancel={() => setShowRejectModal(false)}
        showCancelButton
      />
    </div>
  );
};

export default JoinedRequestManagement;