"use client";

import { Statistic, StatisticProps } from "antd";
import { FC, useMemo } from "react";
import CountUp from "react-countup";

interface TotalFormCardProps {
  data: any;
}

const categories: Record<string, string[]> = {
  "Nội quy lao động": ["bm13", "bm15"],
  "Bồi dưỡng trình độ": ["bm07"],
  "Công tác chung": ["bm08", "bm09", "bm10", "bm11", "bm12"],
  "Công tác khác": ["bm01", "bm02", "bm03", "bm04", "bm05", "bm14"],
};

const TotalFormCard: FC<TotalFormCardProps> = ({ data }) => {
  const totals = useMemo(() => {
    return Object.keys(categories).reduce((acc, key) => {
      acc[key] = data.reduce(
        (sum: number, item: any) =>
          categories[key].includes(item.shortName)
            ? sum + item.totalItems
            : sum,
        0
      );
      return acc;
    }, {} as Record<string, number>);
  }, [data]);

  const formatter: StatisticProps["formatter"] = (value) => (
    <CountUp end={value as number} duration={3} separator="," />
  );

  return (
    <div className="grid grid-cols-2 gap-6">
      {Object.entries(totals).map(([label, value]) => (
        <div
          key={label}
          className="flex flex-col justify-center items-center px-12 py-3 cursor-pointer border border-neutral-200 rounded-xl hover:border-blue-400 hover:shadow-lg hover:shadow-blue-200 text-neutral-400 hover:text-blue-500"
        >
          <Statistic
            value={value}
            formatter={formatter}
            valueStyle={{ fontSize: "48px" }}
            className=" hover:text-blue-500"
          />
          <span className="text-sm">{label}</span>
        </div>
      ))}
    </div>
  );
};

export default TotalFormCard;
