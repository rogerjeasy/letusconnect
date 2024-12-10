import { ContactUsInterface } from "../store/contactUs";

/**
 * Handles the transformation of form data into the ContactUsInterface structure.
 * @param formData - The form data containing name, email, subject, and message.
 * @param uploadedFiles - The list of uploaded files.
 * @returns A ContactUsInterface object.
 */
export function handleValueField(
  formData: {
    name: string;
    email: string;
    subject: string;
    message: string;
  },
  uploadedFiles: File[]
): ContactUsInterface {
  // Convert the uploaded files to attachment URLs (simulated as file names for now)
  const attachmentUrls = uploadedFiles.map((file) => URL.createObjectURL(file));

  // Construct the ContactUsInterface object
  const contactData: ContactUsInterface = {
    name: formData.name,
    email: formData.email,
    subject: formData.subject,
    message: formData.message,
    status: "unread", // Default status for new submissions
    attachmentUrls,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return contactData;
}
