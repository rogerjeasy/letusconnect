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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, X } from "lucide-react";
import { User } from '@/store/userStore';
import { 
  Skill, 
  isValidSkill
} from '@/store/skills';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { DateValue, Spinner } from '@nextui-org/react';
import UserSelection from '../forms/SelectCountry';
import SkillSelector from '../forms/SkillsSelector';
import { ProgramCombobox } from '../utils/StudyProgram';
import { RegisterFormValues, studyPrograms } from "@/schemas/registerSchema";
import GraduationYearPicker from '../forms/GraduationYearSelector';

interface UserDetailsProps {
  user: User | null;
  onUpdate: (data: Partial<User>) => Promise<void>;
}

const userDetailsSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string(),
  phoneCode: z.string(),
  bio: z.string().max(500, "Bio must not exceed 500 characters"),
  currentJobTitle: z.string(),
  program: z.enum(studyPrograms.map(p => p.label) as [string, ...string[]]),
  lookingForMentor: z.boolean(),
  willingToMentor: z.boolean(),
  graduationYear: z.number().min(1900).max(new Date().getFullYear() + 10),
  interests: z.array(z.string()),
  languages: z.array(z.string()),
  skills: z.array(
    z.object({
      name: z.string(),
      level: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"]),
    })
  ),
  certifications: z.array(z.string()),
  projects: z.array(z.string()),
  dateOfBirth: z.string().nullable(),
});

type FormValues = z.infer<typeof userDetailsSchema>;

