import { NextResponse } from 'next/server';

export function middleware(request:any) {
  // If in production and trying to access /seed, redirect to home
  if (process.env.NODE_ENV === 'production' && request.nextUrl.pathname === '/seed') {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/seed'],
};