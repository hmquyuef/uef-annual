"use client";

import dynamic from "next/dynamic";
import React, { FC, useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
// Import động ReactApexChart
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});
interface LineChartProps {
  start: number;
  end: number;
  categories?: any;
  seriesData?: any;
}

const LineChart: FC<LineChartProps> = ({
  start,
  end,
  categories,
  seriesData,
}) => {
  const [dataSeries, setDataSeries] = useState<any>([]);
  const options: ApexOptions = {
    chart: {
      stackOnlyBar: false,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        speed: 400,
        animateGradually: {
          enabled: true,
          delay: 1000,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 600,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.8,
        opacityTo: 0.9,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      categories: categories.slice(start, end + 1),
      labels: {
        show: categories.length >= 16 ? false : true,
        rotate: -45,
        rotateAlways: true,
      },
    },
  };

  useEffect(() => {
    if (seriesData) {
      const temp = seriesData.map((item: any) => {
        return {
          name: item.name,
          data: item.data.slice(start, end + 1),
        };
      });
      setDataSeries(temp);
    }
  }, [start, end, categories, seriesData]);

  return (
    <div>
      <ReactApexChart
        options={options}
        series={dataSeries}
        type="area"
        height="150"
      />
    </div>
  );
};

export default LineChart;
