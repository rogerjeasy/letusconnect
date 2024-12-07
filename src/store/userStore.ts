import { create } from "zustand";
import { useEffect } from "react";
import { DateValue } from "@nextui-org/react";
import { useRouter } from "next/navigation";

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
interface UserWorkExperience {
  workExperiences: WorkExperience[];
}

// Define the WorkExperience interface
interface WorkExperience {
  company: string;
  position: string;
  city: string;
  country: string;
  startDate: Date;
  endDate: Date;
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

  setUser: (user: User, token: string) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);

    set({
      user,
      isAuthenticated: true,
    });
  },

  setAddress: (address: UserAddress) => {
    set({ address });
  },

  setSchoolExperience: (schoolExperience: UserSchoolExperience) => {
    localStorage.setItem("schoolExperience", JSON.stringify(schoolExperience));
    set({ schoolExperience });
  },
  

  setWorkExperience: (workExperience: UserWorkExperience) => {
    set({ workExperience });
  },

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    set({
      user: null,
      address: null,
      schoolExperience: null,
      workExperience: null,
      isAuthenticated: false,
    });
  },

  restoreUser: () => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    const schoolExperience = localStorage.getItem("schoolExperience");
    const parsedSchoolExperience = schoolExperience ? JSON.parse(schoolExperience) : null;

    if (user && token) {
      set({
        user: JSON.parse(user),
        isAuthenticated: true,
        schoolExperience: parsedSchoolExperience,
      });
    }
  },
}));

// Custom hook for managing authentication
export function useAuth() {
  const { user, isAuthenticated, restoreUser } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    restoreUser();
  }, [restoreUser]);

  return { user, isAuthenticated };
}

export const generateRandomAvatar = (): string => {
  const uniqueId = Math.random().toString(36).substring(7);
  return `https://picsum.photos/seed/${uniqueId}/150/150?nature`;
};