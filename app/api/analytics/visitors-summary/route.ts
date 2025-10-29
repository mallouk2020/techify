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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") ?? "today";

    const response = await fetch(
      `${API_BASE_URL}/api/analytics/visitors-summary?range=${encodeURIComponent(range)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // Revalidate data on each request to keep stats fresh
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      console.error("Failed to fetch visitor stats", errorBody);
      return NextResponse.json(
        { message: "Unable to load visitor statistics" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Unexpected error fetching visitor stats", error);
    return NextResponse.json(
      { message: "Unexpected error fetching visitor statistics" },
      { status: 500 }
    );
  }
}