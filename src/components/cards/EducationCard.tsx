"use client";

import { Card, CardHeader, CardBody, Divider, Button } from "@nextui-org/react";
import InputForm from "../forms/InputForm";
import InputToUpdate from "../forms/InputToUpdate";
import TextareaForm from "../forms/TextArea";
import SelectCountry from "../forms/SelectCountry";
import YearSelector from "../forms/YearSelector";
import SingleDropdownSelection from "../forms/SingleSelection";
import { DeleteDocumentIcon } from "../icons/DeleteDocumentIcon";
import { PlusCircleIcon } from "../icons/PlusCircleIcon";
import universityDegrees from "../../store/universityDegrees";
import SpinnerUI from "../forms/SpinnerUI";
import { University } from "../../store/userStore";

interface EducationCardProps {
  education: University;
  eduIndex: number;
  isEditing: boolean;
  selectedCountry: string;
  universities: { key: string; label: string }[];
  isLoading: boolean;
  manualUniversity: string;
  handleUpdateEducation: (index: number, field: keyof University, value: any) => void;
  handleDeleteEducation: (index: number) => void;
  handleAddAward: (eduIndex: number) => void;
  handleUpdateAward: (eduIndex: number, awardIndex: number, value: string) => void;
  handleDeleteAward: (eduIndex: number, awardIndex: number) => void;
  toggleEdit: (index: number) => void;
  saveChanges: (index: number) => void;
  cancelChanges: (index: number) => void;
  setSelectedCountry: (country: string) => void;
  setManualUniversity: (university: string) => void;
}

export default function EducationCard({
  education,
  eduIndex,
  isEditing,
  selectedCountry,
  universities,
  isLoading,
  manualUniversity,
  handleUpdateEducation,
  handleDeleteEducation,
  handleAddAward,
  handleUpdateAward,
  handleDeleteAward,
  toggleEdit,
  saveChanges,
  cancelChanges,
  setSelectedCountry,
  setManualUniversity,
}: EducationCardProps) {
  return (
    <Card key={eduIndex} className="mb-4">
      <CardHeader className="flex justify-between items-center">
        <p className="text-md font-bold">{education.name || `Education ${eduIndex + 1}`}</p>
        <div className="flex gap-2">
          <Button size="sm" variant="flat" color="primary" onPress={() => toggleEdit(eduIndex)}>
            {isEditing ? "Stop Editing" : "Edit"}
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
              <SelectCountry
                selectionMode="country"
                defaultValue={education.country}
                onChange={(value) => {
                  handleUpdateEducation(eduIndex, "country", value);
                  setSelectedCountry(value as string);
                }}
              />
            ) : (
              <InputForm type="text" label="Country" value={education.country} />
            )}
          </div>
          <div className="flex-1 min-w-[200px]">
            {isEditing ? (
              selectedCountry ? (
                isLoading ? (
                  <SpinnerUI label="Loading universities..." />
                ) : universities.length > 0 ? (
                  <SingleDropdownSelection
                    options={universities}
                    label="University Name"
                    placeholder="Select University"
                    className="w-full"
                    onChange={(selectedKey) => handleUpdateEducation(eduIndex, "name", selectedKey)}
                  />
                ) : (
                  <InputToUpdate
                    type="text"
                    label="University Name"
                    placeholder="Enter your university"
                    value={manualUniversity}
                    onChange={(value) => {
                      setManualUniversity(value);
                      handleUpdateEducation(eduIndex, "name", value);
                    }}
                  />
                )
              ) : (
                <InputForm type="text" label="University Name" value="Select a country first" />
              )
            ) : (
              <InputForm type="text" label="University Name" value={education.name} />
            )}
          </div>
          <div className="flex-1 min-w-[200px]">
            {isEditing ? (
              <InputToUpdate
                type="text"
                label="Program"
                placeholder="Enter program"
                value={education.program}
                onChange={(value) => handleUpdateEducation(eduIndex, "program", value)}
              />
            ) : (
              <InputForm type="text" label="Program" value={education.program} />
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex-1 min-w-[200px]">
            {isEditing ? (
              <SingleDropdownSelection
                options={universityDegrees}
                label="Degree"
                placeholder="Select a degree"
                className="font-bold"
                onChange={(selectedKey) => handleUpdateEducation(eduIndex, "degree", selectedKey)}
              />
            ) : (
              <InputForm type="text" label="Degree" value={education.degree} />
            )}
          </div>
          <div className="flex-1 min-w-[200px]">
            {isEditing ? (
              <YearSelector
                startYear={1950}
                endYear={new Date().getFullYear()}
                label="Start Year"
                placeholder="Select a start year"
                onChange={(selectedYear) =>
                  handleUpdateEducation(eduIndex, "startYear", Number(selectedYear))
                }
              />
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
              <YearSelector
                startYear={1950}
                label="End Year"
                placeholder="Select an end year"
                onChange={(selectedYear) =>
                  handleUpdateEducation(eduIndex, "endYear", Number(selectedYear))
                }
              />
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
              value={education.experience}
              onChange={(value) => handleUpdateEducation(eduIndex, "experience", value)}
              description=""
            />
          ) : (
            <TextareaForm
                label="Experience"
                value={education.experience}
                placeholder=""
                description=""
            />
          )}
        </div>
      </CardBody>
      <Divider />
      <div className="flex justify-end gap-2 p-4">
        {isEditing && (
          <>
            <Button size="sm" variant="flat" color="primary" onPress={() => saveChanges(eduIndex)}>
              Save
            </Button>
            <Button size="sm" variant="flat" color="danger" onPress={() => cancelChanges(eduIndex)}>
              Cancel
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}