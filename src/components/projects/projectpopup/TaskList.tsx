import React from "react";
import { Card, CardHeader, CardBody, Avatar, Textarea, Input, Divider } from "@nextui-org/react";
import { FaCalendarAlt } from "react-icons/fa";
import { Task, Participants } from "@/store/project";

interface TaskListProps {
  tasks: Task[];
  participant: Participants; // To display the creator's avatar
}

const TaskList: React.FC<TaskListProps> = ({ tasks, participant }) => {
  return (
    <>
      {tasks.map((task, index) => (
        <Card
          key={index}
          className="mb-4 p-4 border rounded-lg shadow-md flex flex-col gap-4 bg-white hover:shadow-lg transition-shadow duration-200"
        >
          {/* Header */}
          <CardHeader className="flex justify-between items-center">
            {/* Creator's Avatar */}
            <div className="flex items-center gap-2">
              <Avatar
                src={participant.profilePicture || ""}
                alt={participant.username || "User"}
                className="w-8 h-8 border border-gray-300"
              />
              <span className="font-medium">{participant.username}</span>
            </div>

            {/* Status */}
            <div className="text-sm font-semibold">
              <span>Status: </span>
              <span
                className={
                  task.status === "todo"
                    ? "text-yellow-600"
                    : task.status === "in_progress"
                    ? "text-blue-600"
                    : task.status === "done"
                    ? "text-green-600"
                    : "text-gray-600"
                }
              >
                {task.status.replace("_", " ")}
              </span>
            </div>
          </CardHeader>

          {/* Divider */}
          <Divider className="my-2" />

          {/* Body */}
          <CardBody>
            {/* Title */}
            <Input
              label="Title"
              value={task.title}
              readOnly
              fullWidth
              className="text-md font-semibold"
            />

            {/* Description */}
            <Textarea
              label="Description"
              value={task.description}
              readOnly
              fullWidth
              className="text-md font-semibold"
            />

            {/* Priority and Due Date */}
            <div className="flex flex-col gap-2 text-sm mt-4">
              {/* Priority */}
              <div className="flex items-center gap-2">
                <span className="font-medium">Priority:</span>
                <span
                  className={
                    task.priority === "low"
                      ? "text-green-600"
                      : task.priority === "medium"
                      ? "text-yellow-600"
                      : task.priority === "high"
                      ? "text-red-600"
                      : "text-gray-600"
                  }
                >
                  {task.priority}
                </span>
              </div>

              {/* Due Date */}
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-blue-400" />
                <span className="font-medium">Due Date:</span>
                {new Date(task.dueDate).toLocaleDateString()}
              </div>
            </div>

            {/* Assigned To */}
            <div className="flex items-center gap-2 mt-4">
              <span className="font-medium text-gray-500">Assigned To:</span>
              {Array.isArray(task.assignedTo) && task.assignedTo.length > 0 ? (
                task.assignedTo.map((user, idx) => (
                  <Avatar
                    key={idx}
                    src={user.profilePicture || ""}
                    alt={user.username || "User"}
                    className="w-8 h-8 border border-gray-300"
                  />
                ))
              ) : (
                <span className="text-gray-500 italic">No assignees</span>
              )}
            </div>
          </CardBody>
        </Card>
      ))}
    </>
  );
};

export default TaskList;

