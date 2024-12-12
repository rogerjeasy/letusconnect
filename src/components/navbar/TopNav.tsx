"use client";

import Link from "next/link";
import { useUserStore, generateRandomAvatar } from "../../store/userStore";
import ProfileDropDown from "./ProfileDropDown";
import NavigationMenu from "./NavigationMenu";

const Navbar = () => {
  const { user, isAuthenticated } = useUserStore();
  const avatarPicture = user?.profilePicture || generateRandomAvatar();

  return (
    <nav className="bg-blue-600 text-white w-full z-50 shadow h-auto md:fixed">
      <div className="w-full px-2 md:px-4 lg:px-6 py-2 md:py-3 lg:py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Logo Section */}
        <div className="text-2xl font-bold flex-shrink-0 mr-6">
          <Link href={isAuthenticated ? "/dashboard" : "/"}>
            Let&apos;s Connect
          </Link>
        </div>

        {/* Navigation Menu */}
        <div className="flex-grow">
          <NavigationMenu isAuthenticated={isAuthenticated} user={user} />
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
