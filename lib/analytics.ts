import apiClient from "./api";

export interface VisitorSummaryResponse {
  totalVisits: number;
  uniqueVisitors: number;
  averageDailyVisits: number;
  dailyBreakdown: Record<string, number>;
}

const DEFAULT_VISITOR_SUMMARY: VisitorSummaryResponse = {
  totalVisits: 0,
  uniqueVisitors: 0,
  averageDailyVisits: 0,
  dailyBreakdown: {},
};

export async function getVisitorSummary(range: string = "today"): Promise<VisitorSummaryResponse> {
  try {
    const response = await apiClient.get(`/api/analytics/visitors-summary?range=${encodeURIComponent(range)}`, {
      next: {
        revalidate: 0,
      },
    });

    if (!response.ok) {
      // During static builds the backend API may be unavailable (ECONNREFUSED).
      // Log at debug level when running server-side in a local/non-hosted environment
      // to avoid noisy error output during `next build`.
      const isServer = typeof window === 'undefined';
      const isHosted = Boolean(process.env.VERCEL || process.env.RAILWAY_STATIC_URL || process.env.AWS_REGION);
      // Avoid noisy logs during local server-side builds where the API is often unavailable.
      if (!isServer || isHosted) {
        console.error("Failed to fetch visitor summary", response.status);
      }
      return DEFAULT_VISITOR_SUMMARY;
    }

    const data = (await response.json()) as VisitorSummaryResponse;
    return {
      ...DEFAULT_VISITOR_SUMMARY,
      ...data,
    };
  } catch (error) {
    const isServer = typeof window === 'undefined';
    const isHosted = Boolean(process.env.VERCEL || process.env.RAILWAY_STATIC_URL || process.env.AWS_REGION);
    // Only log errors during client runtime or when running in a hosted environment.
    if (!isServer || isHosted) {
      console.error("Unexpected error fetching visitor summary", error);
    }
    return DEFAULT_VISITOR_SUMMARY;
  }
}