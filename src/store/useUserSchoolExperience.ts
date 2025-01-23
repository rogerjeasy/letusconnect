"use client";
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { University, UserSchoolExperience } from "@/store/userStore";
import {
  createSchoolExperience,
  getSchoolExperience,
  addUniversity,
  addBulkUniversities,
  updateUniversity,
  deleteUniversity
} from '@/services/schoool.experience.service';

interface UseSchoolExperienceProps {
  setTabLoading?: (loading: boolean) => void;
}

interface UseSchoolExperienceReturn {
  schoolExperience: UserSchoolExperience | null;
  setSchoolExperience: React.Dispatch<React.SetStateAction<UserSchoolExperience | null>>;
  handleEducationUpdate: (data: UserSchoolExperience) => Promise<void>;
  handleUniversityUpdate: (id: string, updates: Partial<University>) => Promise<void>;
  handleUniversityDelete: (id: string) => Promise<void>;
  fetchSchoolExperience: () => Promise<void>;
  isLoading: boolean;
}

export const useSchoolExperience = ({
  setTabLoading
}: UseSchoolExperienceProps = {}): UseSchoolExperienceReturn => {
  const [schoolExperience, setSchoolExperience] = useState<UserSchoolExperience | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
    setTabLoading?.(loading);
  };

  const fetchSchoolExperience = useCallback(async () => {
    try {
      const experience = await getSchoolExperience();
      setSchoolExperience(experience);
    } catch (error) {
      console.error('Error fetching school experience:', error);
      toast.error("Failed to load education history");
    }
  }, []); 

  const handleEducationUpdate = async (data: UserSchoolExperience) => {
    try {
      setLoading(true);
      let currentExperience = schoolExperience;
  
      if (!currentExperience) {
        currentExperience = await createSchoolExperience();
        setSchoolExperience(currentExperience);
      }
  
      if (data.universities.length === 0) {
        setSchoolExperience(currentExperience);
      } else if (data.universities.length > 1) {
        const universitiesToAdd = data.universities.map(uni => {
          const { id, ...uniWithoutId } = uni;
          return uniWithoutId;
        });
        
        const updatedExperience = await addBulkUniversities(universitiesToAdd);
        setSchoolExperience(updatedExperience);
      } else {
        const { id, ...universityData } = data.universities[0];
        const updatedExperience = await addUniversity(universityData);
        setSchoolExperience(updatedExperience);
      }
  
      toast.success("Education history updated successfully");
    } catch (error) {
      console.error('Error updating education history:', error);
      toast.error("Failed to update education history");
    } finally {
      setLoading(false);
    }
  };

  const handleUniversityUpdate = async (id: string, updates: Partial<University>) => {
    try {
      setLoading(true);
      const updatedExperience = await updateUniversity(id, updates);
      setSchoolExperience(updatedExperience);
      toast.success("University updated successfully");
    } catch (error) {
      console.error('Error updating university:', error);
      toast.error("Failed to update university");
    } finally {
      setLoading(false);
    }
  };

  const handleUniversityDelete = async (id: string) => {
    try {
      setLoading(true);
      const updatedExperience = await deleteUniversity(id);
      setSchoolExperience(updatedExperience);
    } catch (error) {
      console.error('Error deleting university:', error);
      toast.error("Failed to delete university");
    } finally {
      setLoading(false);
    }
  };

  return {
    schoolExperience,
    setSchoolExperience,
    handleEducationUpdate,
    handleUniversityUpdate,
    handleUniversityDelete,
    isLoading,
    fetchSchoolExperience
  };
};