"use client";

import CustomModal from "@/components/CustomModal";
import CustomNotification from "@/components/CustomNotification";
import FormPermission from "@/components/forms/permissions/formPermission";
import {
  deletePermissionsForMenu,
  getAllPermissionsForMenu,
  PermissionForMenuResponses,
} from "@/services/permissions/permissionForMenu";
import {
  AddUpdatePermissionItem,
  deletePermissions,
  getAllPermissions,
  PermissionItem,
  postAddPermission,
  putUpdatePermission,
} from "@/services/permissions/permissionServices";
import { getRoleByName, RoleItem } from "@/services/roles/rolesServices";
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
  Empty,
  PaginationProps,
  Table,
  TableColumnsType,
  Tag,
  Tooltip,
} from "antd";
import { TableRowSelection } from "antd/es/table/interface";
import { Key, useCallback, useEffect, useState } from "react";

const Permissions = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [data, setData] = useState<PermissionItem[]>([]);
  const [dataForMenu, setDataForMenu] = useState<
    PermissionForMenuResponses | undefined
  >(undefined);
  const [message, setMessage] = useState("");
  const [description, setDescription] = useState("");
  const [selectedItem, setSelectedItem] = useState<
    Partial<AddUpdatePermissionItem> | undefined
  >(undefined);
  const [status, setStatus] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
  const [role, setRole] = useState<RoleItem>();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
  });

  const color = [
    "magenta",
    "red",
    "volcano",
    "orange",
    "gold",
    "lime",
    "green",
    "cyan",
    "blue",
    "geekblue",
    "purple",
  ];
  const getListPermissions = async () => {
    const response = await getAllPermissions();
    setData(response.items);
  };

  const getListPermissionsForMenu = async () => {
    const response = await getAllPermissionsForMenu();
    setDataForMenu(response);
    setNotificationOpen(false);
  };

  const columns: TableColumnsType<PermissionItem> = [
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
      dataIndex: "userName",
      key: "userName",
      className: "max-w-24",
      render: (userName: string) => (
        <span
          className="text-blue-500 font-medium cursor-pointer"
          onClick={() => {
            setMode("edit");
            setIsOpen(true);
            setSelectedItem(data.find((item) => item.userName === userName));
          }}
        >
          {userName}
        </span>
      ),
    },
    {
      title: "HỌ VÀ TÊN",
      dataIndex: "fullName",
      key: "fullName",
      className: "max-w-24",
      render: (fullName: string) => <>{fullName}</>,
    },
    {
      title: "QUYỀN CHỨC NĂNG",
      dataIndex: ["roles", "appName"],
      key: "name",
      render: (name: string, record: PermissionItem) => {
        const roles = record.roles.map((role) => role.name).join(", ");
        return <>{roles}</>;
      },
    },
    {
      title: "QUYỀN ỨNG DỤNG",
      dataIndex: "roleMenus",
      key: "roleMenus",
      render: (roleMenus: string, record: PermissionItem) => {
        const userName = record.userName;
        const menus =
          dataForMenu?.items.find((item) => item.userName === userName)
            ?.permissions ?? [];
        return (
          <>
            {menus &&
              menus.map((menu) => (
                <Tag
                  key={menu.position}
                  color={color[Math.floor(Math.random() * color.length)]}
                >
                  {menu.position}. {menu.label}
                  {menu.isChildren && ` (${menu.children.length})`}
                </Tag>
              ))}
          </>
        );
      },
      className: "max-w-[15rem] text-center",
    },
    {
      title: "NGÀY KHỞI TẠO",
      dataIndex: "creationTime",
      key: "creationTime",
      render: (creationTime: number) =>
        creationTime ? convertTimestampToDate(creationTime) : "",
      className: "text-center w-[120px]",
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
  const rowSelection: TableRowSelection<PermissionItem> = {
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

  const handleSubmit = async (formData: Partial<any>) => {
    try {
      if (mode === "edit" && selectedItem) {
        const response = await putUpdatePermission(
          formData.id as string,
          formData
        );
        if (response) {
          setDescription("Cập nhật phân quyền thành công!");
        }
      } else {
        const response = await postAddPermission(formData);
        if (response) {
          setDescription("Thêm mới phân quyền thành công!");
        }
      }
      setNotificationOpen(true);
      setStatus("success");
      setMessage("Thông báo");
      await fetchData();
      setIsOpen(false);
      setSelectedItem(undefined);
      setMode("add");
    } catch (error) {
      setNotificationOpen(true);
      setStatus("error");
      setMessage("Thông báo");
      setDescription("Đã có lỗi xảy ra!");
    }
    setNotificationOpen(false);
  };
  const handleDelete = useCallback(async () => {
    try {
      const selectedKeysArray = Array.from(selectedRowKeys) as string[];

      const selectedUserNames = data
        .filter((item) => selectedRowKeys.includes(item.id))
        .map((item) => item.userName);

      if (selectedKeysArray.length > 0) {
        await Promise.all([
          deletePermissions(selectedKeysArray),
          deletePermissionsForMenu(selectedUserNames),
        ]);
        setNotificationOpen(true);
        setStatus("success");
        setMessage("Thông báo");
        setDescription(
          `Đã xóa thành công ${selectedKeysArray.length} phân quyền ứng dụng!`
        );
        await fetchData();
        setSelectedRowKeys([]);
      }
    } catch (error) {
      console.error("Error deleting selected items:", error);
    }
    setNotificationOpen(false);
  }, [selectedRowKeys]);

  const fetchData = async () => {
    await Promise.all([getListPermissions(), getListPermissionsForMenu()]);
  };
  const getDisplayRole = async () => {
    if (typeof window !== "undefined") {
      const s_role = localStorage.getItem("s_role");
      const response = await getRoleByName(s_role as string);
      setRole(response.items[0]);
    }
  };
  useEffect(() => {
    document.title = PageTitles.PERMISSIONS;
    fetchData();
    getDisplayRole();
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
                  <span>Phân quyền</span>
                </>
              ),
            },
          ]}
        />
      </div>
      <div className="flex justify-end gap-4 mb-4">
        {role?.displayRole.isCreate && (
          <>
            <Tooltip placement="top" title={"Thêm mới phân quyền"} arrow={true}>
              <Button
                type="primary"
                onClick={() => {
                  setIsOpen(true);
                  setMode("add");
                }}
                icon={<PlusOutlined />}
                iconPosition="start"
              >
                Thêm phân quyền
              </Button>
            </Tooltip>
          </>
        )}

        {role?.displayRole.isCreate && (
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
          width={"40vw"}
          title={
            mode === "edit" ? "Cập nhật phân quyền" : "Thêm mới phân quyền"
          }
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
            <FormPermission
              onSubmit={handleSubmit}
              initialData={selectedItem as Partial<PermissionItem>}
              mode={mode}
            />
          }
        />
        <Table<PermissionItem>
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
    </div>
  );
};

export default Permissions;
