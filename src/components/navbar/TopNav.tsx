"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@nextui-org/react";
import {  Dropdown,  
  DropdownTrigger,  
  DropdownMenu,  
  DropdownItem,
  Input,
} from "@nextui-org/react";
import { useUserStore, generateRandomAvatar } from "../../store/userStore";
import { ChevronDown } from "./Icons";
import { SearchIcon } from "./SearchIcon";
import MobileMenu from "./MobileNavBar";
import ProfileDropDown from "./ProfileDropDown";
import DropdownMenuComponent from "./DropdownMenuComponent";
import { menuOptions, DropdownContentItem } from "../../store/menuOptions";
import DropDownWithIcon from "../forms/DropDownWithIcon";
import { mentorshipOptionsForDropDown } from "../dropdownoptions/menuOptonsForDropDown";
import { aboutOptions } from "../dropdownoptions/AboutOptions";
import { adminOptions } from "../dropdownoptions/adminOptions";


const Navbar = () => {
  const { user, isAuthenticated, logout } = useUserStore();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const avatarPicture = user?.profilePicture || generateRandomAvatar();

  const icons = {
    chevron: <ChevronDown fill="currentColor" size={16} />,
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false); // Close dropdown on logout
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  return (
    <nav className="bg-blue-600 text-white fixed w-full z-50 shadow">
      <div className="container mx-auto px-4 flex justify-between items-center h-16">
        {/* Left Section: Logo */}
        <div className="text-2xl font-bold">
          <Link href="/" className="hover:text-gray-200">
            LetUsConnect
          </Link>
        </div>

        {/* Middle Section */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link href="/" className="hover:text-gray-200">
            <Button 
              variant="bordered"
              size="sm" 
            >
              Home
            </Button>
          </Link>
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="hover:text-gray-200">
                <Button 
                  variant="bordered"
                  size="sm" 
                >
                  Dashboard
                </Button>
              </Link> 

            {/* Check if the user has the 'admin' role */}
              {user && user.role?.includes("admin") ? (
              <>
                <DropDownWithIcon
                  buttonLabel="Admin Dashboard"
                  options={adminOptions.adminDashboard}
                  buttonColor="default"
                />
              </>
              ) : null}
            

            {/* Mentorship Dropdown */}
            <DropDownWithIcon
              buttonLabel="Mentorship"
              options={mentorshipOptionsForDropDown.mentorshipAuthUsers}
              buttonColor="default"
            />

          {/* Projects Dropdown */}
          <DropdownMenuComponent
            title="Projects"
            menuItems={menuOptions.Projects}
          />

          {/* Jobs & Careers Dropdown */}
          <DropdownMenuComponent
            title="Jobs & Careers"
            menuItems={menuOptions.Jobs}
          />

          {/* Events Dropdown */}
          <DropdownMenuComponent
            title="Events"
            menuItems={menuOptions.Events}
          />

          {/* Groups/Forums Dropdown */}
          <DropdownMenuComponent
            title="Groups/Forums"
            menuItems={menuOptions.Groups}
          />

            </>
          ) : (
            <>
              {/* About Dropdown */}
              <DropDownWithIcon
                buttonLabel="About"
                options={aboutOptions.aboutUs}
                buttonColor="default"
              />

              {/* <DropdownMenuComponent
                title="Mentorship"
                menuItems={menuOptions.MentorshipNonAuth}
              /> */}

              <DropDownWithIcon
                buttonLabel="Mentorship"
                options={mentorshipOptionsForDropDown.mentorshipNonAuthUsers}
                buttonColor="default"
              />

              <DropdownMenuComponent
                title="Projects"
                menuItems={menuOptions.ProjectsNonAuth}
              />
              
              <DropdownMenuComponent
                title="Jobs"
                menuItems={menuOptions.JobsNonAuth}
              />

              <DropdownMenuComponent
                title="Testimonials"
                menuItems={menuOptions.TestimonialsNonAuth}
              />

              <DropdownMenuComponent
                title="Events"
                menuItems={menuOptions.EventsNonAuth}
              />
            </>
          )}
        </div>

        {/* Right Section: Authenticated Dropdown or Login/Register */}
        <div className="hidden md:flex space-x-6 items-center">
          {/* Search Bar */}
          <Input
            classNames={{
              base: "max-w-full sm:max-w-[10rem] h-10 bg-gray-200 rounded-full",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper: "h-full font-normal text-default-500 bg-gray-200",
            }}
            placeholder="Type to search..."
            size="sm"
            startContent={<SearchIcon size={18} />}
            type="search"
          />
          {isAuthenticated ? (
            <div className="relative">
              {/* Dropdown Menu */}
              <ProfileDropDown
                type="avatar"
                userDetails={{
                  name: user?.username || "User",
                  email: user?.email || "user@example.com",
                  avatarUrl: avatarPicture,
                }}
              />
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button
                  color="primary"
                  size="sm"
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  color="secondary"
                  size="sm"
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="focus:outline-none"
            aria-label="Toggle Mobile Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={
                  isMobileMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16m-7 6h7"
                }
              ></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-blue-500">
          <div className="flex flex-col space-y-4 p-4">
            <Link href="/" className="hover:text-gray-200" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link href="/about" className="hover:text-gray-200" onClick={() => setMobileMenuOpen(false)}>
              About
            </Link>
            {isAuthenticated ? (
              <>
                
                <MobileMenu />
                <button
                  onClick={handleLogout}
                  className="hover:text-gray-200 focus:outline-none"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    color="primary"
                    size="sm"
                    className="bg-green-500 hover:bg-green-600 text-white w-full"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    color="secondary"
                    size="sm"
                    className="bg-yellow-500 hover:bg-yellow-600 text-white w-full"
                  >
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;