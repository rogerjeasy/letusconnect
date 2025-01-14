// components/faqs/FAQsAdmin.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Input,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  Tooltip,
  Textarea,
  Card,
  Pagination,
  CardBody,
  Select,
  SelectItem,
} from "@nextui-org/react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaExclamationCircle,
  FaBoxOpen,
  FaTags,
  FaListAlt,
} from "react-icons/fa";
import { useUserStore } from "../../store/userStore";
import AccessDenied from "@/components/accessdenied/AccessDenied";
import { extractDateAndTime } from "../utils/dateUtils";
import { faqCategories } from "../dropdownoptions/faqCategories";
import ModalPopup from "../forms/ModalPopup";
import { createFAQ, deleteFAQ, getAllFAQs, updateFAQ } from "@/services/faq.service";
import { toast } from "react-toastify";
import { handleError } from "@/helpers/api";
import { getCategoryLabel } from "../dropdownoptions/faqCategories";
import { FAQ } from "@/store/faq";

interface FormErrors {
  category?: string;
  question?: string;
  response?: string;
}

export default function FAQsAdmin() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>([]);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFAQ, setNewFAQ] = useState({ question: "", response: "", category: "" });
  const { user, isAuthenticated } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  useEffect(() => {
    fetchFAQs();
  }, [isAuthenticated, user]);

  const fetchFAQs = async () => {
    setLoading(true);
    try {
      const fetchedFaqs = await getAllFAQs();
      setFaqs(fetchedFaqs || []);
      setFilteredFaqs(fetchedFaqs || []);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      setFaqs([]);
      setFilteredFaqs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = faqs.filter((faq) =>
      faq.question.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredFaqs(filtered);
    setCurrentPage(1);
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    if (!newFAQ.category) {
      errors.category = "Category is required";
    }
    
    if (!newFAQ.question?.trim()) {
      errors.question = "Question is required";
    }
    
    if (!newFAQ.response?.trim()) {
      errors.response = "Response is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateFAQ = async () => {
    setIsSubmitting(true);
    
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      setLoading(true);
      const faqData = {
        question: newFAQ.question.trim(),
        response: newFAQ.response.trim(),
        category: newFAQ.category
      };
      await createFAQ(faqData);
      setIsModalOpen(false);
      setNewFAQ({ question: "", response: "", category: "" });
      setFormErrors({});
      await fetchFAQs();
      toast.success("FAQ created successfully");
    } catch (error) {
      toast.error("Error creating FAQ:", handleError(error));
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const openEditModal = (faq: FAQ) => {
    setEditingFAQ(faq);
    setIsEditModalOpen(true);
  };

  const handleUpdateFAQ = async () => {
    if (!editingFAQ?.id) return;
    try {
      setLoading(true);
      const updateData = {
        question: editingFAQ.question.trim(),
        response: editingFAQ.response.trim(),
        category: editingFAQ.category
      };

      await updateFAQ(editingFAQ.id, updateData);

      setIsEditModalOpen(false);
      setEditingFAQ(null);
      await fetchFAQs();
      toast.success("FAQ updated successfully");
    } catch (error) {
      console.error("Error updating FAQ:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteFAQ = async (id: string) => {
    try {
      setLoading(true);
      await deleteFAQ(id);
      await fetchFAQs();
      toast.success("FAQ deleted successfully");
    } catch (error) {
      console.error("Error deleting FAQ:", error);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (id: string) => {
    setFaqToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (faqToDelete) {
      await handleDeleteFAQ(faqToDelete);
      setIsDeleteModalOpen(false);
      setFaqToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setFaqToDelete(null);
  };

  const getCategoryStats = () => {
    const categoryCounts: { [key: string]: number } = {};
    faqs.forEach((faq) => {
      categoryCounts[faq.category] = (categoryCounts[faq.category] || 0) + 1;
    });
    return categoryCounts;
  };

  const categoryStats = getCategoryStats();
  const totalCategories = faqs.length;

  // Pagination logic
  const totalPages = Math.ceil(filteredFaqs.length / itemsPerPage);
  const paginatedFaqs = filteredFaqs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (!user?.role?.includes("admin")) {
    return <AccessDenied condition={true} message="Access Denied: Admin privileges required." />;
  }

  return (
    <div className="p-4 md:p-8 pt-24 md:pt-28">
      <h2 className="text-3xl font-bold mb-4 text-center">FAQs Management</h2>

      <ModalPopup
        isOpen={isDeleteModalOpen}
        title="Confirm Deletion"
        content="Are you sure you want to delete this FAQ? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmColor="danger"
        cancelColor="secondary"
        showCancelButton={true}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <div className="flex items-center justify-center mb-6 text-yellow-600">
        <FaExclamationCircle className="mr-2" />
        <p>
          Caution: Admin users can create, edit, and delete FAQs. Please ensure the information
          is accurate before making changes.
        </p>
      </div>

      <div className="flex justify-center mb-6">
        <Button color="success" startContent={<FaPlus />} onPress={() => setIsModalOpen(true)}>
          Create a New FAQ
        </Button>
      </div>

      {/* Create FAQ Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) {
            setFormErrors({});
            setNewFAQ({ question: "", response: "", category: "" });
          }
        }}
        className="max-w-2xl"
      >
        <ModalContent>
          <ModalHeader className="text-center w-full justify-center">
            Create New FAQ
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
            <Select 
              label="Category"
              placeholder="Select a category"
              className="max-w-full"
              selectedKeys={newFAQ.category ? [newFAQ.category] : []}
              onSelectionChange={(keys) => {
                // Since we're using single selection, we can get the first (and only) key
                const selectedKey = Array.from(keys)[0] as string;
                setNewFAQ({ ...newFAQ, category: selectedKey });
                if (formErrors.category) {
                  setFormErrors({ ...formErrors, category: undefined });
                }
              }}
              isRequired
              errorMessage={formErrors.category}
              isInvalid={!!formErrors.category}
            >
              {faqCategories.map((category) => (
                <SelectItem key={category.key} value={category.key}>
                  {category.label}
                </SelectItem>
              ))}
            </Select>
              <Input
                isRequired
                label="Question"
                placeholder="Enter the question"
                value={newFAQ.question}
                onChange={(e) => {
                  setNewFAQ({ ...newFAQ, question: e.target.value });
                  if (formErrors.question) {
                    setFormErrors({ ...formErrors, question: undefined });
                  }
                }}
                errorMessage={formErrors.question}
                isInvalid={!!formErrors.question}
                fullWidth
              />
              <Textarea
                isRequired
                label="Response"
                placeholder="Enter the response"
                value={newFAQ.response}
                onChange={(e) => {
                  setNewFAQ({ ...newFAQ, response: e.target.value });
                  if (formErrors.response) {
                    setFormErrors({ ...formErrors, response: undefined });
                  }
                }}
                errorMessage={formErrors.response}
                isInvalid={!!formErrors.response}
                fullWidth
              />
            </div>
          </ModalBody>
          <ModalFooter className="flex justify-center gap-4">
            <Button 
              color="danger" 
              onPress={() => {
                setIsModalOpen(false);
                setFormErrors({});
                setNewFAQ({ question: "", response: "", category: "" });
              }}
            >
              Cancel
            </Button>
            <Button 
              color="primary" 
              onPress={handleCreateFAQ} 
              isLoading={loading || isSubmitting}
              isDisabled={isSubmitting}
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit FAQ Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onOpenChange={() => setIsEditModalOpen(false)}
        className="max-w-2xl"
      >
        <ModalContent>
          <ModalHeader className="text-center w-full justify-center">
            Edit FAQ
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              <Select 
                label="Category"
                placeholder="Select a category"
                className="max-w-full"
                selectedKeys={editingFAQ?.category ? [editingFAQ.category] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as string;
                  if (editingFAQ) {
                    setEditingFAQ({ ...editingFAQ, category: selectedKey });
                  }
                }}
              >
                {faqCategories.map((category) => (
                  <SelectItem key={category.key} value={category.key}>
                    {category.label}
                  </SelectItem>
                ))}
              </Select>
              <Input
                isRequired
                label="Question"
                placeholder="Enter the question"
                value={editingFAQ?.question || ""}
                onChange={(e) => 
                  setEditingFAQ(editingFAQ ? { ...editingFAQ, question: e.target.value } : null)
                }
                fullWidth
              />
              <Textarea
                isRequired
                label="Response"
                placeholder="Enter the response"
                value={editingFAQ?.response || ""}
                onChange={(e) => 
                  setEditingFAQ(editingFAQ ? { ...editingFAQ, response: e.target.value } : null)
                }
                fullWidth
              />
            </div>
          </ModalBody>
          <ModalFooter className="flex justify-center gap-4">
            <Button color="danger" onPress={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleUpdateFAQ} isLoading={loading}>
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <div className="my-6 flex justify-center">
        <div className="w-full max-w-md">
          <Input
            placeholder="Search FAQs..."
            startContent={<FaSearch />}
            value={searchTerm}
            onChange={handleSearch}
            fullWidth
          />
        </div>
      </div>
          <Table aria-label="FAQs Table" className="border-separate border-spacing-y-2">
            <TableHeader>
              <TableColumn>Created By</TableColumn>
              <TableColumn>Category</TableColumn>
              <TableColumn>Question</TableColumn>
              <TableColumn>Response</TableColumn>
              <TableColumn>Created At</TableColumn>
              <TableColumn>Last Update</TableColumn>
              <TableColumn>Action</TableColumn>
            </TableHeader>
            <TableBody>
            {paginatedFaqs.length === 0 ? (
                <TableRow>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>
                    <div className="flex flex-col items-center justify-center py-10">
                      <FaBoxOpen className="text-6xl text-gray-400 mb-4" />
                      <p className="text-gray-500">No FAQs available</p>
                    </div>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
              ) : (
                paginatedFaqs.map((faq) => (
                  <TableRow key={faq.id}>
                    <TableCell>{faq.username}</TableCell>
                    <TableCell>{getCategoryLabel(faq.category)}</TableCell>
                    <TableCell>{faq.question}</TableCell>
                    <TableCell>{faq.response}</TableCell>
                    <TableCell className="w-40">
                      {faq.createdAt ? (
                        (() => {
                          const { date, time } = extractDateAndTime(faq.createdAt);
                          return (
                            <div>
                              <div>{date}</div>
                              <div className="text-xs text-gray-500">{time}</div>
                            </div>
                          );
                        })()
                      ) : "Unknown"}
                    </TableCell>
                    <TableCell className="w-40">
                      {faq.updatedAt ? (
                        (() => {
                          const { date, time } = extractDateAndTime(faq.updatedAt);
                          return (
                            <div>
                              <div>{date}</div>
                              <div className="text-xs text-gray-500">{time}</div>
                            </div>
                          );
                        })()
                      ) : "Unknown"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Tooltip content="Edit FAQ">
                          <Button 
                            isIconOnly 
                            color="warning" 
                            variant="light"
                            onClick={() => openEditModal(faq)}
                          >
                            <FaEdit />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Delete FAQ">
                          <Button
                            isIconOnly
                            color="danger"
                            variant="light"
                            onClick={() => openDeleteModal(faq.id)}
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

          <div className="flex justify-center mt-6">
            <Pagination
              total={totalPages}
              initialPage={1}
              page={currentPage}
              onChange={setCurrentPage}
              color="primary"
            />
          </div>

          <div className="mt-10">
            <h3 className="text-2xl font-bold mb-4 text-center">FAQs Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(categoryStats).map(([category, count]) => (
                <Card key={category} className="w-full max-w-md mx-auto shadow-lg">
                  <CardBody className="flex items-center gap-4">
                    <FaTags className="text-4xl text-blue-500" />
                    <div>
                      <h4 className="text-lg font-semibold">{getCategoryLabel(category)}</h4>
                      <p className="text-gray-500">FAQs: {count}</p>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Card className="w-full max-w-md mx-auto shadow-lg">
                <CardBody className="flex items-center justify-center gap-4">
                  <FaListAlt className="text-4xl text-green-500" />
                  <h4 className="text-lg font-semibold">Total Categories: {totalCategories}</h4>
                </CardBody>
              </Card>
            </div>
          </div>
    </div>
  );
}