const UserDetails: React.FC<UserDetailsProps> = ({
  user,
  onUpdate,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(userDetailsSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      phoneCode: user?.phoneCode || "",
      bio: user?.bio || "",
      currentJobTitle: user?.currentJobTitle || "",
      program: (user?.program || "") as RegisterFormValues['program'],
      lookingForMentor: user?.lookingForMentor || false,
      willingToMentor: user?.willingToMentor || false,
      graduationYear: user?.graduationYear || new Date().getFullYear(),
      interests: user?.interests || [],
      languages: (user?.languages || []),
      skills: user?.skills?.map(skill => {
        if (typeof skill === 'string') {
          return { name: skill, level: 'Beginner' };
        }
        return skill;
      }) || [],
      certifications: user?.certifications || [],
      projects: user?.projects || [],
      dateOfBirth: user?.dateOfBirth instanceof Date 
      ? user.dateOfBirth.toISOString().split('T')[0] 
      : user?.dateOfBirth 
        ? new Date(user.dateOfBirth.toString()).toISOString().split('T')[0] 
        : null,
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true);
      const updatedUserData = {
        ...user,
        ...data,
        dateOfBirth: data.dateOfBirth 
          ? new Date(data.dateOfBirth) as unknown as DateValue
          : null,
        skills: data.skills.map((skill) => skill.name) as Skill[],
      };
      await onUpdate(updatedUserData);
    } catch (error) {
      console.error('Error updating user details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>
          Update your personal details and preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field: fieldProps }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="First name" {...fieldProps} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field: fieldProps }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Last name" {...fieldProps} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field: fieldProps }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
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
                name="graduationYear"
                render={({ field: fieldProps }) => (
                    <FormItem>
                    <FormLabel>Graduation Year</FormLabel>
                    <FormControl>
                        <GraduationYearPicker
                        value={fieldProps.value}
                        onChange={fieldProps.onChange}
                        />
                    </FormControl>
                    <FormDescription>
                        Select your expected graduation year
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="program"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                    <FormLabel>Study Program</FormLabel>
                    <FormControl>
                        <ProgramCombobox
                        value={field.value as RegisterFormValues['program']}
                        onChange={(value) => {
                            field.onChange(value);
                        }}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

              <FormField
                control={form.control}
                name="currentJobTitle"
                render={({ field: fieldProps }) => (
                  <FormItem>
                    <FormLabel>Current Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Current job title" {...fieldProps} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field: fieldProps }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Email" disabled={true} {...fieldProps} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-2">
              <FormField
                control={form.control}
                name="phoneCode"
                render={({ field: fieldProps }) => (
                    <FormItem>
                    <FormLabel>Country Code</FormLabel>
                    <FormControl>
                        <UserSelection
                        selectionMode="phone"
                        defaultValue={fieldProps.value || ""}
                        onChange={fieldProps.onChange}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field: fieldProps }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone number" {...fieldProps} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Bio */}
            <FormField
              control={form.control}
              name="bio"
              render={({ field: fieldProps }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell us about yourself"
                      className="min-h-[100px]" 
                      {...fieldProps} 
                    />
                  </FormControl>
                  <FormDescription>
                    Brief description about yourself (max 500 characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Skills Section */}
            <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Areas of Expertise</FormLabel>
                    <SkillSelector
                        selectedSkills={
                        field.value.map((skill) => skill.name).filter(isValidSkill) as Skill[]
                        } // Ensure only valid skills are passed
                        onChange={(skills) =>
                        field.onChange(
                            skills.map((name) => ({ name, level: "Beginner" }))
                        )
                        }
                    />
                    <FormMessage />
                    </FormItem>
                )}
            />


            {/* Languages */}
            <FormField
                control={form.control}
                name="languages"
                render={({ field: fieldProps }) => (
                    <FormItem>
                    <FormLabel>Languages</FormLabel>
                    <FormControl>
                        <UserSelection
                        selectionMode="language"
                        defaultValue={fieldProps.value || []}
                        onChange={fieldProps.onChange}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

            {/* Certifications */}
            <FormField
              control={form.control}
              name="certifications"
              render={({ field: fieldProps }) => (
                <FormItem>
                  <FormLabel>Certifications</FormLabel>
                  <div className="space-y-2">
                    {fieldProps.value.map((cert, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <Input
                          value={cert}
                          onChange={(e) => {
                            const newCerts = [...fieldProps.value];
                            newCerts[index] = e.target.value;
                            fieldProps.onChange(newCerts);
                          }}
                          placeholder="Enter certification"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const newCerts = fieldProps.value.filter((_, i) => i !== index);
                            fieldProps.onChange(newCerts);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        fieldProps.onChange([...fieldProps.value, '']);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Certification
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Projects */}
            <FormField
              control={form.control}
              name="projects"
              render={({ field: fieldProps }) => (
                <FormItem>
                  <FormLabel>Projects</FormLabel>
                  <div className="space-y-2">
                    {fieldProps.value.map((project, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <Input
                          value={project}
                          onChange={(e) => {
                            const newProjects = [...fieldProps.value];
                            newProjects[index] = e.target.value;
                            fieldProps.onChange(newProjects);
                          }}
                          placeholder="Enter project name"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const newProjects = fieldProps.value.filter((_, i) => i !== index);
                            fieldProps.onChange(newProjects);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        fieldProps.onChange([...fieldProps.value, '']);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Project
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Interests */}
            <FormField
              control={form.control}
              name="interests"
              render={({ field: fieldProps }) => (
                <FormItem>
                  <FormLabel>Interests</FormLabel>
                  <div className="space-y-2">
                    {fieldProps.value.map((interest, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <Input
                          value={interest}
                          onChange={(e) => {
                            const newInterests = [...fieldProps.value];
                            newInterests[index] = e.target.value;
                            fieldProps.onChange(newInterests);
                          }}
                          placeholder="Enter your interest"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const newInterests = fieldProps.value.filter((_, i) => i !== index);
                            fieldProps.onChange(newInterests);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        fieldProps.onChange([...fieldProps.value, '']);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Interest
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Mentor Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="lookingForMentor"
                render={({ field: fieldProps }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Looking for Mentor
                      </FormLabel>
                      <FormDescription>
                        Indicate if you are seeking mentorship
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={fieldProps.value}
                        onCheckedChange={fieldProps.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="willingToMentor"
                render={({ field: fieldProps }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Willing to Mentor
                      </FormLabel>
                      <FormDescription>
                        Indicate if you want to mentor others
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={fieldProps.value}
                        onCheckedChange={fieldProps.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? <Spinner size="sm" color="white" /> : "Save Personal Information"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UserDetails;