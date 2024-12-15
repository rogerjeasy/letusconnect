import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().nonempty("Title is required"),
  description: z.string().nonempty("Description is required"),
  collaborationType: z.string().nonempty("Collaboration type is required"),
  industry: z.string().nonempty("Industry is required"),
  skillsNeeded: z.array(z.string()).nonempty("At least one skill is required"),
  status: z.string().nonempty("Project status is required"),
  tasks: z.array(
    z.object({
      id: z.string(),
      title: z.string().nonempty("Task title is required"),
      description: z.string().nonempty("Task description is required"),
      status: z.string(),
      priority: z.string(),
      dueDate: z.date(),
      assignedTo: z.array(z.string()),
    })
  ),
});
