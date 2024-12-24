// components/ProjectSearchFilterSection.tsx
"use client";

import React, { useState } from "react";
import {
  Input,
  Card,
  CardBody,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { FaTimesCircle } from "react-icons/fa";
import { ChevronDown } from "../navbar/Icons";
import { projectRoles, industries, skills, statuses } from "@/store/project";

const ProjectSearchFilterSection = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleClearFilters = () => {
    setSearchQuery("");
  };

  return (
    <div className="mx-auto pt-16">
    <Card className="p-6 shadow-lg">
      <CardBody>
        {/* Title */}
        <h2 className="text-2xl font-bold mb-6 text-center">🔍 Search and Filter Projects</h2>

        {/* Search Bar */}
        <div className="flex justify-center mb-6">
          <Input
            placeholder="Search by title, skills, industry, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="lg"
            className="w-full md:w-2/3 lg:w-1/2"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {/* Category Filter */}
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="bordered"
                className="w-40 h-10"
                endContent={<ChevronDown fill="currentColor" size={16} />}
              >
                Categories
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Project Role">
              {projectRoles.map((category) => (
                <DropdownItem key={category}>{category}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          {/* Industry Filter */}
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="bordered"
                className="w-40 h-10"
                endContent={<ChevronDown fill="currentColor" size={16} />}
              >
                Industry
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Industries">
              {industries.map((industry) => (
                <DropdownItem key={industry}>{industry}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          {/* Skills Needed Filter */}
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="bordered"
                className="w-40 h-10"
                endContent={<ChevronDown fill="currentColor" size={16} />}
              >
                Skills Needed
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Skills Needed">
              {skills.map((skill) => (
                <DropdownItem key={skill}>{skill}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          {/* Status Filter */}
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="bordered"
                className="w-40 h-10"
                endContent={<ChevronDown fill="currentColor" size={16} />}
              >
                Status
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Statuses">
              {statuses.map((status) => (
                <DropdownItem key={status}>{status}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button color="primary" size="md" className="h-10 px-4">
            Search Projects
          </Button>
          <Button
            color="danger"
            variant="bordered"
            size="md"
            className="h-10 px-4"
            onClick={handleClearFilters}
            startContent={<FaTimesCircle />}
          >
            Clear Filters
          </Button>
        </div>
      </CardBody>
    </Card>
    </div>
  );
};

export default ProjectSearchFilterSection;