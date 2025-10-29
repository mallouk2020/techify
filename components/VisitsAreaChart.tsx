"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[240px] w-full items-center justify-center rounded-lg border border-blue-200 bg-white/80 p-6 text-sm text-blue-700">
      Loading chart...
    </div>
  ),
});

type VisitsAreaChartProps = {
  data: Record<string, number> | null | undefined;
};

const formatBucketLabel = (bucket: string) => {
  if (!bucket) return "";

  if (/^\d{2}:\d{2}$/.test(bucket)) {
    return bucket;
  }

  const parsedDate = new Date(bucket);
  if (!Number.isNaN(parsedDate.getTime())) {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
    }).format(parsedDate);
  }

  return bucket;
};

const VisitsAreaChart: React.FC<VisitsAreaChartProps> = ({ data }) => {
  const { categories, seriesData } = useMemo(() => {
    const entries = Object.entries(data ?? {}).sort(([a], [b]) => (a > b ? 1 : -1));

    return {
      categories: entries.map(([bucket]) => formatBucketLabel(bucket)),
      seriesData: entries.map(([, value]) => value ?? 0),
    };
  }, [data]);
  const options = useMemo(() => ({
    chart: {
      type: "area" as const,
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 400,
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth" as const,
      width: 3,
      colors: ["#2563eb"],
    },
    fill: {
      type: "gradient" as const,
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.35,
        opacityTo: 0.05,
        stops: [0, 90, 100],
        colorStops: [
          {
            offset: 0,
            color: "#2563eb",
            opacity: 0.35,
          },
          {
            offset: 100,
            color: "#dbeafe",
            opacity: 0.05,
          },
        ],
      },
    },
    grid: {
      borderColor: "#dbeafe",
      strokeDashArray: 4,
      padding: {
        left: 12,
        right: 12,
      },
    },
    markers: {
      size: 4,
      colors: ["#1d4ed8"],
      strokeColors: "#ffffff",
      strokeWidth: 2,
      hover: {
        size: 7,
      },
    },
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: "#1e3a8a",
        },
      },
    },
    yaxis: {
      min: 0,
      forceNiceScale: true,
      labels: {
        formatter: (value: number) => `${Math.max(0, Math.round(value))}`,
        style: {
          colors: "#1e3a8a",
        },
      },
    },
    tooltip: {
      theme: "light" as const,
      y: {
        formatter: (value: number) => `${value.toLocaleString()} visits`,
      },
    },
  }), [categories]);

  const series = useMemo(
    () => [
      {
        name: "Visits",
        data: seriesData,
      },
    ],
    [seriesData]
  );

  if (!categories.length) {
    return (
      <div className="flex h-full min-h-[240px] w-full items-center justify-center rounded-lg border border-dashed border-blue-200 bg-white/80 p-6 text-center text-sm text-blue-700">
        No visit data recorded for the selected period yet. Traffic will appear here once visitors arrive.
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <ReactApexChart options={options} series={series} type="area" height={280} />
    </div>
  );
};

export default VisitsAreaChart;