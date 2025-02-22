"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@nextui-org/react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardBody, CardHeader, Chip } from "@nextui-org/react";
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
  const [open, setOpen] = React.useState(false);
  const [activeCategory, setActiveCategory] = React.useState<ExpertiseCategory>("DATA_SCIENCE");

  const handleSkillToggle = (skill: ExpertiseSkill) => {
    if (selectedExpertise.includes(skill)) {
      onChange(selectedExpertise.filter(item => item !== skill));
    } else if (selectedExpertise.length < maxSelections) {
      onChange([...selectedExpertise, skill]);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <span className="text-sm text-muted-foreground">
          Selected: {selectedExpertise.length}/{maxSelections}
        </span>
      </div>

      {/* Category Selection */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="solid"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {EXPERTISE_CATEGORIES[activeCategory].name}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search categories..." />
            <CommandList>
              <CommandEmpty>No category found.</CommandEmpty>
              <CommandGroup>
                {getAllCategories().map(({ key, name }) => (
                  <CommandItem
                    key={key}
                    value={name}
                    onSelect={() => {
                      setActiveCategory(key);
                      setOpen(false);
                    }}
                  >
                    {name}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        activeCategory === key ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Skills Display */}
      <Card className="mt-4">
        <CardHeader className="pb-3">
          <h4 className="font-medium">Available Skills</h4>
        </CardHeader>
        <CardBody>
          <div className="flex flex-wrap gap-2">
            {[...EXPERTISE_CATEGORIES[activeCategory].skills].map((skill) => (
              <Chip
                key={skill}
                variant="flat"
                color={selectedExpertise.includes(skill) ? "primary" : "default"}
                className="cursor-pointer"
                onClick={() => handleSkillToggle(skill)}
              >
                {skill}
                {selectedExpertise.includes(skill) && (
                  <Check className="ml-2 h-3 w-3" />
                )}
              </Chip>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Selected Skills */}
      {selectedExpertise.length > 0 && (
        <Card className="mt-4">
          <CardHeader className="pb-3">
            <h4 className="font-medium">Selected Skills</h4>
          </CardHeader>
          <CardBody>
            <div className="flex flex-wrap gap-2">
              {selectedExpertise.map((skill) => (
                <Chip
                  key={skill}
                  variant="flat"
                  color="primary"
                  className="cursor-pointer"
                  onClose={() => handleSkillToggle(skill)}
                >
                  {skill}
                </Chip>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}