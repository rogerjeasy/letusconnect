"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
} from "@nextui-org/react";
import { FaSave, 
    FaTimes,
    // FaPencilAlt 
} from "react-icons/fa";
import { Task, Participants } from "@/store/project";
import AssignedToComponent from "./AssignedToComponent";
import InputToUpdate from "../../forms/InputToUpdate";
import TextareaForm from "../../forms/TextArea";
import SingleDropdownSelection from "../../forms/SingleSelection";
import { taskSchema } from "../../../schemas/taskSchema";
import { z } from "zod";

interface TaskCardProps {
  task: Task;
  users: Participants[];
  manageTask?: boolean;
  creatingProject?: boolean;
  onSave?: (updatedTask: Task) => void;
  onCancel?: () => void;
}

const statuses = [
  { key: "todo", label: "Todo" },
  { key: "in_progress", label: "In Progress" },
  { key: "done", label: "Done" },
  { key: "archived", label: "Archived" },
  { key: "blocked", label: "Blocked" },
];

const priorities = [
  { key: "low", label: "Low" },
  { key: "medium", label: "Medium" },
  { key: "high", label: "High" },
  { key: "critical", label: "Critical" },
];

const TaskCard = ({
  task,
  users,
  manageTask = false,
  creatingProject = false,
  onSave,
  onCancel,
}: TaskCardProps) => {
  const [updatedTask, setUpdatedTask] = useState(task);
  const [assignedUsers, setAssignedUsers] = useState(task.assignedTo);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSave = () => {
    try {
      // Validate task data with taskSchema
      taskSchema.parse(updatedTask);
      if (onSave) {
        onSave({ ...updatedTask, assignedTo: assignedUsers });
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path) {
            fieldErrors[error.path[0]] = error.message;
          }
        });
        setErrors(fieldErrors);
      }
    }
  };

  return (
    <Card className="w-full max-w-5xl shadow-lg">
      <CardHeader className="text-lg font-bold">Task Details</CardHeader>

      <CardBody className="space-y-4">
        {/* Task Title */}
        <InputToUpdate
          type="text"
          label="Title"
          placeholder="Enter task title"
          value={updatedTask.title}
          width="w-full"
          onChange={(value) => setUpdatedTask({ ...updatedTask, title: value })}
          isInvalid={!!errors.title}
          errorMessage={errors.title}
        />

        {/* Task Description */}
        <TextareaForm
          label="Description"
          placeholder="Enter task description"
          description="Provide a brief description of the task."
          value={updatedTask.description}
          onChange={(value) => setUpdatedTask({ ...updatedTask, description: value })}
          isInvalid={!!errors.description}
          errorMessage={errors.description}
        />

        {/* Task Status, Priority, and Due Date on the same line */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/3">
            <SingleDropdownSelection
              label="Status"
              placeholder="Select task status"
              options={statuses}
              onChange={(selectedKey) =>
                setUpdatedTask({ ...updatedTask, status: selectedKey })
              }
            />
          </div>

          <div className="w-full md:w-1/3">
            <SingleDropdownSelection
              label="Priority"
              placeholder="Select task priority"
              options={priorities}
              onChange={(selectedKey) =>
                setUpdatedTask({ ...updatedTask, priority: selectedKey })
              }
            />
          </div>

          <div className="w-full md:w-1/3">
            <InputToUpdate
              type="date"
              label="Due Date"
              placeholder="Select due date"
              value={updatedTask.dueDate.toISOString().split("T")[0]}
              onChange={(value) => setUpdatedTask({ ...updatedTask, dueDate: new Date(value) })}
            />
          </div>
        </div>

        {/* Assigned To */}
        <div>
          <strong>Assigned To:</strong>
          <AssignedToComponent
            users={users}
            onSelectionChange={(selectedUsers) => setAssignedUsers(selectedUsers)}
          />
        </div>
      </CardBody>

      {/* Conditionally render the buttons based on manageTask and creatingProject */}
      <CardFooter className="flex justify-end gap-4">
        {creatingProject ? (
          <>
            <Button color="success" onClick={handleSave}>
              <FaSave className="mr-2" /> Add To Tasks
            </Button>
            {/* <Button color="secondary" variant="ghost" onClick={handleSave}>
              <FaPencilAlt className="mr-2" /> Save Draft
            </Button> */}
            <Button color="danger" variant="bordered" onClick={onCancel}>
              <FaTimes className="mr-2" /> Cancel
            </Button>
          </>
        ) : (
          manageTask && (
            <>
              <Button color="success" onClick={handleSave}>
                <FaSave className="mr-2" /> Save
              </Button>
              <Button color="danger" variant="bordered" onClick={onCancel}>
                <FaTimes className="mr-2" /> Cancel
              </Button>
            </>
          )
        )}
      </CardFooter>
    </Card>
  );
};

export default TaskCard;