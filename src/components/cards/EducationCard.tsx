"use client";

import { Card, CardHeader, CardBody, Divider, Button } from "@nextui-org/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { set, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputForm from "../forms/InputForm";
import InputToUpdate from "../forms/InputToUpdate";
import TextareaForm from "../forms/TextArea";
import SelectCountry from "../forms/SelectCountry";
import YearSelector from "../forms/YearSelector";
import SingleDropdownSelection from "../forms/SingleSelection";
import { DeleteDocumentIcon } from "../icons/DeleteDocumentIcon";
import { PlusCircleIcon } from "../icons/PlusCircleIcon";
import SpinnerUI from "../forms/SpinnerUI";
import universityDegrees from "../../store/universityDegrees";
import { University } from "../../store/userStore";
import { EditDocumentIcon } from "../icons/EditDocumentIcon";

interface EducationCardProps {
  education: University;
  eduIndex: number;
  isEditing: boolean;
  selectedCountry: string;
  universities: { key: string; label: string }[];
  isLoading: boolean;
  manualUniversity: string;
  handleDeleteEducation: (index: number) => void;
  handleAddAward: (eduIndex: number) => void;
  handleUpdateAward: (eduIndex: number, awardIndex: number, value: string) => void;
  handleDeleteAward: (eduIndex: number, awardIndex: number) => void;
  toggleEdit: (index: number) => void;
  saveChanges: (index: number, data: any) => void;
  cancelChanges: (index: number) => void;
  setSelectedCountry: (country: string) => void;
  setManualUniversity: (university: string) => void;
  handleFieldValue: (index: number, field: keyof University, value: any) => void;
}

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

