import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Add CORS headers
  const headers = new Headers({
    'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_DOMAIN || '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });

  const searchParams = request.nextUrl.searchParams;
  const country = searchParams.get('country');
  
  const baseUrl = 'http://universities.hipolabs.com/search';
  const endpoint = country ? `${baseUrl}?country=${encodeURIComponent(country)}` : baseUrl;
  
  try {
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error(`Upstream API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data, { headers });
  } catch (error) {
    console.error('Error fetching universities:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch universities',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500, headers }
    );
  }
}