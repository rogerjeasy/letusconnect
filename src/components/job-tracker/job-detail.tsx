"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
import { InterviewRoundSchema, JobSchema, JobStatusEnum } from '@/store/jobStore';
import { useJobStore } from '@/store/useJobStore';
import { Building2, Briefcase, MapPin, Link, DollarSign, Calendar } from 'lucide-react';
import type { z } from 'zod';
import InterviewCardForm from './interview-card-form';

interface JobDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
}

const JOB_TYPES = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE', 'REMOTE'] as const;

const JobDetailsDialog: React.FC<JobDetailsDialogProps> = ({
  isOpen,
  onClose,
  jobId
}) => {
  const { selectedJob, loading, updateJob, fetchJobById, addInterviewRound, removeInterviewRound, updateInterviewRound } = useJobStore();
  const [activeTab, setActiveTab] = React.useState('details');
  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState<Partial<z.infer<typeof JobSchema>>>({});
  const [isAddingInterview, setIsAddingInterview] = React.useState(false);
  const defaultInterviewRound: z.infer<typeof InterviewRoundSchema> = {
    roundNumber: (selectedJob?.interviews?.length || 0) + 1,
    date: new Date(),
    interviewType: 'PHONE',
    reminder: 'NONE'
  };
  const [newInterviewData, setNewInterviewData] = React.useState<z.infer<typeof InterviewRoundSchema>>(defaultInterviewRound);

  React.useEffect(() => {
    if (isOpen && jobId) {
      fetchJobById(jobId);
    }
  }, [isOpen, jobId, fetchJobById]);

  React.useEffect(() => {
    if (selectedJob) {
      setFormData(selectedJob);
    }
  }, [selectedJob]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!selectedJob?.id) return;
    
    try {
      await updateJob(selectedJob.id, formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update job:', error);
    }
  };

  const handleInterviewUpdate = async (index: number, data: Partial<z.infer<typeof InterviewRoundSchema>>) => {
    if (!selectedJob?.id || !selectedJob.interviews?.[index]) return;
    
    try {
      const currentInterview = selectedJob.interviews[index];
      const updatedData: z.infer<typeof InterviewRoundSchema> = {
        ...currentInterview,
        ...data,
        roundNumber: currentInterview.roundNumber, // Preserve round number
        date: data.date || currentInterview.date,
        interviewType: data.interviewType || currentInterview.interviewType,
        reminder: data.reminder || currentInterview.reminder
      };

      await updateInterviewRound(
        selectedJob.id,
        currentInterview.roundNumber.toString(),
        updatedData
      );
    } catch (error) {
      console.error('Failed to update interview:', error);
    }
  };

  const handleInterviewDelete = async (index: number) => {
    if (!selectedJob?.id || !selectedJob.interviews?.[index]) return;
    
    try {
      await removeInterviewRound(
        selectedJob.id,
        selectedJob.interviews[index].roundNumber.toString()
      );
    } catch (error) {
      console.error('Failed to delete interview:', error);
    }
  };

  const handleInterviewSubmit = async (data: Partial<z.infer<typeof InterviewRoundSchema>>) => {
    if (!selectedJob?.id) return;
    
    try {
      // Ensure all required fields are present
      const completeData: z.infer<typeof InterviewRoundSchema> = {
        roundNumber: data.roundNumber || newInterviewData.roundNumber,
        date: data.date || new Date(),
        interviewType: data.interviewType || 'PHONE',
        reminder: data.reminder || 'NONE',
        time: data.time,
        location: data.location,
        interviewer: data.interviewer,
        description: data.description,
        meetingLink: data.meetingLink,
        notes: data.notes
      };

      await addInterviewRound(selectedJob.id, completeData);
      setIsAddingInterview(false);
      setNewInterviewData(defaultInterviewRound);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to add interview:', error);
    }
  };

  const handleAddInterview = () => {
    const nextRoundNumber = (selectedJob?.interviews?.length || 0) + 1;
    setNewInterviewData({
      ...defaultInterviewRound,
      roundNumber: nextRoundNumber,
    });
    setIsAddingInterview(true);
  };

  const handleDetailsSubmit = async () => {
    if (!selectedJob?.id) return;
    
    try {
      await updateJob(selectedJob.id, formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update job:', error);
    }
  };

  const handleSaveChanges = async () => {
    if (activeTab === 'details') {
      await handleDetailsSubmit();
    } else if (activeTab === 'interviews' && newInterviewData) {
      await handleInterviewSubmit(newInterviewData);
    }
  };

    const handleClose = () => {
        onClose();
        setIsEditing(false);
        setIsAddingInterview(false);
    };

  const handleCancel = () => {
    if (activeTab === 'details') {
      setFormData(selectedJob || {});
    } else {
      setIsAddingInterview(false);
      setNewInterviewData(defaultInterviewRound);
    }
    setIsEditing(false);
  };

  if (!selectedJob) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-4xl h-[90vh] max-h-[900px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <Building2 className="w-6 h-6" />
            {selectedJob.company}
          </DialogTitle>
          <DialogDescription className="text-lg">
            {selectedJob.position}
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="details"
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col min-h-0"
        >
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
            <TabsTrigger value="details">Job Details</TabsTrigger>
            <TabsTrigger value="interviews">Interviews</TabsTrigger>
          </TabsList>

          <TabsContent
            value="details"
            className="flex-1 overflow-y-auto px-1 data-[state=inactive]:hidden"
          >
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company" className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Company
                  </Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing || loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position" className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Position
                  </Label>
                  <Input
                    id="position"
                    name="position"
                    value={formData.position || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing || loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing || loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    name="status"
                    value={formData.status}
                    onValueChange={(value) => handleSelectChange('status', value)}
                    disabled={!isEditing || loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(JobStatusEnum.Values) as Array<keyof typeof JobStatusEnum.Values>).map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0) + status.slice(1).toLowerCase().replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobType" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Job Type
                  </Label>
                  <Select
                    name="jobType"
                    value={formData.jobType || ''}
                    onValueChange={(value) => handleSelectChange('jobType', value)}
                    disabled={!isEditing || loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      {JOB_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.replace('_', ' ').charAt(0) + type.slice(1).toLowerCase().replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salaryRange" className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Salary Range
                  </Label>
                  <Input
                    id="salaryRange"
                    name="salaryRange"
                    value={formData.salaryRange || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing || loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobPostLink" className="flex items-center gap-2">
                    <Link className="w-4 h-4" />
                    Job Post URL
                  </Label>
                  <Input
                    id="jobPostLink"
                    name="jobPostLink"
                    value={formData.jobPostLink || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing || loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyWebsite" className="flex items-center gap-2">
                    <Link className="w-4 h-4" />
                    Company Website
                  </Label>
                  <Input
                    id="companyWebsite"
                    name="companyWebsite"
                    value={formData.companyWebsite || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing || loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobDescription">Job Description</Label>
                <Textarea
                  id="jobDescription"
                  name="jobDescription"
                  value={formData.jobDescription || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing || loading}
                  className="h-32 resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="applicationNotes">Application Notes</Label>
                <Textarea
                  id="applicationNotes"
                  name="applicationNotes"
                  value={formData.applicationNotes || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing || loading}
                  className="h-32 resize-none"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent
          value="interviews"
          className="flex-1 overflow-y-auto px-1 data-[state=inactive]:hidden"
        >
          <div className="space-y-4 py-4">
            {isAddingInterview && (
              <InterviewCardForm
                interview={newInterviewData}
                roundNumber={newInterviewData.roundNumber}
                isEditing={true}
                onSave={handleInterviewSubmit}
                onCancel={() => {
                  setIsAddingInterview(false);
                  setNewInterviewData(defaultInterviewRound);
                }}
              />
            )}
            
            {selectedJob.interviews?.map((interview, index) => (
              <InterviewCardForm
                key={index}
                interview={interview}
                roundNumber={interview.roundNumber}
                isEditing={isEditing}
                onSave={(data) => handleInterviewUpdate(index, data)}
                onDelete={() => handleInterviewDelete(index)}
                onCancel={isEditing ? () => setIsEditing(false) : undefined}
              />
            ))}
            
            {isEditing && !isAddingInterview && (
              <Button
                onClick={handleAddInterview}
                className="w-full"
              >
                Add Interview Round
              </Button>
            )}
            
            {(!selectedJob.interviews?.length && !isAddingInterview) && (
              <p className="text-center text-muted-foreground">
                No interviews scheduled yet. {isEditing && 'Click the button above to add one.'}
              </p>
            )}
          </div>
        </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            Close
          </Button>
          {isEditing || isAddingInterview ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveChanges}
                disabled={loading}
              >
                Save Changes
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              disabled={loading}
            >
              Edit
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailsDialog;