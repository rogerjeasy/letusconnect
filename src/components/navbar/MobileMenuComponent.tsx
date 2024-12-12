"use client";

import Link from "next/link";
import { Button } from "@nextui-org/react";
import NavigationMenu from "./NavigationMenu";

type MobileMenuProps = {
  isMobileMenuOpen: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  onLogout: () => void;
  onCloseMenu: () => void;
};

const MobileMenu = ({
  isMobileMenuOpen,
  isAuthenticated,
  isAdmin,
  onLogout,
  onCloseMenu,
}: MobileMenuProps) => {
  if (!isMobileMenuOpen) return null;

  return (
    <div className="md:hidden bg-blue-500">
      <div className="flex flex-col space-y-4 p-4">
        {isAuthenticated ? (
          <>
            {/* <Link href="/dashboard" className="hover:text-gray-200" onClick={onCloseMenu}>
              Dashboard
            </Link>

            {isAdmin && (
              <Link href="/admin" className="hover:text-gray-200" onClick={onCloseMenu}>
                Admin Dashboard
              </Link>
            )} */}

            {/* Render the NavigationMenu vertically for authenticated users */}
            <NavigationMenu isAuthenticated={isAuthenticated} user={{ role: isAdmin ? ["admin"] : [] }} />

            <button
              onClick={() => {
                onLogout();
                onCloseMenu();
              }}
              className="hover:text-gray-200 focus:outline-none text-left"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            {/* Render the NavigationMenu vertically for non-authenticated users */}
            <NavigationMenu isAuthenticated={isAuthenticated} />

            <Link href="/login" onClick={onCloseMenu}>
              <Button
                color="primary"
                size="sm"
                className="bg-green-500 hover:bg-green-600 text-white w-full"
              >
                Login
              </Button>
            </Link>
            <Link href="/register" onClick={onCloseMenu}>
              <Button
                color="secondary"
                size="sm"
                className="bg-yellow-500 hover:bg-yellow-600 text-white w-full"
              >
                Register
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;