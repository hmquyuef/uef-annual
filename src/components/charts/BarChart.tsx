"use client";

import dynamic from "next/dynamic";
import React, { FC, useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import Colors from "@/utility/Colors";
// Import động ReactApexChart
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});
interface BarChartProps {
  categories: any;
  seriesData: any;
}

const BarChart: FC<BarChartProps> = ({ categories, seriesData }) => {
  // const [dataSeries, setDataSeries] = useState<any>([{  data: [] }]);
  const [dataSeries, setDataSeries] = useState<any>([{ name: "", data: [] }]);
  const options: ApexOptions = {
    chart: {
      stackOnlyBar: false,
      toolbar: {
        show: false,
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
    dataLabels: {
      enabled: true,
      offsetY: -18,
      style: {
        fontSize: "11px",
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
      },
      textAnchor: "middle",
      formatter: function (val) {
        return val.toString();
      },
    },
    legend: {
      show: false,
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
    plotOptions: {
      bar: {
        columnWidth: "45%",
        distributed: true,
        borderRadius: 6,
        borderRadiusApplication: "end",
        horizontal: false,
        dataLabels: {
          position: "top",
        },
      },
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          fontSize: "11px",
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
        },
      },
    },
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      // setDataSeries([{ data: seriesData }]);
      setDataSeries([{ name: "Số sự kiện", data: seriesData }]);
    }, 500);
    return () => clearTimeout(timeout);
  }, [seriesData]);

  return (
    <ReactApexChart
      options={options}
      series={dataSeries}
      type="bar"
      height={450}
    />
  );
};

export default BarChart;
