"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { createGroup } from '@/services/group.forum.service';
import { groupForumSchema, GroupForumFormData } from "@/schemas/group-forum.schemas";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
    Card,
    CardContent, 
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
   
import {
    Form,
    FormControl,
    FormField, 
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
   
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger, 
    SelectValue
} from "@/components/ui/select";
   
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useUserStore } from '@/store/userStore';

interface SubmitGroupForum {
    name: string;
    description: string;
    category: {
      name: "academic" | "professional" | "research" | "social" | "projects" | "mentorship";
      icon: string;
      description: string;
      count: number;
    };
    privacy: "public" | "private" | "restricted";
    size: "small" | "medium" | "large";
    featured: boolean;
    activityLevel: string;
    members: [];
    topics: [];
    events: [];
    resources: [];
    admins: [];
    rules: [];
  }

const CreateGroupForm = () => {
  const router = useRouter();
  const currentUser = useUserStore(state => state.user);
  const form = useForm<GroupForumFormData>({
    resolver: zodResolver(groupForumSchema),
    defaultValues: {
      name: '',
      description: '',
      featured: false,
      activityLevel: 'new',
      category: {
        name: undefined,
        icon: 'default',
        description: '',
        count: 0
      },
      privacy: undefined, 
      size: 'small',
      members: [],
      topics: [],
      events: [],
      resources: [],
      admins: [],
      rules: []
    }
  });

  const onSubmit = async (data: GroupForumFormData) => {
    try {
      const submitData: SubmitGroupForum = {
        ...data,
        members: [],
        topics: [],
        events: [],
        resources: [],
        admins: [],
        rules: []
      };
      
      await createGroup(submitData);
      router.push('/groups/my-groups');
    } catch (err) {
      form.setError('root', { 
        message: err instanceof Error ? err.message : 'An error occurred'
      });
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="container mx-auto py-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Group Forum</CardTitle>
          <CardDescription>
            Create a new discussion group to connect with students and alumni
          </CardDescription>
        </CardHeader>
        <CardContent>
          {form.formState.errors.root && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
            </Alert>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter group name"
                        disabled={form.formState.isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your group's purpose and discussion topics"
                        className="h-32"
                        disabled={form.formState.isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select 
                        disabled={form.formState.isSubmitting} 
                        onValueChange={field.onChange} 
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="academic">Academic Discussions</SelectItem>
                          <SelectItem value="professional">Career & Professional</SelectItem>
                          <SelectItem value="research">Research Topics</SelectItem>
                          <SelectItem value="social">Social & Networking</SelectItem>
                          <SelectItem value="projects">Project Collaboration</SelectItem>
                          <SelectItem value="mentorship">Mentorship</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="privacy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Privacy</FormLabel>
                      <Select 
                        disabled={form.formState.isSubmitting}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select privacy" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="public">Public - Anyone can join</SelectItem>
                          <SelectItem value="private">Private - Approval required</SelectItem>
                          <SelectItem value="restricted">Restricted - Invite only</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Group Size</FormLabel>
                    <Select 
                      disabled={form.formState.isSubmitting}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select group size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="small">Small (1-20 members)</SelectItem>
                        <SelectItem value="medium">Medium (21-100 members)</SelectItem>
                        <SelectItem value="large">Large (100+ members)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={form.formState.isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Group Forum
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateGroupForm;