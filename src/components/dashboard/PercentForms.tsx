"use client";

import Colors from "@/utility/Colors";
import { Progress } from "antd";
import { FC, useEffect, useState } from "react";

interface PercentFormsProps {
  data: any;
  color: number | 0;
}

const PercentForms: FC<PercentFormsProps> = ({ data, color }) => {
  const [datapercent, setDataPercent] = useState<number | 0>(0);
  const getColor = (color: number): string => {
    switch (color) {
      case 0:
        return Colors.BLUE;
      case 1:
        return Colors.GREEN;
      case 2:
        return Colors.ORANGE;
      case 3:
        return Colors.RED;
      case 4:
        return Colors.PURPLE;
      default:
        return "black";
    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setDataPercent((prev) =>
        prev < data.approvedPercent
          ? prev + (data.approvedPercent % 15)
          : data.approvedPercent
      );
    }, 100);
    return () => clearInterval(interval);
  }, [data.approvedPercent]);
  return (
    <div>
      <div className="flex justify-between text-purple-400">
        <span
          className={`font-semibold text-sm text-${
            color === 0
              ? "blue"
              : color === 1
              ? "green"
              : color === 2
              ? "orange"
              : color === 3
              ? "red"
              : "purple"
          }-400`}
        >
          {data.formName} ({data.totalApprovedItems}/{data.totalItems})
        </span>
        <span
          className={`font-semibold text-sm text-${
            color === 0
              ? "blue"
              : color === 1
              ? "green"
              : color === 2
              ? "orange"
              : color === 3
              ? "red"
              : "purple"
          }-400`}
        >
          {data.approvedPercent}%
        </span>
      </div>
      <Progress
        percent={datapercent}
        status="active"
        showInfo={false}
        strokeColor={{ from: getColor(color), to: getColor(color) }}
      />
    </div>
  );
};

export default PercentForms;
