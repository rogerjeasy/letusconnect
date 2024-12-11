"use client";

import { useState } from "react";
import { Card, CardHeader, CardBody, Divider, Button } from "@nextui-org/react";
import { WorkExperience } from "../../store/userStore";
import { useUserStore } from "../../store/userStore";
import { api } from "../../helpers/api";
import PlusCircleIcon from "../icons/PlusCircleIcon";
import WorkExperienceCard from "../cards/WorkExperienceCard";

// Default new work experience template
const newWorkExperienceTemplate: WorkExperience = {
  id: "",
  company: "",
  position: "",
  city: "",
  country: "",
  startDate: null,
  endDate: null,
  responsibilities: [],
  achievements: [],
};

export default function UserWorkExperienceComponent() {
  const workExperience = useUserStore((state) => state.workExperience);
  const setWorkExperience = useUserStore((state) => state.setWorkExperience);

  const [isEditingIndex, setIsEditingIndex] = useState<number | null>(null);
  const [validationError, ] = useState<string | null>(null);

  // const handleAddWorkExperience = async () => {
  //   try {
  //     const response = await api.post(
  //       `/api/work-experiences/${workExperience?.uid}/work-experiences`,
  //       newWorkExperienceTemplate,
  //       {
  //         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  //       }
  //     );

  //     const newWorkExperience = response.data.workExperiences.slice(-1)[0];

  //     const updatedWorkExperiences = [
  //       ...(workExperience?.workExperiences || []),
  //       newWorkExperience,
  //     ];

  //     setWorkExperience({
  //       ...workExperience,
  //       uid: workExperience?.uid || "",
  //       workExperiences: updatedWorkExperiences,
  //     });

  //     setIsEditingIndex(updatedWorkExperiences.length - 1);
  //   } catch (error) {
  //     console.error("Error adding new work experience:", error);
  //   }
  // };

  const handleAddWorkExperience = () => {
    const updatedWorkExperiences = [
      ...(workExperience?.workExperiences || []),
      { ...newWorkExperienceTemplate, id: Date.now().toString() }, // Assign a unique id
    ];

    setWorkExperience({
      ...workExperience,
      uid: workExperience?.uid || "",
      workExperiences: updatedWorkExperiences,
    });

    setIsEditingIndex(updatedWorkExperiences.length - 1);
  };

  const handleDeleteWorkExperience = async (index: number) => {
    const currentWorkExperience = workExperience?.workExperiences[index];
    if (!currentWorkExperience || !currentWorkExperience.id) return;

    try {
      await api.delete(
        `/api/work-experiences/${workExperience?.uid}/work-experiences/${currentWorkExperience.id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const updatedWorkExperiences = [...workExperience?.workExperiences || []];
      updatedWorkExperiences.splice(index, 1);

      setWorkExperience({
        ...workExperience,
        workExperiences: updatedWorkExperiences,
      });
    } catch (error) {
      console.error("Error deleting work experience:", error);
    }
  };

  const toggleEdit = (index: number) => {
    setIsEditingIndex(isEditingIndex === index ? null : index);
  };

  const cancelChanges = () => {
    setIsEditingIndex(null);
  };

  const saveChanges = async (index: number, updatedData: WorkExperience) => {
    const currentWorkExperience = workExperience?.workExperiences[index];

    if (!currentWorkExperience || !currentWorkExperience.id) return;

    const dataToSave: WorkExperience = {
      id: currentWorkExperience.id,
      company: updatedData.company || currentWorkExperience.company,
      position: updatedData.position || currentWorkExperience.position,
      city: updatedData.city || currentWorkExperience.city || "",
      country: updatedData.country || currentWorkExperience.country,
      startDate: updatedData.startDate !== undefined ? updatedData.startDate : currentWorkExperience.startDate,
      endDate: updatedData.endDate !== undefined ? updatedData.endDate : currentWorkExperience.endDate,
      responsibilities: updatedData.responsibilities || currentWorkExperience.responsibilities,
      achievements: updatedData.achievements || currentWorkExperience.achievements,
    };

    try {
      const response = await api.put(
        `/api/work-experiences/${workExperience?.uid}/work-experiences/${currentWorkExperience.id}`,
        dataToSave,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const updatedWorkExperiences = [...workExperience?.workExperiences || []];
      updatedWorkExperiences[index] = response.data;

      setWorkExperience({
        ...workExperience,
        workExperiences: updatedWorkExperiences,
      });

      setIsEditingIndex(null);
    } catch (error) {
      console.error("Error saving work experience:", error);
    }
  };

  const handleFieldValue = (index: number, field: keyof WorkExperience, value: string) => {
    const updatedWorkExperiences = [...workExperience?.workExperiences || []];
    updatedWorkExperiences[index] = { ...updatedWorkExperiences[index], [field]: value };

    setWorkExperience({
      ...workExperience,
      uid: workExperience?.uid || "",
      workExperiences: updatedWorkExperiences,
    });
  }

  const handleDateChange = (index: number, field: "startDate" | "endDate", date: Date | null) => {
    const updatedWorkExperiences = [...workExperience?.workExperiences || []];
    updatedWorkExperiences[index] = { ...updatedWorkExperiences[index], [field]: date };
    setWorkExperience({
      ...workExperience,
      uid: workExperience?.uid || "",
      workExperiences: updatedWorkExperiences,
    });
  };

  return (
    <div className="relative">
      <Card className="max-w-[800px] mx-auto">
        <CardHeader className="flex justify-between items-center">
          <p className="text-md font-bold">Work Experience</p>
        </CardHeader>
        <Divider />

        <CardBody>
          {workExperience?.workExperiences?.map((workExp, workIndex) => (
            <WorkExperienceCard
              key={workExp.id || workIndex}
              workExperience={workExp}
              workIndex={workIndex}
              isEditing={isEditingIndex === workIndex}
              handleFieldValue={handleFieldValue}
              handleDeleteWorkExperience={handleDeleteWorkExperience}
              handleDateChange={(field, date) => handleDateChange(workIndex, field, date)}
              toggleEdit={toggleEdit}
              saveChanges={(index, data) =>
                saveChanges(index, {
                  ...data,
                  id: workExp.id,
                  startDate: data.startDate ?? null,
                  endDate: data.endDate ?? null,
                  responsibilities: data.responsibilities ?? [], 
                  achievements: data.achievements ?? [],
                })
              }
              cancelChanges={cancelChanges}
              setSelectedCountry={(country) => handleFieldValue(workIndex, "country", country)}
              handleAddResponsibility={() => handleFieldValue(workIndex, "responsibilities", "")}
              handleUpdateResponsibility={() => {}}
              handleDeleteResponsibility={() => {}}
              handleAddAchievement={() => handleFieldValue(workIndex, "achievements", "")}
              handleUpdateAchievement={() => {}}
              handleDeleteAchievement={() => {}}
            />
          ))}

          <div className="flex flex-col items-center mt-4">
            {validationError && (
              <p className="text-red-500 text-sm mb-2">{validationError}</p>
            )}
            <Button
              size="lg"
              variant="flat"
              color="primary"
              onPress={handleAddWorkExperience}
              startContent={<PlusCircleIcon />}
            >
              {workExperience?.workExperiences?.length === 0
                ? "Add Work Experience"
                : "Save Your Previous Work Experience to Add a New One"}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
