"use client";

import React, { useState } from 'react';
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
import { UserWorkExperience, WorkExperience } from "@/store/userStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { Trash2, Plus } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";

interface UserWorkExperiencesProps {
  workExperience: UserWorkExperience | null;
  onUpdate: (data: UserWorkExperience) => Promise<void>;
}

const workExperienceSchema = z.object({
  id: z.string(),
  company: z.string().min(2, "Company name is required"),
  position: z.string().min(2, "Position is required"),
  city: z.string().optional(),
  country: z.string().min(2, "Country is required"),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  responsibilities: z.array(z.string()),
  achievements: z.array(z.string()),
});

const userWorkExperienceSchema = z.object({
  workExperiences: z.array(workExperienceSchema),
});

type FormValues = z.infer<typeof userWorkExperienceSchema>;

const UserWorkExperiences: React.FC<UserWorkExperiencesProps> = ({
  workExperience,
  onUpdate,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(userWorkExperienceSchema),
    defaultValues: {
      workExperiences: workExperience?.workExperiences.map(exp => ({
        ...exp,
        startDate: exp.startDate ? exp.startDate.toISOString().split('T')[0] : null,
        endDate: exp.endDate ? exp.endDate.toISOString().split('T')[0] : null,
      })) || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "workExperiences",
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true);
      const processedData: UserWorkExperience = {
        uid: workExperience?.uid || '',
        workExperiences: data.workExperiences.map(exp => ({
          ...exp,
          startDate: exp.startDate ? new Date(exp.startDate) : null,
          endDate: exp.endDate ? new Date(exp.endDate) : null,
        })),
      };
      await onUpdate(processedData);
    } catch (error) {
      console.error('Error updating work experiences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addResponsibility = (index: number) => {
    const currentResponsibilities = form.getValues(`workExperiences.${index}.responsibilities`);
    form.setValue(`workExperiences.${index}.responsibilities`, [...currentResponsibilities, '']);
  };

  const removeResponsibility = (expIndex: number, respIndex: number) => {
    const currentResponsibilities = form.getValues(`workExperiences.${expIndex}.responsibilities`);
    form.setValue(
      `workExperiences.${expIndex}.responsibilities`,
      currentResponsibilities.filter((_, index) => index !== respIndex)
    );
  };

  const addAchievement = (index: number) => {
    const currentAchievements = form.getValues(`workExperiences.${index}.achievements`);
    form.setValue(`workExperiences.${index}.achievements`, [...currentAchievements, '']);
  };

  const removeAchievement = (expIndex: number, achIndex: number) => {
    const currentAchievements = form.getValues(`workExperiences.${expIndex}.achievements`);
    form.setValue(
      `workExperiences.${expIndex}.achievements`,
      currentAchievements.filter((_, index) => index !== achIndex)
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Work Experience</CardTitle>
        <CardDescription>
          Add or update your work history
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ScrollArea className="h-[500px] pr-4">
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
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`workExperiences.${index}.company`}
                      render={({ field: fieldProps }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Company name" {...fieldProps} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`workExperiences.${index}.position`}
                      render={({ field: fieldProps }) => (
                        <FormItem>
                          <FormLabel>Position</FormLabel>
                          <FormControl>
                            <Input placeholder="Position" {...fieldProps} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`workExperiences.${index}.city`}
                      render={({ field: fieldProps }) => (
                        <FormItem>
                          <FormLabel>City (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="City" {...fieldProps} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`workExperiences.${index}.country`}
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
                      name={`workExperiences.${index}.startDate`}
                      render={({ field: fieldProps }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Input 
                              type="date"
                              {...fieldProps}
                              value={fieldProps.value || ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`workExperiences.${index}.endDate`}
                      render={({ field: fieldProps }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <Input 
                              type="date"
                              {...fieldProps}
                              value={fieldProps.value || ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-4">
                    <FormLabel>Responsibilities</FormLabel>
                    {form.getValues(`workExperiences.${index}.responsibilities`)?.map((_, respIndex) => (
                      <div key={respIndex} className="flex gap-2 mt-2">
                        <FormField
                          control={form.control}
                          name={`workExperiences.${index}.responsibilities.${respIndex}`}
                          render={({ field: fieldProps }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input {...fieldProps} placeholder="Add responsibility" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeResponsibility(index, respIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => addResponsibility(index)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Responsibility
                    </Button>
                  </div>

                  <div className="mt-4">
                    <FormLabel>Achievements</FormLabel>
                    {form.getValues(`workExperiences.${index}.achievements`)?.map((_, achIndex) => (
                      <div key={achIndex} className="flex gap-2 mt-2">
                        <FormField
                          control={form.control}
                          name={`workExperiences.${index}.achievements.${achIndex}`}
                          render={({ field: fieldProps }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input {...fieldProps} placeholder="Add achievement" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeAchievement(index, achIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => addAchievement(index)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Achievement
                    </Button>
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
                  id: crypto.randomUUID(),
                  company: '',
                  position: '',
                  city: '',
                  country: '',
                  startDate: null,
                  endDate: null,
                  responsibilities: [''],
                  achievements: [''],
                })
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Work Experience
            </Button>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Save Work History"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UserWorkExperiences;