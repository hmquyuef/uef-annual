"use client";

import { ApexOptions } from "apexcharts";
import { FC, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

interface ColumnChartProps {
  start: number;
  end: number;
  categories?: any;
  seriesData?: any;
}

// const ColumnChart: FC<ColumnChartProps> = ({
//   start,
//   end,
//   categories,
//   seriesData,
// }) => {
const ColumnChart = () => {
  const [data, setData] = useState<{ series: number[] }>({
    series: [],
  });

  var options: ApexOptions = {
    series: [
      {
        name: "BM01 - Created",
        group: "bm01",
        data: [44, 55, 41, 67, 22, 43],
      },
      {
        name: "BM02 - Created",
        group: "bm02",
        data: [13, 23, 20, 8, 13, 27],
      },
      {
        name: "BM03 - Created",
        group: "bm03",
        data: [11, 17, 15, 15, 21, 14],
      },
      {
        name: "BM04 - Created",
        group: "bm04",
        data: [21, 7, 25, 13, 22, 8],
      },
      {
        name: "BM05 - Created",
        group: "bm05",
        data: [21, 7, 25, 13, 22, 8],
      },
      {
        name: "BM01 - Approved",
        group: "bm01",
        data: [34, 45, 31, 57, 12, 33],
      },
      {
        name: "BM02 - Approved",
        group: "bm02",
        data: [10, 19, 15, 7, 10, 22],
      },
      {
        name: "BM03 - Approved",
        group: "bm03",
        data: [9, 15, 12, 12, 18, 11],
      },
      {
        name: "BM04 - Approved",
        group: "bm04",
        data: [19, 5, 20, 10, 18, 6],
      },
      {
        name: "BM05 - Approved",
        group: "bm05",
        data: [19, 5, 20, 10, 18, 6],
      },
      {
        name: "BM01 - Rejected",
        group: "bm01",
        data: [34, 45, 31, 57, 12, 33],
      },
      {
        name: "BM02 - Rejected",
        group: "bm02",
        data: [10, 19, 15, 7, 10, 22],
      },
      {
        name: "BM03 - Rejected",
        group: "bm03",
        data: [9, 15, 12, 12, 18, 11],
      },
      {
        name: "BM04 - Rejected",
        group: "bm04",
        data: [19, 5, 20, 10, 18, 6],
      },
      {
        name: "BM05 - Rejected",
        group: "bm05",
        data: [19, 5, 20, 10, 18, 6],
      },
    ],
    chart: {
      stacked: true,
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
    stroke: {
      width: 1,
      colors: ["#fff"],
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    xaxis: {
      categories: [
        "Tháng 1",
        "Tháng 2",
        "Tháng 3",
        "Tháng 4",
        "Tháng 5",
        "Tháng 6",
        "Tháng 7",
        "Tháng 8",
        "Tháng 9",
        "Tháng 10",
        "Tháng 11",
        "Tháng 12",
      ],
    },
    fill: {
      opacity: 1,
    },
    yaxis: {
      labels: {
        formatter: (val) => `${val}`,
      },
    },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
    },
    colors: [
      "#007BFF",
      "#007BFF",
      "#007BFF",
      "#007BFF",
      "#007BFF",
      "#28A745",
      "#28A745",
      "#28A745",
      "#28A745",
      "#28A745",
      "#DC3545",
      "#DC3545",
      "#DC3545",
      "#DC3545",
      "#DC3545",
    ],
    // colors: ["#007BFF", "#28A745", "#FFC107", "#DC3545", "#6F42C1"],
  };

  //   useEffect(() => {
  //     setData({
  //       series: [5.2, 0, 0, 0, 50.2],
  //     });
  //   }, []);

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
    <div className="w-full">
      <ReactApexChart
        options={options}
        series={options.series}
        type="bar"
        height="350"
      />
    </div>
  );
};

export default ColumnChart;
