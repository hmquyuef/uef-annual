"use client";

import CustomModal from "@/components/CustomModal";
import CustomNotification from "@/components/CustomNotification";
import FormPermission from "@/components/forms/permissions/formPermission";
import {
  AddUpdateMenuItem,
  deleteMenus,
  getAllMenus,
  MenuItem,
} from "@/services/menus/menuServices";
import { AddUpdatePermissionItem } from "@/services/permissions/permissionServices";
import { convertTimestampToDate } from "@/utility/Utilities";
import {
  ContactsOutlined,
  DeleteOutlined,
  FileExcelOutlined,
  HomeOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Dropdown,
  Empty,
  MenuProps,
  PaginationProps,
  Table,
  TableColumnsType,
  TableProps,
  Tag,
  Tooltip,
} from "antd";
// import { TableRowSelection } from "antd/es/table/interface";
import { Key, useCallback, useEffect, useState } from "react";
type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];
const Menus = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [data, setData] = useState<MenuItem[]>([]);
  const [message, setMessage] = useState("");
  const [description, setDescription] = useState("");
  const [selectedItem, setSelectedItem] = useState<
    Partial<AddUpdateMenuItem> | undefined
  >(undefined);
  const [status, setStatus] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
  });

  const getListMenus = async () => {
    const response = await getAllMenus();
    setData(response.items);
  };

  const columns: TableColumnsType<MenuItem> = [
    // {
    //   title: <div className="p-2">STT</div>,
    //   dataIndex: "stt",
    //   key: "stt",
    //   render: (_, __, index) => (
    //     <></>
    //     // <p>{pagination.pageSize * (pagination.current - 1) + index + 1}</p>
    //   ),
    //   className: "text-center w-[20px]",
    // },
    {
      title: <div className="p-2">CHỨC NĂNG</div>,
      dataIndex: "label",
      key: "label",
      className: "max-w-24",
      render: (label: string) => <>{label}</>,
    },
    {
      title: "VỊ TRÍ",
      dataIndex: "position",
      key: "position",
      className: "text-center w-[60px]",
      render: (position: string) => <>{position}</>,
    },
    {
      title: "BIỂU TƯỢNG",
      dataIndex: "icon",
      key: "icon",
      className: "max-w-24",
      render: (icon: string) => <>{icon}</>,
    },
    {
      title: "ỨNG DỤNG",
      dataIndex: "appName",
      key: "appName",
      render: (appName: string) => <>{appName}</>,
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
  // const rowSelection: TableRowSelection<MenuItem> = {
  //   selectedRowKeys,
  //   onChange: onSelectChange,
  // };
  const rowSelection: TableRowSelection<MenuItem> = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
      console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log(selected, selectedRows, changeRows);
    },
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

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <p
          onClick={() => {
            setIsOpen(true);
            setMode("add");
          }}
          className="font-medium"
        >
          Thêm mới
        </p>
      ),
      icon: <PlusCircleOutlined />,
      style: { color: "#1890ff" },
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: (
        <p
          onClick={() => {
            setIsOpen(true);
            setMode("add");
          }}
          className="font-medium"
        >
          Import Excel
        </p>
      ),
      icon: <FileExcelOutlined />,
      style: { color: "#52c41a" },
    },
  ];
  const handleSubmit = async (formData: Partial<MenuItem>) => {
    console.log("object :>> ", formData);
    // try {
    //   if (mode === "edit" && selectedItem) {
    //     const updatedFormData: Partial<AddUpdateActivityItem> = {
    //       ...formData,
    //       participants: formData.participants as ActivityInput[],
    //     };
    //     const response = await putUpdateActivity(
    //       formData.id as string,
    //       updatedFormData
    //     );
    //     if (response) {
    //       setNotificationOpen(true);
    //       setStatus("success");
    //       setMessage("Thông báo");
    //       setDescription("Cập nhật hoạt động thành công!");
    //     }
    //   } else {
    //     const newFormData: Partial<AddUpdateActivityItem> = {
    //       ...formData,
    //       participants: formData.participants as ActivityInput[],
    //     };
    //     const response = await postAddActivity(newFormData);
    //     if (response) {
    //       setNotificationOpen(true);
    //       setStatus("success");
    //       setMessage("Thông báo");
    //       setDescription("Thêm mới hoạt động thành công!");
    //     }
    //   }
    //   await getListActivities();
    //   setIsOpen(false);
    //   setSelectedItem(undefined);
    //   setMode("add");
    // } catch (error) {
    //   setNotificationOpen(true);
    //   setStatus("error");
    //   setMessage("Thông báo");
    //   setDescription("Đã có lỗi xảy ra!");
    // }
  };
  const handleDelete = useCallback(async () => {
    try {
      const selectedKeysArray = Array.from(selectedRowKeys) as string[];
      if (selectedKeysArray.length > 0) {
        await deleteMenus(selectedKeysArray);
        setNotificationOpen(true);
        setStatus("success");
        setMessage("Thông báo");
        setDescription(
          `Đã xóa thành công ${selectedKeysArray.length} hoạt động!`
        );
        await getListMenus();
        setSelectedRowKeys([]);
      }
    } catch (error) {
      console.error("Error deleting selected items:", error);
    }
  }, [selectedRowKeys]);
  useEffect(() => {
    getListMenus();
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
                  <span>Chức năng</span>
                </>
              ),
            },
          ]}
        />
      </div>
      <div className="flex justify-end gap-4 mb-4">
        <Tooltip placement="top" title={"Thêm mới hoạt động"} arrow={true}>
          <Dropdown menu={{ items }} trigger={["click"]}>
            <a onClick={(e) => e.preventDefault()}>
              <Button type="primary" icon={<PlusOutlined />}>
                Thêm hoạt động
              </Button>
            </a>
          </Dropdown>
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
          isOk={true}
          width={"30vw"}
          title={mode === "edit" ? "Cập nhật vai trò" : "Thêm mới vai trò"}
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
              initialData={selectedItem as Partial<AddUpdatePermissionItem>}
              mode={mode}
            />
          }
        />
        <Table<MenuItem>
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
          rowSelection={{...rowSelection, checkStrictly: true}}
          columns={columns}
          dataSource={data}
          locale={{ emptyText: <Empty description="No Data"></Empty> }}
          onChange={handleTableChange}
        />
      </div>
    </div>
  );
};

export default Menus;