export default function EducationCard({
  education,
  eduIndex,
  isEditing,
  selectedCountry,
  universities,
  isLoading,
  manualUniversity,
  handleDeleteEducation,
  handleAddAward,
  handleUpdateAward,
  handleDeleteAward,
  toggleEdit,
  saveChanges,
  cancelChanges,
  setSelectedCountry,
  setManualUniversity,
  handleFieldValue,
}: EducationCardProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EducationFormValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      country: education.country || "",
      name: education.name || "",
      program: education.program || "",
      degree: education.degree || "",
      startYear: education.startYear || 0,
      endYear: education.endYear || 0,
      awards: education.awards || [],
      experience: education.experience || "",
    },
  });

  const onSubmit: SubmitHandler<EducationFormValues> = (data) => {
    const formattedData = {
      ...data,
      awards: education.awards,
    };
  
    saveChanges(eduIndex, formattedData);
  };
  
  return (
    <Card key={eduIndex} className="mb-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader className="flex justify-between items-center">
          <p className="text-md font-bold">{education.name || `Education`}</p>
          <div className="flex gap-2">
            <Button size="sm" variant="flat" color="primary" onPress={() => toggleEdit(eduIndex)}>
              {isEditing ?( 
                <>
                  <EditDocumentIcon className="mr-2" />
                  Editing...
                </>
                ) : (
                <>

                  <EditDocumentIcon className="mr-2" />
                  Edit
                </>
                  ) }
            </Button>
            <Button
              size="sm"
              variant="flat"
              color="danger"
              onPress={() => handleDeleteEducation(eduIndex)}
              startContent={<DeleteDocumentIcon />}
            >
              Delete
            </Button>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              {isEditing ? (
                <>
                  <SelectCountry
                    selectionMode="country"
                    defaultValue={education.country}
                    {...register("country")}
                    onChange={(value) => {
                      const countryValue = Array.isArray(value) ? value[0] : value; 
                      handleFieldValue(eduIndex, "country", countryValue);
                      setSelectedCountry(countryValue);
                      setValue("country", countryValue);
                    }}
                  />
                  {errors.country && (
                    <p className="text-red-500 text-xs italic mt-1">
                      {errors.country.message}
                    </p>
                  )}
                </>
              ) : (
                <InputForm type="text" label="Country" value={education.country} />
              )}
            </div>
            <div className="flex-1 min-w-[200px]">
              {isEditing ? (
                <>
                  {selectedCountry ? (
                    isLoading ? (
                      <SpinnerUI label="Loading universities..." />
                    ) : universities.length > 0 ? (
                      <SingleDropdownSelection
                        options={universities}
                        label="University Name"
                        placeholder="Select University"
                        className="w-full"
                        {...register("name")}
                        onChange={(selectedKey) => {
                          const universityValue = Array.isArray(selectedKey) ? selectedKey[0] : selectedKey;
                          handleFieldValue(eduIndex, "name", universityValue);
                          setValue("name", universityValue);
                        }}
                      />
                    ) : (
                      <InputToUpdate
                        type="text"
                        label="University Name"
                        placeholder="Enter your university"
                        value={manualUniversity}
                        {...register("name")}
                        onChange={(value) => {
                          setManualUniversity(value);
                          handleFieldValue(eduIndex, "name", value);
                          setValue("name", value);
                        }}
                      />
                    )
                  ) : (
                    <InputForm type="text" label="University Name" value="Select a country first" />
                  )}
                  {errors.name && (
                    <p className="text-red-500 text-xs italic mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </>
              ) : (
                <InputForm type="text" label="University Name" value={education.name} />
              )}
            </div>
            <div className="flex-1 min-w-[200px]">
              {isEditing ? (
                <>
                  <InputToUpdate
                    type="text"
                    label="Program"
                    placeholder="Enter program"
                    value={watch("program")} 
                    onChange={(value: string) => {
                      setValue("program", value);
                      handleFieldValue(eduIndex, "program", value);
                    }}
                  />

                  {errors.program && (
                    <p className="text-red-500 text-xs italic mt-1">
                      {errors.program.message}
                    </p>
                  )}

                </>
              ) : (
                <InputForm type="text" label="Program" value={education.program} />
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex-1 min-w-[200px]">
              {isEditing ? (
                <>
                  <SingleDropdownSelection
                    options={universityDegrees}
                    label="Degree"
                    placeholder="Select a degree"
                    {...register("degree")}
                    onChange={(selectedKey) => {
                      const selectedOption = universityDegrees.find((option) => option.key === selectedKey);
                      if (selectedOption) {
                        handleFieldValue(eduIndex, "degree", selectedOption.label);
                        setValue("degree", selectedOption.label);
                      }
                    }}
                  />


                  {errors.degree && (
                    <p className="text-red-500 text-xs italic mt-1">
                      {errors.degree.message}
                    </p>
                  )}
                </>
              ) : (
                <InputForm type="text" label="Degree" value={education.degree} />
              )}
            </div>
            <div className="flex-1 min-w-[200px]">
              {isEditing ? (
                <>
                  <YearSelector
                    startYear={1950}
                    endYear={new Date().getFullYear()}
                    label="Start Year"
                    placeholder="Select a start year"
                    value={watch("startYear")?.toString()}
                    {...register("startYear")}
                    onChange={(selectedYear) => {
                      const yearAsNumber = Number(selectedYear); 
                      if (!isNaN(yearAsNumber)) {
                        handleFieldValue(eduIndex, "startYear", yearAsNumber); 
                        setValue("startYear", yearAsNumber);
                      } else {
                        console.warn("Invalid year selected:", selectedYear);
                      }
                    }}
                  />
                  {errors.startYear && (
                    <p className="text-red-500 text-xs italic mt-1">
                      {errors.startYear.message}
                    </p>
                  )}
                </>
              ) : (
                <InputForm
                  type="text"
                  label="Start Year"
                  value={education.startYear?.toString()}
                />
              )}
            </div>
            <div className="flex-1 min-w-[200px]">
              {isEditing ? (
                <>
                  <YearSelector
                    startYear={1950}
                    endYear={new Date().getFullYear() + 8}
                    label="End Year"
                    placeholder="Select an end year"
                    value={watch("endYear")?.toString()}
                    onChange={(selectedYear) => {
                      const yearAsNumber = Number(selectedYear); 
                      if (!isNaN(yearAsNumber)) {
                        handleFieldValue(eduIndex, "endYear", yearAsNumber); 
                        setValue("endYear", yearAsNumber);
                      } else {
                        console.warn("Invalid year selected:", selectedYear);
                      }
                    }}
                  />
                  {errors.endYear && (
                    <p className="text-red-500 text-xs italic mt-1">
                      {errors.endYear.message}
                    </p>
                  )}
                </>
              ) : (
                <InputForm
                  type="text"
                  label="End Year"
                  value={education.endYear?.toString()}
                />
              )}
            </div>

          </div>

        {/* Awards Section */}
        <div className="mt-4">
          <p className="text-md font-bold">Awards</p>
          {(education.awards || []).map((award, awardIndex) => (
            <div key={awardIndex} className="flex items-center gap-2">
              {isEditing ? (
                <InputToUpdate
                  type="text"
                  label={`Award ${awardIndex + 1}`}
                  placeholder="Enter award"
                  value={award}
                  onChange={(value) =>
                    handleUpdateAward(eduIndex, awardIndex, value)
                  }
                />
              ) : (
                <InputForm type="text" label={`Award ${awardIndex + 1}`} value={award} />
              )}
              {isEditing && (
                <Button
                  size="sm"
                  variant="flat"
                  color="danger"
                  onPress={() => handleDeleteAward(eduIndex, awardIndex)}
                  startContent={<DeleteDocumentIcon />}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
          {isEditing && (
            <Button
              size="sm"
              variant="flat"
              color="primary"
              onPress={() => handleAddAward(eduIndex)}
              startContent={<PlusCircleIcon />}
            >
              Add Award
            </Button>
          )}
        </div>


        {/* Experience */}
        <div className="mt-4">
          {isEditing ? (
            <TextareaForm
              label="Experience"
              placeholder="Enter experience"
              value={watch("experience") || ""}  
              onChange={(value) => {
                setValue("experience", value); 
                handleFieldValue(eduIndex, "experience", value);
              }}
              description=""
              labelColor="text-black"
            />
          ) : (
            <TextareaForm
                label="Experience"
                isReadOnly={true}
                value={education.experience}
                placeholder=""
                description=""
                labelColor="text-black"
            />
          )}
        </div>

        </CardBody>
        <Divider />
        <div className="flex justify-end gap-2 p-4">
          {isEditing && (
            <>
              <Button size="sm" variant="flat" color="primary" type="submit">
                Save
              </Button>
              <Button size="sm" variant="flat" color="danger" onPress={() => cancelChanges(eduIndex)}>
                Cancel
              </Button>
            </>
          )}
        </div>
      </form>
    </Card>
  );
}