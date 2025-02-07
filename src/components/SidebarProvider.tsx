// src/components/SidebarProvider.tsx
"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

import React, { createContext, useContext, useState } from 'react';

interface SidebarContextType {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export const SidebarProviderContext: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      <SidebarProvider>
        <SidebarTrigger />
        {children}
    </SidebarProvider>
    </SidebarContext.Provider>
  );
};