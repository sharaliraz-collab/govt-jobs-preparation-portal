import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Government Jobs & Test Prep Portal Next.js API is operational',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
}
