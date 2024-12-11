"use client";

import React from "react";


interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export default function NavLink({ href, children }: NavLinkProps) {
  return (
    <li>
        <a href={href} className="text-gray-800 hover:text-gray-600">{children}</a>
    </li>
    );
}