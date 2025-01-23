"use client";

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserSchoolExperience, University } from "@/store/userStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { Trash2, Plus } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";

interface UserSchoolExperiencesProps {
  schoolExperience: UserSchoolExperience | null;
  onUpdate: (data: UserSchoolExperience) => Promise<void>;
  onUniversityUpdate: (id: string, updates: Partial<University>) => Promise<void>;
  onUniversityDelete: (id: string) => Promise<void>;
  isLoading: boolean;
}

const universitySchema = z.object({
  id: z.string(),
  name: z.string().min(2, "University name is required"),
  program: z.string().min(2, "Program name is required"),
  country: z.string().min(2, "Country is required"),
  degree: z.string().min(2, "Degree is required"),
  startYear: z.number().min(1900).max(new Date().getFullYear()),
  endYear: z.number().min(1900).max(new Date().getFullYear() + 10),
  experience: z.string(),
  awards: z.array(z.string()),
  extracurriculars: z.array(z.string())
});

const schoolExperienceSchema = z.object({
  universities: z.array(universitySchema)
});

type FormValues = z.infer<typeof schoolExperienceSchema>;

const UserSchoolExperiences: React.FC<UserSchoolExperiencesProps> = ({
  schoolExperience,
  onUpdate,
  onUniversityUpdate,
  onUniversityDelete,
  isLoading
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(schoolExperienceSchema),
    defaultValues: {
      universities: schoolExperience?.universities.map(university => ({
        ...university,
        startYear: university.startYear || new Date().getFullYear(),
        endYear: university.endYear || new Date().getFullYear(),
        experience: university.experience || "",
        awards: university.awards || [],
        extracurriculars: university.extracurriculars || []
      })) || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "universities",
  });

  const handleDeleteUniversity = async (index: number, id: string | undefined) => {
    if (id && schoolExperience?.universities[index]?.id) {
      await onUniversityDelete(id);
    }
    remove(index);
  };

  const onSubmit = async (data: FormValues) => {    
    try {
      await onUpdate({
        uid: schoolExperience?.uid || '',
        universities: data.universities,
      });

      // After bulk update, handle individual university updates if needed
      if (schoolExperience?.universities) {
        const existingIds = new Set(schoolExperience.universities.map(u => u.id));
        for (const university of data.universities) {
          if (existingIds.has(university.id)) {
            await onUniversityUpdate(university.id, university);
          }
        }
      }
    } catch (error) {
      console.error('Error updating school experiences:', error);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Education History</CardTitle>
        <CardDescription>
          Add or update your educational background
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ScrollArea className="h-[400px] pr-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="relative p-6 border rounded-lg mb-4"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => handleDeleteUniversity(index, schoolExperience?.universities[index]?.id || undefined)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`universities.${index}.name`}
                      render={({ field: fieldProps }) => (
                        <FormItem>
                          <FormLabel>University Name</FormLabel>
                          <FormControl>
                            <Input placeholder="University name" {...fieldProps} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`universities.${index}.program`}
                      render={({ field: fieldProps }) => (
                        <FormItem>
                          <FormLabel>Program</FormLabel>
                          <FormControl>
                            <Input placeholder="Program name" {...fieldProps} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`universities.${index}.degree`}
                      render={({ field: fieldProps }) => (
                        <FormItem>
                          <FormLabel>Degree</FormLabel>
                          <FormControl>
                            <Input placeholder="Degree" {...fieldProps} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`universities.${index}.country`}
                      render={({ field: fieldProps }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input placeholder="Country" {...fieldProps} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`universities.${index}.startYear`}
                      render={({ field: fieldProps }) => (
                        <FormItem>
                          <FormLabel>Start Year</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Start year"
                              {...fieldProps}
                              onChange={(e) =>
                                fieldProps.onChange(parseInt(e.target.value) || new Date().getFullYear())
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`universities.${index}.endYear`}
                      render={({ field: fieldProps }) => (
                        <FormItem>
                          <FormLabel>End Year</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="End year"
                              {...fieldProps}
                              onChange={(e) =>
                                fieldProps.onChange(parseInt(e.target.value) || new Date().getFullYear())
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
            </ScrollArea>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() =>
                append({
                  id: "",
                  name: "",
                  program: "",
                  country: "",
                  degree: "",
                  startYear: new Date().getFullYear(),
                  endYear: new Date().getFullYear(),
                  experience: "",
                  awards: [],
                  extracurriculars: [],
                })
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Education
            </Button>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Save Education History"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UserSchoolExperiences;