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
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu } from "lucide-react";
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

interface ListItemProps extends React.ComponentPropsWithoutRef<"a"> {
    title: string;
    description: string;
    href: string;
    icon?: JSX.Element;
  }

const NewNavbar = () => {
  const { user, isAuthenticated } = useUserStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

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
          <Button variant="ghost" size="icon" className="flex-shrink-0">
            <FaSearch className="h-4 w-4" />
          </Button>

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