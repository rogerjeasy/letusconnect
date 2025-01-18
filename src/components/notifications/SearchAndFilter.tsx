"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Settings, X, ChevronDown, RefreshCcw, Search, Bell, Filter, GrapeIcon } from "lucide-react";
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import NotificationGroup from "./NotificationGroup";
import NotificationStats from "./NotificationStats";

interface SearchAndFilterProps {
  onSearch: (query: string) => void;
  onFilterChange: (filter: { type: string; status: string }) => void;
  onSortChange: (sort: string) => void;
  groupedNotifications: {
    [date: string]: {
      id: string;
      title: string;
      content: string;
      type: string;
      time: string;
      priority: string;
      isRead: boolean;
      userId?: string;
    }[];
  };
  onActionClick: (id: string, action: string) => void;
  onRefreshNotifications: () => void;
  isRefreshing: boolean;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  onSearch,
  onFilterChange,
  onSortChange,
  groupedNotifications,
  onActionClick,
  onRefreshNotifications,
  isRefreshing,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortOption, setSortOption] = useState("date");
  const token = localStorage.getItem("token");
  const router = useRouter();

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

  const navigateToSettings = () => {
    router.push("platform-settings?current=notifications");
  };

  const activeFiltersCount = [
    filterType !== "all",
    filterStatus !== "all",
    sortOption !== "date"
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="w-[740px] max-w-full mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Bell className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Notifications</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={onRefreshNotifications}
              disabled={isRefreshing}
              size="icon"
            >
              <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={navigateToSettings}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Notification Settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                  📊
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Notifications Stats</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  {token && (
                    <NotificationStats />
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Search and Filters Section */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                onSearch(e.target.value);
              }}
              className="pl-9"
            />
          </div>
          
          <div className="flex gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Notifications</SheetTitle>
                </SheetHeader>
                <div className="py-6 space-y-6">
                  <div className="space-y-4">
                    <label className="text-sm font-medium">Type</label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full">
                        <DropdownMenuLabel>Select Type</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {["all", "message", "event", "reminder", "system", "custom"].map((type) => (
                          <DropdownMenuItem
                            key={type}
                            onClick={() => handleFilterChange(type, filterStatus)}
                          >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-medium">Status</label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          {filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full">
                        <DropdownMenuLabel>Select Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {["all", "unread", "read", "hidden"].map((status) => (
                          <DropdownMenuItem
                            key={status}
                            onClick={() => handleFilterChange(filterType, status)}
                          >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-medium">Sort By</label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          {sortOption.charAt(0).toUpperCase() + sortOption.slice(1)}
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full">
                        <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {["date", "priority", "type"].map((sort) => (
                          <DropdownMenuItem
                            key={sort}
                            onClick={() => {
                              setSortOption(sort);
                              onSortChange(sort);
                            }}
                          >
                            {sort.charAt(0).toUpperCase() + sort.slice(1)}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {(filterType !== "all" || filterStatus !== "all" || sortOption !== "date") && (
                    <Button
                      variant="ghost"
                      onClick={handleClearFilters}
                      className="w-full"
                      disabled={isRefreshing}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear Filters
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {["date", "priority", "type"].map((sort) => (
                  <DropdownMenuItem
                    key={sort}
                    onClick={() => {
                      setSortOption(sort);
                      onSortChange(sort);
                    }}
                  >
                    {sort.charAt(0).toUpperCase() + sort.slice(1)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Active Filters */}
        {(filterType !== "all" || filterStatus !== "all" || sortOption !== "date") && (
          <div className="flex flex-wrap gap-2 mb-6">
            {filterType !== "all" && (
              <Badge variant="secondary" className="text-sm">
                Type: {filterType}
                <button
                  onClick={() => handleFilterChange("all", filterStatus)}
                  className="ml-2 hover:text-primary"
                >
                  <X className="h-3 w-3 inline-block" />
                </button>
              </Badge>
            )}
            {filterStatus !== "all" && (
              <Badge variant="secondary" className="text-sm">
                Status: {filterStatus}
                <button
                  onClick={() => handleFilterChange(filterType, "all")}
                  className="ml-2 hover:text-primary"
                >
                  <X className="h-3 w-3 inline-block" />
                </button>
              </Badge>
            )}
            {sortOption !== "date" && (
              <Badge variant="secondary" className="text-sm">
                Sorted by: {sortOption}
                <button
                  onClick={() => {
                    setSortOption("date");
                    onSortChange("date");
                  }}
                  className="ml-2 hover:text-primary"
                >
                  <X className="h-3 w-3 inline-block" />
                </button>
              </Badge>
            )}
          </div>
        )}

        {/* Notifications List */}
        <div className="space-y-4">
          {Object.entries(groupedNotifications).map(([date, notifications]) => (
            <NotificationGroup
              key={date}
              date={date}
              notifications={notifications}
              onActionClick={onActionClick}
              onRefresh={onRefreshNotifications}
            />
          ))}
          
          {isRefreshing && (
            <div className="flex justify-center py-8">
              <div className="space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-2 w-2 bg-primary/20 rounded-full inline-block animate-pulse"
                    style={{ animationDelay: `${i * 100}ms` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilter;