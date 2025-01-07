"use client"

import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { aboutComponents } from "@/components/utils/aboutusmenu"
import { projectsNonAuthComponents, projectsAuthComponents } from "@/components/utils/projectsOptions"
import { mentorshipNonAuthComponents, mentorshipAuthComponents } from "@/components/utils/mentorshipOptions"
import { connectAuthComponents, connectNonAuthComponents } from "@/components/utils/connectStudentOptions"
import { eventsNonAuthComponents, eventsAuthComponents } from "@/components/utils/eventOptions"
import { jobsNonAuthComponents, jobsAuthComponents } from "@/components/utils/jobOptions"
import { groupsAuthComponents, groupsNonAuthComponents } from "@/components/utils/forumOptions"
import { testimonialsNonAuthComponents, testimonialsAuthComponents } from "@/components/utils/testimonialOptions"
import { User } from "@/store/userStore";
import { NotificationIcon } from "../icons/NotificationIcon"
import { Badge, Button, Input, Spinner, Tooltip } from "@nextui-org/react"
import { useNotificationCount } from "../notifications/ManagingNotifications"
import { useEffect, useState } from "react"
import { getPusherInstance } from "@/helpers/pusher"
import { useRouter } from "next/navigation"
import { SearchIcon } from "./SearchIcon"
import { FaComments } from "react-icons/fa"
import { getUnreadMessageCount } from "@/services/message.service"

interface MenuComponent {
  title: string;
  href: string;
  description: string;
  icon: JSX.Element;
}

interface MenuSection {
  title: string;
  components: MenuComponent[];
  authRequired: boolean;
  showWhenAuth: boolean;
}

interface NavigationMenuProps {
  isAuthenticated: boolean;
  user: User | null;
  closeMenu: () => void;
  isMobile?: boolean;
}

interface ListItemProps
  extends React.ComponentPropsWithoutRef<"a"> {
  title: string;
  href: string;
  children: React.ReactNode;
}

const  NavigationMenuCombined= ({ isAuthenticated, user, closeMenu, isMobile=false }: NavigationMenuProps) => {

  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const menuSections = [
    {
      title: "About Us",
      components: aboutComponents,
      authRequired: false,
      showWhenAuth: false
    },
    {
      title: "Students & Alumni",
      components: isAuthenticated ? connectAuthComponents : connectNonAuthComponents,
      authRequired: false,
      showWhenAuth: true
    },
    {
      title: "Mentorship",
      components: isAuthenticated ? mentorshipAuthComponents : mentorshipNonAuthComponents,
      authRequired: false,
      showWhenAuth: true
    },
    {
      title: "Projects",
      components: isAuthenticated ? projectsAuthComponents : projectsNonAuthComponents,
      authRequired: false,
      showWhenAuth: true
    },
    {
      title: "Jobs & Careers",
      components: isAuthenticated ? jobsAuthComponents : jobsNonAuthComponents,
      authRequired: false,
      showWhenAuth: true
    },
    {
      title: "Events",
      components: isAuthenticated ? eventsAuthComponents : eventsNonAuthComponents,
      authRequired: false,
      showWhenAuth: true
    },
    {
      title: "Groups/Forums",
      components: isAuthenticated ? groupsAuthComponents : groupsNonAuthComponents,
      authRequired: false,
      showWhenAuth: true
    },
    {
      title: "Testimonials",
      components: isAuthenticated ? testimonialsAuthComponents : testimonialsNonAuthComponents,
      authRequired: false,
      showWhenAuth: true
    }
  ];

  useEffect(() => {
    if (!user?.uid) return;

    getUnreadMessageCount(setUnreadCount);

    const pusher = getPusherInstance();
    const notificationChannel = pusher?.subscribe(`user-notifications-${user.uid}`);

    notificationChannel?.bind("new-unread-message", () => {
      setUnreadCount((prev) => prev + 1);
    });

    notificationChannel?.bind("update-unread-count", () => {
      getUnreadMessageCount(setUnreadCount);
    });

    notificationChannel?.bind("message-read", () => {
      getUnreadMessageCount(setUnreadCount);
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

  const renderMenuSection = (section: MenuSection) => {
    if ((section.authRequired && !isAuthenticated) || 
        (!section.showWhenAuth && isAuthenticated)) {
      return null;
    }

    return (
      <NavigationMenuItem key={section.title}>
        <NavigationMenuTrigger>{section.title}</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className={`grid gap-3 p-4 ${
            isMobile ? "w-full" : "w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]"
          }`}>
            {section.components.map((component) => (
              <ListItem
                key={component.title}
                title={component.title}
                href={component.href}
                onClick={() => {
                  closeMenu();
                  router.push(component.href);
                }}
              >
                {component.description}

              </ListItem>
            ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  };

  const NotificationBadge = ({ token}: { token: string }) => {
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

  const MessageBadgeTooltip = () => {
    return (
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
    )
  }
  
  return (
    <div className={`flex ${isMobile ? "flex-col" : "flex-wrap"} items-center gap-2 w-full`}>
      <NavigationMenu className={isMobile ? "w-full" : ""}>
        <NavigationMenuList className={isMobile ? "flex-col w-full" : "flex-wrap"}>
          {isAuthenticated && (
            <>
              <NavigationMenuItem>
              <Link href="/dashboard" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <Button
                    size="md"
                    variant="light"
                    className="font-bold text-white"
                  >
                    Dashboard
                  </Button>
                </NavigationMenuLink>
              </Link>
              </NavigationMenuItem>
                <NavigationMenuItem>
                <Link href="/messages" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <MessageBadgeTooltip />
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </>
            )}

          {menuSections.map(renderMenuSection)}
          
          {isAuthenticated && (
            <NavigationMenuItem>
            <Link href="/notifications" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <NotificationBadge 
                token={localStorage.getItem("token") || ""}
              />
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>

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

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  ListItemProps
>(({ className, title, children, href, onClick, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
      <Link
          href={href}
          onClick={onClick}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          {/* <a ref={ref}>
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </a> */}
        </Link>
      </NavigationMenuLink>
    </li>
  );
});

ListItem.displayName = "ListItem";

export default NavigationMenuCombined;