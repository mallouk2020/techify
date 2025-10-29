import React, { useMemo } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";

interface StatsElementProps {
  title: string;
  value: number | string;
  subtitle?: string;
  trend?: {
    direction: "up" | "down";
    percentage: number;
  };
}

const StatsElement: React.FC<StatsElementProps> = ({
  title,
  value,
  subtitle,
  trend,
}) => {
  const isTrendUp = trend?.direction === "up";
  const TrendIcon = isTrendUp ? FaArrowUp : FaArrowDown;

  const formattedValue = useMemo(() => {
    if (typeof value === "number") {
      return new Intl.NumberFormat(undefined, {
        maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
      }).format(value);
    }

    return value;
  }, [value]);

  return (
    <div className="w-80 h-32 bg-blue-500 text-white flex flex-col justify-center items-center rounded-md max-md:w-full">
      <h4 className="text-xl text-white">{title}</h4>
      <p className="text-2xl font-bold">{formattedValue}</p>
      {subtitle && (
        <p className="text-sm text-blue-100 text-center">{subtitle}</p>
      )}
      {trend && (
        <p
          className={`flex gap-x-1 items-center text-sm ${
            isTrendUp ? "text-green-200" : "text-red-200"
          }`}
        >
          <TrendIcon />
          {trend.percentage}% Since last period
        </p>
      )}
    </div>
  );
};

export default StatsElement;
