"use client";

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
import { useRouter } from "next/navigation";

interface NavigationMenuProps {
  isAuthenticated: boolean;
  user?: { role?: string[] } | null;
  closeMenu: () => void;
}

const NavigationMenu = ({ isAuthenticated, user, closeMenu }: NavigationMenuProps) => {
  const router = useRouter();

  return (
    <div className="flex flex-wrap items-center gap-1 md:gap-2 justify-between w-full">
      <div className="flex flex-wrap items-center gap-1 md:gap-2">
        {isAuthenticated ? (
          <>
            {/* Dashboard Button */}
            <Button
              variant="bordered"
              size="sm"
              onPress={() => {
                closeMenu();
                router.push("/dashboard");
              }}
            >
              Dashboard
            </Button>

            {/* Admin Dashboard */}
            {user?.role?.includes("admin") && (
              <DropDownWithIcon
                buttonLabel="Admin Dashboard"
                options={adminOptions.adminDashboard}
                buttonColor="default"
                closeMenu={closeMenu}
              />
            )}

            {/* Mentorship Dropdown */}
            <DropDownWithIcon
              buttonLabel="Mentorship"
              options={mentorshipOptionsForDropDown.mentorshipAuthUsers}
              buttonColor="default"
              closeMenu={closeMenu}
            />

            {/* Connect with Fellow Students */}
            <DropDownWithIcon
              buttonLabel="Students & Alumni"
              options={connectStudentOptions.connectAuthUsers}
              buttonColor="default"
              closeMenu={closeMenu}
            />

            {/* Projects Dropdown */}
            <DropDownWithIcon
              buttonLabel="Projects"
              options={projectsOptions.projectsAuth}
              buttonColor="default"
              closeMenu={closeMenu}
            />

            {/* Jobs & Careers Dropdown */}
            <DropDownWithIcon
              buttonLabel="Jobs & Careers"
              options={jobsOptions.jobs}
              buttonColor="default"
              closeMenu={closeMenu}
            />

            {/* Events Dropdown */}
            <DropDownWithIcon
              buttonLabel="Events"
              options={eventsOptions.events}
              buttonColor="default"
              closeMenu={closeMenu}
            />

            {/* Testimonials Dropdown */}
            <DropDownWithIcon
              buttonLabel="Testimonials"
              options={testimonialsOptions.testimonials}
              buttonColor="default"
              closeMenu={closeMenu}
            />

            {/* Groups/Forums Dropdown */}
            <DropDownWithIcon
              buttonLabel="Groups/Forums"
              options={groupsOptions.groups}
              buttonColor="default"
              closeMenu={closeMenu}
            />
          </>
        ) : (
          <>
            <DropDownWithIcon buttonLabel="About" options={aboutOptions.aboutUs} buttonColor="default" closeMenu={closeMenu} />

            <DropDownWithIcon
              buttonLabel="Mentorship"
              options={mentorshipOptionsForDropDown.mentorshipNonAuthUsers}
              buttonColor="default"
              closeMenu={closeMenu}
            />

            <DropDownWithIcon
              buttonLabel="Students & Alumni"
              options={connectStudentOptions.connectNonAuthUsers}
              buttonColor="default"
              closeMenu={closeMenu}
            />

            <DropDownWithIcon
              buttonLabel="Projects"
              options={projectsOptions.projectsNonAuth}
              buttonColor="default"
              closeMenu={closeMenu}
            />

            <DropDownWithIcon
              buttonLabel="Jobs & Careers"
              options={jobsOptions.jobsNonAuth}
              buttonColor="default"
              closeMenu={closeMenu}
            />

            <DropDownWithIcon
              buttonLabel="Events"
              options={eventsOptions.eventsNonAuth}
              buttonColor="default"
              closeMenu={closeMenu}
            />

            <DropDownWithIcon
              buttonLabel="Groups/Forums"
              options={groupsOptions.groupsNonAuth}
              buttonColor="default"
              closeMenu={closeMenu}
            />

            <DropDownWithIcon
              buttonLabel="Testimonials"
              options={testimonialsOptions.testimonialsNonAuth}
              buttonColor="default"
              closeMenu={closeMenu}
            />
          </>
        )}
      </div>

      {/* Search Bar, Register, and Login Buttons on the Right Side */}
      <div className="flex items-center gap-2 mt-2 md:mt-0 md:ml-auto">
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

        {!isAuthenticated && (
          <div className="flex gap-1">
            <Button
              color="primary"
              size="sm"
              className="bg-green-500 hover:bg-green-600 text-white"
              onPress={() => {
                closeMenu();
                router.push("/register");
              }}
            >
              Register
            </Button>
            <Button
              color="secondary"
              size="sm"
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
              onPress={() => {
                closeMenu();
                router.push("/login");
              }}
            >
              Login
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavigationMenu;