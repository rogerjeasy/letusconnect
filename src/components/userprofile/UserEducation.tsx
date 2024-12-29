"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Divider, Button } from "@nextui-org/react";
import { University, UserSchoolExperience } from "../../store/userStore";
import { useUserStore } from "../../store/userStore";
import { api, handleError } from "../../helpers/api";
import EducationCard from "../cards/EducationCard";
import { z } from "zod";
import PlusCircleIcon from "../icons/PlusCircleIcon";

// Zod Schema for Validation
const educationSchema = z
  .object({
    country: z.string().min(1, "Country is required."),
    name: z.string().min(1, "University name is required."),
    program: z.string().min(1, "Program is required."),
    degree: z.string().min(1, "Degree is required."),
    startYear: z.number().min(1900, "Start year is required."),
    endYear: z.number().min(1900, "End year is required."),
    awards: z.array(z.string()).optional(),
    experience: z.string().optional(),
  })
  .refine((data) => data.startYear <= data.endYear, {
    path: ["endYear"],
    message: "End year must be after or the same as the start year.",
  });

  type EducationFormValues = z.infer<typeof educationSchema>;


export default function UserEducation() {

  const schoolExperience = useUserStore((state) => state.schoolExperience);
  const setSchoolExperience = useUserStore((state) => state.setSchoolExperience);
  // const user = useUserStore((state) => state.user);

  const [, setIsEditing] = useState(false);
  const [universities, setUniversities] = useState<{ key: string; label: string }[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [manualUniversity, setManualUniversity] = useState<string>("");
  const [isEditingIndex, setIsEditingIndex] = useState<number | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [, setFieldValues] = useState<Record<number, Partial<University>>>({});

  const proxyApi = {
    get: async (endpoint: string) => {
      const response = await fetch(endpoint);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch: ${response.statusText}`);
      }
      return response.json();
    }
  };

  const fetchUniversities = async (country: string) => {
    const endpoint = country 
    ? `/api/proxy/universities?country=${encodeURIComponent(country)}`
    : '/api/proxy/universities';

    try {
      setIsLoading(true);
      const data: University[] = await proxyApi.get(endpoint);
    
    const universityNames = data.map((university) => ({
      key: `${university.name}`,
      label: university.name,
    }));
    setUniversities(universityNames);
    } catch (error) {
      console.error("Error fetching universities:", error);
      alert("Failed to fetch universities. Please try again.");
      setUniversities([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUniversities(selectedCountry);
  }, [selectedCountry]);

  useEffect(() => {
    if (schoolExperience?.universities?.length) {
      const currentEducation = schoolExperience.universities[schoolExperience.universities.length - 1];
      const validation = educationSchema.safeParse(currentEducation);
  
      if (!validation.success) {
        setValidationError(validation.error.errors[0]?.message || "Validation failed.");
      } else {
        setValidationError(null);
      }
    }
  }, [schoolExperience?.universities]); 

  const validateCurrentEducation = () => {
    if (!schoolExperience?.universities?.length) return true;

    const currentEducation = schoolExperience.universities[schoolExperience.universities.length - 1];
    const validation = educationSchema.safeParse(currentEducation);

    if (!validation.success) {
      setValidationError(validation.error.errors[0]?.message || "Validation failed.");
      return false;
    }
    setValidationError(null);
    return true;
  };

  const handleFieldValue = (index: number, field: keyof University, value: string | number | string[]) => {
    setFieldValues((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [field]: value,
      },
    }));
  };

  const handleAddEducation = async () => {
    if (!validateCurrentEducation()) return;
  
    if (!schoolExperience || !schoolExperience.uid) {
      console.error("School experience UID is missing or undefined.");
      return;
    }
  
    const newEducation: University = {
      id: "",
      name: "",
      program: "",
      country: "",
      degree: "",
      startYear: 0,
      endYear: 0,
      experience: "",
      awards: [],
      extracurriculars: [],
    };
  
    try {
      // Send a POST request to create the new education record in the backend
      const response = await api.post(
        `/api/school-experiences/${schoolExperience.uid}/universities`,
        newEducation,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
  
      const universitiesArray = response.data.universities;
      const newUniversity = universitiesArray[universitiesArray.length - 1];

      // Ensure that schoolExperience.universities is initialized as an array
      const updatedUniversities = [
        ...(schoolExperience.universities || []),
        newUniversity,
      ];

      // Update the state with the new universities list
      setSchoolExperience({
        ...schoolExperience,
        universities: updatedUniversities,
      });
  
      setIsEditingIndex(updatedUniversities.length - 1);
    } catch (error) {
      const errorMessage = handleError(error);
      console.error("Error adding new education:", errorMessage);
      alert(errorMessage);
    }
  };  

  const handleAddAward = (eduIndex: number) => {
    if (!schoolExperience) {
      console.error("School experience is missing.");
      return;
    }
  
    const updatedUniversities = [...schoolExperience.universities];
  
    // Ensure awards is initialized as an array
    if (!updatedUniversities[eduIndex].awards) {
      updatedUniversities[eduIndex].awards = [];
    }
  
    const currentAwards = updatedUniversities[eduIndex].awards;
  
    // Only add a new empty input if the last award is not empty
    if (currentAwards.length === 0 || currentAwards[currentAwards.length - 1].trim()) {
      updatedUniversities[eduIndex].awards.push("");
      setSchoolExperience({ ...schoolExperience, universities: updatedUniversities });
    } else {
      console.warn("Please complete the current award before adding a new one.");
    }
  };     
  
  const handleUpdateAward = (eduIndex: number, awardIndex: number, value: string) => {
    if (!schoolExperience) {
      console.error("School experience is missing.");
      return;
    }
  
    const updatedUniversities = [...schoolExperience.universities];
    updatedUniversities[eduIndex].awards[awardIndex] = value;
  
    setSchoolExperience({ ...schoolExperience, universities: updatedUniversities });
  };  
  
  const handleDeleteAward = (eduIndex: number, awardIndex: number) => {
    if (!schoolExperience) {
      console.error("School experience is missing.");
      return;
    }
  
    const updatedUniversities = [...schoolExperience.universities];
    updatedUniversities[eduIndex].awards.splice(awardIndex, 1); // Remove the specific award
    setSchoolExperience({ ...schoolExperience, universities: updatedUniversities });
  };  

  const toggleEdit = (index: number) => {
    if (isEditingIndex === index) {
      // If already editing this card, stop editing
      setIsEditingIndex(null);
    } else {
      // Otherwise, set this card to editing mode
      setIsEditingIndex(index);
      fetchUniversities(selectedCountry);
    }
  };
  
  const cancelChanges = () => {
    setIsEditingIndex(null);
    setIsEditing(false);
  }

  const saveChanges = async (index: number, updatedData: EducationFormValues) => {
    setIsEditingIndex(null);
  
    if (!schoolExperience || !schoolExperience.universities) return;
  
    const updatedUniversity = {
      ...schoolExperience.universities[index],
      ...updatedData,
    };
  
    try {
      if (updatedUniversity.id) {
        // Update the education information if ID exists
        const response = await api.put(
          `/api/school-experiences/${schoolExperience.uid}/universities/${updatedUniversity.id}`,
          updatedUniversity,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
  
        // Update the local state with the updated education record
        const updatedExperience: UserSchoolExperience = {
          uid: schoolExperience.uid,
          universities: [...schoolExperience.universities],
        };
        updatedExperience.universities[index] = response.data;
  
        setSchoolExperience(response.data);
      } else {
        console.warn("University ID is missing. Cannot update the record.");
      }
    } catch (error) {
      const errorMessage = handleError(error);
      console.error("Error saving education:", errorMessage);
      alert(errorMessage);
    }
  };  

  const handleDeleteEducation = async (index: number) => {
    if (!schoolExperience || !schoolExperience.universities) {
      console.error("School experience or universities are missing.");
      return;
    }
  
    const updatedUniversities = [...schoolExperience.universities];
    const university = updatedUniversities[index];
  
    if (!university || !university.id) {
      console.error("University or university ID is missing.");
      return;
    }
  
    try {
      await api.delete(
        `/api/school-experiences/${schoolExperience.uid}/universities/${university.id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
  
      updatedUniversities.splice(index, 1);
      setSchoolExperience({
        ...schoolExperience,
        universities: updatedUniversities,
      });
    } catch (error) {
      const errorMessage = handleError(error);
      console.error("Error deleting education:", errorMessage);
      alert(errorMessage);
    }
  };  

  return (
    <div className="relative">
      <Card className="max-w-[800px] mx-auto">
        {/* Header */}
        <CardHeader className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <p className="text-md font-bold">Education Section</p>
          </div>
        </CardHeader>
        <Divider />

        {/* Education Sub-Cards */}
        <CardBody>
          {schoolExperience?.universities?.map((education, eduIndex) => (
            <EducationCard
              key={eduIndex}
              education={education}
              eduIndex={eduIndex}
              isEditing={isEditingIndex === eduIndex}
              toggleEdit={toggleEdit}
              saveChanges={saveChanges}
              cancelChanges={cancelChanges}
              selectedCountry={selectedCountry}
              universities={universities}
              isLoading={isLoading}
              manualUniversity={manualUniversity}
              handleDeleteEducation={handleDeleteEducation}
              handleAddAward={handleAddAward}
              handleUpdateAward={handleUpdateAward}
              handleDeleteAward={handleDeleteAward}
              setSelectedCountry={setSelectedCountry}
              setManualUniversity={setManualUniversity}
              handleFieldValue={handleFieldValue}
            />
          ))}

          {/* Add Education Button */}
          <div className="flex flex-col items-center mt-4">
            {validationError && (
              <p className="text-red-500 text-sm mb-2">{validationError}</p>
            )}
            <Button
              size="lg"
              variant="flat"
              color="primary"
              onPress={handleAddEducation}
              isDisabled={(schoolExperience?.universities ?? []).length > 0 && !!validationError}
              startContent={<PlusCircleIcon />}
            >
              {(schoolExperience?.universities ?? []).length === 0
                ? "Add Education"
                : "Save Your Previous Education to Add a New One"}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}