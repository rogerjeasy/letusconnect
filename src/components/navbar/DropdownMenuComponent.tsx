import React from "react";
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { ChevronDown } from "./Icons";

type DropdownMenuComponentProps = {
  title: string;
  menuItems: { key: string; label: string; href: string }[]; 
};

const DropdownMenuComponent: React.FC<DropdownMenuComponentProps> = ({ title, menuItems }) => {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="bordered"
          size="sm"
          endContent={<ChevronDown fill="currentColor" size={16} />}
        >
          {title}
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label={`${title} Actions`}>
        {menuItems.map((item) => (
          <DropdownItem key={item.key}>
            <a href={item.href}>{item.label}</a>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default DropdownMenuComponent;