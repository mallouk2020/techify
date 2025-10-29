import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
  // Don't throw in dev — use a safe localhost fallback so the route registers.
  // In production set NEXT_PUBLIC_API_BASE_URL explicitly to your backend URL.
  // eslint-disable-next-line no-console
  console.warn(
    "NEXT_PUBLIC_API_BASE_URL not set — using fallback http://localhost:3001. Set NEXT_PUBLIC_API_BASE_URL in .env.local for explicit control."
  );
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    const response = await fetch(`${API_BASE_URL}/api/analytics/page-view`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      // No cache for analytics
      cache: "no-store",
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      console.error("Failed to proxy page view", errorBody);
      return NextResponse.json({ message: "Unable to record page view" }, { status: response.status });
    }

    // Some backends return an empty body on create; try to forward JSON or empty 201
    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status || 201 });
  } catch (error) {
    console.error("Unexpected error proxying page view", error);
    return NextResponse.json({ message: "Unexpected error recording page view" }, { status: 500 });
  }
}
