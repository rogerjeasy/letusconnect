"use client";

import * as React from "react";
import { AlertCircle, Check, ChevronsUpDown } from "lucide-react";
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
  SKILL_CATEGORIES,
  type SkillCategory,
  type Skill,
  getAllCategories
} from "@/store/skills";

interface SkillSelectorProps {
  selectedSkills: Skill[];
  onChange: (skills: Skill[]) => void;
  maxSelections?: number;
}

export default function SkillSelector({
  selectedSkills,
  onChange,
  maxSelections = 10
}: SkillSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [activeCategory, setActiveCategory] = React.useState<SkillCategory | null>(null);

  const handleSkillToggle = (skill: Skill) => {
    if (selectedSkills.includes(skill)) {
      onChange(selectedSkills.filter(item => item !== skill));
    } else if (selectedSkills.length < maxSelections) {
      onChange([...selectedSkills, skill]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          Selected Skills: {selectedSkills.length}/{maxSelections}
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
            {activeCategory ? SKILL_CATEGORIES[activeCategory].name : "Select Your Skills"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search skill categories..." />
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

      {/* Available Skills Display */}
      {activeCategory && (
        <Card className="mt-4">
          <CardHeader className="pb-3">
            <h4 className="font-medium">Available Skills in {SKILL_CATEGORIES[activeCategory].name}</h4>
          </CardHeader>
          <CardBody>
            <div className="flex flex-wrap gap-2">
              {[...SKILL_CATEGORIES[activeCategory].skills].map((skill) => (
                <Chip
                  key={skill}
                  variant="flat"
                  color={selectedSkills.includes(skill) ? "primary" : "default"}
                  className="cursor-pointer transition-colors"
                  onClick={() => handleSkillToggle(skill)}
                >
                  {skill}
                  {selectedSkills.includes(skill) && (
                    <Check className="ml-2 h-3 w-3" />
                  )}
                </Chip>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* No Skills Selected Message */}
      {selectedSkills.length === 0 && (
        <Card className="mt-4">
          <CardBody>
            <div className="flex items-center gap-2 justify-center py-4">
              <AlertCircle className="h-5 w-5 text-default-400" />
              <p className="text-default-400">No skills selected yet. Choose a category to start selecting your skills.</p>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Selected Skills Display remains the same */}
      {selectedSkills.length > 0 && (
        <Card className="mt-4">
          <CardHeader className="pb-3">
            <h4 className="font-medium">Your Selected Skills</h4>
          </CardHeader>
          <CardBody>
            <div className="flex flex-wrap gap-2">
              {selectedSkills.map((skill) => (
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