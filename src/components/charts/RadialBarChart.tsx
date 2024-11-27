"use client";

import { ApexOptions } from "apexcharts";
import { FC, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

interface RadialBarChartProps {
  start: number;
  end: number;
  categories?: any;
  seriesData?: any;
}

// const RadialBarChart: FC<RadialBarChartProps> = ({
//   start,
//   end,
//   categories,
//   seriesData,
// }) => {
const RadialBarChart = () => {
  const [data, setData] = useState<{ series: number[] }>({
    series: [],
  });
  const options: ApexOptions = {
    chart: {
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
    plotOptions: {
      radialBar: {
        offsetY: 0,
        startAngle: 0,
        endAngle: 360,
        hollow: {
          size: "30%",
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            show: true,
            fontSize: "22px",
            offsetY: 8,
            formatter: (val) => `${val}%`,
          },
        },
      },
    },
    labels: ["BM01 - 5.2%", "BM02 - 0%", "BM03 - 0%", "BM04 - 0%", "BM05 - 50.2%"],
    legend: {
      show: true,
      position: "bottom",
      fontSize: "14px",
      itemMargin: {
        vertical: 8,
        horizontal: 12
      },
    },
  };

  useEffect(() => {
    setData({
      series: [5.2, 0, 0, 0, 50.2],
    });
  }, []);

  // useEffect(() => {
  //   if (seriesData) {
  //     const temp = seriesData.map((item: any) => {
  //       return {
  //         name: item.name,
  //         data: item.data.slice(start, end + 1),
  //       };
  //     });
  //     setDataSeries(temp);
  //   }
  // }, [start, end, categories, seriesData]);

  return (
    <div>
      <ReactApexChart
        options={options}
        series={data.series}
        type="radialBar"
        height="350"
      />
    </div>
  );
};

export default RadialBarChart;
