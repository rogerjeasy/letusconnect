"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Textarea, Spinner, Divider, Chip, Card } from "@nextui-org/react";
import { FaUser, FaEnvelope, FaPaperclip, FaEdit, FaLinkedin, FaTwitter, FaFacebook, FaGithub, FaInstagram } from "react-icons/fa";
import SpinnerUI from "../forms/SpinnerUI";
import Link from "next/link";
import { DeleteDocumentIcon } from "../icons/DeleteDocumentIcon";
import SimpleInputText from "../forms/SimpleInputText";
import { api, handleError } from "../../helpers/api";
import { handleValueField } from "../../helpers/handleValueField";
import ModalPopup from "../forms/ModalPopup";

// Zod Schema for Form Validation
const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  subject: z.string().min(3, "Subject must be at least 3 characters."),
  message: z.string().min(10, "Message must be at least 10 characters."),
  attachment: z.instanceof(File).optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactUsForm() {
  const [loading, setLoading] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState<string | JSX.Element>("");
  const [modalConfirmLabel, setModalConfirmLabel] = useState("OK");


  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit: SubmitHandler<ContactFormValues> = async (data) => {
    setLoading(true);
    setSubmissionError(null);
    setSubmissionSuccess(false);
  
    try {
      // Transform form data and uploaded files into ContactUsInterface format
      const contactData = handleValueField(
        {
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
        },
        uploadedFiles
      );  
      // Send the contactData to the backend
      const response = await api.post("/api/contact-us", contactData);
  
      setSubmissionSuccess(true);
      reset();
      setUploadedFiles([]);

      setModalTitle("Message Sent!");
      setModalContent(response.data.message);
      setModalConfirmLabel("OK");
      setIsModalOpen(true);
    } catch (error) {
      const errorMessage = handleError(error);
      console.error("Error submitting form:", errorMessage);
      setModalTitle("Submission Failed");
      setModalContent(errorMessage || "An error occurred. Please try again.");
      setModalConfirmLabel("Try Again");
      setIsModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles([...uploadedFiles, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (fileToRemove: File) => {
    setUploadedFiles(uploadedFiles.filter((file) => file !== fileToRemove));
  };

  return (
    <div className="relative min-h-screen">
      {/* Fixed Background Image */}
      <div
        className="fixed top-0 left-0 w-full h-full bg-cover bg-center z-0"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&w=1600&q=80')" }}
      ></div>

      {/* Overlay for Readability */}
      <div className="fixed top-0 left-0 w-full h-full bg-black/50 z-0"></div>

      {/* Contact Form */}
      <div className="relative flex items-center justify-center h-full z-10 py-16">
        <Card className="max-w-3xl w-full p-8 bg-white bg-opacity-90 backdrop-blur-lg rounded-lg shadow-md">
          <h2 className="text-3xl font-bold mb-6 text-center text-black">Contact Us</h2>

          {loading && <SpinnerUI label="Submitting..." color="primary" />}
          {submissionSuccess && (
            <p className="text-green-600 text-center mb-4">Message sent successfully!</p>
          )}
          {submissionError && (
            <p className="text-red-600 text-center mb-4">{submissionError}</p>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <SimpleInputText
              placeholder="Your Name"
              icon={<FaUser className="text-blue-400" />}
              isInvalid={!!errors.name}
              errorMessage={errors.name?.message}
              register={register("name")}
            />

            {/* Email Field */}
            <SimpleInputText
              placeholder="Your Email"
              icon={<FaEnvelope className="text-blue-400" />}
              type="email"
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
              register={register("email")}
            />

            {/* Subject Field */}
            <SimpleInputText
              placeholder="Subject"
              icon={<FaEdit className="text-blue-400" />}
              isInvalid={!!errors.subject}
              errorMessage={errors.subject?.message}
              register={register("subject")}
            />

            {/* Message Field */}
            <Textarea
              {...register("message")}
              placeholder="Your Message"
              isInvalid={!!errors.message}
              errorMessage={errors.message?.message}
              fullWidth
              minRows={6}
              style={{ caretColor: "black" }}
            />

            {/* Attachment Field */}
            <div>
              <Input
                type="file"
                multiple
                onChange={handleFileChange}
                startContent={<FaPaperclip className="text-blue-400" />}
                fullWidth
              />
              {uploadedFiles.length > 0 && (
                <div className="mt-4 flex flex-col gap-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Chip color="primary">{file.name}</Chip>
                      <Button isIconOnly variant="light" onClick={() => removeFile(file)} className="text-red-500">
                        <DeleteDocumentIcon />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <Button type="submit" color="primary" radius="lg" className="font-bold" isDisabled={loading}>
                {loading ? <Spinner size="sm" color="white" /> : "Send Message"}
              </Button>
            </div>
          </form>

          {/* Divider Line */}
          <Divider className="my-8" />

          {/* Additional Contact Info */}
          <div className="text-center">
            <p className="text-gray-600 mb-2">Prefer to email us directly?</p>
            <Link href="mailto:support@letusconnect.com" className="text-blue-500 hover:underline">
              support@letusconnect.com
            </Link>
          </div>

          {/* Divider Line */}
          <Divider className="my-8" />

          {/* Social Media Links */}
          <div className="flex justify-center gap-6 mt-4">
            <Link href="https://www.linkedin.com" target="_blank" className="text-blue-700 hover:text-blue-900">
              <FaLinkedin size={32} />
            </Link>
            <Link href="https://www.instagram.com" target="_blank" className="text-pink-500 hover:text-pink-700">
              <FaInstagram size={32} />
            </Link>
            <Link href="https://www.twitter.com" target="_blank" className="text-blue-400 hover:text-blue-600">
              <FaTwitter size={32} />
            </Link>
            <Link href="https://www.facebook.com" target="_blank" className="text-blue-600 hover:text-blue-800">
              <FaFacebook size={32} />
            </Link>
            <Link href="https://www.github.com" target="_blank" className="text-gray-800 hover:text-gray-600">
              <FaGithub size={32} />
            </Link>
          </div>
          <ModalPopup
            isOpen={isModalOpen}
            title={modalTitle}
            content={modalContent}
            confirmLabel={modalConfirmLabel}
            onConfirm={() => setIsModalOpen(false)}
            onCancel={() => setIsModalOpen(false)}
            showCancelButton={false}
            confirmColor="primary"
            cancelColor="secondary"
            cancelLabel="Cancel"
          />
        </Card>
      </div>
    </div>
  );
}