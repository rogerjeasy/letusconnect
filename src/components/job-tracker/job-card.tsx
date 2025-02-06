import React from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Calendar, DollarSign, Link, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { JobStatusIcons } from "@/components/icons/job-status-icon";
import type { z } from 'zod';
import type { JobSchema } from '@/store/jobStore';
import { useJobStore } from '@/store/useJobStore';

interface JobCardProps {
  job: z.infer<typeof JobSchema>;
  onSelect?: (job: z.infer<typeof JobSchema>) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onSelect }) => {
  const StatusIcon = JobStatusIcons[job.status];
  const appliedDate = job.applicationDate ? new Date(job.applicationDate).toLocaleDateString() : null;
  const deleteJob = useJobStore(state => state.deleteJob);

  const handleDelete = async () => {
    try {
      await deleteJob(job.id as string);
    } catch (error) {
      console.error('Failed to delete job:', error);
    }
  };

  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <h3 className="font-semibold text-lg">{job.position}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="w-4 h-4" />
              <span>{job.company}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="flex items-center gap-1.5"
            >
              <StatusIcon className="w-3.5 h-3.5" />
              {job.status.charAt(0) + job.status.slice(1).toLowerCase().replace('_', ' ')}
            </Badge>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Job Application</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this job application? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid gap-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            {job.location && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{job.location}</span>
              </div>
            )}
            {job.jobType && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{job.jobType.replace('_', ' ').toLowerCase()}</span>
              </div>
            )}
            {job.salaryRange && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <DollarSign className="w-4 h-4" />
                <span>{job.salaryRange}</span>
              </div>
            )}
            {job.companyWebsite && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Link className="w-4 h-4" />
                <a
                  href={job.companyWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline truncate"
                >
                  Company Site
                </a>
              </div>
            )}
          </div>
          
          {job.jobDescription && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {job.jobDescription}
            </p>
          )}
          
          <div className="flex items-center justify-between pt-2">
            {appliedDate ? (
              <span className="text-sm text-muted-foreground">
                Applied: {appliedDate}
              </span>
            ) : (
              <span className="text-sm text-muted-foreground">Applied: Not available</span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelect?.(job)}
            >
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;