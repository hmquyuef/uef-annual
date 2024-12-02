"use client";

import { FastBackwardOutlined } from "@ant-design/icons";
import clsx from "clsx";
import { FC, useEffect, useState } from "react";

interface TotalFormCardProps {
  data: any;
  color: string;
}

const TotalFormCard: FC<TotalFormCardProps> = ({ data, color }) => {
  const [totalItems, setTotalItems] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalItems((prev) =>
        prev < data.totalItems ? prev + 1 : data.totalItems
      );
    }, 10);
    return () => clearInterval(interval);
  }, [data.totalItems]);

  return (
    <div className="cursor-pointer transition-transform duration-300 hover:-translate-y-2">
      <div className="flex justify-center">
        <div
          className={clsx(
            "w-2/3 bg-[#fcfaf6] shadow-sm rounded-lg h-5",
            `shadow-${color}-100`,
            `hover:shadow-${color}-200`
          )}
        />
      </div>
      <div
        className={clsx(
          `bg-${color}-50 rounded-lg h-32 shadow-md mt-[-8px] p-4`,
          `shadow-${color}-200 hover:shadow-lg hover:shadow-${color}-300`
        )}
      >
        <div className="grid grid-rows-3 h-full">
          <div className="row-span-2 flex justify-between items-start mt-1">
            <div className="w-full flex flex-col">
              <span
                className={clsx(`text-${color}-400 font-semibold text-[14px]`)}
              >
                {data.formName}
              </span>
              <div className="px-4">
                <span
                  className={clsx(
                    `font-bold font-serif text-${color}-500 text-5xl`
                  )}
                >
                  {totalItems}
                </span>
                <span
                  className={clsx(
                    `text-${color}-400 font-semibold text-[13px] ms-2`
                  )}
                >
                  sự kiện
                </span>
              </div>
            </div>
            <FastBackwardOutlined
              className={`p-3 text-2xl rounded-lg bg-${color}-100`}
            />
          </div>
          <div className="flex justify-end items-end">
            <span
              className={clsx(`text-[13px] font-semibold text-${color}-400`)}
            >
              tỉ lệ: {data.percentage}%
            </span>
            {/* <span
              className={clsx(
                `text-[13px] text-${color}-400 hover:text-${color}-500 hover:underline`
              )}
            >
              Xem chi tiết
            </span> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalFormCard;
