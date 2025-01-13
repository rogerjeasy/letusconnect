"use client";

import { Badge, Button, Input, Spinner, Tooltip } from "@nextui-org/react";
import DropDownWithIcon from "../forms/DropDownWithIcon";
import { SearchIcon } from "./SearchIcon";
import { useRouter } from "next/navigation";
import { FaComments } from "react-icons/fa";
import { useCallback, useEffect, useState } from "react";
import { getPusherInstance } from "@/helpers/pusher";
import { User } from "@/store/userStore";
import { NotificationIcon } from "../icons/NotificationIcon";
import { useNotificationStatsStore } from '@/store/notificationStatsStore';
import { getUnreadMessageCount } from "@/services/message.service";

import { aboutComponents } from "@/components/utils/aboutusmenu"
import { projectsNonAuthComponents, projectsAuthComponents } from "@/components/utils/projectsOptions"
import { mentorshipNonAuthComponents, mentorshipAuthComponents } from "@/components/utils/mentorshipOptions"
import { connectAuthComponents, connectNonAuthComponents } from "@/components/utils/connectStudentOptions"
import { eventsNonAuthComponents, eventsAuthComponents } from "@/components/utils/eventOptions"
import { jobsNonAuthComponents, jobsAuthComponents } from "@/components/utils/jobOptions"
import { groupsAuthComponents, groupsNonAuthComponents } from "@/components/utils/forumOptions"
import { testimonialsNonAuthComponents, testimonialsAuthComponents } from "@/components/utils/testimonialOptions"
import { adminComponents } from "@/components/utils/adminOptions"
import { useNotificationCount } from "../notifications/ManagingNotifications";
import React from "react";

interface NavigationMenuProps {
  isAuthenticated: boolean;
  user?: User | null;
  closeMenu: () => void;
  isMobile?: boolean;
}

interface MenuComponent {
  title: string;
  href: string;
  description: string;
  icon: JSX.Element;
}

interface MenuSection {
  title: string;
  getComponents: (isAuth: boolean) => MenuComponent[];
  visibilityCondition: (isAuth: boolean) => boolean;
}

interface NotificationBadgeProps {
  handleNavigation: (path: string) => void;
}

interface MessageBadgeProps {
  unreadCountMsg: number;
  handleMessagesClick: () => void;
}

