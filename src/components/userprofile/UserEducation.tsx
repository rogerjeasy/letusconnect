"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Divider, Button } from "@nextui-org/react";
import InputForm from "../forms/InputForm";
import InputToUpdate from "../forms/InputToUpdate";
import AddButtonIcon from "../buttons/AddButton";
import { DeleteDocumentIcon } from "../icons/DeleteDocumentIcon";
import { PlusCircleIcon } from "../icons/PlusCircleIcon";
import SpinnerUI from "../forms/SpinnerUI";
import Scroll from "../forms/Scroll";
import SelectCountry from "../forms/SelectCountry";
import TextareaForm from "../forms/TextArea";
import { University, UserSchoolExperience } from "../../store/userStore";
import SingleDropdownSelection from "../forms/SingleSelection";
import universityDegrees from "../../store/universityDegrees";
import YearSelector from "../forms/YearSelector";
import { useUserStore } from "../../store/userStore";
import { api } from "../../helpers/api";

export default function UserEducation() {

  const schoolExperience = useUserStore((state) => state.schoolExperience);
  const setSchoolExperience = useUserStore((state) => state.setSchoolExperience);
  const user = useUserStore((state) => state.user);

  const [isEditing, setIsEditing] = useState(false);
  const [universities, setUniversities] = useState<{ key: string; label: string }[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [manualUniversity, setManualUniversity] = useState<string>("");

  const fetchUniversities = async (country: string) => {
    const endpoint = country
      ? `http://universities.hipolabs.com/search?country=${country}`
      : "http://universities.hipolabs.com/search";

    try {
      setIsLoading(true);
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error("Failed to fetch universities");

      const data: University[] = await response.json();
      const universityNames = data.map((university, index) => ({
        key: `${university.name}-${index}`,
        label: university.name,
      }));
      setUniversities(universityNames);
    } catch (error) {
      console.error("Error fetching universities:", error);
      setUniversities([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUniversities(selectedCountry);
  }, [selectedCountry]);

  console.log("schoolExperience", schoolExperience);
  console.log("user", user);

  const handleAddEducation = async () => {
    const newEducation = {
      id: "",
      name: "",
      program: "",
      country: "",
      degree: "",
      startYear: 0,
      endYear: 0,
      level: "",
      experience: "",
      awards: [],
      extracurriculars: [],
    };
  
    if (!schoolExperience?.uid) {
      console.error("School experience UID is missing.");
      return;
    }
  
    try {
      const response = await api.post(
        `/api/school-experiences/${schoolExperience.uid}/universities`,
        newEducation,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
  
      const updatedExperience: UserSchoolExperience = {
        uid: schoolExperience.uid,
        universities: [...schoolExperience.universities, response.data],
      };
  
      setSchoolExperience(updatedExperience);
    } catch (error) {
      console.error("Error adding education:", error);
    }
  };
     

  const handleUpdateEducation = async (
    index: number,
    field: keyof University,
    value: any
  ) => {
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
  
    updatedUniversities[index] = { ...university, [field]: value };
    try {
      await api.put(
        `/api/school-experiences/${schoolExperience.uid}/universities/${university.id}`,
        updatedUniversities[index],
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
  
      setSchoolExperience({
        ...schoolExperience,
        universities: updatedUniversities,
      });
    } catch (error) {
      console.error("Error updating education:", error);
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
      console.error("Error deleting education:", error);
    }
  };  

  const handleAddAward = (eduIndex: number) => {
    if (!schoolExperience) {
      console.error("School experience is missing.");
      return;
    }
  
    const updatedUniversities = [...schoolExperience.universities];
    updatedUniversities[eduIndex].awards.push(""); // Add an empty award
    setSchoolExperience({ ...schoolExperience, universities: updatedUniversities });
  };
  
  const handleUpdateAward = (eduIndex: number, awardIndex: number, value: string) => {
    if (!schoolExperience) {
      console.error("School experience is missing.");
      return;
    }
  
    const updatedUniversities = [...schoolExperience.universities];
    updatedUniversities[eduIndex].awards[awardIndex] = value; // Update the specific award
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
  

  const toggleEdit = () => {
    setIsEditing((prev) => {
      if (!prev) {
        // Fetch universities when editing starts
        fetchUniversities(selectedCountry);
      }
      return !prev;
    });
  };

  return (
    <div className="relative">
      <Card className="max-w-[800px] mx-auto">
        {/* Header */}
        <CardHeader className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <p className="text-md font-bold">Education</p>
          </div>
        </CardHeader>
        <Divider />

        {/* Education Sub-Cards */}
        <CardBody>
          {schoolExperience?.universities?.map((education, eduIndex) => (
            <Card key={eduIndex} className="mb-4">
              <CardHeader className="flex justify-between items-center">
                <p className="text-md font-bold">{education.name || `Education ${eduIndex + 1}`}</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="flat"
                    color="primary"
                    onPress={toggleEdit}
                  >
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
                            onChange={(selectedKey) =>
                              handleUpdateEducation(eduIndex, "name", selectedKey)
                            }
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
                  {/* City, Start Year, End Year */}
                  <div className="flex-1 min-w-[200px]">
                    {isEditing ? (
                      <SingleDropdownSelection
                        options={universityDegrees}
                        label="Degree"
                        placeholder="Select a degree"
                        className="font-bold"
                        onChange={(selectedKey) =>
                            handleUpdateEducation(eduIndex, "degree", selectedKey)
                        }
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
            </Card>
          ))}

          {/* Add Education Button */}
          <div className="flex justify-center mt-4">
            <Button
              size="lg"
              variant="flat"
              color="primary"
              onPress={handleAddEducation}
            >
              <AddButtonIcon text="Add Education" />
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}