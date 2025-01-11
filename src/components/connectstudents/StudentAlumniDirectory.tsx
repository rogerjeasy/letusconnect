"use client";

import { useState, useEffect } from "react";
import {
  Input,
  Button,
  Pagination,
  Select,
  SelectItem,
} from "@nextui-org/react";
import {
  FaSearch,
  FaBook,
  FaUsers,
  FaUndo,
  FaCalendar,
  FaStar,
  FaExclamationTriangle,
  FaTimes,
} from "react-icons/fa";
import UserCard from "./UserCard";
import { User, useUserStore } from "@/store/userStore";
import UserCardWhileLoading from "./UserCardWhileLoading";
import { getAllUsers } from "@/services/users.services";

interface FilteredUsersState {
  users: User[];
  error: {
    type: 'program' | 'year' | 'interest' | 'general' | string;
    message: string;
  } | null;
}

interface FilterState {
  program: string;
  year: string;
  interest: string;
}

export default function StudentAlumniDirectory() {
  // State management
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<FilteredUsersState>({
    users: [],
    error: null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    program: "",
    year: "",
    interest: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const currentUser = useUserStore((state) => state.user);

  // Initial data fetch
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const fetchedUsers = await getAllUsers();
      const processedUsers = currentUser
        ? fetchedUsers.filter((user: User) => user.uid !== currentUser.uid)
        : fetchedUsers;

      setUsers(processedUsers);
      setFilteredUsers({
        users: processedUsers,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      setFilteredUsers({
        users: [],
        error: {
          type: 'general',
          message: 'Failed to load users. Please try again later.',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search function
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch();
    }, 300); 

    return () => clearTimeout(timer);
  }, [searchTerm, filters]);

  const performSearch = () => {
    if (isLoading) return;

    try {
      let filtered = users;

      // Apply name search if there's a search term
      if (searchTerm.trim()) {
        filtered = filtered.filter((user) => {
          const fullName = `${user.firstName} ${user.lastName} ${user.username}`.toLowerCase();
          return fullName.includes(searchTerm.toLowerCase());
        });

        if (filtered.length === 0) {
          return setFilteredUsers({
            users: [],
            error: {
              type: 'search',
              message: 'No users match your search term. Try a different search.',
            },
          });
        }
      }

      // Apply program filter
      if (filters.program) {
        const beforeCount = filtered.length;
        filtered = filtered.filter((user) => user.program === filters.program);
        if (filtered.length === 0 && beforeCount > 0) {
          return setFilteredUsers({
            users: [],
            error: {
              type: 'program',
              message: 'No users found in this program. Try a different program.',
            },
          });
        }
      }

      // Apply year filter
      if (filters.year) {
        const beforeCount = filtered.length;
        filtered = filtered.filter((user) => user.graduationYear.toString() === filters.year);
        if (filtered.length === 0 && beforeCount > 0) {
          return setFilteredUsers({
            users: [],
            error: {
              type: 'year',
              message: 'No users found for this graduation year. Try a different year.',
            },
          });
        }
      }

      // Apply interest filter
      if (filters.interest) {
        const beforeCount = filtered.length;
        filtered = filtered.filter((user) =>
          user.interests.some((interest) =>
            interest.toLowerCase().includes(filters.interest.toLowerCase())
          )
        );
        if (filtered.length === 0 && beforeCount > 0) {
          return setFilteredUsers({
            users: [],
            error: {
              type: 'interest',
              message: 'No users found with this interest. Try a different interest.',
            },
          });
        }
      }

      setFilteredUsers({
        users: filtered,
        error: null,
      });
      setCurrentPage(1);
    } catch (error) {
      console.error('Error during search:', error);
      setFilteredUsers({
        users: [],
        error: {
          type: 'general',
          message: 'An error occurred while searching. Please try again.',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilters({
      program: "",
      year: "",
      interest: "",
    });
    setFilteredUsers({
      users: users,
      error: null,
    });
    setCurrentPage(1);
  };

  // Handle input changes
  const handleFilterChange = (type: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }));
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.users.length / itemsPerPage);
  const paginatedUsers = filteredUsers.users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4 md:p-8 pt-24 md:pt-28">
      {/* Feature Explanation */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">🎓 Student & Alumni Directory</h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Connect with fellow students and alumni based on program, graduation year, and shared interests. 
          Grow your network, collaborate on projects, and share knowledge!
        </p>
        <FaUsers className="text-6xl text-teal-500 mx-auto mb-8" />

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-4">
          <Input
            placeholder="Search by name..."
            startContent={<FaSearch className="text-teal-500" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            classNames={{
              input: "bg-gradient-to-r from-teal-50 to-white border-teal-200 focus:border-teal-500",
              inputWrapper: "hover:border-teal-400 focus-within:border-teal-500"
            }}
            endContent={
              searchTerm && (
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={() => {
                    setSearchTerm("");
                    performSearch();
                  }}
                >
                  <FaTimes className="text-gray-400 hover:text-gray-600" />
                </Button>
              )
            }
            fullWidth
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-4">
          <Select
            label="Filter by Program"
            placeholder="Select a program"
            value={filters.program}
            onChange={(e) => handleFilterChange('program', e.target.value)}
            classNames={{
              trigger: "bg-gradient-to-r from-teal-50 to-white"
            }}
          >
            <SelectItem key="Applied Information and Data Science" value="Applied Information and Data Science">
              Applied Information and Data Science
            </SelectItem>
            <SelectItem key="Computer Science" value="Computer Science">
              Computer Science
            </SelectItem>
            <SelectItem key="Business Analytics" value="Business Analytics">
              Business Analytics
            </SelectItem>
          </Select>

          <Select
            label="Filter by Graduation Year"
            placeholder="Select a year"
            value={filters.year}
            onChange={(e) => handleFilterChange('year', e.target.value)}
            classNames={{
              trigger: "bg-gradient-to-r from-teal-50 to-white"
            }}
          >
            <SelectItem key="2024" value="2024">2024</SelectItem>
            <SelectItem key="2023" value="2023">2023</SelectItem>
            <SelectItem key="2022" value="2022">2022</SelectItem>
          </Select>

          <Input
            placeholder="Filter by area of interest..."
            startContent={<FaBook className="text-teal-500" />}
            value={filters.interest}
            onChange={(e) => handleFilterChange('interest', e.target.value)}
            classNames={{
              input: "bg-gradient-to-r from-teal-50 to-white border-teal-200 focus:border-teal-500",
              inputWrapper: "hover:border-teal-400 focus-within:border-teal-500"
            }}
            fullWidth
          />
        </div>

      </div>

      {/* User Cards Section */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto mb-10">
          {Array.from({ length: 6 }).map((_, index) => (
            <UserCardWhileLoading key={index} />
          ))}
        </div>
      ) : filteredUsers.error ? (
        <div className="text-center p-8 bg-white rounded-lg shadow-sm">
          {filteredUsers.error.type === 'program' && (
            <FaBook className="text-6xl text-orange-400 mb-4 mx-auto" />
          )}
          {filteredUsers.error.type === 'year' && (
            <FaCalendar className="text-6xl text-blue-400 mb-4 mx-auto" />
          )}
          {filteredUsers.error.type === 'interest' && (
            <FaStar className="text-6xl text-purple-400 mb-4 mx-auto" />
          )}
          {filteredUsers.error.type === 'general' && (
            <FaExclamationTriangle className="text-6xl text-red-400 mb-4 mx-auto" />
          )}
          <p className="text-gray-600 font-medium mb-2">{filteredUsers.error.message}</p>
          <p className="text-gray-500 mb-4">Try adjusting your filters or search terms.</p>
          <Button
            color="danger"
            variant="light"
            onPress={handleResetFilters}
            startContent={<FaUndo />}
            className="mx-auto"
          >
            Reset All Filters
          </Button>
        </div>
      ) : filteredUsers.users.length === 0 ? (
        <div className="text-center p-8 bg-white rounded-lg shadow-sm max-w-3xl mx-auto">
          <FaSearch className="text-6xl text-gray-400 mb-4 mx-auto" />
          <p className="text-gray-600 font-medium mb-2">No users match your search criteria.</p>
          <p className="text-gray-500 mb-4">Try adjusting your filters or search terms.</p>
          <Button
            color="danger"
            variant="light"
            onPress={handleResetFilters}
            startContent={<FaUndo />}
            className="mx-auto"
          >
            Reset All Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto mb-10">
          {paginatedUsers.map((user) => (
            <UserCard key={user.uid} user={user} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {filteredUsers.users.length > 0 && (
        <div className="flex justify-center mt-8">
          <Pagination
            total={totalPages}
            initialPage={1}
            page={currentPage}
            onChange={setCurrentPage}
            color="primary"
            className="bg-white rounded-lg shadow-sm p-2"
          />
        </div>
      )}
    </div>
  );
}