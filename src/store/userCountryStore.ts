import { create } from "zustand";

// Define the Country interface
interface Country {
  name: string;
  flag: string;
}

// Define the store state
interface CountryState {
  countries: Country[]; 
  selectedCountry: Country | null; 
  setCountries: (countries: Country[]) => void; 
  setSelectedCountry: (country: Country) => void; 
  clearSelectedCountry: () => void; 
  restoreSelectedCountry: () => void;
}

export const useCountryStore = create<CountryState>((set) => ({
  countries: [],
  selectedCountry: null,

  setCountries: (countries: Country[]) => {
    set({ countries });
  },

  setSelectedCountry: (country: Country) => {
    localStorage.setItem("selectedCountry", JSON.stringify(country));
    set({ selectedCountry: country });
  },

  clearSelectedCountry: () => {
    localStorage.removeItem("selectedCountry");
    set({ selectedCountry: null });
  },

  restoreSelectedCountry: () => {
    const storedCountry = localStorage.getItem("selectedCountry");
    if (storedCountry) {
      set({ selectedCountry: JSON.parse(storedCountry) });
    }
  },
}));