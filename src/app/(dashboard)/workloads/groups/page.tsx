"use client";

import CustomModal from "@/components/CustomModal";
import CustomNotification from "@/components/CustomNotification";
import FormWorkloadGroup from "@/components/forms/workloads/formWorkloadGroup";
import { getRoleByName, RoleItem } from "@/services/roles/rolesServices";
import {
  deleteWorkloadGroup,
  getWorkloadGroups,
  postAddWorkloadGroup,
  putUpdateWorkloadGroup,
  WorkloadGroupItem,
} from "@/services/workloads/groupsServices";
import PageTitles from "@/utility/Constraints";
import Messages from "@/utility/Messages";
import { convertTimestampToDate } from "@/utility/Utilities";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  FileDoneOutlined,
  HomeOutlined,
  PlusOutlined
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Empty,
  GetProps,
  Input,
  PaginationProps,
  Table,
  TableColumnsType,
  Tag,
  Tooltip
} from "antd";
import { TableRowSelection } from "antd/es/table/interface";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { Key, useCallback, useEffect, useState } from "react";
type SearchProps = GetProps<typeof Input.Search>;

const WorkloadGroups = () => {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<RoleItem>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [data, setData] = useState<WorkloadGroupItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isUpload, setIsUpload] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Partial<any> | undefined>(
    undefined
  );
  const [message, setMessage] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
  });

  const columns: TableColumnsType<WorkloadGroupItem> = [
    {
      title: "NHÓM BIỂU MẪU",
      dataIndex: "name",
      key: "name",
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
      title: "MÔ TẢ",
      dataIndex: "description",
      key: "description",
      className: "max-w-32",
    },
    {
      title: (
        <div className="py-1">
          THỜI GIAN <br /> KHỞI TẠO
        </div>
      ),
      dataIndex: "creationTime",
      key: "creationTime",
      render: (timestamp: number) => convertTimestampToDate(timestamp),
      className: "text-center w-32",
    },
    {
      title: "TRẠNG THÁI",
      dataIndex: "isActived",
      key: "isActived",
      render: (isActived: boolean) => (
        <Tag
          bordered={false}
          color={isActived ? "success" : "magenta"}
          icon={isActived ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
        >
          {isActived ? "Đã kích hoạt" : "Chưa kích hoạt"}
        </Tag>
      ),
      className: "text-center max-w-8",
    },
  ];

  const getListWorkloadGroup = async () => {
    const response = await getWorkloadGroups();
    setData(response.items);
    setNotificationOpen(false);
  };

  const onSelectChange = (newSelectedRowKeys: Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection: TableRowSelection<WorkloadGroupItem> = {
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
        await deleteWorkloadGroup(selectedKeysArray);
        setNotificationOpen(true);
        setStatus("success");
        setMessage("Thông báo");
        setDescription(
          `Đã xóa thành công ${selectedKeysArray.length} hoạt động!`
        );
        await getListWorkloadGroup();
        setSelectedRowKeys([]);
      }
    } catch (error) {
      console.error("Error deleting selected items:", error);
    }
  }, [selectedRowKeys]);

  const handleSubmit = async (formData: Partial<RoleItem>) => {
    try {
      if (mode === "edit" && selectedItem) {
        const response = await putUpdateWorkloadGroup(
          formData.id as string,
          formData
        );
        if (response) {
          setDescription("Cập nhật nhóm biểu mẫu thành công!");
        }
      } else {
        const response = await postAddWorkloadGroup(formData);
        if (response) {
          setDescription("Thêm mới nhóm biểu mẫu thành công!");
        }
      }
      setNotificationOpen(true);
      setStatus("success");
      setMessage("Thông báo");
      await getListWorkloadGroup();
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

  const handleTableChange = (pagination: PaginationProps) => {
    setPagination({
      current: pagination.current || 1,
      pageSize: pagination.pageSize || 15,
    });
    Cookies.set(
      "p_s",
      JSON.stringify([pagination.current, pagination.pageSize])
    );
  };

  const getDisplayRole = async (name: string) => {
    const response = await getRoleByName(name);
    setRole(response.items[0]);
  };

  useEffect(() => {
    setLoading(true);
    document.title = PageTitles.WORKLOAD_GROUPS;
    const pageState = Cookies.get("p_s");
    if (pageState) {
      const [current, pageSize] = JSON.parse(pageState);
      setPagination({
        current,
        pageSize,
      });
    }
    getListWorkloadGroup();

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
    setLoading(false);
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
                  <span>{Messages.BREAD_CRUMB_HOME}</span>
                </>
              ),
            },
            {
              title: (
                <>
                  <FileDoneOutlined />
                  <span>{Messages.BREAD_CRUMB_WORKLOAD_GROUPS}</span>
                </>
              ),
            },
          ]}
        />
      </div>
      <div className="flex justify-end mt-6 gap-3 mb-3">
        {role?.displayRole.isCreate && (
          <>
            <Tooltip placement="top" title={"Thêm mới nhóm"} arrow={true}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setIsOpen(true);
                  setMode("add");
                }}
                iconPosition="start"
              >
                Thêm nhóm
              </Button>
            </Tooltip>
          </>
        )}
        {role?.displayRole.isDelete && (
          <>
            <Tooltip placement="top" title="Xóa các nhóm" arrow={true}>
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
          mode === "edit" ? "Cập nhật nhóm biểu mẫu" : "Thêm mới nhóm biểu mẫu"
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
          <FormWorkloadGroup
            onSubmit={handleSubmit}
            initialData={selectedItem as Partial<RoleItem>}
            mode={mode}
          />
        }
      />

      <Table<WorkloadGroupItem>
        key={"table-workload-groups"}
        className="custom-table-header shadow-md rounded-md bg-white"
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
  );
};
export default WorkloadGroups;
