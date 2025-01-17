"use client";

import { api, handleError } from "@/helpers/api";
import { API_CONFIG } from "@/config/api.config";
import type { LoginResponse } from "@/config/api.config";
import { User } from "@/store/userStore";
import { RegisterData } from "@/models/RegisterData";
import { 
  GoogleAuthProvider, 
  GithubAuthProvider,
  signInWithPopup,
  fetchSignInMethodsForEmail,
  AuthError,
  UserCredential
} from 'firebase/auth';
import { toast } from 'react-toastify';
import { auth } from '@/config/firebase';


interface LoginData {
  emailOrUsername: string;
  password: string;
}

interface BaseOAuthData {
  email: string;
  firstName: string;
  lastName: string;
  photoURL: string;
  uid: string;
  program: string;
  accessToken?: string;
}

interface GoogleOAuthData extends BaseOAuthData {
  provider: 'google';
  locale?: string;
  displayName: string;
}

interface GitHubOAuthData extends BaseOAuthData {
  provider: 'github';
  login?: string;
  html_url?: string;
}

interface AuthResponse {
  user: any;
  token: string | undefined;
  isNewUser: boolean;
}

// Handle Google Authentication
export const handleGoogleAuth = async (mode: 'login' | 'register', program="Other"): Promise<AuthResponse> => {
  try {
    const provider = new GoogleAuthProvider();
    
    if (mode === 'register') {
      provider.setCustomParameters({
        prompt: 'select_account'
      });
    }

    const result: UserCredential = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;

    const resultWithMetadata = result as UserCredential & {
      _tokenResponse?: {
        isNewUser?: boolean;
        firstName?: string;
        lastName?: string;
        locale?: string;
      };
    };

    const isNewUser = resultWithMetadata._tokenResponse?.isNewUser ?? false;

    if (mode === 'login' && isNewUser) {
      throw new Error('No account exists with this Google account. Please sign up first.');
    }

    if (mode === 'register' && !isNewUser) {
      throw new Error('An account already exists with this Google account. Please sign in instead.');
    }

    // If this is a registration and we have the necessary data
    if (mode === 'register' && isNewUser) {
      if (!program) {
        throw new Error('Program selection is required for registration');
      }

      if (!result.user.displayName) {
        throw new Error('Display name is required for registration');
      }

      const nameParts = result.user.displayName.split(' ');
      
      const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
      const firstName = nameParts.length > 1 
        ? nameParts.slice(0, nameParts.length - 1).join(' ') 
        : nameParts[0];


      const registerData: GoogleOAuthData = {
        email: result.user.email!,
        displayName: result.user.displayName,
        firstName: firstName,
        lastName: lastName,
        photoURL: result.user.photoURL || '',
        uid: result.user.uid,
        provider: 'google',
        accessToken: token,
        program,
        locale: resultWithMetadata._tokenResponse?.locale
      };

      // Register with our backend
      await api.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, registerData);
    }
    toast.success(`Successfully ${mode === 'login' ? 'signed in' : 'signed up'} with Google!`);
    return { user: result.user, token, isNewUser };
  } catch (error) {
    console.error('Google auth error:', error);
    
    const authError = error as AuthError;
    
    if (authError.code === 'auth/popup-blocked') {
      toast.error('Please allow popups for this website');
    } else if (authError.code === 'auth/cancelled-popup-request') {
      throw new Error('Authentication cancelled');
    } else if (authError.code === 'auth/account-exists-with-different-credential') {
      toast.error('An account already exists with the same email but different sign-in method');
    } else if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error(`Failed to ${mode === 'login' ? 'sign in' : 'sign up'} with Google`);
    }
    
    throw error;
  }
};

// Handle GitHub Authentication
export const handleGithubAuth = async (mode: 'login' | 'register', program="Other"): Promise<AuthResponse> => {
  try {
    const provider = new GithubAuthProvider();
    provider.addScope('user:email');

    const result: UserCredential = await signInWithPopup(auth, provider);
    const credential = GithubAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;

    const resultWithMetadata = result as UserCredential & {
      _tokenResponse?: {
        isNewUser?: boolean;
        screenName?: string;
        firstName?: string;
        lastName?: string;
      };
    };

    const isNewUser = resultWithMetadata._tokenResponse?.isNewUser ?? false;

    if (mode === 'login' && isNewUser) {
      throw new Error('No account exists with this GitHub account. Please sign up first.');
    }

    if (mode === 'register' && !isNewUser) {
      throw new Error('An account already exists with this GitHub account. Please sign in instead.');
    }

    // If this is a registration and we have the necessary data
    if (mode === 'register' && isNewUser) {
      if (!program) {
        throw new Error('Program selection is required for registration');
      }

      const names = (result.user.displayName || '').split(' ');
      const registerData: GitHubOAuthData = {
        email: result.user.email!,
        firstName: resultWithMetadata._tokenResponse?.firstName || names[0] || '',
        lastName: resultWithMetadata._tokenResponse?.lastName || names.slice(1).join(' ') || '',
        photoURL: result.user.photoURL || '',
        uid: result.user.uid,
        provider: 'github',
        accessToken: token,
        program,
        login: resultWithMetadata._tokenResponse?.screenName,
        html_url: `https://github.com/${resultWithMetadata._tokenResponse?.screenName}`
      };

      // Register with our backend
      await api.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, registerData);
    }

    toast.success(`Successfully ${mode === 'login' ? 'signed in' : 'signed up'} with GitHub!`);
    return { user: result.user, token, isNewUser };
  } catch (error) {
    console.error('GitHub auth error:', error);
    
    const authError = error as AuthError;
    
    if (authError.code === 'auth/popup-blocked') {
      toast.error('Please allow popups for this website');
    } else if (authError.code === 'auth/cancelled-popup-request') {
      throw new Error('Authentication cancelled');
    } else if (authError.code === 'auth/account-exists-with-different-credential') {
      toast.error('An account already exists with the same email but different sign-in method');
    } else if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error(`Failed to ${mode === 'login' ? 'sign in' : 'sign up'} with GitHub`);
    }
    
    throw error;
  }
};

// Helper function to check if email exists
export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const methods = await fetchSignInMethodsForEmail(auth, email);
    return methods.length > 0;
  } catch (error) {
    console.error('Error checking email:', error);
    return false;
  }
};


export const login = async (data: LoginData): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>(
      API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      data
    );

    if (!response.data.token || !response.data.user) {
      throw new Error("Invalid response from server");
    }

    return response.data;
  } catch (error) {
    throw new Error(handleError(error) || "Login failed");
  }
};

export const registerUser = async (data: RegisterData): Promise<{ token: string; user: User }> => {
    try {
      const newDataWithProvider = {
        ...data,
        provider: "email",
      }
      const response = await api.post<{ token: string; user: User }>(
        API_CONFIG.ENDPOINTS.AUTH.REGISTER,
        newDataWithProvider
      );
      if (!response.data.token || !response.data.user) {
        throw new Error("Invalid response from server");
      }
      return response.data;
    } catch (error) {
      throw new Error(handleError(error) || "Registration failed");
    }
  };

  export const getSession = async (): Promise<User> => {
    try {
      const response = await api.get<{ user: User }>(
        API_CONFIG.ENDPOINTS.AUTH.SESSION
      );
      if (!response.data.user) {
        throw new Error("Invalid session response from server");
      }
      return response.data.user;
    } catch (error) {
      throw new Error(handleError(error) || "Failed to get session");
    }
  };
  
  export const logout = async (): Promise<void> => {
    try {
      await api.patch(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
      await auth.signOut();
    } catch (error) {
      throw new Error(handleError(error) || "Logout failed");
    }
  };