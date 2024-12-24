"use client";

import { useState } from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "../navbar/Icons";

interface DropdownOption {
  label: string;
  icon: JSX.Element;
  link: string;
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
            endContent={<ChevronDown fill="currentColor" size={16} />}
          >
            {buttonLabel}
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label={buttonLabel} variant="faded">
          {options.map((option, index) => (
            <DropdownItem
              key={index}
              startContent={option.icon}
              onPress={() => handleOptionClick(option.link)}
            >
              <Button
                variant="light"
                className="w-full justify-start text-left"
                onPress={() => handleOptionClick(option.link)}
              >
                {option.label}
              </Button>
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}