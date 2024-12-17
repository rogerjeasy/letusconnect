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
  FaFilter,
  FaBook,
  FaUsers,
  FaBan,
  FaUndo,
} from "react-icons/fa";
import { api } from "@/helpers/api";
import UserCard from "./UserCard";
import { User, useUserStore } from "@/store/userStore";
import UserCardWhileLoading from "./UserCardWhileLoading";

export default function StudentAlumniDirectory() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [programFilter, setProgramFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [interestFilter, setInterestFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const currentUser = useUserStore((state) => state.user);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/users");
      let fetchedUsers = response.data.users;

      // Exclude the currentUser if not null
      if (currentUser) {
        fetchedUsers = fetchedUsers.filter((user: User) => user.uid !== currentUser.uid);
      }

      setUsers(fetchedUsers);
      setFilteredUsers(fetchedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    let filtered = users.filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (programFilter) {
      filtered = filtered.filter((user) => user.program === programFilter);
    }
    if (yearFilter) {
      filtered = filtered.filter((user) => user.graduationYear.toString() === yearFilter);
    }
    if (interestFilter) {
      filtered = filtered.filter((user) =>
        user.interests.some((interest) =>
          interest.toLowerCase().includes(interestFilter.toLowerCase())
        )
      );
    }    
    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setProgramFilter("");
    setYearFilter("");
    setInterestFilter("");
    setFilteredUsers(users);
    setCurrentPage(1);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4 md:p-8 pt-24 md:pt-28">
      {/* Feature Explanation */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">🎓 Student & Alumni Directory</h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Connect with fellow students and alumni based on program, graduation year, and shared interests. Grow your network, collaborate on projects, and share knowledge!
        </p>
        <FaUsers className="text-6xl text-teal-500 mx-auto mb-8" />

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-4">
          <Input
            placeholder="Search by username..."
            startContent={<FaSearch />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            fullWidth
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-4">
          <Select
            label="Filter by Program"
            placeholder="Select a program"
            onChange={(e) => setProgramFilter(e.target.value)}
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
            onChange={(e) => setYearFilter(e.target.value)}
          >
            <SelectItem key="2024" value="2024">
              2024
            </SelectItem>
            <SelectItem key="2023" value="2023">
              2023
            </SelectItem>
            <SelectItem key="2022" value="2022">
              2022
            </SelectItem>
          </Select>
          <Input
            placeholder="Filter by area of interest..."
            startContent={<FaBook />}
            value={interestFilter}
            onChange={(e) => setInterestFilter(e.target.value)}
            fullWidth
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <Button color="primary" startContent={<FaFilter />} onClick={handleSearch}>
            Apply Filters
          </Button>
          <Button color="secondary" startContent={<FaUndo />} onClick={handleResetFilters}>
            Reset Filters
          </Button>
        </div>
      </div>

      {/* User Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto mb-10">
          {/* Display placeholder cards while loading */}
          {Array.from({ length: 6 }).map((_, index) => (
            <UserCardWhileLoading key={index} />
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center">
          <FaBan className="text-6xl text-gray-400 mb-4 mx-auto block" />
          <p className="text-gray-500">No users found. Please adjust your filters and try again.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto mb-10">
          {paginatedUsers.map((user) => (
            <UserCard key={user.uid} user={user} />
          ))}
        </div>
      )}


      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <Pagination
          total={totalPages}
          initialPage={1}
          page={currentPage}
          onChange={setCurrentPage}
          color="primary"
        />
      </div>
    </div>
  );
}