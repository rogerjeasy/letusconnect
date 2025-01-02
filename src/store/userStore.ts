"use client";

import { create } from "zustand";
import { useEffect } from "react";
import { DateValue } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { api, handleError } from "@/helpers/api";
import { ExpertiseSkill } from "./areaOfExpertise";
import { Skill } from "./skills";
import { API_CONFIG } from "@/config/api.config";

// User interfaces remain the same
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
  areasOfExpertise: ExpertiseSkill[];
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
  skills: Skill[];
  certifications: string[];
  projects: string[];
}

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

export interface UserSchoolExperience {
  uid: string;
  universities: University[];
}

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

export interface UserWorkExperience {
  uid: string;
  workExperiences: WorkExperience[];
}

interface UserState {
  user: User | null;
  address: UserAddress | null;
  schoolExperience: UserSchoolExperience | null;
  workExperience: UserWorkExperience | null;
  isAuthenticated: boolean;
  hasChecked: boolean;
  loading: boolean;
  token: string | null;
  setUser: (user: User, token: string) => void;
  setAddress: (address: UserAddress) => void;
  setSchoolExperience: (schoolExperience: UserSchoolExperience) => void;
  setWorkExperience: (workExperience: UserWorkExperience) => void;
  logout: () => void;
  checkSession: () => Promise<void>;
}

export const useUserStore = create<UserState>()((set, get) => ({
  user: null,
  address: null,
  schoolExperience: null,
  workExperience: null,
  isAuthenticated: false,
  loading: false,
  token: null,
  hasChecked: false,


  checkSession: async () => {
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!storedToken) {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        hasChecked: true
      });
      return;
    }
    try {
      set({ loading: true });
      const response = await api.get(API_CONFIG.ENDPOINTS.AUTH.SESSION, {
        withCredentials: true,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${storedToken || get().token}`
            }
      });
      if (response.status === 200 && response.data.user) {
        set({
          user: response.data.user,
          token: response.data.token,
          isAuthenticated: true,
          loading: false,
          hasChecked: true
        });
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', response.data.token);
        }
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      } else {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
          hasChecked: true
        });
      }
    } catch (error) {
      // toast.error("Failed to check session. Please log in again.");
      localStorage.removeItem('token');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        hasChecked: true
      });
    }
  },

  setUser: (user: User, token: string) => {
    if (token) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
      }
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    set({
      user,
      token,
      isAuthenticated: true,
      loading: false,
      hasChecked: true
    });
  },

  setAddress: (address: UserAddress) => {
    set({ address });
  },

  setSchoolExperience: (schoolExperience: UserSchoolExperience) => {
    set({ schoolExperience });
  },

  setWorkExperience: (workExperience: UserWorkExperience) => {
    set({ workExperience });
  },

  logout: async () => {
    try {
      set({ loading: false, hasChecked: true });
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      await api.patch(API_CONFIG.ENDPOINTS.AUTH.LOGOUT, {}, {
        headers: {
          'Authorization': `Bearer ${storedToken || get().token}`
        }
      });
      
      // Clear authorization header
      delete api.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      
      // Reset store state
      set({
        user: null,
        address: null,
        schoolExperience: null,
        workExperience: null,
        isAuthenticated: false,
        loading: false,
        token: null,
        hasChecked: false
      });
    } catch (error) {
      console.error('Logout failed:', error);
      localStorage.removeItem('token');
      set({
        user: null,
        address: null,
        schoolExperience: null,
        workExperience: null,
        isAuthenticated: false,
        loading: false,
        token: null,
        hasChecked: false
      });
    }
  },
}));

// Custom hook for protected routes
export function useAuth() {
  const { user, isAuthenticated, loading } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isAuthenticated)) {
      router.push("/login");
    }
  }, [user, isAuthenticated, loading, router]);

  return { user, isAuthenticated, loading };
}

export function useInitializeAuth() {
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      try {
        const user = JSON.parse(storedUser) as User;
        useUserStore.getState().setUser(user, storedToken);
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);
}