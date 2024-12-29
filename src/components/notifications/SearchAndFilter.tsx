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
  Modal,
  ModalContent,
  Tooltip,
} from "@nextui-org/react";
import { FaTimesCircle, FaCog } from "react-icons/fa";
import { ChevronDown } from "../navbar/Icons";
import NotificationsSettings from "./NotificationsSettings";
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
    }[];
  };
  onActionClick: (id: string, action: string) => void;
  onRefreshNotifications: () => void;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  onSearch,
  onFilterChange,
  onSortChange,
  groupedNotifications,
  onActionClick,
  onRefreshNotifications,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortOption, setSortOption] = useState("date");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const token = localStorage.getItem("token");

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
    <div className="flex flex-col gap-8">
      <div className="mx-auto pt-16 w-full">
        <Card className="p-6 shadow-lg relative">
          {/* Stats with responsive positioning */}
          {token && (
            <div className="md:absolute md:top-4 md:left-4 md:z-20 w-full md:w-auto md:max-w-xs mb-6 md:mb-0">
              <NotificationStats token={token} />
            </div>
          )}

          {/* Settings Icon */}
          <Tooltip
            content={
              <Card className="p-4 shadow-md">
                <h4 className="font-bold text-lg">Notification Settings</h4>
                <p className="text-sm text-gray-600">
                  Manage notification preferences
                </p>
              </Card>
            }
            placement="top"
            showArrow
          >
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors duration-200 rounded-full hover:bg-gray-100 z-10"
            >
              <FaCog className="w-6 h-6" />
            </button>
          </Tooltip>

          <CardBody>
            {/* Title with responsive margin */}
            <div className="md:mt-0">
              <h2 className="text-2xl font-bold mb-6 text-center">
                🔍 Search and Filter Notifications
              </h2>

              {/* Search bar */}
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

              {/* Filters with responsive wrapping */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
                <div className="w-full sm:w-auto">
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        variant="bordered"
                        className="w-full sm:w-40 h-10"
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
                </div>

                <div className="w-full sm:w-auto">
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        variant="bordered"
                        className="w-full sm:w-40 h-10"
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
                </div>

                <div className="w-full sm:w-auto">
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        variant="bordered"
                        className="w-full sm:w-40 h-10"
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
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                <Button 
                  color="primary" 
                  size="md" 
                  className="w-full sm:w-auto h-10 px-4"
                >
                  Apply Filters
                </Button>
                <Button
                  color="danger"
                  variant="bordered"
                  size="md"
                  className="w-full sm:w-auto h-10 px-4"
                  onClick={handleClearFilters}
                  startContent={<FaTimesCircle />}
                >
                  Clear Filters
                </Button>
              </div>

              {/* Notification Groups */}
              <div className="w-full mt-8">
                {Object.entries(groupedNotifications).map(([date, notifications]) => (
                  <NotificationGroup
                    key={date}
                    date={date}
                    notifications={notifications}
                    onActionClick={onActionClick}
                    onRefresh={onRefreshNotifications}
                  />
                ))}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Settings Modal */}
        <Modal
          size="2xl"
          isOpen={isSettingsOpen}
          onOpenChange={(open) => setIsSettingsOpen(open)}
          scrollBehavior="inside"
        >
          <ModalContent>
            <div className="p-6">
              <NotificationsSettings />
            </div>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

export default SearchAndFilter;