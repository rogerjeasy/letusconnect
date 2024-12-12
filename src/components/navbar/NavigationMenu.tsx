"use client";

import Link from "next/link";
import { Button, Input } from "@nextui-org/react";
import DropDownWithIcon from "../forms/DropDownWithIcon";
import { adminOptions } from "../dropdownoptions/adminOptions";
import { mentorshipOptionsForDropDown } from "../dropdownoptions/menuOptonsForDropDown";
import { connectStudentOptions } from "../dropdownoptions/connectStudentOptions";
import { aboutOptions } from "../dropdownoptions/AboutOptions";
import { projectsOptions } from "../dropdownoptions/projectOptions";
import { jobsOptions } from "../dropdownoptions/jobOptions";
import { eventsOptions } from "../dropdownoptions/eventOptions";
import { testimonialsOptions } from "../dropdownoptions/testimonialOptions";
import { groupsOptions } from "../dropdownoptions/forumOptions";
import { SearchIcon } from "./SearchIcon";

interface NavigationMenuProps {
  isAuthenticated: boolean;
  user?: { role?: string[] } | null;
}

const NavigationMenu = ({ isAuthenticated, user }: NavigationMenuProps) => {
  return (
    <div className="flex flex-wrap items-center gap-1 md:gap-2">
      {isAuthenticated ? (
        <>
          <Link href="/dashboard">
            <Button variant="bordered" size="sm">
              Dashboard
            </Button>
          </Link>

          {/* Admin Dashboard */}
          {user?.role?.includes("admin") && (
            <DropDownWithIcon
              buttonLabel="Admin Dashboard"
              options={adminOptions.adminDashboard}
              buttonColor="default"
            />
          )}

          {/* Mentorship Dropdown */}
          <DropDownWithIcon
            buttonLabel="Mentorship"
            options={mentorshipOptionsForDropDown.mentorshipAuthUsers}
            buttonColor="default"
          />

          {/* Connect with Fellow Students */}
          <DropDownWithIcon
            buttonLabel="Students & Alumni"
            options={connectStudentOptions.connectAuthUsers}
            buttonColor="default"
          />

          {/* Projects Dropdown */}
          <DropDownWithIcon
            buttonLabel="Projects"
            options={projectsOptions.projectsAuth}
            buttonColor="default"
          />

          {/* Jobs & Careers Dropdown */}
          <DropDownWithIcon
            buttonLabel="Jobs & Careers"
            options={jobsOptions.jobs}
            buttonColor="default"
          />

          {/* Events Dropdown */}
          <DropDownWithIcon
            buttonLabel="Events"
            options={eventsOptions.events}
            buttonColor="default"
          />

          {/* Testimonials Dropdown */}
          <DropDownWithIcon
            buttonLabel="Testimonials"
            options={testimonialsOptions.testimonials}
            buttonColor="default"
          />

          {/* Groups/Forums Dropdown */}
          <DropDownWithIcon
            buttonLabel="Groups/Forums"
            options={groupsOptions.groups}
            buttonColor="default"
          />
        </>
      ) : (
        <>
          <DropDownWithIcon buttonLabel="About" options={aboutOptions.aboutUs} buttonColor="default" />

          <DropDownWithIcon
            buttonLabel="Mentorship"
            options={mentorshipOptionsForDropDown.mentorshipNonAuthUsers}
            buttonColor="default"
          />

          <DropDownWithIcon
            buttonLabel="Students & Alumni"
            options={connectStudentOptions.connectNonAuthUsers}
            buttonColor="default"
          />

          <DropDownWithIcon
            buttonLabel="Projects"
            options={projectsOptions.projectsNonAuth}
            buttonColor="default"
          />

          <DropDownWithIcon
            buttonLabel="Jobs & Careers"
            options={jobsOptions.jobsNonAuth}
            buttonColor="default"
          />

          <DropDownWithIcon
            buttonLabel="Events"
            options={eventsOptions.eventsNonAuth}
            buttonColor="default"
          />

          <DropDownWithIcon
            buttonLabel="Groups/Forums"
            options={groupsOptions.groupsNonAuth}
            buttonColor="default"
          />

          <DropDownWithIcon
            buttonLabel="Testimonials"
            options={testimonialsOptions.testimonialsNonAuth}
            buttonColor="default"
          />
        </>
      )}

      {/* Search Bar */}
      <div className="w-full md:w-auto mt-2 md:mt-0">
        <Input
          classNames={{
            base: "max-w-full sm:max-w-[12rem] h-10 bg-gray-200 rounded-full",
            mainWrapper: "h-full",
            input: "text-small",
            inputWrapper: "h-full font-normal text-default-500 bg-gray-200",
          }}
          placeholder="Search..."
          size="sm"
          startContent={<SearchIcon size={18} />}
          type="search"
        />
      </div>

      {/* Display Login and Register Buttons Only When Not Authenticated */}
      {!isAuthenticated && (
        <div className="flex gap-1 mt-2 md:mt-0 md:ml-2">
          <Link href="/register">
            <Button color="primary" size="sm" className="bg-green-500 hover:bg-green-600 text-white">
              Register
            </Button>
          </Link>
          <Link href="/login">
            <Button color="secondary" size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-white">
              Login
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default NavigationMenu;