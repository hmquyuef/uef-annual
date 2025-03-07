"use client";

import CustomNotification from "@/components/CustomNotification";
import TemplateForms from "@/components/forms/workloads/TemplateForms";
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
  GetProps,
  Input,
  Select,
  TableColumnsType,
} from "antd";
import { Key, useCallback, useEffect, useState } from "react";

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

  const [formNotification, setFormNotification] = useState<{
    message: string;
    description: string;
    status: "success" | "error" | "info" | "warning";
    isOpen: boolean;
  }>({
    message: "",
    description: "",
    status: "success",
    isOpen: false,
  });

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
      title: "MÃ SỐ CB-GV-NV",
      dataIndex: "username",
      key: "username",
      className: "max-w-[5rem]",
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
      className: "max-w-[20rem]",
    },
    {
      title: (
        <div>
          PHƯƠNG THỨC <br /> TRUY CẬP
        </div>
      ),
      dataIndex: "method",
      key: "method",
      render: (method: string) => (
        <>
          {method === "GET" ? (
            <div className="bg-blue-500 text-white rounded-md">{method}</div>
          ) : (
            <>
              {method === "POST" ? (
                <div className="bg-green-500 text-white rounded-md">
                  {method}
                </div>
              ) : (
                <>
                  {method === "PUT" ? (
                    <div className="bg-orange-500 text-white rounded-md">
                      {method}
                    </div>
                  ) : (
                    <div className="bg-red-500 text-white rounded-md">
                      {method}
                    </div>
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
      title: (
        <div className="py-1">
          THỜI GIAN <br /> PHẢN HỒI
        </div>
      ),
      dataIndex: "elapsedTime",
      key: "elapsedTime",
      render: (elapsedTime: number) => <>{elapsedTime}ms</>,
      className: "text-center w-[100px]",
    },
    {
      title: "TRẠNG THÁI",
      dataIndex: "statusCode",
      key: "statusCode",
      render: (statusCode: number) => <>{statusCode}</>,
      className: "text-center w-[60px]",
    },
    {
      title: (
        <div>
          ĐỊA CHỈ <br /> TRUY CẬP
        </div>
      ),
      dataIndex: "ip",
      key: "ip",
      render: (requestBody: string) => <>{requestBody}</>,
      className: "text-center w-[120px]",
    },
    {
      title: "NGÀY KHỞI TẠO",
      dataIndex: "creationTime",
      key: "creationTime",
      render: (creationTime: number) =>
        creationTime ? convertTimestampToFullDateTime(creationTime) : "",
      className: "text-center max-w-[3rem]",
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

  const handleDelete = useCallback(async () => {
    try {
      const selectedKeysArray = Array.from(selectedRowKeys) as string[];
      if (selectedKeysArray.length > 0) {
        await deleteLogActivities(selectedKeysArray);
        setFormNotification((prev) => ({
          ...prev,
          isOpen: true,
          status: "success",
          message: "Thông báo",
          description: `Đã xóa thành công ${selectedKeysArray.length} sự kiện logs hoạt động!`,
        }));
      }
    } catch (error) {
      console.error("Error deleting selected items:", error);
    } finally {
      await getDefaultYears();
      setSelectedRowKeys([]);
    }
  }, [selectedRowKeys]);

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
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(
      () => setFormNotification((prev) => ({ ...prev, isOpen: false })),
      100
    );
    return () => clearTimeout(timer);
  }, [formNotification.isOpen]);

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
      <section className="grid grid-cols-3 mb-3 border-b border-neutral-200 pb-3">
        <div className="col-span-2">
          <div className="grid grid-cols-6 gap-4">
            <div className="col-span-2 flex flex-col justify-center gap-1">
              <span className="text-sm text-neutral-500">Tìm kiếm:</span>
              <Search placeholder=" " onSearch={onSearch} enterButton />
            </div>
            <div className="flex flex-col justify-center gap-1">
              <span className="text-sm text-neutral-500">Năm học:</span>
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
          </div>
        </div>
        <div className="flex justify-end items-end gap-4">
          {role?.displayRole.isDelete && role.name === "admin" && (
            <>
              <Button
                color="danger"
                variant="solid"
                disabled={selectedRowKeys.length === 0}
                onClick={handleDelete}
                icon={<DeleteOutlined />}
              >
                Xóa{" "}
                {selectedRowKeys.length !== 0
                  ? `(${selectedRowKeys.length})`
                  : ""}
              </Button>
            </>
          )}
        </div>
      </section>
      <CustomNotification {...formNotification} />
      <TemplateForms
        loading={loading}
        data={data}
        title={columns}
        hideEntryDate={true}
        onEdit={() => {}}
        onSelectionChange={(selectedRowKeys) =>
          setSelectedRowKeys(selectedRowKeys)
        }
      />
    </div>
  );
};
export default LogsActivities;
