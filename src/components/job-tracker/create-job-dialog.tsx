"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle, Bot, PenLine } from "lucide-react";
import CreateJobForm from './create-job-form';
import CreateJobWithAI from './create-job-ai';
import { useJobStore } from '@/store/useJobStore';
import { JobCreateSchema } from '@/store/jobStore';
import { z } from 'zod';

type EntryMode = 'select' | 'manual' | 'ai' | 'review';

const CreateJobDialog = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [mode, setMode] = React.useState<EntryMode>('select');
  const [extractedData, setExtractedData] = React.useState<z.infer<typeof JobCreateSchema> | null>(null);
  const { createJob } = useJobStore();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const resetDialog = () => {
    setMode('select');
    setExtractedData(null);
    setIsOpen(false);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetDialog();
    }
  };

  const handleAIDataExtracted = (jobData: z.infer<typeof JobCreateSchema>) => {
    setExtractedData(jobData);
    setMode('review');
  };

  const handleJobCreation = async (jobData: z.infer<typeof JobCreateSchema>) => {
    setIsSubmitting(true);
    try {
      await createJob(jobData);
      resetDialog();
    } catch (error) {
      // Error handling is managed by the CreateJobForm component
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isSubmitting && setIsOpen(open)}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full md:w-auto gap-2">
          <PlusCircle className="w-5 h-5" />
          New Application
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90vw] max-w-xl sm:max-w-2xl mx-auto">
        {mode === 'select' && (
          <>
            <DialogHeader className="space-y-3">
              <DialogTitle className="text-2xl font-bold">
                Create New Application
              </DialogTitle>
              <DialogDescription className="text-base">
                Choose how you&apos;d like to create your job application
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Button
                variant="outline"
                className="h-40 flex flex-col items-center justify-center gap-4 p-8 hover:border-primary"
                onClick={() => setMode('manual')}
                disabled={isSubmitting}
              >
                <PenLine className="w-10 h-10" />
                <div className="text-center space-y-2">
                  <div className="font-semibold text-lg">Manual Entry</div>
                  <div className="text-sm text-muted-foreground">
                    Fill in job details yourself
                  </div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-40 flex flex-col items-center justify-center gap-4 p-8 hover:border-primary"
                onClick={() => setMode('ai')}
                disabled={isSubmitting}
              >
                <Bot className="w-10 h-10" />
                <div className="text-center space-y-2">
                  <div className="font-semibold text-lg">AI Auto-Complete</div>
                  <div className="text-sm text-muted-foreground">
                    Let AI extract details from job posting
                  </div>
                </div>
              </Button>
            </div>
          </>
        )}
        {mode === 'manual' && (
          <>
            <DialogHeader className="mb-6 text-center">
              <DialogTitle className="text-2xl font-bold flex items-center justify-center gap-3">
                <PenLine className="w-7 h-7" />
                Manual Entry
              </DialogTitle>
            </DialogHeader>
            <CreateJobForm 
              onSuccess={resetDialog} 
              onClose={handleClose}
              disabled={isSubmitting}
            />
          </>
        )}
        {mode === 'ai' && (
          <>
            <DialogHeader className="mb-6 text-center">
              <DialogTitle className="text-2xl font-bold flex items-center justify-center gap-3">
                <Bot className="w-7 h-7" />
                AI Auto-Complete
              </DialogTitle>
              <DialogDescription className="text-base mt-2">
                Paste a job posting URL or description to automatically extract details
              </DialogDescription>
            </DialogHeader>
            <CreateJobWithAI 
              onClose={handleClose}
              onDataExtracted={handleAIDataExtracted}
            />
          </>
        )}
        {mode === 'review' && extractedData && (
          <>
            <DialogHeader className="mb-6 text-center">
              <DialogTitle className="text-2xl font-bold flex items-center justify-center gap-3">
                <Bot className="w-7 h-7" />
                Review AI Extracted Details
              </DialogTitle>
              <DialogDescription className="text-base mt-2">
                Review and modify the extracted details before creating the application
              </DialogDescription>
            </DialogHeader>
            <CreateJobForm
              initialData={extractedData}
              onSuccess={resetDialog}
              onClose={handleClose}
              disabled={isSubmitting}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateJobDialog;