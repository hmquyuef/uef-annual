"use client";

import { LoadingSkeleton } from "@/components/skeletons/LoadingSkeleton";
import Messages from "@/utility/Messages";
import { convertTimestampToDate } from "@/utility/Utilities";
import {
  CheckOutlined,
  CloseOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Empty, PaginationProps, Spin, Table, TableColumnsType } from "antd";
import { TableRowSelection } from "antd/es/table/interface";
import Cookies from "js-cookie";
import { FC, Key, useEffect, useState } from "react";

interface TemplateFormsProps {
  loading: boolean;
  data: any;
  title: any[];
  hideEntryDate?: boolean;
  onEdit?: (record: any) => void;
  onSelectionChange?: (selectedKeys: Key[]) => void;
  onSetBlock?: (isBlock: boolean) => void;
  onSetPayments?: (payments: any) => void;
}

const TemplateForms: FC<TemplateFormsProps> = ({
  loading,
  data,
  title,
  hideEntryDate,
  onEdit,
  onSelectionChange,
  onSetBlock,
  onSetPayments,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
  });

  const onSelectChange = (newSelectedRowKeys: Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
    if (typeof onSelectionChange === "function") {
      onSelectionChange(newSelectedRowKeys);
    }
  };
  const rowSelection: TableRowSelection<any> = {
    selectedRowKeys,
    getCheckboxProps: (record: any) => ({
      disabled: record.payments?.length > 0 ? true : false,
    }),
    onChange: onSelectChange,
  };

  const showTotal: PaginationProps["showTotal"] = (total) => (
    <p className="w-full text-start">
      Đã chọn {selectedRowKeys.length} / {total} dòng dữ liệu
    </p>
  );
  const tempColumns: TableColumnsType<any> = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      render: (_: any, __: any, index: number) => {
        const [current, pageSize] = JSON.parse(Cookies.get("p_s") || "[1, 15]");
        return <>{pageSize * (current - 1) + index + 1}</>;
      },
      className: "text-center text-black w-[40px]",
    },
    ...title,
    {
      title: (
        <div className="py-1 rounded-tr-lg">
          NGÀY NHẬP <br /> VĂN BẢN
        </div>
      ),
      dataIndex: "entryDate",
      key: "entryDate",
      sorter: (a, b) => {
        const aDate = a.entryDate || a.determinations?.entryDate || 0;
        const bDate = b.entryDate || b.determinations?.entryDate || 0;
        return aDate - bDate;
      },
      render: (_, record) => {
        const fromDate = record.entryDate || record.determinations?.entryDate;
        return fromDate && convertTimestampToDate(fromDate);
      },
      className: "customInfoColors text-center w-[110px]",
    },
    {
      title: (
        <div className="rounded-tr-lg">
          KIỂM DUYỆT <br /> THANH TOÁN
        </div>
      ),
      dataIndex: "payments",
      key: "payments",
      render: (_: any, record: any) => {
        const payments = record.payments ?? [];
        const confirmationType = payments.reduce(
          (max: number, x: any) =>
            x.confirmationType > max ? x.confirmationType : max,
          0
        );
        const item = payments.find(
          (x: any) => x.confirmationType === confirmationType
        );
        if (confirmationType === 0) {
          return (
            <div className="flex justify-center items-center gap-2">
              <Spin size="small" />
              <span className="text-blue-500">Kiểm duyệt</span>
            </div>
          );
        }
        if (confirmationType === 1) {
          return (
            <span className="text-orange-500 flex justify-center items-center gap-2">
              <Spin
                indicator={
                  <span className="text-orange-600 mt-[-18px]">
                    <LoadingOutlined spin />
                  </span>
                }
              />
              Đợi xác nhận
            </span>
          );
        }
        if (confirmationType === 2 || confirmationType === 3) {
          if (item.isRejected) {
            return (
              <div className="flex justify-center items-center gap-2 text-red-500">
                <CloseOutlined />
                <span>Từ chối</span>
              </div>
            );
          } else {
            return (
              <div className="flex justify-center items-center gap-2 text-green-500">
                <CheckOutlined />
                <span>Xác nhận</span>
              </div>
            );
          }
        }
      },
      className: "customApprovedColors text-center w-[130px]",
    },
  ];

  if (!onSetPayments) {
    tempColumns.pop();
  }

  if (hideEntryDate) {
    tempColumns.pop();
  }

  const columns: TableColumnsType<any> = tempColumns.map((column) => {
    if (column.key === "userName" || column.key === "name") {
      return {
        ...column,
        render: (userName: string, record: any) => (
          <span
            className="text-blue-500 font-semibold cursor-pointer"
            onClick={() => {
              if (typeof onEdit === "function") onEdit(record);
              if (typeof onSetBlock === "function") {
                const isBlock = record.payments?.isBlockData ?? false;
                onSetBlock(isBlock);
              }
              if (typeof onSetPayments === "function") {
                const payments = record.payments;
                onSetPayments(payments);
              }
            }}
          >
            {userName}
          </span>
        ),
      };
    }
    return column;
  });

  const handleTableChange = (pagination: PaginationProps) => {
    setPagination({
      current: pagination.current || 1,
      pageSize: pagination.pageSize || 15,
    });
    Cookies.set(
      "p_s",
      JSON.stringify([pagination.current, pagination.pageSize])
    );
  };

  useEffect(() => {
    const [current, pageSize] = JSON.parse(Cookies.get("p_s") || "[]");
    setPagination({
      current: current || 1,
      pageSize: pageSize || 15,
    });
  }, []);

  return (
    <div>
      {loading ? (
        <>
          <LoadingSkeleton />
        </>
      ) : (
        <>
          <Table<any>
            rowKey={(item) => item.id}
            bordered
            rowHoverable
            size="small"
            pagination={{
              ...pagination,
              total: data.length,
              showTotal: showTotal,
              showSizeChanger: true,
              position: ["bottomRight"],
              defaultPageSize: 15,
              pageSizeOptions: ["15", "25", "50", "100"],
            }}
            rowSelection={rowSelection}
            columns={columns}
            dataSource={data}
            locale={{
              emptyText: (
                <Empty
                  description={Messages.NO_DATA}
                  className="h-56 flex flex-col justify-center"
                ></Empty>
              ),
            }}
            onChange={handleTableChange}
            className="custom-table-header shadow-md rounded-md"
            rowClassName={(_, index) =>
              index % 2 === 0 ? "bg-sky-50" : "bg-white"
            }
          />
        </>
      )}
    </div>
  );
};

export default TemplateForms;
