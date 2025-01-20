"use client";

import * as React from "react";
import Link from "next/link";
import { useUserStore } from "../../store/userStore";
import { FaSearch } from "react-icons/fa";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { aboutComponents } from "@/components/utils/aboutusmenu";
import { projectsNonAuthComponents, projectsAuthComponents } from "@/components/utils/projectsOptions";
import { mentorshipNonAuthComponents, mentorshipAuthComponents } from "@/components/utils/mentorshipOptions";
import { connectAuthComponents, connectNonAuthComponents } from "@/components/utils/connectStudentOptions";
import { eventsNonAuthComponents, eventsAuthComponents } from "@/components/utils/eventOptions";
import { jobsNonAuthComponents, jobsAuthComponents } from "@/components/utils/jobOptions";
import { groupsAuthComponents, groupsNonAuthComponents } from "@/components/utils/forumOptions";
import { testimonialsNonAuthComponents, testimonialsAuthComponents } from "@/components/utils/testimonialOptions";
import { adminComponents } from "@/components/utils/adminOptions";
import { UserProfileDropdown } from "./UserProfileDropdown";
import { MobileMenu } from "./MobileMenuComponent";
import DevelopmentModal from "../utils/DevelopmentModal";
import { useUnreadMessages } from '@/store/useUnreadMessageCounts';

interface ListItemProps extends React.ComponentPropsWithoutRef<"a"> {
    title: string;
    description: string;
    href: string;
    icon?: JSX.Element;
  }

