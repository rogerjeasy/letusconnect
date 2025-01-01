"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
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

// Predefined list of possible interests
const INTEREST_CATEGORIES = {
  TECHNOLOGY: {
    name: "Technology",
    interests: [
      "Artificial Intelligence",
      "Blockchain",
      "Cloud Computing",
      "Cybersecurity",
      "Data Science",
      "IoT",
      "Machine Learning",
      "Mobile Development",
      "Robotics",
      "Web Development"
    ]
  },
  BUSINESS: {
    name: "Business",
    interests: [
      "Digital Marketing",
      "Entrepreneurship",
      "Finance",
      "Innovation",
      "Leadership",
      "Management",
      "Project Management",
      "Startups",
      "Strategy",
      "Venture Capital"
    ]
  },
  INDUSTRY: {
    name: "Industry",
    interests: [
      "E-commerce",
      "Education",
      "Healthcare",
      "Manufacturing",
      "Media",
      "Real Estate",
      "Retail",
      "Sustainability",
      "Transportation",
      "Telecommunications"
    ]
  },
  PROFESSIONAL: {
    name: "Professional Development",
    interests: [
      "Career Growth",
      "Communication",
      "Consulting",
      "Mentoring",
      "Networking",
      "Personal Branding",
      "Public Speaking",
      "Remote Work",
      "Team Building",
      "Work-Life Balance"
    ]
  }
} as const;

type InterestCategory = keyof typeof INTEREST_CATEGORIES;
type Interest = typeof INTEREST_CATEGORIES[InterestCategory]["interests"][number];

interface InterestsSelectorProps {
  selectedInterests: string[];
  onChange: (interests: string[]) => void;
  maxSelections?: number;
  isEditing?: boolean;
}

export default function InterestsSelector({
  selectedInterests,
  onChange,
  maxSelections = 10,
  isEditing = false
}: InterestsSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [activeCategory, setActiveCategory] = React.useState<InterestCategory>("TECHNOLOGY");
  const [customInterest, setCustomInterest] = React.useState("");

  const handleInterestToggle = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      onChange(selectedInterests.filter(item => item !== interest));
    } else if (selectedInterests.length < maxSelections) {
      onChange([...selectedInterests, interest]);
    }
  };

  const handleAddCustomInterest = () => {
    if (customInterest && !selectedInterests.includes(customInterest) && selectedInterests.length < maxSelections) {
      onChange([...selectedInterests, customInterest]);
      setCustomInterest("");
    }
  };

  if (!isEditing) {
    return (
      <div className="flex flex-wrap gap-2">
        {selectedInterests.map((interest) => (
          <Chip key={interest} variant="flat" color="secondary">
            {interest}
          </Chip>
        ))}
        {selectedInterests.length === 0 && (
          <span className="text-default-500">No interests selected</span>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          Selected Interests: {selectedInterests.length}/{maxSelections}
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
            {INTEREST_CATEGORIES[activeCategory].name}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search interest categories..." />
            <CommandList>
              <CommandEmpty>No category found.</CommandEmpty>
              <CommandGroup>
                {Object.entries(INTEREST_CATEGORIES).map(([key, { name }]) => (
                  <CommandItem
                    key={key}
                    value={name}
                    onSelect={() => {
                      setActiveCategory(key as InterestCategory);
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

      {/* Custom Interest Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={customInterest}
          onChange={(e) => setCustomInterest(e.target.value)}
          placeholder="Add custom interest..."
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <Button
          variant="solid"
          color="primary"
          isIconOnly
          onClick={handleAddCustomInterest}
          disabled={!customInterest || selectedInterests.length >= maxSelections}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Available Interests */}
      <Card>
        <CardHeader className="pb-3">
          <h4 className="font-medium">Available Interests in {INTEREST_CATEGORIES[activeCategory].name}</h4>
        </CardHeader>
        <CardBody>
          <div className="flex flex-wrap gap-2">
            {INTEREST_CATEGORIES[activeCategory].interests.map((interest) => (
              <Chip
                key={interest}
                variant="flat"
                color={selectedInterests.includes(interest) ? "secondary" : "default"}
                className="cursor-pointer"
                onClick={() => handleInterestToggle(interest)}
              >
                {interest}
                {selectedInterests.includes(interest) && (
                  <Check className="ml-2 h-3 w-3" />
                )}
              </Chip>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Selected Interests */}
      {selectedInterests.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <h4 className="font-medium">Your Selected Interests</h4>
          </CardHeader>
          <CardBody>
            <div className="flex flex-wrap gap-2">
              {selectedInterests.map((interest) => (
                <Chip
                  key={interest}
                  variant="flat"
                  color="secondary"
                  className="cursor-pointer"
                  onClose={() => handleInterestToggle(interest)}
                >
                  {interest}
                </Chip>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}