"use client";

import CustomNotification from "@/components/CustomNotification";
import {
  ApplicationItem,
  getAllApplications,
} from "@/services/applications/applicationServices";
import PageTitles from "@/utility/Constraints";
import { convertTimestampToDate } from "@/utility/Utilities";
import {
  AppstoreOutlined,
  HomeOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Empty,
  PaginationProps,
  Table,
  TableColumnsType,
  Tag,
} from "antd";
import { TableRowSelection } from "antd/es/table/interface";
import { Key, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { getRoleByName, RoleItem } from "@/services/roles/rolesServices";

const Applications = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [data, setData] = useState<ApplicationItem[]>([]);
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
  const [role, setRole] = useState<RoleItem>();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
  });

  const getListApplications = async () => {
    const response = await getAllApplications();
    setData(response.items);
  };
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setNotificationOpen(true);
        setStatus("success");
        setMessage("Thông báo");
        setDescription("Sao chép thông tin thành công!");
      },
      (err) => {
        setNotificationOpen(true);
        setStatus("error");
        setMessage("Thông báo");
        setDescription("Sao chép thông tin thành công!");
        console.error("Lỗi sao chép:", err);
      }
    );
    setNotificationOpen(false);
  };
  const columns: TableColumnsType<ApplicationItem> = [
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
      title: "TÊN ỨNG DỤNG",
      dataIndex: "name",
      key: "name",
      className: "max-w-24",
      render: (name: string) => <>{name}</>,
    },
    {
      title: "MÔ TẢ",
      dataIndex: "description",
      key: "description",
      render: (description: string) => <>{description}</>,
    },
    {
      title: "KHÓA CÔNG KHAI",
      dataIndex: "publicKey",
      key: "publicKey",
      render: (publicKey: string) => (
        <div
          className="text-center w-[20rem] bg-gray-200 rounded-md p-1 whitespace-nowrap overflow-hidden text-ellipsis"
          onClick={() => handleCopy(publicKey)}
        >
          {publicKey}
        </div>
      ),
      className: "text-center w-[20rem]",
    },
    {
      title: "KHÓA BÍ MẬT",
      dataIndex: "secretKey",
      key: "secretKey",
      render: (secretKey: string) => (
        <div
          className="text-center w-[20rem] bg-gray-200 rounded-md p-1 whitespace-nowrap overflow-hidden text-ellipsis"
          title={secretKey}
          onClick={() => handleCopy(secretKey)}
        >
          {secretKey}
        </div>
      ),
      className: "text-center w-[20rem]",
    },
    {
      title: "NGÀY KHỞI TẠO",
      dataIndex: "creationTime",
      key: "creationTime",
      render: (creationTime: number) =>
        creationTime ? convertTimestampToDate(creationTime) : "",
      className: "text-center w-[10rem]",
    },
    {
      title: "TRẠNG THÁI",
      dataIndex: "isActived",
      key: "isActived",
      render: (isActived: boolean) => {
        return (
          <>
            {isActived ? (
              <>
                <Tag color={"blue"}>Đã kích hoạt</Tag>
              </>
            ) : (
              <>
                <Tag color={"error"}>Tạm khóa</Tag>
              </>
            )}
          </>
        );
      },
      className: "text-center w-[10rem]",
    },
  ];

  const onSelectChange = (newSelectedRowKeys: Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection: TableRowSelection<ApplicationItem> = {
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
  const getDisplayRole = async (name: string) => {
    const response = await getRoleByName(name);
    setRole(response.items[0]);
  };
  useEffect(() => {
    document.title = PageTitles.APPLICATIONS;
    getListApplications();
    const token = Cookies.get("s_t");
    if (token) {
      const decodedRole = jwtDecode<{
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
      }>(token);
      const role =
        decodedRole[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];
      getDisplayRole(role as string);
    }
  }, []);

  return (
    <div>
      <div className="mb-3">
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
                  <SettingOutlined />
                  <span>Cài đặt</span>
                </>
              ),
            },
            {
              title: (
                <>
                  <AppstoreOutlined />
                  <span>Ứng dụng</span>
                </>
              ),
            },
          ]}
        />
      </div>
      <CustomNotification
        message={message}
        description={description}
        status={status}
        isOpen={isNotificationOpen}
      />
      {role?.displayRole.isRead ? (
        <>
          <div>
            <Table<ApplicationItem>
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
          </div>
        </>
      ) : (
        <>
          <div className="text-center text-red-500">
            <div className="flex flex-col">
              <span className="font-medium text-xl">
                Bạn chưa được cấp quyền để khai thác nội dung!
              </span>
              <span>
                Vui lòng liên hệ Trung Tâm QLCNTT để được cấp quyền. Xin cảm on!
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Applications;
