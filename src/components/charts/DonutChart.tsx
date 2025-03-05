"use client";

import Colors from "@/utility/Colors";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { FC, useEffect, useState } from "react";
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
    legend: {
      position: "right",
      offsetY: -20,
      formatter: (seriesName: string, opts: any) => {
        const value = opts.w.config.series[opts.seriesIndex];
        const color = opts.w.config.colors[opts.seriesIndex];
        return `<span style="color:${color}">${seriesName} - </span><strong style="color:${color}">${value}</strong>`;
      },
    },
    labels: categories,
    dataLabels: {
      enabled: false,
      formatter: (val: number) => {
        return `${val.toFixed(1)}%`;
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "40%",
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
        breakpoint: 500,
        options: {
          chart: {
            width: 400,
          },
          // legend: {
          //   position: "bottom",
          // },
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
    <div className="h-full w-full flex justify-center items-center">
      <ReactApexChart
        options={options}
        series={dataSeries}
        type="donut"
        width={500}
      />
    </div>
  );
};

export default DonutChart;
