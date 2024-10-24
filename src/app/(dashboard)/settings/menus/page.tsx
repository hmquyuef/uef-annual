"use client";

import CustomModal from "@/components/CustomModal";
import CustomNotification from "@/components/CustomNotification";
import FormMenu from "@/components/forms/menus/formMenu";
import {
  AddUpdateMenu,
  AddUpdateMenuItem,
  deleteMenus,
  getAllMenus,
  MenuItem,
  postAddMenu,
  putUpdateMenu,
} from "@/services/menus/menuServices";
import PageTitles from "@/utility/Constraints";
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
  TableProps,
  Tag,
  Tooltip,
} from "antd";
import { Key, useEffect, useState } from "react";
type TableRowSelection<T extends object = object> =
  TableProps<T>["rowSelection"];
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

  const handleEdit = (menu: MenuItem) => {
    const updatedMenu: Partial<AddUpdateMenuItem> = {
      ...menu,
    };
    setSelectedItem(updatedMenu);
    setMode("edit");
    setIsOpen(true);
  };

  const columns: TableColumnsType<MenuItem> = [
    {
      title: <div className="p-2">CHỨC NĂNG</div>,
      dataIndex: "label",
      key: "label",
      className: "max-w-24",
      render: (label: string, record: MenuItem) => (
        <span
          className="text-blue-500 font-medium cursor-pointer"
          onClick={() => {
            setMode("edit");
            handleEdit(record);
          }}
        >
          {label}
        </span>
      ),
    },
    {
      title: "VỊ TRÍ",
      dataIndex: "position",
      key: "position",
      className: "w-[60px]",
      render: (position: string) => <>{position}</>,
    },
    {
      title: "BIỂU TƯỢNG",
      dataIndex: "icon",
      key: "icon",
      className: "text-center w-[100px]",
      render: (icon: string) => {
        const IconComponent = icon ? require(`@ant-design/icons`)[icon] : null;
        return IconComponent ? <IconComponent /> : null;
      },
    },
    {
      title: "ĐƯỜNG DẪN",
      dataIndex: "href",
      key: "href",
      className: "w-[15rem]",
      render: (href: string) => <>{href}</>,
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

  const rowSelection: TableRowSelection<MenuItem> = {
    onChange: onSelectChange,
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

  const handleSubmit = async (formData: Partial<AddUpdateMenu>) => {
    try {
      if (mode === "edit" && selectedItem) {
        const response = await putUpdateMenu(formData.id as string, formData);
        console.log("response :>> ", response);
        if (response) {
         
          setDescription("Cập nhật chức năng thành công!");
        }
      } else {
        const response = await postAddMenu(formData);
        console.log("response :>> ", response);
        if (response) {
          setDescription("Thêm mới chức năng thành công!");
        }
      }
      setNotificationOpen(true);
      setStatus("success");
      setMessage("Thông báo");
      await getListMenus();
      setIsOpen(false);
      setNotificationOpen(false);
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
  const handleDelete = async () => {
    try {
      const selectedKeysArray = Array.from(selectedRowKeys) as string[];
      const idsToDelete = selectedKeysArray
        .map((key) => {
          const menuItem = data.find((item) => item.position === key);
          return menuItem ? menuItem.id : null;
        })
        .filter((id) => id !== null);
      if (idsToDelete.length > 0) {
        await deleteMenus(idsToDelete);
        setNotificationOpen(true);
        setStatus("success");
        setMessage("Thông báo");
        setDescription(`Đã xóa thành công ${idsToDelete.length} chức năng!`);
        await getListMenus();
        setSelectedRowKeys([]);
      }
    } catch (error) {
      console.error("Error deleting selected items:", error);
    }
    setNotificationOpen(false);
  };
  useEffect(() => {
    document.title = PageTitles.MENUS;
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
          <Button
            type="primary"
            onClick={() => {
              setIsOpen(true);
              setMode("add");
            }}
            icon={<PlusOutlined />}
            iconPosition="start"
          >
            Thêm chức năng
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
          width={"50vw"}
          title={mode === "edit" ? "Cập nhật chức năng" : "Thêm mới chức năng"}
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
            <FormMenu
              onSubmit={handleSubmit}
              initialData={selectedItem as Partial<AddUpdateMenu>}
              mode={mode}
            />
          }
        />
        <Table<MenuItem>
          key={"table-menus"}
          className="custom-table-header shadow-md rounded-md"
          bordered
          rowKey={(item) => item.position}
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
          rowSelection={{ ...rowSelection, checkStrictly: false }}
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
