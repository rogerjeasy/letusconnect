"use client";

import Link from "next/link";
import { useUserStore, generateRandomAvatar } from "../../store/userStore";
import ProfileDropDown from "./ProfileDropDown";
import NavigationMenu from "./NavigationMenu";
import { useState } from "react";

const Navbar = () => {
  const { user, isAuthenticated } = useUserStore();
  const avatarPicture = user?.profilePicture || generateRandomAvatar();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-blue-600 text-white w-full z-50 shadow fixed top-0 left-0 right-0">
      <div className="w-full px-2 md:px-4 lg:px-6 py-2 md:py-3 lg:py-4 flex flex-wrap md:flex-nowrap justify-between items-center gap-4">
        
        {/* Logo Section */}
        <div className="text-2xl font-bold flex-shrink-0">
          <Link href={isAuthenticated ? "/dashboard" : "/"}>
            Let&apos;s Connect
          </Link>
        </div>

        {/* Toggle Button for Mobile Menu */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-white focus:outline-none"
          aria-label="Toggle Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
          </svg>
        </button>

        {/* Navigation Menu */}
        <div className={`w-full md:w-auto ${isMenuOpen ? "block" : "hidden"} md:flex flex-col md:flex-row md:items-center`}>
          <NavigationMenu isAuthenticated={isAuthenticated} user={user} closeMenu={() => setIsMenuOpen(false)} />
        </div>

        {/* Profile or Auth Buttons */}
        <div className="flex items-center gap-2 mt-2 md:mt-0">
          {isAuthenticated ? (
            <ProfileDropDown
              type="avatar"
              userDetails={{
                name: user?.username || "User",
                email: user?.email || "user@example.com",
                avatarUrl: avatarPicture,
              }}
            />
          ) : null}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
