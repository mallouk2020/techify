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
      console.error("Failed to fetch visitor summary", response.status);
      return DEFAULT_VISITOR_SUMMARY;
    }

    const data = (await response.json()) as VisitorSummaryResponse;
    return {
      ...DEFAULT_VISITOR_SUMMARY,
      ...data,
    };
  } catch (error) {
    console.error("Unexpected error fetching visitor summary", error);
    return DEFAULT_VISITOR_SUMMARY;
  }
}