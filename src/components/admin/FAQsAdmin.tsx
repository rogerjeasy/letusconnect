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
  Card,
  Pagination,
  CardBody,
} from "@nextui-org/react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaExclamationCircle,
  FaBoxOpen,
  FaTags,
  FaListAlt,
} from "react-icons/fa";
import { useUserStore } from "../../store/userStore";
import AccessDenied from "@/components/accessdenied/AccessDenied";
import { extractDateAndTime } from "../utils/dateUtils";
import { faqCategories, faqStatuses } from "../dropdownoptions/faqCategories";
import ModalPopup from "../forms/ModalPopup";
import { createFAQ, deleteFAQ, getAllFAQs, updateFAQ } from "@/services/faq.service";
import { toast } from "react-toastify";
import { handleError } from "@/helpers/api";
import { getLabel } from "../dropdownoptions/faqCategories";
import { FAQ } from "@/store/faq";
import { truncateText } from "../utils/truncateText";
import ViewFAQDetails from "./ViewFAQDetails";
import CreateFAQModal from "./CreateFAQModal";
import { CreateFAQData } from "@/schemas/faqSchema";

interface FormErrors {
  category?: string;
  question?: string;
  response?: string;
  status?: string;
}

export default function FAQsAdmin() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFAQ, setNewFAQ] = useState({ question: "", response: "", category: "", status: "" });
  const { user, isAuthenticated } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);

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

    if (!newFAQ.status) {
      errors.status = "Status is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateFAQ = async (faqData: CreateFAQData) => {
    try {
      setLoading(true);
      await createFAQ(faqData);
      setIsModalOpen(false);
      await fetchFAQs();
      toast.success("FAQ created successfully");
    } catch (error) {
      toast.error("Error creating FAQ:", handleError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleManageFAQ = (faq: FAQ) => {
    setSelectedFAQ(faq);
    setIsViewModalOpen(true);
  };

  const handleUpdateFAQ = async (updatedFAQ: FAQ) => {
    try {
      setLoading(true);
      const updateData = {
        question: updatedFAQ.question.trim(),
        response: updatedFAQ.response.trim(),
        category: updatedFAQ.category,
        status: updatedFAQ.status
      };
  
      await updateFAQ(updatedFAQ.id, updateData);
  
      setIsViewModalOpen(false);
      
      setSelectedFAQ(null);
      
      await fetchFAQs();
      toast.success("FAQ updated successfully");
    } catch (error) {
      console.error("Error updating FAQ:", error);
      toast.error("Failed to update FAQ");
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

      <CreateFAQModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateFAQ={handleCreateFAQ}
        categories={faqCategories}
        statuses={faqStatuses}
        isSubmitting={isSubmitting}
      />

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
              <TableColumn>Last Update</TableColumn>
              <TableColumn>Status</TableColumn>
              <TableColumn>Action</TableColumn>
            </TableHeader>
            <TableBody>
            {paginatedFaqs.length === 0 ? (
                <TableRow>
                  <TableCell>-</TableCell>
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
                </TableRow>
              ) : (
                paginatedFaqs.map((faq) => (
                  <TableRow key={faq.id}>
                    <TableCell>{faq.username}</TableCell>
                    <TableCell>{getLabel(faqCategories, faq.category)}</TableCell>
                    <TableCell>{truncateText(faq.question)}</TableCell>
                    <TableCell>{truncateText(faq.response, 10)}</TableCell>
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
                    <TableCell>{getLabel(faqStatuses, faq.status)}</TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <Button
                          color="primary"
                          variant="flat"
                          onPress={() => handleManageFAQ(faq)}
                          startContent={<FaEdit className="text-sm" />}
                        >
                          Manage FAQ
                        </Button>
                      </div>
                  </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {selectedFAQ && (
            <ViewFAQDetails 
              faq={selectedFAQ}
              isOpen={isViewModalOpen}
              onClose={() => setIsViewModalOpen(false)}
              onUpdate={handleUpdateFAQ}
              onDelete={handleDeleteFAQ}
              categories={faqCategories}
              statuses={faqStatuses}
            />
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

          <div className="mt-10">
            <h3 className="text-2xl font-bold mb-4 text-center">FAQs Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(categoryStats).map(([category, count]) => (
                <Card key={category} className="w-full max-w-md mx-auto shadow-lg">
                  <CardBody className="flex items-center gap-4">
                    <FaTags className="text-4xl text-blue-500" />
                    <div>
                      <h4 className="text-lg font-semibold">{getLabel(faqCategories, category)}</h4>
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