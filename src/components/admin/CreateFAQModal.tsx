import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, Save, X, AlertTriangle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from "@/lib/utils";

interface CreateFAQProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateFAQ: (faqData: CreateFAQData) => Promise<void>;
  categories: { key: string; label: string }[];
  statuses: { key: string; label: string }[];
  isSubmitting: boolean;
}

// Zod schema for form validation
const createFAQSchema = z.object({
  category: z.string({
    required_error: "Category is required",
  }),
  status: z.string({
    required_error: "Status is required",
  }),
  question: z.string()
    .min(10, "Question must be at least 10 characters long")
    .max(500, "Question must not exceed 500 characters"),
  response: z.string()
    .min(20, "Response must be at least 20 characters long")
    .max(2000, "Response must not exceed 2000 characters"),
});

type CreateFAQData = z.infer<typeof createFAQSchema>;

const CreateFAQModal: React.FC<CreateFAQProps> = ({
  isOpen,
  onClose,
  onCreateFAQ,
  categories,
  statuses,
  isSubmitting,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateFAQData>({
    resolver: zodResolver(createFAQSchema),
    defaultValues: {
      category: '',
      status: '',
      question: '',
      response: '',
    },
  });

  const onSubmit = async (data: CreateFAQData) => {
    await onCreateFAQ(data);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  // Get current values for character count
  const questionValue = watch('question');
  const responseValue = watch('response');

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] w-[95vw] overflow-hidden p-0 gap-0">
        <DialogHeader className="p-6 pb-2 text-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
          <DialogTitle className="text-xl md:text-2xl font-bold flex items-center justify-center gap-2">
            <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
            Create New FAQ
          </DialogTitle>
          <DialogDescription className="text-center text-sm md:text-base">
            Add a new FAQ to help users find answers to common questions
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <ScrollArea className="flex-grow px-4 md:px-6 py-4 h-[calc(95vh-12rem)]">
            <div className="space-y-6">
              <Card className="border-none shadow-none bg-gray-50/50">
                <CardContent className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-sm font-medium">
                        Category
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Select
                        onValueChange={(value) => setValue('category', value)}
                      >
                        <SelectTrigger className={cn(
                          "w-full",
                          errors.category && "border-red-500 focus-visible:ring-red-500"
                        )}>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.key} value={category.key}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          {errors.category.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status" className="text-sm font-medium">
                        Status
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Select
                        onValueChange={(value) => setValue('status', value)}
                      >
                        <SelectTrigger className={cn(
                          "w-full",
                          errors.status && "border-red-500 focus-visible:ring-red-500"
                        )}>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {statuses.map((status) => (
                            <SelectItem key={status.key} value={status.key}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.status && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          {errors.status.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="question" className="text-sm font-medium">
                      Question
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        {...register('question')}
                        className={cn(
                          "pr-16",
                          errors.question && "border-red-500 focus-visible:ring-red-500"
                        )}
                        placeholder="Enter your question"
                      />
                      <span className="absolute right-2 top-2 text-xs text-gray-400">
                        {questionValue?.length || 0}/500
                      </span>
                    </div>
                    {errors.question && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {errors.question.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="response" className="text-sm font-medium">
                      Response
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <div className="relative">
                      <Textarea
                        {...register('response')}
                        className={cn(
                          "min-h-[200px]",
                          errors.response && "border-red-500 focus-visible:ring-red-500"
                        )}
                        placeholder="Enter your response"
                      />
                      <span className="absolute right-2 bottom-2 text-xs text-gray-400">
                        {responseValue?.length || 0}/2000
                      </span>
                    </div>
                    {errors.response && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {errors.response.message}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>

          <div className="p-4 flex justify-end gap-2 md:gap-4 bg-gray-50 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-sm md:text-base"
            >
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="text-sm md:text-base"
            >
              <Save className="w-4 h-4 mr-1" />
              {isSubmitting ? 'Creating...' : 'Create FAQ'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFAQModal;