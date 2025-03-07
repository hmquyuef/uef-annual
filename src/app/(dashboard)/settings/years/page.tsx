"use client";

import CustomModal from "@/components/CustomModal";
import CustomNotification from "@/components/CustomNotification";
import FormSchoolYear from "@/components/schoolYears/FormSchoolYear";
import { getRoleByName, RoleItem } from "@/services/roles/rolesServices";
import {
  deleteSchoolYears,
  getAllSchoolYears,
  postSchoolYear,
  putSchoolYear,
  SchoolYearsResponses,
} from "@/services/schoolYears/schoolYearsServices";
import PageTitles from "@/utility/Constraints";
import Messages from "@/utility/Messages";
import { convertTimestampToDate } from "@/utility/Utilities";
import {
  CheckOutlined,
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
} from "antd";
import { TableRowSelection } from "antd/es/table/interface";
import { Key, useCallback, useEffect, useState } from "react";

const SchoolYear = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [schoolYears, setSchoolYears] = useState<
    SchoolYearsResponses | undefined
  >(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [description, setDescription] = useState("");
  const [selectedItem, setSelectedItem] = useState<Partial<any> | undefined>(
    undefined
  );
  const [role, setRole] = useState<RoleItem>();
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
      title: "NĂM HỌC",
      dataIndex: "title",
      key: "title",
      className: "max-w-24",
      render: (title: string) => (
        <span
          className="text-blue-500 font-medium cursor-pointer"
          onClick={() => {
            setMode("edit");
            setIsOpen(true);
            setSelectedItem(
              schoolYears?.items.find((item: any) => item.title === title)
            );
          }}
        >
          {title}
        </span>
      ),
    },
    {
      title: "TỪ NGÀY",
      dataIndex: "startDate",
      key: "startDate",
      render: (startDate: number) =>
        startDate ? convertTimestampToDate(startDate) : "",
      className: "text-center w-[100px]",
    },
    {
      title: "ĐẾN NGÀY",
      dataIndex: "endDate",
      key: "endDate",
      render: (endDate: number) =>
        endDate ? convertTimestampToDate(endDate) : "",
      className: "text-center w-[100px]",
    },
    {
      title: (
        <div className="py-1">
          THIẾT LẬP <br /> MẶC ĐỊNH
        </div>
      ),
      dataIndex: "isDefault",
      key: "isDefault",
      render: (isDefault: boolean) => {
        return (
          <>
            {isDefault && (
              <>
                <span className="text-green-600">
                  <CheckOutlined />
                </span>
              </>
            )}
          </>
        );
      },
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
    {
      title: "MÔ TẢ",
      dataIndex: "description",
      key: "description",
      render: (description: string) => <span>{description}</span>,
      className: "m-w-24",
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

  const getSchoolYears = async () => {
    const response = await getAllSchoolYears();
    setSchoolYears(response);
    setNotificationOpen(false);
  };

  const handleSubmit = async (formData: Partial<any>) => {
    try {
      if (mode === "edit" && selectedItem) {
        const response = await putSchoolYear(formData.id as string, formData);
        if (response) {
          setDescription(Messages.UPDATE_SCHOOLYEARS);
        }
      } else {
        const response = await postSchoolYear(formData);
        if (response) {
          setDescription(Messages.ADD_SCHOOLYEARS);
        }
      }
      setNotificationOpen(true);
      setStatus("success");
      setMessage("Thông báo");
      await getSchoolYears();
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
        await deleteSchoolYears(selectedKeysArray);
        setNotificationOpen(true);
        setStatus("success");
        setMessage("Thông báo");
        setDescription(
          `Đã xóa thành công ${selectedKeysArray.length} thời gian năm học!`
        );
        await getSchoolYears();
        setSelectedRowKeys([]);
      }
    } catch (error) {
      console.error("Error deleting selected items:", error);
    }
  }, [selectedRowKeys]);

  const getDisplayRole = async () => {
    if (typeof window !== "undefined") {
      const s_role = localStorage.getItem("s_role");
      const response = await getRoleByName(s_role as string);
      setRole(response.items[0]);
    }
  };

  useEffect(() => {
    document.title = PageTitles.SCHOOL_YEARS;
    getSchoolYears();
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
                  <span>Thời gian năm học</span>
                </>
              ),
            },
          ]}
        />
      </div>
      <div className="flex justify-end gap-4 mb-3 border-b border-neutral-300 pb-3">
        {role?.displayRole.isCreate && (
          <>
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
          </>
        )}
        {role?.displayRole.isDelete && (
          <>
            <Button
              color="danger"
              variant="solid"
              disabled={selectedRowKeys.length === 0}
              onClick={handleDelete}
              icon={<DeleteOutlined />}
              iconPosition="start"
            >
              Xóa
            </Button>
          </>
        )}
      </div>
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
            ? "Cập nhật thời gian năm học"
            : "Thêm mới thời gian năm học"
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
          <FormSchoolYear
            onSubmit={handleSubmit}
            initialData={selectedItem as Partial<RoleItem>}
            mode={mode}
          />
        }
      />
      <Table<any>
        key={"table-school-years"}
        className="custom-table-header shadow-md rounded-md"
        bordered
        rowKey={(item) => item.id}
        rowHoverable
        size="small"
        pagination={{
          ...pagination,
          total: schoolYears?.totalCount,
          showTotal: showTotal,
          showSizeChanger: true,
          position: ["bottomRight"],
          defaultPageSize: 15,
          pageSizeOptions: ["15", "25", "50", "100"],
        }}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={schoolYears?.items}
        locale={{ emptyText: <Empty description="No Data"></Empty> }}
        onChange={handleTableChange}
        rowClassName={(_, index) =>
          index % 2 === 0 ? "bg-sky-50" : "bg-white"
        }
      />
    </div>
  );
};

export default SchoolYear;
