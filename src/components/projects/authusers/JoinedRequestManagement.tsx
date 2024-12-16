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
import { FaCheck, FaTimes, FaUser, FaUserShield } from "react-icons/fa";
import ModalPopup from "@/components/forms/ModalPopup";
import { api, handleError } from "@/helpers/api";
import { JoinRequest, projectRoles } from "@/store/project";

interface JoinedRequestManagementProps {
  joinRequests: JoinRequest[];
  projectId: string;
  onUpdate: () => void;
}


const JoinedRequestManagement = ({ joinRequests, projectId, onUpdate }: JoinedRequestManagementProps) => {
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
        `/api/projects/${projectId}/join-requests/${selectedRequest.userId}`,
        { 
          action: "accept",
          userId: selectedRequest.userId, 
          role: selectedRole, 
          username: selectedRequest.username,
          email: selectedRequest.email,
          profilePicture: selectedRequest.profilePicture,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      onUpdate();
      setShowRoleModal(false);
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
        `/api/projects/${projectId}/join-requests/${selectedRequest.userId}`,
        { action: "reject" },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      onUpdate();
      setShowRejectModal(false);
    } catch (err) {
      const errorMessage = handleError(err);
      alert("Failed to reject join request. "+errorMessage);
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
                  <Avatar src={request.profilePicture} alt={request.username} />
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
                    onClick={() => {
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
                    onClick={() => {
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
            <Button variant="light" onClick={() => setShowRoleModal(false)}>
              Cancel
            </Button>
            <Button color="success" onClick={handleAccept} isLoading={loading}>
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
        // isLoading={loading}
        showCancelButton
      />
    </div>
  );
};

export default JoinedRequestManagement;