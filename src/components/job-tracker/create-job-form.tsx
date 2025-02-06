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
import type { z } from 'zod';

interface CreateJobFormProps {
    onSuccess?: () => void;
    onClose?: () => void;
  }

const CreateJobForm: React.FC<CreateJobFormProps> = ({ onSuccess, onClose }) => {
  const createJob = useJobStore(state => state.createJob);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const jobData: z.infer<typeof JobCreateSchema> = {
      company: formData.get('company')?.toString() || '',
      position: formData.get('position')?.toString() || '',
      location: formData.get('location')?.toString(),
      status: (formData.get('status')?.toString() || 'APPLIED') as z.infer<typeof JobStatusEnum>,
      salaryRange: formData.get('salaryRange')?.toString(),
      jobType: formData.get('jobType')?.toString(),
      jobDescription: formData.get('jobDescription')?.toString(),
      jobPostLink: formData.get('jobPostLink')?.toString(),
      companyWebsite: formData.get('companyWebsite')?.toString()
    };

    try {
      await createJob(jobData);
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create job:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 overflow-hidden">
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
          <Briefcase className="w-5 h-5 md:w-6 md:h-6" />
          Create New Application
        </h2>
      </div>
      <div className="w-full">
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
                className="text-sm md:text-base"
              />
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
                className="text-sm md:text-base"
              />
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
                className="text-sm md:text-base"
              />
            </div>

            <div className="space-y-1.5 md:space-y-2">
              <Label htmlFor="status" className="text-sm md:text-base">Application Status</Label>
              <Select name="status" defaultValue="APPLIED">
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
              <Select name="jobType">
                <SelectTrigger className="text-sm md:text-base">
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  {['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP'].map((type) => (
                    <SelectItem key={type} value={type} className="text-sm md:text-base">
                      {type.replace('_', ' ').charAt(0) + type.slice(1).toLowerCase().replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                className="text-sm md:text-base"
              />
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
                className="text-sm md:text-base"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button 
                type="button" 
                variant="outline" 
                className="text-sm md:text-base" 
                onClick={onClose || onSuccess}
            >
                Cancel
            </Button>
            <Button type="submit" disabled={loading} className="text-sm md:text-base">
              {loading ? 'Creating...' : 'Create Application'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJobForm;