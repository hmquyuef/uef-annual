"use client";

import Messages from "@/utility/Messages";
import { MoreOutlined } from "@ant-design/icons";
import { Button, Empty, Spin, Table, TableColumnsType } from "antd";
import { FC, useEffect, useState } from "react";

interface TopHumanChartProps {
  data: any;
}

const TopHumanChart: FC<TopHumanChartProps> = ({ data }) => {
  const [humans, setHumans] = useState<any>();
  const columns: TableColumnsType<any> = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      render: (_, __, index) => (
        <>
          {index + 1 === 1 ? (
            <div className="flex justify-center">
              <img
                src="/medal-champion-1.svg"
                width={36}
                loading="lazy"
                alt="upload"
              />
            </div>
          ) : index + 1 === 2 ? (
            <div className="flex justify-center">
              <img
                src="/medal-champion-2.svg"
                width={32}
                loading="lazy"
                alt="upload"
              />
            </div>
          ) : index + 1 === 3 ? (
            <div className="flex justify-center">
              <img
                src="/medal-champion-3.svg"
                width={28}
                loading="lazy"
                alt="upload"
              />
            </div>
          ) : (
            index + 1
          )}
        </>
      ),
      className: "text-center w-[60px]",
    },
    {
      title: "MÃ SỐ CB-GV-NV",
      dataIndex: "userName",
      key: "userName",
      className: "w-[15rem]",
      render: (userName: string, record: any) => {
        const fullName = record.fullName;
        return (
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold">{fullName}</span>
            <span className="text-[10px] text-neutral-500">{userName}</span>
          </div>
        );
      },
    },
    {
      title: "ĐƠN VỊ",
      dataIndex: "unitName",
      key: "unitName",
      className: "text-center w-[6rem]",
      render: (unitName: string) => <span className="text-[13px] font-semibold">{unitName}</span>,
    },
    {
      title: "SỰ KIỆN",
      dataIndex: "totalEvents",
      key: "totalEvents",
      className: "text-center w-[70px]",
      render: (totalEvents: number) => <span className="font-semibold">{totalEvents}</span>,
    },
    {
      title: <div className="py-1">TIẾT CHUẨN</div>,
      dataIndex: "totalStandarNumber",
      key: "totalStandarNumber",
      className: "text-center w-[90px]",
      render: (totalStandarNumber: string) => <span className="font-semibold">{totalStandarNumber}</span>,
    },
  ];

  useEffect(() => {
    const timeout = setTimeout(() => {
      setHumans(data.slice(0, 7));
    }, 500);
    return () => clearTimeout(timeout);
  }, [data]);

  return (
    <div className="bg-white w-full flex flex-col rounded-lg shadow-lg cursor-pointer">
      <div className="px-4 py-3 flex justify-between items-center">
        <span className="text-neutral-400 font-semibold text-[14px]">
          Top các CB-GV-NV có nhiều hoạt động
        </span>
        <Button type="text" shape="circle" icon={<MoreOutlined />} />
      </div>
      <hr />
      <div className="h-full p-1 flex justify-center">
        <Table<any>
          key={"table-humans"}
          className="custom-table-header shadow-md rounded-md"
          bordered
          rowKey={(item) => item.id}
          rowHoverable
          size="small"
          pagination={false}
          columns={columns}
          dataSource={humans}
          locale={{
            emptyText: <Empty description={Messages.NO_DATA}></Empty>,
          }}
        />
      </div>
    </div>
  );
};
export default TopHumanChart;
