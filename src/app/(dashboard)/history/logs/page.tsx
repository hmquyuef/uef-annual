"use client";

import CustomNotification from "@/components/CustomNotification";
import {
  deleteLogActivities,
  getAllLogActivities,
  LogActivityItem,
  LogActivityResponses,
} from "@/services/history/logActivityServices";
import { getRoleByName, RoleItem } from "@/services/roles/rolesServices";
import { getAllSchoolYears } from "@/services/schoolYears/schoolYearsServices";
import PageTitles from "@/utility/Constraints";
import { convertTimestampToFullDateTime } from "@/utility/Utilities";
import {
  AuditOutlined,
  DeleteOutlined,
  HistoryOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Empty,
  GetProps,
  Input,
  PaginationProps,
  Select,
  Skeleton,
  Table,
  TableColumnsType,
  Tooltip,
} from "antd";
import { TableRowSelection } from "antd/es/table/interface";
import { Key, useCallback, useEffect, useState } from "react";
import { allExpanded, darkStyles, JsonView } from "react-json-view-lite";
import "react-json-view-lite/dist/index.css";

type SearchProps = GetProps<typeof Input.Search>;
const { Search } = Input;

const LogsActivities = () => {
  const [loading, setLoading] = useState(false);
  const [defaultYears, setDefaultYears] = useState<any>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [data, setData] = useState<LogActivityItem[]>([]);
  const [logActivities, setLogActivities] = useState<
    LogActivityResponses | undefined
  >(undefined);
  const [role, setRole] = useState<RoleItem>();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
  });
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
  const [selectedKey, setSelectedKey] = useState<any>();

  const getDefaultYears = async () => {
    const response = await getAllSchoolYears();
    setDefaultYears(response.items);
    const yearId = response.items.filter((x: any) => x.isDefault)[0] as any;
    setSelectedKey(yearId);
    getListLogActivities(yearId.id);
  };

  const getListLogActivities = async (yearId: string) => {
    const response = await getAllLogActivities(yearId);
    setLogActivities(response);
    setData(response.items);
  };

  const columns: TableColumnsType<LogActivityItem> = [
    {
      title: <div className="p-2">STT</div>,
      dataIndex: "stt",
      key: "stt",
      render: (_, __, index) => (
        <>{pagination.pageSize * (pagination.current - 1) + index + 1}</>
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
      className: "w-[20rem]",
    },
    {
      title: "PHƯƠNG THỨC",
      dataIndex: "method",
      key: "method",
      render: (method: string) => (
        <>
          {method === "GET" ? (
            <>
              <span className="bg-blue-500 px-2 py-1 text-white rounded-md">
                {method}
              </span>
            </>
          ) : (
            <>
              {method === "POST" ? (
                <>
                  <span className="bg-green-500 px-2 py-1 text-white rounded-md">
                    {method}
                  </span>
                </>
              ) : (
                <>
                  {method === "PUT" ? (
                    <>
                      <span className="bg-orange-500 px-2 py-1 text-white rounded-md">
                        {method}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="bg-red-500 px-2 py-1 text-white rounded-md">
                        {method}
                      </span>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </>
      ),
      className: "text-center w-[100px]",
    },
    {
      title: "ĐƯỜNG DẪN",
      dataIndex: "path",
      key: "path",
      render: (path: string) => (
        <>
          <>
            <Tooltip title={path} placement="bottomLeft">
              {path}
            </Tooltip>
          </>
        </>
      ),
      className:
        "max-w-[10rem] whitespace-nowrap overflow-hidden text-ellipsis",
    },
    {
      title: "QUERY",
      dataIndex: "query",
      key: "query",
      render: (query: string) => (
        <>
          <Tooltip
            title={
              <JsonView
                data={query}
                shouldExpandNode={allExpanded}
                style={darkStyles}
              />
            }
            placement="bottomLeft"
          >
            {query}
          </Tooltip>
        </>
      ),
      className:
        "max-w-[15rem] whitespace-nowrap overflow-hidden text-ellipsis",
    },
    {
      title: "REQUEST BODY",
      dataIndex: "requestBody",
      key: "requestBody",
      render: (requestBody: string) => (
        <Tooltip
          title={
            <JsonView
              data={requestBody}
              shouldExpandNode={allExpanded}
              style={darkStyles}
            />
          }
          placement="bottomLeft"
        >
          {requestBody}
        </Tooltip>
      ),
      className:
        "max-w-[15rem] whitespace-nowrap overflow-hidden text-ellipsis",
    },
    {
      title: <div className="py-1">THỜI GIAN XỬ LÝ</div>,
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
      title: "ĐỊA CHỈ IP",
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
      className: "text-center w-[110px]",
    },
  ];

  const onSearch: SearchProps["onSearch"] = (value) => {
    if (value === "") setData(logActivities?.items || []);
    const filteredData = logActivities?.items.filter((item) => {
      const matchesName =
        item.username.toLowerCase().includes(value.toLowerCase()) ||
        item.functionName.toLowerCase().includes(value.toLowerCase());
      return matchesName;
    });
    setData(filteredData || []);
  };

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

  const handleDelete = useCallback(async () => {
    try {
      const selectedKeysArray = Array.from(selectedRowKeys) as string[];
      if (selectedKeysArray.length > 0) {
        await deleteLogActivities(selectedKeysArray);
        setDescription(
          `Đã xóa thành công ${selectedKeysArray.length} sự kiện logs hoạt động!`
        );
        setNotificationOpen(true);
        setStatus("success");
        setMessage("Thông báo");
        await getDefaultYears();
        setSelectedRowKeys([]);
      }
    } catch (error) {
      console.error("Error deleting selected items:", error);
    }
  }, [selectedRowKeys]);

  const handleTableChange = (pagination: PaginationProps) => {
    setPagination({
      current: pagination.current || 1,
      pageSize: pagination.pageSize || 15,
    });
  };

  const getDisplayRole = async () => {
    if (typeof window !== "undefined") {
      const s_role = localStorage.getItem("s_role");
      const response = await getRoleByName(s_role as string);
      setRole(response.items[0]);
    }
  };

  const handleChangeYear = (value: any) => {
    setLoading(true);
    const temp = defaultYears.filter((x: any) => x.id === value)[0] as any;
    setSelectedKey(temp);
    getListLogActivities(temp.id);
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timeoutId);
  };

  useEffect(() => {
    setLoading(true);
    document.title = PageTitles.LOGS_ACTIVITY;
    getDefaultYears();
    getDisplayRole();
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timeoutId);
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
      <section className="grid grid-cols-3 mb-3">
        <div className="col-span-2">
          <div className="grid grid-cols-4 gap-4">
            {loading ? (
              <>
                <Skeleton.Input active size="small" style={{ width: "100%" }} />
                <Skeleton.Input active size="small" style={{ width: "100%" }} />
                <Skeleton.Input active size="small" style={{ width: "100%" }} />
              </>
            ) : (
              <>
                <div className="flex flex-col justify-center gap-1">
                  <span className="text-[14px] font-medium text-neutral-500">
                    Tìm kiếm:
                  </span>
                  <Search placeholder=" " onSearch={onSearch} enterButton />
                </div>
                <div className="flex flex-col justify-center gap-1">
                  <span className="text-[14px] font-medium text-neutral-500">
                    Năm học:
                  </span>
                  <Select
                    showSearch
                    optionFilterProp="label"
                    filterSort={(optionA, optionB) =>
                      (optionA?.title ?? "").localeCompare(optionB?.title ?? "")
                    }
                    options={defaultYears?.map((year: any) => ({
                      value: year.id,
                      label: year.title,
                    }))}
                    //
                    value={selectedKey && selectedKey.title}
                    onChange={(value) => handleChangeYear(value)}
                    className="w-fit"
                  />
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex justify-end items-end gap-4">
          {loading ? (
            <>
              <Skeleton.Input active size="small" />
              <Skeleton.Input active size="small" />
              <Skeleton.Input active size="small" />
            </>
          ) : (
            <>
              {role?.displayRole.isDelete && role.name === "admin" && (
                <>
                  <Tooltip
                    placement="top"
                    title="Xóa các hoạt động"
                    arrow={true}
                  >
                    <Button
                      type="dashed"
                      disabled={selectedRowKeys.length === 0}
                      danger
                      onClick={handleDelete}
                      icon={<DeleteOutlined />}
                    >
                      Xóa{" "}
                      {selectedRowKeys.length !== 0
                        ? `(${selectedRowKeys.length})`
                        : ""}
                    </Button>
                  </Tooltip>
                </>
              )}
            </>
          )}
        </div>
      </section>
      <CustomNotification
        message={message}
        description={description}
        status={status}
        isOpen={isNotificationOpen}
      />
      <hr className="mb-3" />
      <section>
        <Table<LogActivityItem>
          key={"table-logs-history"}
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
          locale={{
            emptyText: <Empty description="Không có dữ liệu..."></Empty>,
          }}
          onChange={handleTableChange}
        />
      </section>
    </div>
  );
};
export default LogsActivities;
