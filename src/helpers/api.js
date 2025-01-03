import axios from "axios";
import { getDomain } from "./getDomain";
import { API_CONFIG } from "@/config/api.config";

// Create API instances
export const api = axios.create({
  baseURL: `${getDomain()}${API_CONFIG.VERSION}`,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  withCredentials: true
});

export const fileApi = axios.create({
  baseURL: `${getDomain()}${API_CONFIG.VERSION}`,
  headers: { 
    "Content-Type": "multipart/form-data" 
  },
  withCredentials: true
});



export const handleError = (error) => {
  const response = error.response;

  if (response) {
    // Handle 4xx and 5xx status codes
    if (`${response.status}`.match(/^[4|5]\d{2}$/)) {
      let errorMessage = "An error occurred.";

      if (response.data && typeof response.data === "object") {
        // Check if there is a specific error message in the response data
        errorMessage = response.data.error || response.data.message || JSON.stringify(response.data, null, 2);
      } else {
        errorMessage = response.statusText || `Status code: ${response.status}`;
      }

      console.log("The request was made and answered but was unsuccessful.", response);

      return errorMessage;
    }
  } else if (error.message) {
    // Handle network errors and other client-side issues
    if (error.message.match(/Network Error/)) {
      alert("The server cannot be reached.\nDid you start it?");
    } else if (error.message.includes("CORS header")) {
      alert("A CORS error occurred. Ensure the server's CORS policy allows this request.");
    } else {
      console.log("Something else happened.", error);
    }

    return error.message;
  } else {
    // General error handling for unexpected issues
    console.log("An unknown error occurred.", error);

    return "An unknown error occurred.";
  }
};

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Clear token on 401 error
      // setAuthToken(null);
    }
    return Promise.reject(error);
  }
);

fileApi.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Clear token on 401 error
      // setAuthToken(null);
    }
    return Promise.reject(error);
  }
);