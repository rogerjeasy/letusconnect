"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useJobStore } from '@/store/useJobStore';
import { JobStatusEnum, type JobCreateSchema } from '@/store/jobStore';
import { Building2, Briefcase, MapPin, Link, DollarSign, Calendar } from 'lucide-react';
import { toast } from "react-toastify";
import type { z } from 'zod';

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

  const validateForm = (formData: FormData): { 
    isValid: boolean; 
    data: z.infer<typeof JobCreateSchema>; 
    errors: Record<string, string>;
  } => {
    const errors: Record<string, string> = {};
    
    // Get and validate required fields
    const company = formData.get('company')?.toString() || '';
    const position = formData.get('position')?.toString() || '';
    
    if (!company.trim()) {
      errors.company = 'Company name is required';
    }
    
    if (!position.trim()) {
      errors.position = 'Position is required';
    }
  
    const jobPostLinkRaw = formData.get('jobPostLink')?.toString();
    const companyWebsiteRaw = formData.get('companyWebsite')?.toString();
  
    // Format URLs if provided, returning empty string for invalid/undefined URLs
    const jobPostLink = formatUrl(jobPostLinkRaw);
    const companyWebsite = formatUrl(companyWebsiteRaw);

    if (jobPostLinkRaw && jobPostLinkRaw.trim() !== '' && !jobPostLink) {
        errors.jobPostLink = 'Please enter a valid URL';
      }
      
      if (companyWebsiteRaw && companyWebsiteRaw.trim() !== '' && !companyWebsite) {
        errors.companyWebsite = 'Please enter a valid URL';
      }
  
    // Construct the job data object with proper types
    const jobData: z.infer<typeof JobCreateSchema> = {
      company,
      position,
      location: formData.get('location')?.toString(),
      status: (formData.get('status')?.toString() || 'APPLIED') as z.infer<typeof JobStatusEnum>,
      applicationDate: formData.get('applicationDate') ? 
          new Date(formData.get('applicationDate')!.toString()) : 
          new Date(),
      referral: formData.get('referral')?.toString(),
      salaryRange: formData.get('salaryRange')?.toString(),
      jobType: formData.get('jobType')?.toString(),
      jobDescription: formData.get('jobDescription')?.toString(),
      jobPostLink,
      companyWebsite,
      applicationNotes: formData.get('applicationNotes')?.toString()
    };
  
    return {
      isValid: Object.keys(errors).length === 0,
      data: jobData,
      errors
    };
  };


interface CreateJobFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
  disabled?: boolean;
  initialData?: Partial<z.infer<typeof JobCreateSchema>>;
}

const JOB_TYPES = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE', 'REMOTE'] as const;

