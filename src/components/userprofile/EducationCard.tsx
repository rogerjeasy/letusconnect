"use client";
import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Button, Input, Select, SelectItem } from "@nextui-org/react";
import { Plus, Trash2, School } from "lucide-react";
import { handleAddBulkEducation, handleAddNewEducation } from "../apihandling/HandleUserEducation";
import { useUserStore } from "@/store/userStore";
import { s } from "framer-motion/client";

interface University {
  id: string;
  name: string;
  program: string;
  country: string;
  degree: string;
  startYear: number;
  endYear: number;
  experience: string;
  awards: string[];
  extracurriculars: string[];
}

interface UserSchoolExperience {
  uid: string;
  universities: University[];
}

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 124 }, (_, i) => currentYear - i);

const emptyUniversity: University = {
  id: "",
  name: "",
  program: "",
  country: "",
  degree: "",
  startYear: currentYear,
  endYear: currentYear,
  experience: "",
  awards: [],
  extracurriculars: [],
};

function validateUniversity(university: University) {
  const errors: string[] = [];
  
  if (!university.country) errors.push("Country is required");
  if (!university.name) errors.push("University name is required");
  if (!university.program) errors.push("Program is required");
  if (!university.degree) errors.push("Degree is required");
  if (!university.startYear) errors.push("Start year is required");
  if (!university.endYear) errors.push("End year is required");
  if (university.startYear > university.endYear) {
    errors.push("End year must be after or the same as start year");
  }

  return errors;
}

const EducationForm = ({ 
  university, 
  onChange, 
  onRemove,
  validationErrors 
}: { 
  university: University;
  onChange: (field: keyof University, value: any) => void;
  onRemove: () => void;
  validationErrors: string[];
}) => {
  return (
    <div className="p-6 mb-6 border rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <School className="h-5 w-5" />
          <h3 className="text-lg font-semibold">University Details</h3>
        </div>
        <Button variant="light" color="danger" size="sm" onClick={onRemove}>
          <Trash2 className="h-4 w-4 mr-2"/>
          Remove
        </Button>
      </div>

      {validationErrors.length > 0 && (
        <div className="mb-4 p-4 border border-red-400 bg-red-50 rounded-lg">
          <ul className="list-disc pl-4 text-red-600">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Country</label>
          <Input
            value={university.country}
            onChange={(e) => onChange('country', e.target.value)}
            placeholder="Enter country"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">University Name</label>
          <Input
            value={university.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="Enter university name"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Program</label>
          <Input
            value={university.program}
            onChange={(e) => onChange('program', e.target.value)}
            placeholder="Enter program"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Degree</label>
          <Input
            value={university.degree}
            onChange={(e) => onChange('degree', e.target.value)}
            placeholder="Enter degree"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Start Year</label>
          <Select
            selectedKeys={[university.startYear.toString()]}
            onChange={(e) => onChange('startYear', parseInt(e.target.value))}
            placeholder="Select start year"
            aria-label="Start year"
            label="Start Year"
          >
            {yearOptions.map((year) => (
              <SelectItem 
              key={year.toString()} 
              value={year.toString()}
              textValue={year.toString()}
            >
              {year}
            </SelectItem>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">End Year</label>
          <Select
            selectedKeys={[university.endYear.toString()]}
            onChange={(e) => onChange('endYear', parseInt(e.target.value))}
            placeholder="Select end year"
            aria-label="End year"
            label="End Year"
          >
            {yearOptions.map((year) => (
              <SelectItem 
              key={year.toString()} 
              value={year.toString()}
              textValue={year.toString()}
            >
              {year}
            </SelectItem>
            ))}
          </Select>
        </div>

        <div className="col-span-2 space-y-2">
          <label className="text-sm font-medium">Experience</label>
          <Input
            value={university.experience}
            onChange={(e) => onChange('experience', e.target.value)}
            placeholder="Enter experience"
          />
        </div>
      </div>
    </div>
  );
};


export default function UserEducationComponent() {
  const [formUniversities, setFormUniversities] = useState<University[]>([]);
  const [validationErrors, setValidationErrors] = useState<Record<number, string[]>>({});
  const setSchoolExperience = useUserStore((state) => state.setSchoolExperience);
  const schoolExperience = useUserStore((state) => state.schoolExperience);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddNewUniversityToForm = () => {
    // Validate last university before adding new one
    if (formUniversities.length > 0) {
      const lastIndex = formUniversities.length - 1;
      const lastUniversity = formUniversities[lastIndex];
      const errors = validateUniversity(lastUniversity);
      
      if (errors.length > 0) {
        setValidationErrors(prev => ({
          ...prev,
          [lastIndex]: errors
        }));
        return;
      }
    }
    
    setFormUniversities(prev => [...prev, { ...emptyUniversity }]);
  };

  const handleRemoveUniversityFromForm = (index: number) => {
    setFormUniversities(prev => prev.filter((_, i) => i !== index));
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[index];
      return newErrors;
    });
  };

  const handleUpdateFormUniversity = (index: number, field: keyof University, value: any) => {
    setFormUniversities(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      return updated;
    });

    const updatedUniversity = {
      ...formUniversities[index],
      [field]: value
    };
    const errors = validateUniversity(updatedUniversity);
    setValidationErrors(prev => ({
      ...prev,
      [index]: errors
    }));
  };

  const handleSaveAll = async () => {
    // Validate all universities
    const hasErrors = formUniversities.some((univ, index) => {
      const errors = validateUniversity(univ);
      setValidationErrors(prev => ({
        ...prev,
        [index]: errors
      }));
      return errors.length > 0;
    });

    if (hasErrors) return;

    setIsLoading(true);
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authorization token found");

    const result = formUniversities.length === 1
      ? await handleAddNewEducation(formUniversities[0], token)
      : await handleAddBulkEducation(formUniversities, token);

    if (result && result.uid && result.universities) {
      // Update the global store with the new school experience
      setSchoolExperience({
        uid: result.uid,
        universities: result.universities
      });
      
      console.log("result", result);
      // Clear the form
      setFormUniversities([]);
      setValidationErrors({});
    }
  } catch (error) {
    console.error("Error saving universities:", error);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <h1 className="text-xl font-bold">Education Section</h1>
      </CardHeader>
      
      <CardBody>
        {formUniversities.map((university, index) => (
          <EducationForm
            key={index}
            university={university}
            onChange={(field, value) => handleUpdateFormUniversity(index, field, value)}
            onRemove={() => handleRemoveUniversityFromForm(index)}
            validationErrors={validationErrors[index] || []}
          />
        ))}

        <div className="flex flex-col items-center gap-4 mt-6">
          <Button
            variant="light"
            color="primary"
            onClick={handleAddNewUniversityToForm}
            isDisabled={Object.values(validationErrors).some(errors => errors.length > 0)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another University
          </Button>

          {formUniversities.length > 0 && (
            <Button
              onClick={handleSaveAll}
              isDisabled={Object.values(validationErrors).some(errors => errors.length > 0)}
              className="w-full md:w-auto"
            >
              {isLoading ? "Saving..." : "Save All Education Entries"}
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  );
}