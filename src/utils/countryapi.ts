import { CountryAPIResponse } from "../store/types";

const API_URL = 'https://restcountries.com/v3.1/all';
const CACHE_KEY = 'country-data';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface CacheData {
  timestamp: number;
  data: CountryAPIResponse[];
}

export async function fetchCountryData(): Promise<CountryAPIResponse[]> {
  // Check cache first
  const cachedData = localStorage.getItem(CACHE_KEY);
  if (cachedData) {
    const parsed: CacheData = JSON.parse(cachedData);
    if (Date.now() - parsed.timestamp < CACHE_DURATION) {
      return parsed.data;
    }
  }

  const response = await fetch(API_URL, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  
  // Cache the new data
  localStorage.setItem(CACHE_KEY, JSON.stringify({
    timestamp: Date.now(),
    data,
  }));

  return data;
}