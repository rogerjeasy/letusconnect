"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useUserStore } from "../../store/userStore";

// Import all menu options
import { aboutComponents } from "@/components/utils/aboutusmenu";
import { projectsNonAuthComponents, projectsAuthComponents } from "@/components/utils/projectsOptions";
import { mentorshipNonAuthComponents, mentorshipAuthComponents } from "@/components/utils/mentorshipOptions";
import { connectAuthComponents, connectNonAuthComponents } from "@/components/utils/connectStudentOptions";
import { eventsNonAuthComponents, eventsAuthComponents } from "@/components/utils/eventOptions";
import { jobsNonAuthComponents, jobsAuthComponents } from "@/components/utils/jobOptions";
import { groupsAuthComponents, groupsNonAuthComponents } from "@/components/utils/forumOptions";
import { testimonialsNonAuthComponents, testimonialsAuthComponents } from "@/components/utils/testimonialOptions";
import { adminComponents } from "@/components/utils/adminOptions";
import { useUnreadMessages } from "@/store/useUnreadMessageCounts";

interface ListItemProps extends React.ComponentPropsWithoutRef<"a"> {
  title: string;
  description: string;
  href: string;
  icon?: JSX.Element;
}

interface MenuSectionProps {
  title: string;
  items: ListItemProps[];
  onItemClick: () => void;
}

const MenuSection: React.FC<MenuSectionProps> = ({ title, items, onItemClick }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full"
    >
      <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-2 hover:bg-accent rounded-lg group">
        <span className="text-sm font-medium">{title}</span>
        <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${
          isOpen ? "transform rotate-90" : ""
        }`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4">
        <div className="flex flex-col space-y-1 mt-1">
          {items.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="flex items-center gap-2 px-4 py-2 text-sm rounded-md hover:bg-accent"
              onClick={() => {
                onItemClick();
                setIsOpen(false);
              }}
            >
              {item.icon}
              <span>{item.title}</span>
            </Link>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

interface MobileMenuProps {
  className?: string;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ className }) => {
  const { user, isAuthenticated } = useUserStore();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  const { totalCount: unreadMessagesCount, loading: messagesLoading, error: messagesError } = useUnreadMessages({
    userId: user?.uid ?? '',
    maxRetries: 3
  });

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className={`lg:hidden ${className}`} size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="mt-6 flex flex-col space-y-4">

          {isAuthenticated && user?.role?.includes("admin") && (
            <MenuSection
              title="Admin"
              items={adminComponents}
              onItemClick={handleClose}
            />
          )}

            {isAuthenticated && (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-4 px-4 py-2 text-sm font-medium rounded-md hover:bg-accent"
                onClick={handleClose}
              >
                Dashboard
              </Link>

              <Link
                href="/chat"
                className="flex items-center gap-4 px-4 py-2 text-sm font-medium rounded-md hover:bg-accent relative"
                onClick={handleClose}
              >
                Messages
                {unreadMessagesCount > 0 && (
                  <span className="absolute -top-2 right-2 flex items-center justify-center h-5 w-5 text-xs text-white bg-red-500 rounded-full">
                    {unreadMessagesCount > 99 ? '99+' : unreadMessagesCount}
                  </span>
                )}
              </Link>
            </>
          )}

          <MenuSection
            title="Connect"
            items={isAuthenticated ? connectAuthComponents : connectNonAuthComponents}
            onItemClick={handleClose}
          />

          <MenuSection
            title="Projects"
            items={isAuthenticated ? projectsAuthComponents : projectsNonAuthComponents}
            onItemClick={handleClose}
          />

          <MenuSection
            title="Mentorship"
            items={isAuthenticated ? mentorshipAuthComponents : mentorshipNonAuthComponents}
            onItemClick={handleClose}
          />

          <MenuSection
            title="Events"
            items={isAuthenticated ? eventsAuthComponents : eventsNonAuthComponents}
            onItemClick={handleClose}
          />

          <MenuSection
            title="Groups"
            items={isAuthenticated ? groupsAuthComponents : groupsNonAuthComponents}
            onItemClick={handleClose}
          />

          <MenuSection
            title="Jobs"
            items={isAuthenticated ? jobsAuthComponents : jobsNonAuthComponents}
            onItemClick={handleClose}
          />

          <MenuSection
            title="Testimonials"
            items={isAuthenticated ? testimonialsAuthComponents : testimonialsNonAuthComponents}
            onItemClick={handleClose}
          />

          <MenuSection
            title="About"
            items={aboutComponents}
            onItemClick={handleClose}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};