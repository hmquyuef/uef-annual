"use client";

import dynamic from "next/dynamic";
import React, { FC, useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import Colors from "@/utility/Colors";
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
        enabled: false,
      },
      stackOnlyBar: false,
      toolbar: {
        show: false,
      },
      dropShadow: {
        enabled: true,
        color: "#000",
        top: 18,
        left: 5,
        blur: 12,
        opacity: 0.5,
      },
      animations: {
        enabled: true,
        speed: 600,
        animateGradually: {
          enabled: true,
          delay: 250,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 900,
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
      size: 6,
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
      followCursor: false,
      intersect: false,
      theme: "light",
      x: {
        show: true,
      },
      y: {
        formatter: (value: number) => `${value.toLocaleString()} hoạt động`,
      },
      marker: {
        show: true,
      },
    },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      formatter: (seriesName: string, opts: any) => {
        const seriesIndex = opts.seriesIndex;
        const total = opts.w.globals.seriesTotals[seriesIndex];
        const color = opts.w.config.colors[seriesIndex];
        return `<span style="color:${color}">${seriesName} - </span><strong style="color:${color}">${total}</strong>`;
      },
    },
    colors: [
      Colors.BLUE,
      Colors.GREEN,
      Colors.ORANGE,
      Colors.RED,
      Colors.PURPLE,
      Colors.INDIGO_500,
      Colors.ROSE_500,
      Colors.AMBER_500,
      Colors.YELLOW_300,
      Colors.LIME_400,
      Colors.CYAN_400,
      Colors.ZINC_800,
      Colors.YELLOW_700,
      Colors.RED_300,
    ],
    grid: {
      borderColor: "#e7e7e7",
      strokeDashArray: 5,
    },
  };

  useEffect(() => {
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
        height="450"
      />
    </div>
  );
};

export default MultiLineChart;
