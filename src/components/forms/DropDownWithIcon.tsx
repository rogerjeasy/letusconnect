"use client";

import { useState } from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import Link from "next/link";
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
  onCloseMenu?: () => void;
}

export default function DropDownWithIcon({ buttonLabel, options, buttonColor = "primary" }: DropDownWithIconProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => setIsOpen(false);
  const handleOptionClick = () => setIsOpen(false);

  return (
    <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
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
        <DropdownMenu aria-label={buttonLabel} variant="faded" onAction={handleOptionClick}>
          {options.map((option, index) => (
            <DropdownItem key={index} startContent={option.icon} onClick={handleOptionClick}>
              <Link href={option.link} className="w-full block">
                {option.label}
              </Link>
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