export const NotificationBadge = React.memo(({ handleNavigation }: NotificationBadgeProps) => {
  const { unreadCount, isLoading } = useNotificationCount();

  return (
    <Tooltip
      content={unreadCount ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "No new notifications 😊"}
      placement="bottom"
    >
      <Button
        size="md"
        variant="light"
        className="font-bold text-white"
        onPress={() => handleNavigation("/notifications")}
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
});
NotificationBadge.displayName = 'NotificationBadge';

export const MessageBadge = React.memo(({ unreadCountMsg, handleMessagesClick }: MessageBadgeProps) => {
  return (
    <Tooltip
      content={
        unreadCountMsg
          ? `You have ${unreadCountMsg} new message${unreadCountMsg > 1 ? "s" : ""}`
          : "No new messages 😊"
      }
    >
      <Button
        size="sm"
        variant="light"
        className="font-bold text-white"
        onPress={handleMessagesClick}
      >
        <div className="relative flex items-center">
          {unreadCountMsg > 0 && (
            <Badge
              color="danger"
              content={unreadCountMsg > 99 ? "99+" : unreadCountMsg}
              isInvisible={false}
              shape="circle"
              size="sm"
            >
              <FaComments className="text-green-500" size={20} />
            </Badge>
          )}
          {unreadCountMsg === 0 && <FaComments className="text-green-500" size={20} />}
          <span className="ml-2">My Chats & Messages</span>
        </div>
      </Button>
    </Tooltip>
  );
});
MessageBadge.displayName = 'MessageBadge';

const NavigationMenu = React.memo(({ isAuthenticated, user, closeMenu, isMobile = false }: NavigationMenuProps) => {
  const router = useRouter();
  const [unreadCountMsg, setUnreadCountMsg] = useState<number>(0);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const menuSections: MenuSection[] = [
    {
      title: "About Us",
      getComponents: () => aboutComponents,
      visibilityCondition: (isAuth) => !isAuth
    },
    {
      title: "Students & Alumni",
      getComponents: (isAuth) => isAuth ? connectAuthComponents : connectNonAuthComponents,
      visibilityCondition: () => true
    },
    {
      title: "Mentorship",
      getComponents: (isAuth) => isAuth ? mentorshipAuthComponents : mentorshipNonAuthComponents,
      visibilityCondition: () => true
    },
    {
      title: "Projects",
      getComponents: (isAuth) => isAuth ? projectsAuthComponents : projectsNonAuthComponents,
      visibilityCondition: () => true
    },
    // {
    //   title: "Jobs & Careers",
    //   getComponents: (isAuth) => isAuth ? jobsAuthComponents : jobsNonAuthComponents,
    //   visibilityCondition: () => true
    // },
    {
      title: "Events",
      getComponents: (isAuth) => isAuth ? eventsAuthComponents : eventsNonAuthComponents,
      visibilityCondition: () => true
    },
    {
      title: "Groups/Forums",
      getComponents: (isAuth) => isAuth ? groupsAuthComponents : groupsNonAuthComponents,
      visibilityCondition: () => true
    },
    // {
    //   title: "Testimonials",
    //   getComponents: (isAuth) => isAuth ? testimonialsAuthComponents : testimonialsNonAuthComponents,
    //   visibilityCondition: () => true
    // }
  ];

  useEffect(() => {
    if (!user?.uid) return;

    getUnreadMessageCount(setUnreadCountMsg);

    const pusher = getPusherInstance();
    const notificationChannel = pusher?.subscribe(`user-notifications-${user.uid}`);

    notificationChannel?.bind("new-unread-message", () => {
      setUnreadCountMsg((prev) => prev + 1);
    });

    notificationChannel?.bind("update-unread-count", () => {
      getUnreadMessageCount(setUnreadCountMsg);
    });

    notificationChannel?.bind("message-read", () => {
      getUnreadMessageCount(setUnreadCountMsg);
    });

    return () => {
      notificationChannel?.unbind_all();
      pusher?.unsubscribe(`user-notifications-${user.uid}`);
    };
  }, [user?.uid]);

  const handleNavigation = useCallback((path: string) => {
    closeMenu();
    router.push(path);
  }, [closeMenu, router]);

  const handleMessagesClick = useCallback(() => {
    closeMenu();
    router.push("/messages");
  }, [closeMenu, router]);

  const renderMenuSections = () => {
    return menuSections
      .filter(section => section.visibilityCondition(isAuthenticated))
      .map((section, index) => (
        <DropDownWithIcon
          key={index}
          buttonLabel={section.title}
          options={section.getComponents(isAuthenticated)}
          buttonColor="default"
          closeMenu={closeMenu}
        />
      ));
  };

  return (
    <div className={`flex ${isMobile ? "flex-col" : "flex-wrap"} items-center gap-2 w-full`}>
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
                options={adminComponents}
                buttonColor="default"
                closeMenu={closeMenu}
              />
            )}

            {/* Messages button */}
            <MessageBadge 
              unreadCountMsg={unreadCountMsg}
              handleMessagesClick={handleMessagesClick}
            />
            {/* Notification */}
            <NotificationBadge handleNavigation={handleNavigation} />
          </>
        ):null}
      {renderMenuSections()}

      {/* Search and Auth Buttons */}
      <div className={`flex ${isMobile ? "flex-col w-full" : "items-center"} gap-2 mt-2 md:mt-0 ${isMobile ? "" : "md:ml-auto"}`}>
        <Input
          classNames={{
            base: `max-w-full ${isMobile ? "" : "sm:max-w-[12rem]"} h-10 bg-gray-200 rounded-full`,
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
          <div className={`flex ${isMobile ? "flex-col w-full" : ""} gap-1`}>
            <Button
              color="primary"
              size="sm"
              className="bg-green-500 hover:bg-green-600 text-white"
              onPress={() => handleNavigation("/register")}
            >
              Register
            </Button>
            <Button
              color="secondary"
              size="sm"
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
              onPress={() => handleNavigation("/login")}
            >
              Login
            </Button>
          </div>
        )}
      </div>
    </div>
  );
});
NavigationMenu.displayName = 'NavigationMenu';

export default NavigationMenu;