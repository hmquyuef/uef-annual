"use client";

import dynamic from "next/dynamic";
import React, { FC, useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
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
      enabled: false,
    },
    legend: {
      show: false,
    },
    colors: ["#53fbdd"],
    plotOptions: {
      bar: {
        columnWidth: "40%",
        distributed: true,
        borderRadius: 6,
        borderRadiusApplication: "end",
        horizontal: false,
      },
    },
    xaxis: {
      categories: categories ?? [],
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
      height={350}
    />
  );
};

export default BarChart;
