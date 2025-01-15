import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Calendar, User, Tag, Clock, History, Save, X, Edit, Trash2 } from 'lucide-react';
import { FAQ } from '@/store/faq';

interface ViewFAQDetailsProps {
  faq: FAQ;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (faq: FAQ) => void;
  onDelete: (id: string) => void;
  categories: { key: string; label: string }[];
  statuses: { key: string; label: string }[];
}

const ViewFAQDetails: React.FC<ViewFAQDetailsProps> = ({
  faq,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  categories,
  statuses
}) => {
  const [editedFAQ, setEditedFAQ] = useState<FAQ>(faq);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Reset editedFAQ when faq prop changes
  useEffect(() => {
    setEditedFAQ(faq);
  }, [faq]);

  const handleUpdate = () => {
    const updatedFAQ: FAQ = {
      ...editedFAQ,
      id: faq.id,
      question: editedFAQ.question.trim(),
      response: editedFAQ.response.trim()
    };
    
    onUpdate(updatedFAQ);
    setIsEditing(false);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete(faq.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] w-[95vw] overflow-hidden p-0 gap-0">
        <DialogHeader className="p-6 pb-2 text-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
          <DialogTitle className="text-xl md:text-2xl font-bold flex items-center justify-center gap-2">
            <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
            FAQ Details
          </DialogTitle>
          <DialogDescription className="text-center text-sm md:text-base">
            View and manage FAQ information
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-grow p-4 md:p-6 h-[calc(95vh-12rem)]">
          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardContent className="p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm md:text-base">
                    <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <Label className="text-gray-600">Created By:</Label>
                    <span className="font-medium truncate">{faq.username}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm md:text-base">
                    <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <Label className="text-gray-600">Created At:</Label>
                    <span className="font-medium truncate">{formatDate(faq.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm md:text-base">
                    <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <Label className="text-gray-600">Last Update By:</Label>
                    <span className="font-medium truncate">{faq.updatedBy || 'Not updated'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm md:text-base">
                    <History className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <Label className="text-gray-600">Last Update At:</Label>
                    <span className="font-medium truncate">
                      {faq.updatedAt ? formatDate(faq.updatedAt) : 'Not updated'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm md:text-base">Category</Label>
                {isEditing ? (
                  <Select
                    value={editedFAQ.category}
                    onValueChange={(value) => setEditedFAQ({...editedFAQ, category: value})}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.key} value={category.key}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge variant="secondary" className="text-sm md:text-base px-3 py-1">
                    <Tag className="w-4 h-4 mr-2" />
                    {categories.find(c => c.key === faq.category)?.label}
                  </Badge>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm md:text-base">Status</Label>
                {isEditing ? (
                  <Select
                    value={editedFAQ.status}
                    onValueChange={(value) => setEditedFAQ({...editedFAQ, status: value})}
                  >
                    <SelectTrigger className="w-full">
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
                ) : (
                  <Badge variant="outline" className="text-sm md:text-base px-3 py-1">
                    <Clock className="w-4 h-4 mr-2" />
                    {statuses.find(s => s.key === faq.status)?.label}
                  </Badge>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="question" className="text-sm md:text-base">Question</Label>
                {isEditing ? (
                  <Input
                    id="question"
                    value={editedFAQ.question}
                    onChange={(e) => setEditedFAQ({...editedFAQ, question: e.target.value})}
                    className="w-full min-h-[40px]"
                  />
                ) : (
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-md text-sm md:text-base">
                    {faq.question}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="response" className="text-sm md:text-base">Response</Label>
                {isEditing ? (
                  <Textarea
                    id="response"
                    value={editedFAQ.response}
                    onChange={(e) => setEditedFAQ({...editedFAQ, response: e.target.value})}
                    className="min-h-[200px] text-sm md:text-base"
                  />
                ) : (
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-md whitespace-pre-wrap text-sm md:text-base">
                    {faq.response}
                  </p>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        <Separator className="my-0" />

        <div className="p-4 flex justify-end gap-2 md:gap-4 bg-gray-50">
          {isEditing ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(false)}
                className="text-sm md:text-base"
                size="sm"
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
              <Button 
                onClick={handleUpdate}
                className="text-sm md:text-base"
                size="sm"
              >
                <Save className="w-4 h-4 mr-1" />
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                onClick={onClose}
                className="text-sm md:text-base"
                size="sm"
              >
                <X className="w-4 h-4 mr-1" />
                Close
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => setIsEditing(true)}
                className="text-sm md:text-base"
                size="sm"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                className="text-sm md:text-base"
                size="sm"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </>
          )}
        </div>

        {showDeleteConfirm && (
          <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-5 h-5" />
                  Confirm Deletion
                </DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this FAQ? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-4 mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowDeleteConfirm(false)}
                  className="text-sm md:text-base"
                  size="sm"
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={confirmDelete}
                  className="text-sm md:text-base"
                  size="sm"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewFAQDetails;