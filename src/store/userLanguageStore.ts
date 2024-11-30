import { create } from "zustand";

// Define the Language interface
interface Language {
  code: string;
  name: string;
}

// Define the PhoneCode interface
interface PhoneCode {
  country: string;
  code: string;
}

// Define the store state
interface UserLanguageState {
  languages: Language[];
  phoneCodes: PhoneCode[];
  selectedLanguage: Language | null;
  selectedPhoneCode: PhoneCode | null;
  setLanguages: (languages: Language[]) => void;
  setPhoneCodes: (phoneCodes: PhoneCode[]) => void;
  setSelectedLanguage: (language: Language) => void;
  setSelectedPhoneCode: (phoneCode: PhoneCode) => void;
  clearSelections: () => void;
  restoreSelections: () => void;
  languageOptions: { value: string; label: string }[]; // Add this property
}

export const useUserLanguageStore = create<UserLanguageState>((set, get) => ({
  languages: [],
  phoneCodes: [],
  selectedLanguage: null,
  selectedPhoneCode: null,

  setLanguages: (languages: Language[]) => {
    set({ languages });
  },

  setPhoneCodes: (phoneCodes: PhoneCode[]) => {
    set({ phoneCodes });
  },

  setSelectedLanguage: (language: Language) => {
    localStorage.setItem("selectedLanguage", JSON.stringify(language));
    set({ selectedLanguage: language });
  },

  setSelectedPhoneCode: (phoneCode: PhoneCode) => {
    localStorage.setItem("selectedPhoneCode", JSON.stringify(phoneCode));
    set({ selectedPhoneCode: phoneCode });
  },

  clearSelections: () => {
    localStorage.removeItem("selectedLanguage");
    localStorage.removeItem("selectedPhoneCode");
    set({ selectedLanguage: null, selectedPhoneCode: null });
  },

  restoreSelections: () => {
    const storedLanguage = localStorage.getItem("selectedLanguage");
    const storedPhoneCode = localStorage.getItem("selectedPhoneCode");
    set({
      selectedLanguage: storedLanguage ? JSON.parse(storedLanguage) : null,
      selectedPhoneCode: storedPhoneCode ? JSON.parse(storedPhoneCode) : null,
    });
  },

  // Computed property to transform languages into sorted checkbox options
  get languageOptions() {
    return get()
      .languages
      .filter((lang) => lang.code !== undefined)
      .map((lang) => ({
        value: lang.code,
        label: lang.name,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  },
}));