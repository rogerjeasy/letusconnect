"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Pagination,
  Spinner,
} from "@nextui-org/react";
import { api } from "../../helpers/api";
import { FaBoxOpen } from "react-icons/fa";

interface FAQ {
  id: string;
  question: string;
  response: string;
  category: string;
  createdAt: string;
}

export default function FAQs() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const response = await api.get("/api/faqs");
      setFaqs(response.data);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(faqs.length / itemsPerPage);
  const paginatedFaqs = faqs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Frequently Asked Questions</h1>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Spinner size="lg" />
        </div>
      ) : faqs.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <FaBoxOpen className="text-6xl text-gray-400" />
          <p className="text-gray-500">No FAQs available at the moment.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {paginatedFaqs.map((faq) => (
            <Card key={faq.id} className="w-full shadow-md">
              <CardHeader className="bg-gray-100">
                <h2 className="text-xl font-semibold">{faq.question}</h2>
              </CardHeader>
              <CardBody>
                <p className="text-gray-700">{faq.response}</p>
              </CardBody>
              <CardFooter className="text-sm text-gray-500">
                <span>Category: {faq.category}</span>
              </CardFooter>
            </Card>
          ))}

          <div className="flex justify-center mt-4">
            <Pagination
              total={totalPages}
              initialPage={1}
              page={currentPage}
              onChange={setCurrentPage}
              color="primary"
            />
          </div>
        </div>
      )}
    </div>
  );
}
