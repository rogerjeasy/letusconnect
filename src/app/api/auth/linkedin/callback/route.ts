// src/app/api/auth/linkedin/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { LINKEDIN_STATE } from '@/store/linkedin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');
        const error_description = searchParams.get('error_description');

        console.log('LinkedIn callback received:', {
            code: code ? `${code.substring(0, 10)}...` : 'missing',
            state,
            timestamp: new Date().toISOString()
        });

        if (error) {
            console.error('LinkedIn OAuth error:', error, error_description);
            return NextResponse.redirect(
                new URL(`/login?error=${encodeURIComponent(error_description || 'OAuth Error')}`, request.url)
            );
        }

        if (state !== LINKEDIN_STATE) {
            return NextResponse.redirect(
                new URL('/login?error=Invalid state parameter', request.url)
            );
        }

        if (!code) {
            return NextResponse.redirect(
                new URL('/login?error=Missing authorization code', request.url)
            );
        }

        // First, exchange the authorization code for an access token with LinkedIn
        const linkedInTokenUrl = 'https://www.linkedin.com/oauth/v2/accessToken';
        const tokenParams = new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI!,
            client_id: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID!,
            client_secret: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_SECRET!
        });

        console.log('Attempting LinkedIn token exchange');
        
        const tokenResponse = await fetch(linkedInTokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: tokenParams.toString()
        });

        if (!tokenResponse.ok) {
            const errorText = await tokenResponse.text();
            console.error('LinkedIn token exchange failed:', {
                status: tokenResponse.status,
                error: errorText
            });
            throw new Error('Failed to exchange code for token');
        }

        const tokenData = await tokenResponse.json();
        console.log('Successfully obtained LinkedIn access token');

        // Now get user profile data
        const profileResponse = await fetch('https://api.linkedin.com/v2/me', {
            headers: {
                'Authorization': `Bearer ${tokenData.access_token}`,
                'cache-control': 'no-cache',
                'X-Restli-Protocol-Version': '2.0.0'
            }
        });

        const emailResponse = await fetch('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
            headers: {
                'Authorization': `Bearer ${tokenData.access_token}`,
                'cache-control': 'no-cache',
                'X-Restli-Protocol-Version': '2.0.0'
            }
        });

        const [profileData, emailData] = await Promise.all([
            profileResponse.json(),
            emailResponse.json()
        ]);

        console.log('LinkedIn profile data:', profileData);

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
            throw new Error('API URL not configured');
        }

        console.log('Sending code to backend:', {
            url: `${apiUrl}/auth/linkedin`,
            codePreview: `${code.substring(0, 10)}...`
        });

        // Try to pass the data to your backend
        try {
            if (apiUrl) {
                await fetch(`${apiUrl}/auth/linkedin`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        linkedinData: {
                            profile: profileData,
                            email: emailData,
                            token: tokenData
                        }
                    }),
                });
            }
        } catch (backendError) {
            console.error('Backend server error:', backendError);
            // Continue even if backend fails
        }

        // Create redirect response
        const redirectResponse = NextResponse.redirect(
            new URL('/dashboard?success=true', request.url)
        );

        // Set cookies with user data
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const,
            maxAge: 60 * 60 * 24 * 7 // 1 week
        };

        redirectResponse.cookies.set('linkedin_token', tokenData.access_token, cookieOptions);
        redirectResponse.cookies.set('user_profile', JSON.stringify({
            id: profileData.id,
            firstName: profileData.localizedFirstName,
            lastName: profileData.localizedLastName,
            email: emailData.elements?.[0]?.['handle~']?.emailAddress
        }), cookieOptions);

        return redirectResponse;

    } catch (error) {
        console.error('Authentication error:', error);
        const errorMessage = error instanceof Error ? 
            encodeURIComponent(error.message) : 
            'Authentication failed';
        return NextResponse.redirect(
            new URL(`/login?error=${errorMessage}`, request.url)
        );
    }
}