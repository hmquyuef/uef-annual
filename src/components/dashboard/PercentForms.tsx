"use client";

import { FastBackwardOutlined } from "@ant-design/icons";
import { Progress } from "antd";
import { FC, useEffect, useState } from "react";

interface PercentFormsProps {
  name: string;
  countItems: number;
  total: number;
  color: string;
}

const PercentForms: FC<PercentFormsProps> = ({
  name,
  countItems,
  total,
  color,
}) => {
  const [datapercent, setDataPercent] = useState<number | 0>(0);
  const percent = parseFloat(((countItems / total) * 100).toFixed(2));
  const getColor = (color: string): string => {
    switch (color) {
      case "blue":
        return "rgb(59 130 246)";
      case "red":
        return "rgb(239 68 68)";
      case "orange":
        return "rgb(249 115 22)";
      case "violet":
        return "rgb(139 92 246)";
      case "green":
        return "rgb(34 197 94)";
      default:
        return "rgb(0 0 0)";
    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setDataPercent((prev) =>
        prev < percent ? prev + (percent % 15) : percent
      );
    }, 100);
    return () => clearInterval(interval);
  }, [percent]);
  return (
    <div className="grid grid-cols-5 gap-3">
      <FastBackwardOutlined
        className={`bg-${color}-100 text-${color}-600 p-3 text-2xl rounded-lg`}
      />
      <div className="col-span-4 flex flex-col justify-center">
        <div className="flex justify-between">
          <span className={`text-${color}-400 font-semibold text-[14px]`}>
            {name} ({countItems}/{total})
          </span>
          <span className={`text-${color}-400 font-semibold text-[14px]`}>
            {percent}%
          </span>
        </div>
        <Progress
          percent={datapercent}
          status="active"
          showInfo={false}
          strokeColor={{ from: getColor(color), to: getColor(color) }}
        />
      </div>
    </div>
  );
};

export default PercentForms;
