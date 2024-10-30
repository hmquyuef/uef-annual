"use client";

import {
  getAllLogActivities,
  LogActivityItem,
} from "@/services/history/logActivityServices";
import PageTitles from "@/utility/Constraints";
import { convertTimestampToFullDateTime } from "@/utility/Utilities";
import {
  AuditOutlined,
  HistoryOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Empty,
  PaginationProps,
  Table,
  TableColumnsType
} from "antd";
import { TableRowSelection } from "antd/es/table/interface";
import { Key, useEffect, useState } from "react";
const LogsActivities = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [data, setData] = useState<LogActivityItem[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
  });

  const getListLogActivities = async () => {
    const response = await getAllLogActivities();
    setData(response.items);
  };

  const columns: TableColumnsType<LogActivityItem> = [
    {
      title: <div className="p-2">STT</div>,
      dataIndex: "stt",
      key: "stt",
      render: (_, __, index) => (
        <p>{pagination.pageSize * (pagination.current - 1) + index + 1}</p>
      ),
      className: "text-center w-[20px]",
    },
    {
      title: "MÃ SỐ CB-GV-NV",
      dataIndex: "username",
      key: "username",
      className: "max-w-[20rem]",
      render: (username: string) => (
        <span className="text-blue-500 font-medium cursor-pointer">
          {username}
        </span>
      ),
    },
    {
      title: "CHỨC NĂNG",
      dataIndex: "functionName",
      key: "functionName",
      render: (functionName: string) => <>{functionName}</>,
    },
    {
      title: "PHƯƠNG THỨC",
      dataIndex: "method",
      key: "method",
      render: (method: string) => (
        <>
          {method === "GET" ? (
            <>
              <span className="bg-blue-500 px-2 py-1 text-white">{method}</span>
            </>
          ) : (
            <>
              {method === "POST" ? (
                <>
                  <span className="bg-green-500 text-white">{method}</span>
                </>
              ) : (
                <>
                  {method === "PUT" ? (
                    <>
                      <span className="bg-orange-500 text-white">{method}</span>
                    </>
                  ) : (
                    <>
                      <span className="bg-red-500 text-white">{method}</span>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </>
      ),
      className: "text-center w-[70px]",
    },
    {
      title: "ĐƯỜNG DẪN",
      dataIndex: "path",
      key: "path",
      render: (path: string) => <>{path}</>,
    },
    {
      title: "QUERY",
      dataIndex: "query",
      key: "query",
      render: (query: string) => <>{query}</>,
    },
    {
      title: "REQUEST BODY",
      dataIndex: "requestBody",
      key: "requestBody",
      render: (requestBody: string) => <>{requestBody}</>,
    },
    {
      title: "THỜI GIAN XỬ LÝ",
      dataIndex: "elapsedTime",
      key: "elapsedTime",
      render: (elapsedTime: number) => <>{elapsedTime}ms</>,
      className: "text-center w-[80px]",
    },
    {
      title: "TRẠNG THÁI",
      dataIndex: "statusCode",
      key: "statusCode",
      render: (statusCode: number) => <>{statusCode}</>,
      className: "text-center w-[60px]",
    },
    {
      title: "IP",
      dataIndex: "ip",
      key: "ip",
      render: (requestBody: string) => <>{requestBody}</>,
    },
    {
      title: "NGÀY KHỞI TẠO",
      dataIndex: "creationTime",
      key: "creationTime",
      render: (creationTime: number) =>
        creationTime ? convertTimestampToFullDateTime(creationTime) : "",
      className: "text-center w-[100px]",
    },
  ];

  const onSelectChange = (newSelectedRowKeys: Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection: TableRowSelection<LogActivityItem> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const showTotal: PaginationProps["showTotal"] = (total) => (
    <p className="w-full text-start">
      Đã chọn {selectedRowKeys.length} / {total} dòng dữ liệu
    </p>
  );

  const handleTableChange = (pagination: PaginationProps) => {
    setPagination({
      current: pagination.current || 1,
      pageSize: pagination.pageSize || 15,
    });
  };

  useEffect(() => {
    document.title = PageTitles.LOGS_ACTIVITY;
    getListLogActivities();
  }, []);
  return (
    <div>
      <section className="mb-3">
        <Breadcrumb
          items={[
            {
              href: "",
              title: (
                <>
                  <HomeOutlined />
                  <span>Trang chủ</span>
                </>
              ),
            },
            {
              href: "",
              title: (
                <>
                  <HistoryOutlined />
                  <span>Lịch sử</span>
                </>
              ),
            },
            {
              title: (
                <>
                  <AuditOutlined />
                  <span>Lịch sử hoạt động</span>
                </>
              ),
            },
          ]}
        />
      </section>
      {/* <section className="flex justify-end gap-4 mb-4">
        <Tooltip placement="top" title={"Thêm mới vai trò"} arrow={true}>
          <Button
            type="primary"
            onClick={() => {
              setIsOpen(true);
              setMode("add");
            }}
            icon={<PlusOutlined />}
            iconPosition="start"
          >
            Thêm vai trò
          </Button>
        </Tooltip>
        <Tooltip placement="top" title="Xóa các hoạt động" arrow={true}>
          <Button
            type="dashed"
            disabled={selectedRowKeys.length === 0}
            danger
            onClick={handleDelete}
            icon={<DeleteOutlined />}
            iconPosition="start"
          >
            Xóa
          </Button>
        </Tooltip>
      </section> */}

      <section>
        <Table<LogActivityItem>
          key={"table-activity-bm05"}
          className="custom-table-header shadow-md rounded-md"
          bordered
          rowKey={(item) => item.id}
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
          locale={{ emptyText: <Empty description="No Data"></Empty> }}
          onChange={handleTableChange}
        />
      </section>
    </div>
  );
};
export default LogsActivities;
