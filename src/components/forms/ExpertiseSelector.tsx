"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader, Chip } from "@nextui-org/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { 
  EXPERTISE_CATEGORIES,
  type ExpertiseCategory,
  type ExpertiseSkill,
  getAllCategories
} from "@/store/areaOfExpertise";

interface ExpertiseSelectorProps {
  selectedExpertise: ExpertiseSkill[];
  onChange: (expertise: ExpertiseSkill[]) => void;
  maxSelections?: number;
}

export default function ExpertiseSelector({
  selectedExpertise,
  onChange,
  maxSelections = 5
}: ExpertiseSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<ExpertiseCategory>("DATA_SCIENCE");

  const handleExpertiseToggle = (skill: ExpertiseSkill) => {
    if (selectedExpertise.includes(skill)) {
      onChange(selectedExpertise.filter(item => item !== skill));
    } else if (selectedExpertise.length < maxSelections) {
      onChange([...selectedExpertise, skill]);
    }
  };

  return (
    <div className="w-full h-[600px] flex gap-4">
      {/* Categories Navigation */}
      <Card className="w-1/4 h-full">
        <CardHeader className="font-bold text-large">Categories</CardHeader>
        <CardBody className="p-0">
          <ScrollArea className="h-[500px] w-full rounded-md">
            {getAllCategories().map(({ key, name }) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={cn(
                  "w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors",
                  activeCategory === key && "bg-primary text-primary-foreground"
                )}
              >
                {name}
              </button>
            ))}
          </ScrollArea>
        </CardBody>
      </Card>

      {/* Skills Display */}
      <Card className="flex-1 h-full">
        <CardHeader className="flex justify-between items-center">
          <span className="font-bold text-large">
            {EXPERTISE_CATEGORIES[activeCategory].name}
          </span>
          <span className="text-small text-default-500">
            Selected: {selectedExpertise.length}/{maxSelections}
          </span>
        </CardHeader>
        <CardBody>
          <ScrollArea className="h-[500px] w-full rounded-md">
            <div className="flex flex-wrap gap-2 p-2">
              {[...EXPERTISE_CATEGORIES[activeCategory].skills].map((skill) => (
                <Chip
                  key={skill}
                  variant="flat"
                  color={selectedExpertise.includes(skill) ? "primary" : "default"}
                  className="cursor-pointer"
                  onClick={() => handleExpertiseToggle(skill)}
                >
                  {skill}
                </Chip>
              ))}
            </div>
          </ScrollArea>
        </CardBody>
      </Card>
    </div>
  );
}