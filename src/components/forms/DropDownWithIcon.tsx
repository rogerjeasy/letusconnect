"use client";

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
}

export default function DropDownWithIcon({ buttonLabel, options, buttonColor = "primary" }: DropDownWithIconProps) {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button color={buttonColor} variant="bordered" className="font-bold"
            endContent={<ChevronDown fill="currentColor" size={16} />}>
          {buttonLabel}
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label={buttonLabel} variant="faded">
        {options.map((option, index) => (
          <DropdownItem key={index} startContent={option.icon}>
            <Link href={option.link} className="w-full block">
              {option.label}
            </Link>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}