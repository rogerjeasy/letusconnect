import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
import { InterviewTypeEnum, ReminderTypeEnum, type InterviewRoundSchema } from '@/store/jobStore';
import { Calendar, Clock, MapPin, Link, User, VideoIcon } from 'lucide-react';
import type { z } from 'zod';

interface InterviewCardFormProps {
    interview?: z.infer<typeof InterviewRoundSchema>;
    roundNumber: number;
    isEditing?: boolean;
    onSave: (data: Partial<z.infer<typeof InterviewRoundSchema>>) => void;
    onCancel?: () => void;
    onDelete?: () => void;
  }

const InterviewCardForm: React.FC<InterviewCardFormProps> = ({
  interview,
  roundNumber,
  isEditing = false,
  onSave,
  onCancel,
  onDelete
}) => {
    const [formData, setFormData] = React.useState<z.infer<typeof InterviewRoundSchema>>({
        roundNumber,
        date: interview?.date || new Date(),
        interviewType: interview?.interviewType || 'PHONE',
        reminder: interview?.reminder || 'NONE',
        time: interview?.time,
        location: interview?.location,
        interviewer: interview?.interviewer,
        description: interview?.description,
        meetingLink: interview?.meetingLink,
        notes: interview?.notes
      });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: new Date(value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card className="mb-4">
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Interview Date
              </Label>
              <Input
                type="date"
                id="date"
                name="date"
                value={formData.date ? new Date(formData.date).toISOString().split('T')[0] : ''}
                onChange={handleDateChange}
                disabled={!isEditing}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Time
              </Label>
              <Input
                type="time"
                id="time"
                name="time"
                value={formData.time || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interviewType" className="flex items-center gap-2">
                <VideoIcon className="w-4 h-4" />
                Interview Type
              </Label>
              <Select
                name="interviewType"
                value={formData.interviewType}
                onValueChange={(value) => handleSelectChange('interviewType', value)}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select interview type" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(InterviewTypeEnum.Values) as Array<keyof typeof InterviewTypeEnum.Values>).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0) + type.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reminder" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Reminder
              </Label>
              <Select
                name="reminder"
                value={formData.reminder}
                onValueChange={(value) => handleSelectChange('reminder', value)}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select reminder type" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(ReminderTypeEnum.Values) as Array<keyof typeof ReminderTypeEnum.Values>).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0) + type.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meetingLink" className="flex items-center gap-2">
                <Link className="w-4 h-4" />
                Meeting Link
              </Label>
              <Input
                id="meetingLink"
                name="meetingLink"
                type="url"
                value={formData.meetingLink || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interviewer" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Interviewer
              </Label>
              <Input
                id="interviewer"
                name="interviewer"
                value={formData.interviewer || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="h-20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="h-20"
            />
          </div>
        </CardContent>

        {isEditing && (
          <CardFooter className="flex justify-end gap-3">
            {onDelete && (
              <Button
                type="button"
                variant="destructive"
                onClick={onDelete}
              >
                Delete
              </Button>
            )}
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
              >
                Cancel
              </Button>
            )}
            <Button type="submit">
              Save
            </Button>
          </CardFooter>
        )}
      </form>
    </Card>
  );
};

export default InterviewCardForm;