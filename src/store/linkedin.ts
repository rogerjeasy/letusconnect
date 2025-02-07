import { validateEnvVariables } from '@/utils/env';

export interface LinkedInUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
}

export const getLinkedInAuthURL = (): string => {
    try {
        const envVars = validateEnvVariables();

        // Build query parameters
        const queryParams = {
            response_type: 'code',
            client_id: envVars.NEXT_PUBLIC_LINKEDIN_CLIENT_ID,
            redirect_uri: envVars.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI,
            state: LINKEDIN_STATE,
            scope: LINKEDIN_SCOPE
        };

        // Create the URL with properly encoded parameters
        const baseUrl = 'https://www.linkedin.com/oauth/v2/authorization';
        const queryString = Object.entries(queryParams)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');

        const authUrl = `${baseUrl}?${queryString}`;

        // Validate the generated URL
        if (!authUrl.includes('client_id=')) {
            throw new Error('Generated URL is missing client_id parameter');
        }

        return authUrl;
    } catch (error) {
        console.error('Failed to generate LinkedIn auth URL:', error);
        throw error;
    }
};

export const LINKEDIN_STATE = process.env.NEXT_PUBLIC_LINKEDIN_STATE || 'random-state';
export const LINKEDIN_SCOPE = 'openid profile email';