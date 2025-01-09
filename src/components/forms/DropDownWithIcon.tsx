"use client";
import { useState } from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp } from 'lucide-react';

interface DropdownOption {
  title: string;
  icon: JSX.Element;
  href: string;
  description?: string;
}

interface DropDownWithIconProps {
  buttonLabel: string;
  options: DropdownOption[];
  buttonColor?: "primary" | "default" | "secondary" | "success" | "warning";
  closeMenu?: () => void;
}

export default function DropDownWithIcon({ buttonLabel, options, buttonColor = "primary", closeMenu }: DropDownWithIconProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  
  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => setIsOpen(false);
  
  const handleOptionClick = (link: string) => {
    setIsOpen(false);
    if (closeMenu) closeMenu();
    router.push(link);
  };

  return (
    <div className="relative">
      <Dropdown isOpen={isOpen} onOpenChange={setIsOpen}>
        <DropdownTrigger>
          <Button
            color={buttonColor}
            variant="light"
            className="font-bold text-white"
            endContent={isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          >
            {buttonLabel}
          </Button>
        </DropdownTrigger>
        <DropdownMenu 
          aria-label={buttonLabel} 
          variant="faded"
          className="w-full min-w-[200px] max-w-sm md:max-w-md lg:max-w-lg"
        >
          {options.map((option, index) => (
            <DropdownItem
              key={index}
              description={option.description}
              startContent={option.icon}
              onPress={() => handleOptionClick(option.href)}
              // className="p-2 sm:p-3 md:p-4"
            >
              <Button
                variant="light"
                className="w-full justify-start text-left"
                onPress={() => handleOptionClick(option.href)}
              >
                {option.title}
              </Button>
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}