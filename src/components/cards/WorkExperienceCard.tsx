"use client";

import { Card, CardHeader, CardBody, Divider, Button } from "@nextui-org/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DeleteDocumentIcon } from "../icons/DeleteDocumentIcon";
import { EditDocumentIcon } from "../icons/EditDocumentIcon";
import DynamicListManager from "../forms/DynamicListManager";
import { WorkExperience } from "../../store/userStore";
import CountrySelectorField from "../forms/CountrySelectorField";
import FieldName from "../forms/InputTextField";
import FullDateSelector from "../forms/FullDateSelector";

// WorkExperience Schema for Validation
const workExperienceSchema = z
  .object({
    company: z.string().min(1, "Company name is required."),
    position: z.string().min(1, "Position is required."),
    country: z.string().min(1, "Country is required."),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    responsibilities: z.array(z.string()).optional(),
    achievements: z.array(z.string()).optional(),
    city: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) {
        return true;
      }
      return data.startDate <= data.endDate;
    },
    {
      path: ["endDate"],
      message: "End date must be after or the same as the start date.",
    }
  );

type WorkExperienceFormValues = z.infer<typeof workExperienceSchema>;

interface WorkExperienceCardProps {
  workExperience: WorkExperience;
  workIndex: number;
  isEditing: boolean;
  handleFieldValue: (index: number, field: keyof WorkExperience, value: string) => void;
  setSelectedCountry: (country: string) => void;
  handleDeleteWorkExperience: (index: number) => void;
  handleAddResponsibility: (workIndex: number) => void;
  handleUpdateResponsibility: (workIndex: number, resIndex: number, value: string) => void;
  handleDeleteResponsibility: (workIndex: number, resIndex: number) => void;
  handleAddAchievement: (workIndex: number) => void;
  handleUpdateAchievement: (workIndex: number, achIndex: number, value: string) => void;
  handleDeleteAchievement: (workIndex: number, achIndex: number) => void;
  handleDateChange: (field: "startDate" | "endDate", date: Date | null) => void;
  toggleEdit: (index: number) => void;
  saveChanges: (index: number, data: WorkExperienceFormValues) => void;
  cancelChanges: (index: number) => void;
}

export default function WorkExperienceCard({
  workExperience,
  workIndex,
  isEditing,
  handleFieldValue,
  setSelectedCountry,
  handleDeleteWorkExperience,
  handleAddResponsibility,
  handleUpdateResponsibility,
  handleDeleteResponsibility,
  handleAddAchievement,
  handleUpdateAchievement,
  handleDeleteAchievement,
  handleDateChange,
  toggleEdit,
  saveChanges,
  cancelChanges,
}: WorkExperienceCardProps) {
  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<WorkExperienceFormValues>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: {
      company: workExperience.company || "",
      position: workExperience.position || "",
      city: workExperience.city || "",
      country: workExperience.country || "",
      startDate: workExperience.startDate || undefined,
      endDate: workExperience.endDate || undefined,
      responsibilities: workExperience.responsibilities || [],
      achievements: workExperience.achievements || [],
    },
  });

  const onSubmit: SubmitHandler<WorkExperienceFormValues> = (data) => {
    saveChanges(workIndex, data);
  };

  return (
    <Card key={workIndex} className="mb-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader className="flex justify-between items-center">
          <p className="text-md font-bold">{workExperience.company || `Work Experience`}</p>
          <div className="flex gap-2">
            <Button size="sm" variant="flat" color="primary" onPress={() => toggleEdit(workIndex)}>
              {isEditing ? (
                <>
                  <EditDocumentIcon className="mr-2" />
                  Editing...
                </>
              ) : (
                <>
                  <EditDocumentIcon className="mr-2" />
                  Edit
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="flat"
              color="danger"
              onPress={() => handleDeleteWorkExperience(workIndex)}
              startContent={<DeleteDocumentIcon />}
            >
              Delete
            </Button>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          {/* First Row: Company, Position, City */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
                <FieldName label="Company" 
                    value={workExperience.company} 
                    isEditing={isEditing} 
                    error={errors.company?.message} 
                    setValue={setValue} 
                    fieldValue="company" />
            </div>
            <div className="flex-1 min-w-[200px]">
                <FieldName label="Position" 
                    value={workExperience.position} 
                    isEditing={isEditing} 
                    error={errors.position?.message} 
                    setValue={setValue} 
                    fieldValue="position" />
            </div>
            <div className="flex-1 min-w-[200px]">
                <FieldName label="City" 
                    value={workExperience.city || ""} 
                    isEditing={isEditing} 
                    error={errors.city?.message} 
                    setValue={setValue} 
                    fieldValue="city" 
                />
            </div>
          </div>

          {/* Second Row: Country, Start Date, End Date */}
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex-1 min-w-[200px]">
                <CountrySelectorField 
                    label="Country" 
                    value={workExperience.country} 
                    isEditing={isEditing} 
                    handleFieldChange={(value) => handleFieldValue(workIndex, "country", value)} 
                    setSelectedCountry={setSelectedCountry} 
                    setValue={setValue} 
                    fieldValue="country" 
                    error={errors.country?.message} 
                />
            </div>
            
            <div className="flex-1 min-w-[200px]">
                <FullDateSelector label="Start Date" value={workExperience.startDate} onChange={(date) => handleDateChange("startDate", date)} />
            </div>
            
            <div className="flex-1 min-w-[200px]">
                <FullDateSelector 
                    label="End Date" 
                    value={workExperience.endDate} 
                    onChange={(date) => handleDateChange("endDate", date)} 
                />
            </div>
          </div>

          {/* Third Row: Responsibilities */}
          <div className="mt-4">
            <DynamicListManager title="Responsibilities" items={workExperience.responsibilities || []} isEditing={isEditing} handleAddItem={() => handleAddResponsibility(workIndex)} handleUpdateItem={(index, value) => handleUpdateResponsibility(workIndex, index, value)} handleDeleteItem={(index) => handleDeleteResponsibility(workIndex, index)} />
          </div>

          {/* Fourth Row: Achievements */}
          <div className="mt-4">
            <DynamicListManager title="Achievements" items={workExperience.achievements || []} isEditing={isEditing} handleAddItem={() => handleAddAchievement(workIndex)} handleUpdateItem={(index, value) => handleUpdateAchievement(workIndex, index, value)} handleDeleteItem={(index) => handleDeleteAchievement(workIndex, index)} />
          </div>
        </CardBody>
        <Divider />
        <div className="flex justify-end gap-2 p-4">
          {isEditing && (
            <>
              <Button size="sm" variant="flat" color="primary" type="submit">
                Save
              </Button>
              <Button size="sm" variant="flat" color="danger" onPress={() => cancelChanges(workIndex)}>
                Cancel
              </Button>
            </>
          )}
        </div>
      </form>
    </Card>
  );
}
