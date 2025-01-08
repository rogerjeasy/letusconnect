"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Button,
  Input,
  Spinner,
  Tooltip,
  Pagination,
  Chip,
} from "@nextui-org/react";
import { FaEdit, FaTrash, FaSearch, FaBan } from "react-icons/fa";
import ModalPopup from "@/components/forms/ModalPopup";
import { api, handleError } from "@/helpers/api";
import AccessDenied from "@/components/accessdenied/AccessDenied";
import { useUserStore } from "@/store/userStore";
import { User } from "@/store/userStore";
import { getAllUsers } from "@/services/users.services";
import GeneratePDF from "@/components/utils/GeneratePDF";

export default function UserAdmin() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { user, isAuthenticated } = useUserStore();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllUsers();
      setUsers(response);
      setFilteredUsers(response);
    } catch (error) {
      const errorMessage = handleError(error);
      console.error("Error fetching users:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = users.filter(
      (user) =>
        user.username.toLowerCase().includes(value.toLowerCase()) ||
        user.email.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await api.delete(`/api/users/${userToDelete}`);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (error) {
      const errorMessage = handleError(error);
      console.error("Error deleting user:", errorMessage);
    }
  };

  const openDeleteModal = (id: string) => {
    setUserToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (!isAuthenticated || !user?.role?.includes("admin")) {
    return <AccessDenied condition={true} message="Access Denied: Admin privileges required." />;
  }

  return (
    <div className="pt-24 md:pt-28 px-4 md:px-8"> {/* Added top padding and horizontal padding */}
      <h2 className="text-3xl font-bold mb-6 text-center">User Management</h2>

      <div className="flex justify-between items-center mb-6 gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search users..."
            startContent={<FaSearch />}
            value={searchTerm}
            onChange={handleSearch}
            className="w-full max-w-md"
          />
        </div>
        <div className="flex items-center">
          <Tooltip content="Generate PDF Report">
            <GeneratePDF />
          </Tooltip>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableColumn>USERNAME</TableColumn>
            <TableColumn>FULL NAME</TableColumn>
            <TableColumn>EMAIL</TableColumn>
            <TableColumn>ROLE</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody>
            {paginatedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  <FaBan className="text-6xl text-gray-400 mb-4" />
                  <p className="text-gray-500">No users found</p>
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((user) => (
                <TableRow key={user.uid || user.email || `${user.username}-${user.email}`}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.role.map((r) => (
                      <Chip
                        key={`${user.uid}-${r}`}
                        color={r === "admin" ? "danger" : "default"}
                        className="mr-1"
                      >
                        {r}
                      </Chip>
                    ))}
                  </TableCell>
                  <TableCell>
                    <Tooltip content={user.isActive === true ? "Active User" : "Inactive User"}>
                      <Chip color={user.isActive === true ? "success" : "danger"}>
                        {user.isActive === true ? "Active" : "Inactive"}
                      </Chip>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Tooltip content="Edit User">
                        <Button isIconOnly color="warning" variant="light">
                          <FaEdit />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Delete User">
                        <Button
                          isIconOnly
                          color="danger"
                          variant="light"
                          onClick={() => openDeleteModal(user.uid || user.email || "")}
                        >
                          <FaTrash />
                        </Button>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}

      <div className="flex justify-center mt-6">
        <Pagination
          total={totalPages}
          initialPage={1}
          page={currentPage}
          onChange={setCurrentPage}
          color="primary"
        />
      </div>

      <ModalPopup
        isOpen={isDeleteModalOpen}
        title="Confirm Deletion"
        content="Are you sure you want to delete this user? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmColor="danger"
        cancelColor="default"
        showCancelButton={true}
        onConfirm={handleDeleteUser}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}