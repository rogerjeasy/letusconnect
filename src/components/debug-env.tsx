import { validateEnvVariables } from '@/utils/env';

export const DebugEnv = () => {
    if (process.env.NODE_ENV !== 'development') {
        return null;
    }

    try {
        const vars = validateEnvVariables();
        return (
            <div className="fixed bottom-4 right-4 p-4 bg-gray-800 text-white rounded-lg text-xs">
                <h3 className="font-bold mb-2">Environment Debug</h3>
                <pre>
                    {JSON.stringify({
                        clientId: vars.NEXT_PUBLIC_LINKEDIN_CLIENT_ID?.slice(0, 4) + '...',
                        redirectUri: vars.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI,
                        nodeEnv: process.env.NODE_ENV
                    }, null, 2)}
                </pre>
            </div>
        );
    } catch (error) {
        return (
            <div className="fixed bottom-4 right-4 p-4 bg-red-800 text-white rounded-lg text-xs">
                <h3 className="font-bold mb-2">Environment Error</h3>
                <pre>{(error as Error).message}</pre>
            </div>
        );
    }
};