"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { sendChatMessage } from '@/services/chatgpt.service';
import { JobCreateSchema } from '@/store/jobStore';
import { z } from 'zod';

interface CreateJobWithAIProps {
  onClose?: () => void;
  onDataExtracted?: (jobData: z.infer<typeof JobCreateSchema>) => void;
}

const formatUrl = (url: string | undefined): string => {
  if (!url || url === 'Not provided' || url === undefined) return "";
 
  try {
    new URL(url);
    return url;
  } catch {
    // If it doesn't start with http:// or https://, add https://
    if (!url.match(/^https?:\/\//i)) {
      try {
        new URL(`https://${url}`);
        return `https://${url}`;
      } catch {
        return "";
      }
    }
    return "";
  }
};

const EXTRACTION_PROMPT = `Please analyze the following job posting and extract these specific details in JSON format:
{
  "company": "Company name",
  "position": "Job title/position",
  "location": "Job location (if provided)",
  "jobType": "Job type (if provided)",
  "salaryRange": "Salary range (if provided)",
  "jobDescription": "Brief summary of the job description",
  "jobPostLink": "Original job post URL if provided",
  "companyWebsite": "Company website if provided",
  "applicationNotes": "Any additional important details"
}

Please ensure the output is valid JSON format and matches these field names exactly. Only include fields where information is available in the posting. Here's the job posting to analyze:`;

const CreateJobWithAI: React.FC<CreateJobWithAIProps> = ({ onClose, onDataExtracted }) => {
  const [loading, setLoading] = React.useState(false);
  const [input, setInput] = React.useState('');

  const parseAIResponse = (response: string): z.infer<typeof JobCreateSchema> | null => {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return null;

      const jsonData = JSON.parse(jsonMatch[0]);
      
      // Format URLs before constructing the job data
      const formattedJobPostLink = jsonData.jobPostLink ? formatUrl(jsonData.jobPostLink) : "";
      const formattedCompanyWebsite = jsonData.companyWebsite ? formatUrl(jsonData.companyWebsite) : "";
      
      const jobData: z.infer<typeof JobCreateSchema> = {
        company: jsonData.company,
        position: jsonData.position,
        location: jsonData.location === 'Not provided' ? "" : jsonData.location || "",
        jobType: jsonData.jobType === 'Not provided' ? "" : jsonData.jobType || "",
        salaryRange: jsonData.salaryRange === 'Not provided' ? "" : jsonData.salaryRange || "",
        jobDescription: jsonData.jobDescription === 'Not provided' ? "" : jsonData.jobDescription || "",
        jobPostLink: formattedJobPostLink,
        companyWebsite: formattedCompanyWebsite,
        applicationNotes: jsonData.applicationNotes === 'Not provided' ? "" : jsonData.applicationNotes || "",
        status: 'APPLIED',
        applicationDate: new Date()
      };

      return JobCreateSchema.parse(jobData);
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return null;
    }
  };

  const handleGenerate = async () => {
    if (!input.trim()) {
      toast.error('Please provide a job description or URL');
      return;
    }

    setLoading(true);
    try {
      const prompt = `${EXTRACTION_PROMPT}\n\n${input}`;
      const conversation = await sendChatMessage(prompt);
      
      const lastMessage = conversation.messages[conversation.messages.length - 1];
      
      if (!lastMessage || !lastMessage.response) {
        throw new Error('No response received from AI');
      }

      const jobData = parseAIResponse(lastMessage.response);
      
      if (!jobData) {
        throw new Error('Failed to parse job data from AI response');
      }

      onDataExtracted?.(jobData);
      toast.success('Job details extracted successfully!');
    } catch (error) {
      console.error('Error generating job details:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to extract job details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto px-4 sm:px-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="jobInput" className="text-sm md:text-base">
            Job URL or Description
          </Label>
          <Textarea
            id="jobInput"
            placeholder="Paste job posting URL or full job description..."
            className="h-48 text-sm md:text-base resize-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="text-sm md:text-base"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={loading || !input.trim()}
            className="text-sm md:text-base"
          >
            {loading ? 'Extracting Details...' : 'Extract Details'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateJobWithAI;