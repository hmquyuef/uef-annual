"use client";

import CustomModal from "@/components/CustomModal";
import CustomNotification from "@/components/CustomNotification";
import FormRole from "@/components/forms/roles/formRole";
import {
  deleteRoles,
  getAllRoles,
  getRoleByName,
  postAddRole,
  putUpdateRole,
  RoleItem,
} from "@/services/roles/rolesServices";
import PageTitles from "@/utility/Constraints";
import { convertTimestampToDate } from "@/utility/Utilities";
import {
  ContactsOutlined,
  DeleteOutlined,
  HomeOutlined,
  PlusOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Checkbox,
  Empty,
  PaginationProps,
  Table,
  TableColumnsType,
  Tag,
  Tooltip,
} from "antd";
import { TableRowSelection } from "antd/es/table/interface";
import { Key, useCallback, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const Roles = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [data, setData] = useState<RoleItem[]>([]);
  const [message, setMessage] = useState("");
  const [description, setDescription] = useState("");
  const [selectedItem, setSelectedItem] = useState<
    Partial<RoleItem> | undefined
  >(undefined);
  const [status, setStatus] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
  const [role, setRole] = useState<RoleItem>();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
  });

  const getListRoles = async () => {
    const response = await getAllRoles();
    setData(response.items);
    setNotificationOpen(false);
  };

  const columns: TableColumnsType<RoleItem> = [
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
      title: "VAI TRÒ",
      dataIndex: "name",
      key: "name",
      className: "max-w-24",
      render: (name: string) => (
        <span
          className="text-blue-500 font-medium cursor-pointer"
          onClick={() => {
            setMode("edit");
            setIsOpen(true);
            setSelectedItem(data.find((item) => item.name === name));
          }}
        >
          {name}
        </span>
      ),
    },
    {
      title: "ỨNG DỤNG",
      dataIndex: "appName",
      key: "appName",
      render: (appName: string) => <>{appName}</>,
    },
    {
      title: "XEM",
      dataIndex: ["displayRole", "isRead"],
      key: "isRead",
      render: (isRead: boolean) => <Checkbox checked={isRead}></Checkbox>,
      className: "text-center w-[80px]",
    },
    {
      title: "KHỞI TẠO",
      dataIndex: ["displayRole", "isCreate"],
      key: "isCreate",
      render: (isCreate: boolean) => <Checkbox checked={isCreate}></Checkbox>,
      className: "text-center w-[80px]",
    },
    {
      title: "CẬP NHẬT",
      dataIndex: ["displayRole", "isUpdate"],
      key: "isUpdate",
      render: (isUpdate: boolean) => <Checkbox checked={isUpdate}></Checkbox>,
      className: "text-center w-[80px]",
    },
    {
      title: "XÓA",
      dataIndex: ["displayRole", "isDelete"],
      key: "isDelete",
      render: (isDelete: boolean) => <Checkbox checked={isDelete}></Checkbox>,
      className: "text-center w-[80px]",
    },
    {
      title: "XÁC NHẬN",
      dataIndex: ["displayRole", "isConfirm"],
      key: "isConfirm",
      render: (isConfirm: boolean) => <Checkbox checked={isConfirm}></Checkbox>,
      className: "text-center w-[80px]",
    },
    {
      title: "EXPORT",
      dataIndex: ["displayRole", "isExport"],
      key: "isExport",
      render: (isExport: boolean) => <Checkbox checked={isExport}></Checkbox>,
      className: "text-center w-[80px]",
    },
    {
      title: "IMPORT",
      dataIndex: ["displayRole", "isImport"],
      key: "isImport",
      render: (isImport: boolean) => <Checkbox checked={isImport}></Checkbox>,
      className: "text-center w-[80px]",
    },
    {
      title: "UPLOAD",
      dataIndex: ["displayRole", "isUpload"],
      key: "isUpload",
      render: (isUpload: boolean) => <Checkbox checked={isUpload}></Checkbox>,
      className: "text-center w-[80px]",
    },
    {
      title: "PHÊ DUYỆT",
      dataIndex: ["displayRole", "isApprove"],
      key: "isApprove",
      render: (isApprove: boolean) => <Checkbox checked={isApprove}></Checkbox>,
      className: "text-center w-[80px]",
    },
    {
      title: "TỪ CHỐI",
      dataIndex: ["displayRole", "isReject"],
      key: "isReject",
      render: (isReject: boolean) => <Checkbox checked={isReject}></Checkbox>,
      className: "text-center w-[80px]",
    },
    {
      title: "NGÀY KHỞI TẠO",
      dataIndex: "creationTime",
      key: "creationTime",
      render: (creationTime: number) =>
        creationTime ? convertTimestampToDate(creationTime) : "",
      className: "text-center w-[100px]",
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
      className: "text-center w-[100px]",
    },
  ];

  const onSelectChange = (newSelectedRowKeys: Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection: TableRowSelection<RoleItem> = {
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

  const handleSubmit = async (formData: Partial<RoleItem>) => {
    try {
      if (mode === "edit" && selectedItem) {
        const response = await putUpdateRole(formData.id as string, formData);
        if (response) {
          setDescription("Cập nhật vai trò thành công!");
        }
      } else {
        const response = await postAddRole(formData);
        if (response) {
          setDescription("Thêm mới vai trò thành công!");
        }
      }
      setNotificationOpen(true);
      setStatus("success");
      setMessage("Thông báo");
      await getListRoles();
      setIsOpen(false);
      setSelectedItem(undefined);
      setMode("add");
    } catch (error) {
      setNotificationOpen(true);
      setStatus("error");
      setMessage("Thông báo");
      setDescription("Đã có lỗi xảy ra!");
    }
  };
  const handleDelete = useCallback(async () => {
    try {
      const selectedKeysArray = Array.from(selectedRowKeys) as string[];
      if (selectedKeysArray.length > 0) {
        await deleteRoles(selectedKeysArray);
        setNotificationOpen(true);
        setStatus("success");
        setMessage("Thông báo");
        setDescription(
          `Đã xóa thành công ${selectedKeysArray.length} hoạt động!`
        );
        await getListRoles();
        setSelectedRowKeys([]);
      }
    } catch (error) {
      console.error("Error deleting selected items:", error);
    }
  }, [selectedRowKeys]);
  const getDisplayRole = async (name: string) => {
    const response = await getRoleByName(name);
    setRole(response.items[0]);
  };
  useEffect(() => {
    document.title = PageTitles.ROLES;
    getListRoles();
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
                  <ContactsOutlined />
                  <span>Vai trò</span>
                </>
              ),
            },
          ]}
        />
      </div>
      <div className="flex justify-end gap-4 mb-4">
        {role?.displayRole.isCreate && (
          <>
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
          </>
        )}
        {role?.displayRole.isDelete && (
          <>
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
          </>
        )}
      </div>

      <div>
        <CustomNotification
          message={message}
          description={description}
          status={status}
          isOpen={isNotificationOpen} // Truyền trạng thái mở
        />
        <CustomModal
          isOpen={isOpen}
          width={"25vw"}
          title={mode === "edit" ? "Cập nhật vai trò" : "Thêm mới vai trò"}
          role={role || undefined}
          onOk={() => {
            const formElement = document.querySelector("form");
            formElement?.dispatchEvent(
              new Event("submit", { cancelable: true, bubbles: true })
            );
          }}
          onCancel={() => {
            setNotificationOpen(false);
            setIsOpen(false);
            setSelectedItem(undefined);
            setMode("add");
          }}
          bodyContent={
            <FormRole
              onSubmit={handleSubmit}
              initialData={selectedItem as Partial<RoleItem>}
              mode={mode}
            />
          }
        />
        <Table<RoleItem>
          key={"table-roles"}
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
    </div>
  );
};

export default Roles;
