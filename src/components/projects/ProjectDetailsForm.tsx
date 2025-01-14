"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Textarea,
  Button,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { api, handleError } from "@/helpers/api";
import { collaborationTypes, industries, statuses, skills } from "@/store/project";

interface ProjectDetailsFormProps {
  formData: {
    id: string;
    title: string;
    description: string;
    collaborationType: string;
    industry: string;
    skillsNeeded: string[];
    status: string;
  };
  setFormData: (data: any) => void;
  isEditable?: boolean;
  onSave?: () => void;
  onCancel?: () => void;
}

const ProjectDetailsForm = ({
  formData,
  setFormData,
  isEditable = false,
  onSave,
  onCancel,
}: ProjectDetailsFormProps) => {
  const [isEditing, setIsEditing] = useState(isEditable);
  const [initialData, setInitialData] = useState({ ...formData });
  const [loading, setLoading] = useState(false);

  // Update initial data when formData changes
  useEffect(() => {
    setInitialData({ ...formData });
  }, [formData]);

  const handleCancel = () => {
    setFormData({ ...initialData });
    setIsEditing(false);
    if (onCancel) onCancel();
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token is missing.");
      }

      const response = await api.put(
        `/api/projects/${formData.id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(response.data.message);
      setIsEditing(false);
      if (onSave) onSave();
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 shadow-md">
      <CardHeader className="text-lg font-semibold flex items-center gap-2 justify-between">
        Project Details
        {isEditable && (
        <Button color="primary" size="sm" onPress={() => setIsEditing(true)}>
            <FaEdit className="mr-2" /> {isEditing ? "Editing..." : "Edit"}
        </Button>
        )}
      </CardHeader>

      <CardBody className="space-y-4">
        {/* Title */}
        <Input
          label="Title"
          placeholder="Enter project title"
          value={formData.title}
          className="font-bold"
        //   isRequired
          readOnly={!isEditing}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        {/* Description */}
        <Textarea
          label="Description"
          placeholder="Enter project description"
          value={formData.description}
          className="font-bold"
        //   isRequired
          readOnly={!isEditing}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />

        <div className="flex flex-col md:flex-row gap-4">
          {/* Visibility */}
          <div className="w-full md:w-1/3">
            {!isEditing ? (
              <Input label="Visibility" value={formData.collaborationType} readOnly className="font-bold" />
            ) : (
              <Select
                label="Visibility"
                placeholder="Select visibility type"
                className="font-bold"
                // isRequired
                selectedKeys={formData.collaborationType ? new Set([formData.collaborationType]) : new Set()}
                onSelectionChange={(keys) => setFormData({ ...formData, collaborationType: Array.from(keys)[0] as string })}
              >
                {collaborationTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </Select>
            )}
          </div>

          {/* Industry */}
          <div className="w-full md:w-1/3">
            {!isEditing ? (
              <Input label="Industry" value={formData.industry} readOnly className="font-bold" />
            ) : (
              <Select
                label="Industry"
                placeholder="Select industry"
                className="font-bold"
                selectedKeys={formData.industry ? new Set([formData.industry]) : new Set()}
                onSelectionChange={(keys) => setFormData({ ...formData, industry: Array.from(keys)[0] as string })}
              >
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </Select>
            )}
          </div>

          {/* Project Status */}
          <div className="w-full md:w-1/3">
            {!isEditing ? (
              <Input label="Project Status" value={formData.status} readOnly className="font-bold" />
            ) : (
              <Select
                label="Project Status"
                placeholder="Select project status"
                className="font-bold"
                selectedKeys={formData.status ? new Set([formData.status]) : new Set()}
                onSelectionChange={(keys) => setFormData({ ...formData, status: Array.from(keys)[0] as string })}
              >
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </Select>
            )}
          </div>
        </div>

        {/* Skills Needed */}
        {!isEditing ? (
          <Input
            label="Skills Needed"
            value={Array.isArray(formData.skillsNeeded) ? formData.skillsNeeded.join(", ") : ""}
            readOnly
            className="font-bold"
        />
        
        ) : (
          <Select
            label="Skills Needed"
            placeholder="Select required skills"
            selectionMode="multiple"
            className="font-bold"
            selectedKeys={formData.skillsNeeded}
            onSelectionChange={(keys) => setFormData({ ...formData, skillsNeeded: Array.from(keys) as string[] })}
          >
            {skills.map((skill) => (
              <SelectItem key={skill} value={skill}>
                {skill}
              </SelectItem>
            ))}
          </Select>
        )}
      </CardBody>

      {/* Save and Cancel Buttons */}
      {isEditing && (
        <CardFooter className="flex justify-end gap-4">
          <Button color="success" onPress={handleSave} className="w-24">
            <FaSave className="mr-2" /> Save
          </Button>
          <Button color="danger" variant="bordered" onPress={handleCancel} className="w-24">
            <FaTimes className="mr-2" /> Cancel
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ProjectDetailsForm;