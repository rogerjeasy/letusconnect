import * as z from "zod";

const categoryEnum = ['academic', 'professional', 'research', 'social', 'projects', 'mentorship'] as const;

export const groupForumSchema = z.object({
 name: z.string()
   .min(3, 'Group name must be at least 3 characters')
   .max(50, 'Group name cannot exceed 50 characters'),
 description: z.string()
   .min(20, 'Description must be at least 20 characters')
   .max(500, 'Description cannot exceed 500 characters'),
 category: z.object({
   name: z.enum(categoryEnum, {
     required_error: 'Please select a category'
   }),
   icon: z.string(),
   description: z.string(),
   count: z.number()
 }).strict(),
 privacy: z.enum(['public', 'private', 'restricted'] as const, {
   required_error: 'Please select privacy level'
 }),
 size: z.enum(['small', 'medium', 'large'] as const).default('small'),
 featured: z.boolean().default(false),
 activityLevel: z.string().default('new'),
 members: z.array(z.object({
   userId: z.string(),
   groupId: z.string(),
   joinedAt: z.string(),
   role: z.string(),
   status: z.string()
 }).strict()).default([]),
 topics: z.array(z.object({
   id: z.string(),
   name: z.string(),
   color: z.string(),
   description: z.string()
 }).strict()).default([]),
 events: z.array(z.object({
   id: z.string(),
   groupId: z.string(),
   title: z.string(), 
   description: z.string(),
   startTime: z.string(),
   endTime: z.string(),
   location: z.string(),
   type: z.string(),
   attendees: z.array(z.object({
     id: z.string(),
     name: z.string(),
     email: z.string()
   }).strict())
 }).strict()).default([]),
 resources: z.array(z.object({
   id: z.string(),
   groupId: z.string(),
   title: z.string(),
   type: z.string(),
   url: z.string(),
   description: z.string(),
   addedBy: z.string(),
   addedAt: z.string()
 }).strict()).default([]),
 admins: z.array(z.object({
   id: z.string(),
   name: z.string(),
   email: z.string()
 }).strict()).default([]),
 rules: z.array(z.object({
   id: z.string(),
   groupId: z.string(),
   title: z.string(),
   description: z.string(),
   order: z.number()
 }).strict()).default([])
}).strict();

export type GroupForumFormData = z.infer<typeof groupForumSchema>;