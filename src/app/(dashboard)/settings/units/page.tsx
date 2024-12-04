"use client";

import PageTitles from "@/utility/Constraints";
import {
  CheckOutlined,
  DeleteOutlined,
  GoldOutlined,
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
import { Key, useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { getRoleByName, RoleItem } from "@/services/roles/rolesServices";
import {
  deleteUnits,
  getAllUnits,
  postUnit,
  putUnit,
  UnitsResponse,
} from "@/services/units/unitsServices";
import { convertTimestampToDate } from "@/utility/Utilities";
import { TableRowSelection } from "antd/es/table/interface";
import CustomNotification from "@/components/CustomNotification";
import CustomModal from "@/components/CustomModal";
import FormUnit from "@/components/forms/units/formUnit";
import Messages from "@/utility/Messages";

const Units = () => {
  const [role, setRole] = useState<RoleItem>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [units, setUnits] = useState<UnitsResponse | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [description, setDescription] = useState("");
  const [selectedItem, setSelectedItem] = useState<Partial<any> | undefined>(
    undefined
  );
  const [status, setStatus] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
  });

  const columns: TableColumnsType<any> = [
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
      title: "ĐƠN VỊ",
      dataIndex: "name",
      key: "name",
      className: "max-w-24",
      render: (name: string, record: any) => (
        <span
          className="text-blue-500 font-medium cursor-pointer"
          onClick={() => {
            setMode("edit");
            setIsOpen(true);
            setSelectedItem(
              units?.items.find((item: any) => item.idHrm === record.idHrm)
            );
          }}
        >
          {name}
        </span>
      ),
    },
    {
      title: "MÃ ĐƠN VỊ",
      dataIndex: "code",
      key: "code",
      render: (code: string) => <>{code}</>,
      className: "text-center max-w-8",
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
    {
      title: "MÔ TẢ",
      dataIndex: "description",
      key: "description",
      render: (description: string) => <span>{description}</span>,
      className: "max-w-24",
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

  const handleSubmit = async (formData: Partial<any>) => {
    try {
      if (mode === "edit" && selectedItem) {
        const response = await putUnit(formData.id as string, formData);
        if (response) {
          setDescription(Messages.UPDATE_UNITS);
        }
      } else {
        const response = await postUnit(formData);
        if (response) {
          setDescription(Messages.ADD_UNITS);
        }
      }
      setNotificationOpen(true);
      setStatus("success");
      setMessage("Thông báo");
      await getListUnits();
      setIsOpen(false);
      setSelectedItem(undefined);
      setMode("add");
    } catch (error) {
      setNotificationOpen(true);
      setStatus("error");
      setMessage("Thông báo");
      setDescription(Messages.ERROR);
    }
  };

  const handleDelete = useCallback(async () => {
    try {
      const selectedKeysArray = Array.from(selectedRowKeys) as string[];
      if (selectedKeysArray.length > 0) {
        await deleteUnits(selectedKeysArray);
        setNotificationOpen(true);
        setStatus("success");
        setMessage("Thông báo");
        setDescription(`Đã xóa thành công ${selectedKeysArray.length} đơn vị!`);
        await getListUnits();
        setSelectedRowKeys([]);
      }
    } catch (error) {
      console.error("Error deleting selected items:", error);
    }
  }, [selectedRowKeys]);

  const getListUnits = async () => {
    const response = await getAllUnits();
    setUnits(response);
    setNotificationOpen(false);
  };

  const getDisplayRole = async (name: string) => {
    const response = await getRoleByName(name);
    setRole(response.items[0]);
  };

  useEffect(() => {
    document.title = PageTitles.UNITS;
    getListUnits();
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
                  <GoldOutlined />
                  <span>Đơn vị</span>
                </>
              ),
            },
          ]}
        />
      </div>
      <div className="flex justify-end gap-4 mb-4">
        {role?.displayRole.isCreate && (
          <>
            <Tooltip
              placement="top"
              title={Messages.TITLE_ADD_UNITS}
              arrow={true}
            >
              <Button
                type="primary"
                onClick={() => {
                  setIsOpen(true);
                  setMode("add");
                }}
                icon={<PlusOutlined />}
                iconPosition="start"
              >
                Thêm đơn vị
              </Button>
            </Tooltip>
          </>
        )}
        {role?.displayRole.isDelete && (
          <>
            <Tooltip
              placement="top"
              title={Messages.TITLE_DELETE_UNITS}
              arrow={true}
            >
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
          title={
            mode === "edit"
              ? Messages.TITLE_UPDATE_UNITS
              : Messages.TITLE_ADD_UNITS
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
            <FormUnit
              onSubmit={handleSubmit}
              initialData={selectedItem as Partial<RoleItem>}
              mode={mode}
            />
          }
        />
        <Table<any>
          key={"table-units"}
          className="custom-table-header shadow-md rounded-md"
          bordered
          rowKey={(item) => item.id}
          rowHoverable
          size="small"
          pagination={{
            ...pagination,
            total: units?.totalCount,
            showTotal: showTotal,
            showSizeChanger: true,
            position: ["bottomRight"],
            defaultPageSize: 15,
            pageSizeOptions: ["15", "25", "50", "100"],
          }}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={units?.items.sort((a: any, b: any) => a.name.localeCompare(b.name))}
          locale={{ emptyText: <Empty description={Messages.NO_DATA}></Empty> }}
          onChange={handleTableChange}
        />
      </div>
    </div>
  );
};

export default Units;
