"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Breadcrumbs,
  BreadcrumbItem,
  Button,
} from "@nextui-org/react";
import { ChevronDown } from "./Icons";
import { menuOptions, DropdownContentItem } from "../../store/menuOptions";

const MobileMenu = () => {
  const [activeBreadcrumb, setActiveBreadcrumb] = useState<string>("Home");
  const [dropdownContent, setDropdownContent] = useState<DropdownContentItem[]>([]);
  const icons = {
    chevron: <ChevronDown fill="currentColor" size={16} />,
  };

  const handleBreadcrumbClick = (breadcrumb: string) => {
    if (breadcrumb === "Home") {
      setActiveBreadcrumb("Home");
      setDropdownContent([]);
    }
  };

  const handleDropdownTriggerClick = (menu: string) => {
    setActiveBreadcrumb(menu);
    setDropdownContent(menuOptions[menu]);
  };

  const handleDropdownItemClick = (item: DropdownContentItem) => {
    setActiveBreadcrumb(`${activeBreadcrumb} > ${item.label}`);
    setDropdownContent([]);
  };

  return (
    <div className="md:hidden bg-blue-500 p-4">
      <Breadcrumbs
        maxItems={3}
        itemsBeforeCollapse={1}
        itemsAfterCollapse={2}
        className="text-white"
      >
        <BreadcrumbItem href="#" onClick={() => handleBreadcrumbClick("Home")}>
          <>Home</>
        </BreadcrumbItem>
        {activeBreadcrumb !== "Home" && (
          <BreadcrumbItem href="#">
            <>{activeBreadcrumb}</>
          </BreadcrumbItem>
        )}
      </Breadcrumbs>

      {dropdownContent.length === 0 ? (
        <div className="flex flex-col space-y-2 mt-4">
          {Object.keys(menuOptions).map((menu) => (
            <Button
              key={menu}
              variant="bordered"
              size="sm"
              endContent={icons.chevron}
              onClick={() => handleDropdownTriggerClick(menu)}
            >
              {menu}
            </Button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col space-y-2 mt-4">
          {dropdownContent.map((item) => (
            <Button
              key={item.key}
              variant="bordered"
              size="sm"
              onClick={() => handleDropdownItemClick(item)}
            >
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MobileMenu;