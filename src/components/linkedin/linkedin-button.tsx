"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Linkedin } from "lucide-react";
import { getLinkedInAuthURL } from "@/store/linkedin";
import { useToast } from '@/hooks/use-toast';

const LinkedInButton = () => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        try {
            setIsLoading(true);

            // Generate LinkedIn auth URL
            const authUrl = getLinkedInAuthURL();
            
            // Validate URL before redirect
            if (!authUrl.includes('client_id=')) {
                throw new Error('Invalid authentication URL: Missing client ID');
            }

            // Log URL for debugging (remove in production)
            console.log('LinkedIn Auth URL:', authUrl);

            // Redirect to LinkedIn
            window.location.href = authUrl;
        } catch (error) {
            console.error('LinkedIn authentication error:', error);
            
            const errorMessage = error instanceof Error 
                ? error.message
                : 'Failed to connect to LinkedIn. Please try again.';
            
            toast({
                title: "Authentication Error",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            onClick={handleClick}
            size="lg"
            disabled={isLoading}
            className="w-full md:w-auto bg-[#0077B5] hover:bg-[#006097] text-white"
        >
            <Linkedin className="mr-2 h-5 w-5" />
            {isLoading ? 'Connecting...' : 'Connect with LinkedIn'}
        </Button>
    );
};

export default LinkedInButton;