export const validateEnvVariables = () => {
    const requiredVars = {
        NEXT_PUBLIC_LINKEDIN_CLIENT_ID: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID?.trim(),
        NEXT_PUBLIC_LINKEDIN_REDIRECT_URI: process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI?.trim()
    };

    // Debug logging
    console.log('Environment Variables State:', {
        clientId: requiredVars.NEXT_PUBLIC_LINKEDIN_CLIENT_ID ? 'present' : 'missing',
        redirectUri: requiredVars.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI ? 'present' : 'missing',
        environment: process.env.NODE_ENV
    });

    // Validate each variable
    Object.entries(requiredVars).forEach(([key, value]) => {
        if (!value) {
            throw new Error(`Missing required environment variable: ${key}`);
        }
        if (key === 'NEXT_PUBLIC_LINKEDIN_CLIENT_ID' && value.length < 10) {
            throw new Error(`Invalid ${key}: Client ID appears to be malformed`);
        }
    });

    return requiredVars as {
        NEXT_PUBLIC_LINKEDIN_CLIENT_ID: string;
        NEXT_PUBLIC_LINKEDIN_REDIRECT_URI: string;
    };
};