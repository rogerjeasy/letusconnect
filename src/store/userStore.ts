"use client";

import { create } from "zustand";
import { useEffect } from "react";
import { DateValue } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useParticipantsStore } from "@/store/participantsStore"

// Define the User interface to match the server-side model
export interface User {
  uid: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profilePicture: string;
  bio: string;
  role: string[];
  graduationYear: number;
  currentJobTitle: string;
  areasOfExpertise: string[];
  interests: string[];
  // connections: string[];
  // connectionRequests: string[];
  lookingForMentor: boolean;
  willingToMentor: boolean;
  connectionsMade: number;
  accountCreatedAt: string;
  isActive: boolean;
  isVerified: boolean;
  program: string;
  dateOfBirth: DateValue | null;
  phoneCode: string;
  languages: string[];
  skills: string[];
  certifications: string[];
  projects: string[];
}

// Address Interface
export interface UserAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: number;
  houseNumber: number;
  apartment: string;
  region: string;
  id: string;
}

// Define the UserSchoolExperience interface
export interface UserSchoolExperience {
  uid: string;
  universities: University[];
}

// Define the University interface
export interface University {
  id: string;
  name: string;
  program: string;
  country: string;
  degree: string;
  startYear: number;
  endYear: number;
  experience: string;
  awards: string[];
  extracurriculars: string[];
}

// Define the UserWorkExperience interface
export interface UserWorkExperience {
  uid: string;
  workExperiences: WorkExperience[];
}

// Define the WorkExperience interface
export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  city?: string;
  country: string;
  startDate: Date | null;
  endDate: Date | null;
  responsibilities: string[];
  achievements: string[];
}

// Define the store state
interface UserState {
  user: User | null;
  address: UserAddress | null;
  schoolExperience: UserSchoolExperience | null;
  workExperience: UserWorkExperience | null;
  isAuthenticated: boolean;
  loading: boolean;
  setUser: (user: User, token: string) => void;
  setAddress: (address: UserAddress) => void;
  setSchoolExperience: (schoolExperience: UserSchoolExperience) => void;
  setWorkExperience: (workExperience: UserWorkExperience) => void;
  logout: () => void;
  restoreUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  address: null,
  schoolExperience: null,
  workExperience: null,
  isAuthenticated: false,
  loading: true,

  setUser: (user: User, token: string) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);

    set({
      user,
      isAuthenticated: true,
      loading: false,
    });
  },

  setAddress: (address: UserAddress) => {
    localStorage.setItem("address", JSON.stringify(address));
    set({ address });
  },

  setSchoolExperience: (schoolExperience: UserSchoolExperience) => {
    localStorage.setItem("schoolExperience", JSON.stringify(schoolExperience));
    set({ schoolExperience });
  },

  setWorkExperience: (workExperience: UserWorkExperience) => {
    localStorage.setItem("workExperience", JSON.stringify(workExperience));
    set({ workExperience });
  },

  logout: () => {
    localStorage.clear();
    const { clearParticipants } = useParticipantsStore.getState();
    clearParticipants();
    console.log("participants cleared");
    console.log(useParticipantsStore.getState().participants);
    set({
      user: null,
      address: null,
      schoolExperience: null,
      workExperience: null,
      isAuthenticated: false,
      loading: false,
    });
  },

  restoreUser: () => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    const address = localStorage.getItem("address");
    const schoolExperience = localStorage.getItem("schoolExperience");
    const workExperience = localStorage.getItem("workExperience");

    set({
      user: user ? JSON.parse(user) : null,
      address: address ? JSON.parse(address) : null,
      schoolExperience: schoolExperience ? JSON.parse(schoolExperience) : null,
      workExperience: workExperience ? JSON.parse(workExperience) : null,
      isAuthenticated: !!user && !!token,
      loading: false,
    });
  },
}));

// Custom hook for managing authentication
export function useAuth() {
  const { user, isAuthenticated, restoreUser } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    restoreUser();
  }, [restoreUser]);

  useEffect(() => {
    if (!user || !isAuthenticated) {
      router.push("/login");
    }
  }, [user, isAuthenticated, router]);

  return { user, isAuthenticated };
}

// Function to generate a random avatar URL
// export const generateRandomAvatar = (): string => {
//   const uniqueId = Math.random().toString(36).substring(7);
//   return `https://picsum.photos/seed/${uniqueId}/150/150?nature`;
// };
