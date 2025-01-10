// components/ProjectSearchFilterSection.tsx
"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Search, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { projectRoles, industries, skills, statuses } from "@/store/project";
import { cn } from "@/lib/utils";
import { FaTimesCircle } from "react-icons/fa";

interface FilterState {
  category: string;
  industry: string;
  skills: string;
  status: string;
}

interface AppliedFilter {
  type: keyof FilterState;
  value: string;
}

const ProjectSearchFilterSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filters, setFilters] = useState<FilterState>({
    category: "",
    industry: "",
    skills: "",
    status: "",
  });
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);

  const handleFilterChange = (type: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [type]: value }));
    setAppliedFilters((prev) => [...prev, { type, value }]);
  };

  const removeFilter = (index: number) => {
    const updatedFilters = [...appliedFilters];
    const removedFilter = updatedFilters[index];
    updatedFilters.splice(index, 1);
    setAppliedFilters(updatedFilters);
    setFilters((prev) => ({ ...prev, [removedFilter.type]: "" }));
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setFilters({
      category: "",
      industry: "",
      skills: "",
      status: "",
    });
    setAppliedFilters([]);
  };

  return (
    <Card className="mx-auto max-w-5xl shadow-lg bg-white/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
        🔍 Search and Filter Projects
        </CardTitle>
        <CardDescription className="text-center">
          Find the perfect project by using our advanced search and filter options
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search projects by title, description, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12"
          />
        </div>

        {/* Filter Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Project Categories</SelectLabel>
                {projectRoles.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={filters.industry} onValueChange={(value) => handleFilterChange("industry", value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Industries</SelectLabel>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={filters.skills} onValueChange={(value) => handleFilterChange("skills", value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Skills Required" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Required Skills</SelectLabel>
                {skills.map((skill) => (
                  <SelectItem key={skill} value={skill}>
                    {skill}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Project Status</SelectLabel>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Applied Filters */}
        {appliedFilters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {appliedFilters.map((filter, index) => (
              <Badge
                key={index}
                variant="secondary"
                className={cn(
                  "px-3 py-1",
                  filter.type === "category" && "bg-blue-100 text-blue-800",
                  filter.type === "industry" && "bg-green-100 text-green-800",
                  filter.type === "skills" && "bg-purple-100 text-purple-800",
                  filter.type === "status" && "bg-orange-100 text-orange-800"
                )}
              >
                {filter.value}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => removeFilter(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
            {appliedFilters.length > 0 && (
              <Button
                variant="default"
                size="sm"
                onClick={clearAllFilters}
                className="text-white hover:text-white bg-red-500 hover:bg-red-600"
              >
                Clear all
              </Button>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button className="w-40" variant="outline">
            <Search className="mr-2 h-4 w-4" /> Search
          </Button>
          <Button
            variant="destructive"
            className="w-40"
            onClick={clearAllFilters}
          >
            <FaTimesCircle className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectSearchFilterSection;