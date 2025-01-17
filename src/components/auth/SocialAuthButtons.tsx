"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';
import { toast } from 'react-toastify';
import { handleGoogleAuth, handleGithubAuth } from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import { setAuthToken } from '@/helpers/tokenManagement';
import { useUserStore } from '@/store/userStore';
import { api } from '@/helpers/api';
import DevelopmentModal from '../utils/DevelopmentModal';

interface SocialAuthButtonsProps {
  mode: 'login' | 'register';
  className?: string;
}

const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({ mode, className }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<{ google: boolean; github: boolean }>({
    google: false,
    github: false
  });

  const googleUnderDevelopment = true;
  const githubUnderDevelopment = true;

  const handleNavigation = async (mode: 'login' | 'register') => {
    try {
      if (mode === 'login') {
        router.push('/dashboard');
      } else {
        router.push('/welcome');
      }
      router.refresh();
    } catch (error) {
      console.error('Navigation error:', error);
      toast.error('Error during navigation. Please try again.');
    }
  };

  const handleGoogleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(prev => ({ ...prev, google: true }));
    
    try {
      const { user, token, isNewUser } = await handleGoogleAuth(mode);
      if (!user || !token) {
        throw new Error('Invalid authentication response');
      }
      setAuthToken(token);
      useUserStore.setState({
        user,
        token,
        isAuthenticated: true,
        loading: false,
        hasChecked: true
      });
      await handleNavigation(mode);

    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Authentication cancelled') {
          console.log('Google authentication was cancelled by the user');
        } else {
          toast.error(error.message);
        }
        
        // Clear auth data on error
        if (typeof window !== 'undefined') {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
        delete api.defaults.headers.common['Authorization'];
      }
    } finally {
      setIsLoading(prev => ({ ...prev, google: false }));
    }
  };

  const handleGithubClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(prev => ({ ...prev, github: true }));
    
    try {
      const { user, token, isNewUser } = await handleGithubAuth(mode);
      if (!user || !token) {
        throw new Error('Invalid authentication response');
      }
      setAuthToken(token);
      useUserStore.setState({
        user,
        token,
        isAuthenticated: true,
        loading: false,
        hasChecked: true
      });

      await handleNavigation(mode);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Authentication cancelled') {
          console.log('GitHub authentication was cancelled by the user');
        } else {
          toast.error(error.message);
        }
        
        // Clear auth data on error
        if (typeof window !== 'undefined') {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
        delete api.defaults.headers.common['Authorization'];
      }
    } finally {
      setIsLoading(prev => ({ ...prev, github: false }));
    }
  };

  const handleButtonUnderDevelopment = (mode: 'login' | 'register', type: 'github' | 'google') => {
    const action = mode === 'login' ? 'Sign in' : 'Sign up';
    const provider = type.charAt(0).toUpperCase() + type.slice(1);
    const modeText = mode === 'login' ? 'login' : 'registration';
    
    return (
      <DevelopmentModal 
        buttonText={`${action} with ${provider}`}
        buttonVariant="outline"
        buttonClassName={`w-full hover:bg-${type === 'github' ? '[#24292F]' : '[#4285F4]'}/90 hover:text-white transition-colors duration-200 group relative`}
        title={`${provider} ${action} Coming Soon!`}
        description={`${provider} ${modeText} is currently under development and will be available soon. We appreciate your patience! 🙂`}
        icon="construction"
      />
    );
  };

  const buttonText = mode === 'login' ? 'Sign in with' : 'Sign up with';

  const renderGithubButton = () => {
    if (githubUnderDevelopment) {
      return handleButtonUnderDevelopment(mode, 'github');
    }

    return (
      <Button
        type="button"
        variant="outline"
        className="w-full hover:bg-[#24292F]/90 hover:text-white transition-colors duration-200 group relative"
        onClick={handleGithubClick}
        disabled={isLoading.github}
      >
        <div className="flex items-center justify-center">
          <Github className="mr-2 h-4 w-4 text-[#24292F] group-hover:text-white transition-colors" />
          <span className="truncate">
            {isLoading.github ? 'Loading...' : `${buttonText} Github`}
          </span>
        </div>
      </Button>
    );
  };

  const renderGoogleButton = () => {
    if (googleUnderDevelopment) {
      return handleButtonUnderDevelopment(mode, 'google');
    }

    return (
      <Button
        type="button"
        variant="outline"
        className="w-full hover:bg-[#4285F4]/90 hover:text-white transition-colors duration-200 group relative"
        onClick={handleGoogleClick}
        disabled={isLoading.google}
      >
        <div className="flex items-center justify-center">
          <div className="mr-2 bg-white rounded-sm p-0.5 group-hover:bg-[#4285F4]/90 transition-colors">
            <svg className="h-3 w-3" aria-hidden="true" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
                className="group-hover:fill-white transition-colors"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
                className="group-hover:fill-white transition-colors"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
                className="group-hover:fill-white transition-colors"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
                className="group-hover:fill-white transition-colors"
              />
            </svg>
          </div>
          <span className="truncate">
            {isLoading.google ? 'Loading...' : `${buttonText} Google`}
          </span>
        </div>
      </Button>
    );
  };

  return (
    <div className={`grid grid-cols-2 gap-4 ${className}`}>
      {renderGithubButton()}
      {renderGoogleButton()}
    </div>
  );
};

export default SocialAuthButtons;