const CreateJobForm: React.FC<CreateJobFormProps> = ({ 
  onSuccess, 
  onClose, 
  disabled = false,
  initialData 
}) => {
  const createJob = useJobStore(state => state.createJob);
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (disabled || loading) return;

    setLoading(true);
    setErrors({});
    
    try {
        const form = e.currentTarget;
        const formData = new FormData(form);
        
        const { isValid, data: jobData, errors: validationErrors } = validateForm(formData);
  
        if (!isValid) {
          setErrors(validationErrors);
          throw new Error('Please fix the form errors');
        }
      
      await createJob(jobData);
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create job:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create job application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 overflow-hidden">
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto px-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div className="space-y-1.5 md:space-y-2">
            <Label htmlFor="company" className="flex items-center gap-2 text-sm md:text-base">
              <Building2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
              Company
            </Label>
            <Input 
              id="company"
              name="company"
              placeholder="Enter company name"
              required
              defaultValue={initialData?.company || ''}
              disabled={disabled || loading}
              className={`text-sm md:text-base ${errors.company ? 'border-red-500' : ''}`}
              aria-invalid={errors.company ? 'true' : 'false'}
              aria-describedby={errors.company ? 'company-error' : undefined}
            />
            {errors.company && (
              <p id="company-error" className="text-sm text-red-500">{errors.company}</p>
            )}
          </div>

          <div className="space-y-1.5 md:space-y-2">
            <Label htmlFor="position" className="flex items-center gap-2 text-sm md:text-base">
              <Briefcase className="w-3.5 h-3.5 md:w-4 md:h-4" />
              Position
            </Label>
            <Input
              id="position"
              name="position"
              placeholder="Enter job position"
              required
              defaultValue={initialData?.position || ''}
              disabled={disabled || loading}
              className={`text-sm md:text-base ${errors.position ? 'border-red-500' : ''}`}
              aria-invalid={errors.position ? 'true' : 'false'}
              aria-describedby={errors.position ? 'position-error' : undefined}
            />
            {errors.position && (
              <p id="position-error" className="text-sm text-red-500">{errors.position}</p>
            )}
          </div>

          <div className="space-y-1.5 md:space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2 text-sm md:text-base">
              <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4" />
              Location
            </Label>
            <Input
              id="location"
              name="location"
              placeholder="Enter job location"
              defaultValue={initialData?.location || ''}
              disabled={disabled || loading}
              className="text-sm md:text-base"
            />
          </div>

          <div className="space-y-1.5 md:space-y-2">
            <Label htmlFor="status" className="text-sm md:text-base">Application Status</Label>
            <Select 
              name="status" 
              defaultValue={initialData?.status || "APPLIED"}
              disabled={disabled || loading}
            >
              <SelectTrigger className="text-sm md:text-base">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(JobStatusEnum.Values) as Array<keyof typeof JobStatusEnum.Values>).map((status) => (
                  <SelectItem key={status} value={status} className="text-sm md:text-base">
                    {status.charAt(0) + status.slice(1).toLowerCase().replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5 md:space-y-2">
            <Label htmlFor="jobType" className="flex items-center gap-2 text-sm md:text-base">
              <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
              Job Type
            </Label>
            <Select 
              name="jobType"
              defaultValue={initialData?.jobType}
              disabled={disabled || loading}
            >
              <SelectTrigger className="text-sm md:text-base">
                <SelectValue placeholder="Select job type" />
              </SelectTrigger>
              <SelectContent>
                {JOB_TYPES.map((type) => (
                  <SelectItem key={type} value={type} className="text-sm md:text-base">
                    {type.replace('_', ' ').charAt(0) + type.slice(1).toLowerCase().replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5 md:space-y-2">
            <Label htmlFor="applicationDate" className="text-sm md:text-base">Application Date</Label>
            <Input
              id="applicationDate"
              name="applicationDate"
              type="date"
              defaultValue={initialData?.applicationDate?.toISOString().split('T')[0]}
              disabled={disabled || loading}
              className="text-sm md:text-base"
            />
          </div>

          <div className="space-y-1.5 md:space-y-2">
            <Label htmlFor="salaryRange" className="flex items-center gap-2 text-sm md:text-base">
              <DollarSign className="w-3.5 h-3.5 md:w-4 md:h-4" />
              Salary Range
            </Label>
            <Input
              id="salaryRange"
              name="salaryRange"
              placeholder="e.g. $80,000 - $100,000"
              defaultValue={initialData?.salaryRange || ''}
              disabled={disabled || loading}
              className="text-sm md:text-base"
            />
          </div>

          <div className="space-y-1.5 md:space-y-2">
            <Label htmlFor="referral" className="text-sm md:text-base">Referral</Label>
            <Input
              id="referral"
              name="referral"
              placeholder="Enter referral name"
              defaultValue={initialData?.referral || ''}
              disabled={disabled || loading}
              className="text-sm md:text-base"
            />
          </div>
        </div>

        <div className="space-y-1.5 md:space-y-2">
          <Label htmlFor="jobDescription" className="text-sm md:text-base">Job Description</Label>
          <Textarea
            id="jobDescription"
            name="jobDescription"
            placeholder="Enter job description"
            defaultValue={initialData?.jobDescription || ''}
            disabled={disabled || loading}
            className="h-24 md:h-32 text-sm md:text-base resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div className="space-y-1.5 md:space-y-2">
            <Label htmlFor="jobPostLink" className="flex items-center gap-2 text-sm md:text-base">
              <Link className="w-3.5 h-3.5 md:w-4 md:h-4" />
              Job Post URL
            </Label>
            <Input
              id="jobPostLink"
              name="jobPostLink"
              type="url"
              placeholder="https://..."
              defaultValue={initialData?.jobPostLink || ''}
              disabled={disabled || loading}
              className={`text-sm md:text-base ${errors.jobPostLink ? 'border-red-500' : ''}`}
              aria-invalid={errors.jobPostLink ? 'true' : 'false'}
              aria-describedby={errors.jobPostLink ? 'jobPostLink-error' : undefined}
            />
            {errors.jobPostLink && (
              <p id="jobPostLink-error" className="text-sm text-red-500">{errors.jobPostLink}</p>
            )}
          </div>

          <div className="space-y-1.5 md:space-y-2">
            <Label htmlFor="companyWebsite" className="flex items-center gap-2 text-sm md:text-base">
              <Link className="w-3.5 h-3.5 md:w-4 md:h-4" />
              Company Website
            </Label>
            <Input
              id="companyWebsite"
              name="companyWebsite"
              type="url"
              placeholder="https://..."
              defaultValue={initialData?.companyWebsite || ''}
              disabled={disabled || loading}
              className={`text-sm md:text-base ${errors.companyWebsite ? 'border-red-500' : ''}`}
              aria-invalid={errors.companyWebsite ? 'true' : 'false'}
              aria-describedby={errors.companyWebsite ? 'companyWebsite-error' : undefined}
            />
            {errors.companyWebsite && (
              <p id="companyWebsite-error" className="text-sm text-red-500">{errors.companyWebsite}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button 
            type="button" 
            variant="outline" 
            className="text-sm md:text-base"
            onClick={onClose}
            disabled={disabled || loading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={disabled || loading} 
            className="text-sm md:text-base"
          >
            {loading ? 'Creating...' : 'Create Application'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateJobForm;