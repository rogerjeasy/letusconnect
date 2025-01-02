"use client";

import { Badge, Button, Input, Spinner, Tooltip } from "@nextui-org/react";
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
import { FaBell, FaComments } from "react-icons/fa";
import { useEffect, useState } from "react";
import { getPusherInstance } from "@/helpers/pusher";
import { User } from "@/store/userStore";
import fetchUnreadCount from "../messages/fetchUnreadCount";
import { useNotificationCount } from "../notifications/ManagingNotifications";
import { BellIcon } from "lucide-react";
import { NotificationIcon } from "../icons/NotificationIcon";

interface NavigationMenuProps {
  isAuthenticated: boolean;
  user?: User | null;
  closeMenu: () => void;
}

const NavigationMenu = ({ isAuthenticated, user, closeMenu }: NavigationMenuProps) => {
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    if (!user?.uid) return;

    fetchUnreadCount(setUnreadCount);

    const pusher = getPusherInstance();
    const notificationChannel = pusher?.subscribe(`user-notifications-${user.uid}`);

    notificationChannel?.bind("new-unread-message", () => {
      setUnreadCount((prev) => prev + 1);
    });

    notificationChannel?.bind("update-unread-count", () => {
      fetchUnreadCount(setUnreadCount);
    });

    notificationChannel?.bind("message-read", () => {
      fetchUnreadCount(setUnreadCount);
    });

    return () => {
      notificationChannel?.unbind_all();
      pusher?.unsubscribe(`user-notifications-${user.uid}`);
    };
  }, [user?.uid]);

  const handleMessagesClick = () => {
    // setUnreadCount(0);
    closeMenu();
    router.push("/messages");
  };

  const NotificationBadge = ({ token, onPress }: { token: string; onPress?: () => void }) => {
    const { unreadCount, isLoading } = useNotificationCount();
  
    return (
      <Tooltip
        content={unreadCount ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "No new notifications 😊"}
        placement="bottom"
      >
        <Button
          size="sm"
          variant="light"
          className="font-bold text-white"
          onPress={onPress}
        >
          <div className="relative flex items-center">
            {isLoading ? (
              <Spinner size="sm" color="success" />
            ) : (
              <>
                {unreadCount > 0 && (
                  <Badge
                    color="danger"
                    content={unreadCount > 99 ? "99+" : unreadCount}
                    isInvisible={false}
                    shape="circle"
                    size="sm"
                  >
                    <NotificationIcon className="fill-current" size={20} />
                  </Badge>
                )}
                {unreadCount === 0 && <NotificationIcon className="fill-current" size={20} />}
              </>
            )}
            <span className="ml-2">Notification</span>
          </div>
        </Button>
      </Tooltip>
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-1 md:gap-2 justify-between w-full">
      <div className="flex flex-wrap items-center gap-1 md:gap-2">
        {isAuthenticated ? (
          <>
            {/* Dashboard Button */}
            <Button
              variant="light"
              className="font-bold text-white"
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

            {/* Messages button */}
            <Tooltip
              content={
                unreadCount
                  ? `You have ${unreadCount} new message${unreadCount > 1 ? "s" : ""}`
                  : "No new messages 😊"
              }
              // isDisabled={unreadCount === 0}
            >
              <Button
                size="sm"
                variant="light"
                className="font-bold text-white"
                onPress={handleMessagesClick}
              >
                <div className="relative flex items-center">
                  
                  {unreadCount > 0 && (
                    <Badge
                    color="danger"
                    content={unreadCount > 99 ? "99+" : unreadCount}
                    isInvisible={false}
                    shape="circle"
                    size="sm"
                  >
                    <FaComments className="text-green-500"  size={20}/>
                  </Badge>
                  
                  )}
                  {unreadCount === 0 && <FaComments className="text-green-500" size={20} />}
                  <span className="ml-2">My Chats & Messages</span>
                </div>
              </Button>
            </Tooltip>

            {/* Notification */}
            <NotificationBadge 
              token={localStorage.getItem("token") || ""} 
              onPress={() => {
                closeMenu();
                router.push("/notifications");
              }}
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
            {/* <DropDownWithIcon
              buttonLabel="Testimonials"
              options={testimonialsOptions.testimonials}
              buttonColor="default"
              closeMenu={closeMenu}
            /> */}

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