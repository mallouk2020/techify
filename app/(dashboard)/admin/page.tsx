
import React from "react";
import { DashboardSidebar, StatsElement } from "@/components";
import VisitsAreaChart from "@/components/VisitsAreaChart";
import { getVisitorSummary } from "@/lib/analytics";

const AdminDashboardPage = async () => {
  const visitorSummary = await getVisitorSummary("today");

  const dailyAverageRounded = Math.round(visitorSummary.averageDailyVisits * 100) / 100;

  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto max-xl:flex-col">
      <DashboardSidebar />
      <div className="flex flex-col items-center ml-5 gap-y-6 w-full pb-10 max-xl:ml-0 max-xl:px-2 max-xl:mt-5 max-md:gap-y-4">
        <div className="flex justify-between w-full max-md:flex-col max-md:w-full max-md:gap-y-3 gap-x-4">
          <StatsElement
            title="Total Visits"
            value={visitorSummary.totalVisits}
            subtitle="All page views recorded in the selected period"
          />
          <StatsElement
            title="Unique Visitors"
            value={visitorSummary.uniqueVisitors}
            subtitle="Distinct sessions or IPs captured"
          />
          <StatsElement
            title="Avg. Daily Visits"
            value={dailyAverageRounded}
            subtitle="Average visits per day for the selected range"
          />
        </div>
        <section className="w-full rounded-lg border border-blue-100 bg-blue-50/40 p-6">
          <header className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold text-blue-900">Daily Visits Trend</h3>
              <p className="text-sm text-blue-700/80">
                Live breakdown of visits recorded today segmented by hour.
              </p>
            </div>
            <span className="rounded-full bg-blue-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-900">
              Today
            </span>
          </header>
          <div className="mt-6 min-h-[280px] w-full">
            <VisitsAreaChart data={visitorSummary.dailyBreakdown} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
