"use client";

import dynamic from "next/dynamic";
import React, { FC, useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import Colors from "@/utility/Colors";
// Import động ReactApexChart
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});
interface DonutChartProps {
  categories?: any;
  seriesData?: any;
}

const DonutChart: FC<DonutChartProps> = ({ categories, seriesData }) => {
  const [dataSeries, setDataSeries] = useState<any>([]);

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
    colors: [
      Colors.BLUE,
      Colors.GREEN,
      Colors.ORANGE,
      Colors.RED,
      Colors.PURPLE,
    ],
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "diagonal1",
        shadeIntensity: 0.5,
        gradientToColors: [
          Colors.BLUE,
          Colors.GREEN,
          Colors.ORANGE,
          Colors.RED,
          Colors.PURPLE,
        ],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100], // Các điểm dừng màu
      },
    },
    legend: {
      position: "right",
      offsetY: 80,
      formatter: (seriesName: string, opts: any) => {
        const value = opts.w.config.series[opts.seriesIndex];
        const color = opts.w.config.colors[opts.seriesIndex];
        return `<span style="color:${color}">${seriesName} - </span><strong style="color:${color}">${value}</strong>`;
      },
    },
    labels: categories,
    dataLabels: {
      enabled: true,
      formatter: (val: number) => {
        return `${val.toFixed(1)}%`;
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "60%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Tổng cộng",
              formatter: (w) =>
                w.globals.seriesTotals
                  .reduce((a: any, b: any) => a + b, 0)
                  .toString(),
            },
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDataSeries(seriesData);
    }, 500);
    return () => clearTimeout(timeout);
  }, [seriesData]);

  return (
    <div className="w-full">
      <ReactApexChart
        options={options}
        series={dataSeries}
        type="donut"
        height={320}
      />
    </div>
  );
};

export default DonutChart;