const NewNavbar = () => {
  const { user, isAuthenticated } = useUserStore();
  const searchUnderDevelopment = true;

  const { totalCount: unreadMessagesCount, loading: messagesLoading, error: messagesError } = useUnreadMessages({
    userId: user?.uid ?? '',
    maxRetries: 3
  });


  const ListItem = React.forwardRef<React.ElementRef<"a">, ListItemProps>(
    ({ className, title, description, href, icon, ...props }, ref) => {
      return (
        <li>
          <NavigationMenuLink asChild>
            <a
              ref={ref}
              href={href}
              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
              {...props}
            >
              <div className="flex items-center gap-2">
                {icon}
                <span className="text-sm font-medium leading-none">{title}</span>
              </div>
              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                {description}
              </p>
            </a>
          </NavigationMenuLink>
        </li>
      );
    }
  );
  ListItem.displayName = "ListItem";

  const MessagesMenuItem = () => (
    <NavigationMenuItem>
      <Link href="/chat" legacyBehavior passHref>
        <NavigationMenuLink
          className="relative text-black font-bold hover:text-black focus:text-black"
        >
          Messages
          {unreadMessagesCount > 0 && (
            <span className="absolute -top-2 -right-4 flex items-center justify-center h-5 w-5 text-xs text-white bg-red-500 rounded-full">
              {unreadMessagesCount > 99 ? '99+' : unreadMessagesCount}
            </span>
          )}
        </NavigationMenuLink>
      </Link>
    </NavigationMenuItem>
  );

  const NavContent = () => (
    <NavigationMenu className="hidden lg:flex max-w-max">
      <NavigationMenuList className="gap-2">
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-black">About</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 lg:w-[500px] lg:grid-cols-2">
              {aboutComponents.map((item) => (
                <ListItem
                  key={item.title}
                  href={item.href}
                  title={item.title}
                  description={item.description}
                  icon={item.icon}
                />
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Add Admin Navigation Menu */}
        {isAuthenticated && user?.role?.includes("admin") && (
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-black">Admin</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 lg:w-[500px] lg:grid-cols-2">
                {adminComponents.map((item) => (
                  <ListItem
                    key={item.title}
                    href={item.href}
                    title={item.title}
                    description={item.description}
                    icon={item.icon}
                  />
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        )}

        {/* Add Projects Navigation Menu */}

        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-black">Connect</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 lg:w-[500px] lg:grid-cols-2">
              {(isAuthenticated ? connectAuthComponents : connectNonAuthComponents).map((item) => (
                <ListItem
                  key={item.title}
                  href={item.href}
                  title={item.title}
                  description={item.description}
                  icon={item.icon}
                />
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Add Projects Navigation Menu */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-black">Projects</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 lg:w-[500px] lg:grid-cols-2">
              {(isAuthenticated ? projectsAuthComponents : projectsNonAuthComponents).map((item) => (
                <ListItem
                  key={item.title}
                  href={item.href}
                  title={item.title}
                  description={item.description}
                  icon={item.icon}
                />
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Add Mentorship Navigation Menu */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-black">Mentorship</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 lg:w-[500px] lg:grid-cols-2">
              {(isAuthenticated ? mentorshipAuthComponents : mentorshipNonAuthComponents).map((item) => (
                <ListItem
                  key={item.title}
                  href={item.href}
                  title={item.title}
                  description={item.description}
                    icon={item.icon}
                />
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Add Event Navigation Menu */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-black">Events</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 lg:w-[500px] lg:grid-cols-2">
              {(isAuthenticated ? eventsAuthComponents : eventsNonAuthComponents).map((item) => (
                <ListItem
                  key={item.title}
                  href={item.href}
                  title={item.title}
                  description={item.description}
                  icon={item.icon}
                />
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Add Groups Navigation Menu */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-black">Groups</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 lg:w-[500px] lg:grid-cols-2">
              {(isAuthenticated ? groupsAuthComponents : groupsNonAuthComponents).map((item) => (
                <ListItem
                  key={item.title}
                  href={item.href}
                  title={item.title}
                  description={item.description}
                  icon={item.icon}
                />
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Add Message for a authentificated user */}
        {isAuthenticated && <MessagesMenuItem />}

        {/* Add Jobs Navigation Menu */}
        {/* <NavigationMenuItem>
          <NavigationMenuTrigger className="text-black">Jobs</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 lg:w-[500px] lg:grid-cols-2">
              {(isAuthenticated ? jobsAuthComponents : jobsNonAuthComponents).map((item) => (
                <ListItem
                  key={item.title}
                  href={item.href}
                  title={item.title}
                  description={item.description}
                  icon={item.icon}
                />
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem> */}
            
        {/* Add Testimonials Navigation Menu */}
        {/* <NavigationMenuItem>
          <NavigationMenuTrigger className="text-black">Testimonials</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 lg:w-[500px] lg:grid-cols-2">
              {(isAuthenticated ? testimonialsAuthComponents : testimonialsNonAuthComponents).map((item) => (
                <ListItem
                  key={item.title}
                  href={item.href}
                  title={item.title}
                  description={item.description}
                  icon={item.icon}
                />
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem> */}

      </NavigationMenuList>
    </NavigationMenu>
  );

  const renderSearchButton = () => {
    if (searchUnderDevelopment) {
      return (
        <DevelopmentModal
          buttonText={<FaSearch className="h-4 w-4" />}
          buttonVariant="ghost"
          buttonClassName="flex-shrink-0 h-9 w-9 p-0"
          title={
            <div className="flex items-center gap-2">
              Search
              <FaSearch className="h-5 w-5" />
              Feature Coming Soon
            </div>
          }
          description="We're working on an advanced search feature to help you find connections, projects, and resources more easily. Stay tuned for updates!"
          icon="construction"
        />
      );
    } else {
        return (
            <Button variant="ghost" className="flex-shrink-0 h-9 w-9 p-0"
                onClick={() => alert("Search feature is under development")}
            >
                <FaSearch className="h-4 w-4" />
            </Button>
        );
        }
    };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center space-x-4 flex-shrink-0">
            <MobileMenu />
          <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center space-x-2 flex-shrink-0">
            <Image
              src="/favicon.ico"
              alt="Let's Connect Logo"
              width={32}
              height={32}
              className="flex-shrink-0"
            />
            <span className="hidden font-bold sm:inline-block whitespace-nowrap">
                Let&apos;s Connect
            </span>
          </Link>
        </div>

        <div className="flex-1 flex justify-center">
          <NavContent />
        </div>

        <div className="flex items-center space-x-4 flex-shrink-0">
           {renderSearchButton()}

          {isAuthenticated ? (
            <div className="flex-shrink-0">
              <UserProfileDropdown />
            </div>
          ) : (
            <div className="flex items-center space-x-2 flex-shrink-0">
              <Button variant="ghost" asChild className="whitespace-nowrap">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild className="whitespace-nowrap bg-black hover:bg-black/90">
                <Link href="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default NewNavbar;