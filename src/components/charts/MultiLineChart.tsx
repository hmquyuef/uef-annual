"use client";

import dynamic from "next/dynamic";
import React, { FC, useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
// Import động ReactApexChart
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});
interface MultiLineChartProps {
  categories?: any;
  seriesData?: any;
}

const MultiLineChart: FC<MultiLineChartProps> = ({
  categories,
  seriesData,
}) => {
  const [dataSeries, setDataSeries] = useState<any>([]);

  // Cấu hình biểu đồ
  const options: ApexOptions = {
    chart: {
      zoom: {
        enabled: true,
      },
      stackOnlyBar: false,
      toolbar: {
        show: false,
      },
      dropShadow: {
        enabled: true,
        color: '#000',
        top: 18,
        left: 5,
        blur: 12,
        opacity: 0.5
      },
      animations: {
        enabled: true,
        speed: 500,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 800,
        },
      },
    },
    xaxis: {
      categories: categories as Array<string>,
    },
    yaxis: {
      title: {
        text: "",
      },
    },
    markers: {
      size: 4
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      shared: true,
    },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
    },
    colors: ["#3399ff", "#22C55E", "#ff3333", "#ff6600", "#9966ff"],
    grid: {
      borderColor: "#e7e7e7",
      strokeDashArray: 4,
    },
  };

  useEffect(() => {
    console.log('categories :>> ', categories);
    console.log('seriesData :>> ', seriesData);
    const timeout = setTimeout(() => {
      setDataSeries(seriesData);
    }, 500);
    return () => clearTimeout(timeout);
  }, [seriesData]);

  return (
    <div>
      <ReactApexChart
        options={options}
        series={dataSeries}
        type="line"
        height="300"
      />
    </div>
  );
};

export default MultiLineChart;
