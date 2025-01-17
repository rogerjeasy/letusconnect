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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { User } from '@/store/userStore';
import { 
  SKILL_CATEGORIES, 
  SkillCategory, 
  Skill, 
  getAllCategories,
  getSkillsByCategory,
  getAllSkills 
} from '@/store/skills';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { DateValue } from '@nextui-org/react';
import UserSelection from '../forms/SelectCountry';

interface UserDetailsProps {
  user: User | null;
  onUpdate: (data: Partial<User>) => Promise<void>;
}

const languages = [""
] as const;

const userDetailsSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string(),
  phoneCode: z.string(),
  bio: z.string().max(500, "Bio must not exceed 500 characters"),
  currentJobTitle: z.string(),
  program: z.string().min(2, "Program is required"),
  lookingForMentor: z.boolean(),
  willingToMentor: z.boolean(),
  graduationYear: z.number().min(1900).max(new Date().getFullYear() + 10),
  interests: z.array(z.string()),
  languages: z.array(z.enum([...languages])),
  skills: z.array(z.object({
    name: z.string(),
    level: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"]),
  })),
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
  const [skillSearchOpen, setSkillSearchOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | null>(null);

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
      program: user?.program || "",
      lookingForMentor: user?.lookingForMentor || false,
      willingToMentor: user?.willingToMentor || false,
      graduationYear: user?.graduationYear || new Date().getFullYear(),
      interests: user?.interests || [],
      languages: (user?.languages || []) as typeof languages[number][],
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
      await onUpdate({
        ...data,
        dateOfBirth: data.dateOfBirth 
          ? new Date(data.dateOfBirth) as unknown as DateValue
          : null,
        skills: data.skills.map(skill => skill.name) as Skill[],
      });
    } catch (error) {
      console.error('Error updating user details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const allCategories = getAllCategories();
  const selectedSkills = form.watch("skills");

  const toggleSkill = (skillName: string, category: SkillCategory) => {
    const currentSkills = form.getValues("skills");
    const skillExists = currentSkills.find(s => s.name === skillName);
    
    if (skillExists) {
      form.setValue("skills", currentSkills.filter(s => s.name !== skillName));
    } else {
      form.setValue("skills", [
        ...currentSkills,
        { name: skillName, level: "Beginner" }
      ]);
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
                      <Input 
                        type="number"
                        placeholder="Graduation year"
                        {...fieldProps}
                        onChange={(e) => fieldProps.onChange(parseInt(e.target.value) || new Date().getFullYear())}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="program"
                render={({ field: fieldProps }) => (
                  <FormItem>
                    <FormLabel>Program</FormLabel>
                    <Select 
                      onValueChange={fieldProps.onChange} 
                      defaultValue={fieldProps.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your program" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Applied Information and Data Science">
                          Applied Information and Data Science
                        </SelectItem>
                        <SelectItem value="Information and Cyber Security">
                          Information and Cyber Security
                        </SelectItem>
                        <SelectItem value="Digital Business">
                          Digital Business
                        </SelectItem>
                      </SelectContent>
                    </Select>
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
                    <FormLabel>Code</FormLabel>
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
            <div className="space-y-4">
              <FormLabel>Skills</FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Select onValueChange={(value) => setSelectedCategory(value as SkillCategory)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {allCategories.map((category) => (
                        <SelectItem key={category.key} value={category.key}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Popover open={skillSearchOpen} onOpenChange={setSkillSearchOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={skillSearchOpen}
                      className="justify-between"
                    >
                      Select skills
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search skills..." />
                      <CommandEmpty>No skill found.</CommandEmpty>
                      {selectedCategory && (
                        <CommandGroup>
                          {getSkillsByCategory(selectedCategory).map((skill) => {
                            const isSelected = selectedSkills.some(s => s.name === skill);
                            return (
                              <CommandItem
                                key={skill}
                                onSelect={() => toggleSkill(skill, selectedCategory)}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    isSelected ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {skill}
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      )}
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedSkills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {skill.name}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => {
                        const newSkills = selectedSkills.filter((_, i) => i !== index);
                        form.setValue("skills", newSkills);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>

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
              {isLoading ? "Updating..." : "Save Personal Information"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UserDetails;