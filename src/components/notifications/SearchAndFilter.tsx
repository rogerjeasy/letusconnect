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

interface SearchAndFilterProps {
  onSearch: (query: string) => void;
  onFilterChange: (filter: { type: string; status: string }) => void;
  onSortChange: (sort: string) => void;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  onSearch,
  onFilterChange,
  onSortChange,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortOption, setSortOption] = useState("date");

  const handleClearFilters = () => {
    setSearchQuery("");
    setFilterType("all");
    setFilterStatus("all");
    setSortOption("date");
    onSearch("");
    onFilterChange({ type: "all", status: "all" });
    onSortChange("date");
  };

  const handleFilterChange = (type: string, status: string) => {
    setFilterType(type);
    setFilterStatus(status);
    onFilterChange({ type, status });
  };

  return (
    <div className="mx-auto pt-16">
      <Card className="p-6 shadow-lg">
        <CardBody>
          <h2 className="text-2xl font-bold mb-6 text-center">
            🔍 Search and Filter Notifications
          </h2>

          <div className="flex justify-center mb-6">
            <Input
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                onSearch(e.target.value);
              }}
              size="lg"
              className="w-full md:w-2/3 lg:w-1/2"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="bordered"
                  className="w-40 h-10"
                  endContent={<ChevronDown fill="currentColor" size={16} />}
                >
                  Filter by Type
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                onAction={(selected) =>
                  handleFilterChange(selected as string, filterStatus)
                }
              >
                <DropdownItem key="all">All</DropdownItem>
                <DropdownItem key="message">Message</DropdownItem>
                <DropdownItem key="event">Event</DropdownItem>
                <DropdownItem key="reminder">Reminder</DropdownItem>
                <DropdownItem key="system">System</DropdownItem>
                <DropdownItem key="custom">Custom</DropdownItem>
              </DropdownMenu>
            </Dropdown>

            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="bordered"
                  className="w-40 h-10"
                  endContent={<ChevronDown fill="currentColor" size={16} />}
                >
                  Filter by Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                onAction={(selected) =>
                  handleFilterChange(filterType, selected as string)
                }
              >
                <DropdownItem key="all">All</DropdownItem>
                <DropdownItem key="unread">Unread</DropdownItem>
                <DropdownItem key="read">Read</DropdownItem>
                <DropdownItem key="hidden">Hidden</DropdownItem>
              </DropdownMenu>
            </Dropdown>

            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="bordered"
                  className="w-40 h-10"
                  endContent={<ChevronDown fill="currentColor" size={16} />}
                >
                  Sort By
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                onAction={(selected) => {
                  setSortOption(selected as string);
                  onSortChange(selected as string);
                }}
              >
                <DropdownItem key="date">Date</DropdownItem>
                <DropdownItem key="priority">Priority</DropdownItem>
                <DropdownItem key="type">Type</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>

          <div className="flex justify-center gap-4">
            <Button color="primary" size="md" className="h-10 px-4">
              Apply Filters
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

export default SearchAndFilter;