"use client";

import { getAllApplications } from "@/services/applications/applicationServices";
import { getAllMenus, MenuItem } from "@/services/menus/menuServices";
import {
  getAllPermissionsForMenuByUserName,
  postAddPermissionForMenu,
  putUpdatePermissionForMenu
} from "@/services/permissions/permissionForMenu";
import { PermissionItem } from "@/services/permissions/permissionServices";
import { getAllRoles, RoleResponses } from "@/services/roles/rolesServices";
import {
  getUsersFromHRM,
  UsersFromHRMResponse,
} from "@/services/users/usersServices";
import {
  Checkbox,
  Empty,
  Select,
  Table,
  TableColumnsType,
  Tag
} from "antd";
import { FC, FormEvent, Key, useEffect, useState } from "react";

interface FormPermissionProps {
  onSubmit: (formData: Partial<PermissionItem>) => void;
  initialData?: Partial<PermissionItem>;
  mode: "add" | "edit";
}

const FormPermission: FC<FormPermissionProps> = ({
  onSubmit,
  initialData,
  mode,
}) => {
  const [loading, setLoading] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [selectedKeyRoles, setSelectedKeyRoles] = useState<Key | null>(null);
  const [selectedKeyApp, setSelectedKeyApp] = useState<Key | null>(
    "059cee9c-45cc-4433-b22d-b3a1a83d88c1"
  );
  const [data, setData] = useState<MenuItem[]>([]);
  const [dataUsers, setDataUsers] = useState<UsersFromHRMResponse | undefined>(
    undefined
  );
  const [dataApplications, setDataApplications] = useState<any[]>([]);
  const [isActived, setIsActived] = useState(false);
  const [dataRoles, setDataRoles] = useState<RoleResponses | undefined>(
    undefined
  );

  const getUsersHRM = async () => {
    const response = await getUsersFromHRM();
    setDataUsers(response);
  };

  const getListRoles = async () => {
    const response = await getAllRoles();
    setDataRoles(response);
  };

  const getListMenus = async () => {
    const response = await getAllMenus();
    setData(response.items);
  };

  const getListApplications = async () => {
    const response = await getAllApplications();
    setDataApplications(response.items);
  };
  const fetchData = async () => {
    await Promise.all([
      getUsersHRM(),
      getListRoles(),
      getListMenus(),
      getListApplications(),
    ]);
  };

  const columns: TableColumnsType<MenuItem> = [
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
      className: "w-[60px]",
      render: (position: string) => <>{position}</>,
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

  const getPermissionForMenuIdByUserName = async (userName: string) => {
    const response = await getAllPermissionsForMenuByUserName(userName);
    return response.items;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData: Partial<any> = {
      userName: selectedKey,
      roleId: selectedKeyRoles,
      isActived: isActived,
      permissions: data.map((item) => {
        return {
          position: item.position,
          isActived: item.isActived,
          isChildren: item.isChildren,
          children:
            item.children?.map((child) => ({
              position: child.position,
              isActived: selectedRowKeys.includes(child.position),
            })) || [],
        };
      }),
    };
    const permissionForm: Partial<any> = {
      id: initialData?.id || "",
      userId: dataUsers?.items?.find((user) => user.userName === selectedKey)
        ?.id,
      email: dataUsers?.items?.find((user) => user.userName === selectedKey)
        ?.email,
      appId: selectedKeyApp,
      roleIds: [selectedKeyRoles],
      isActived: isActived,
    };

    const permissionForMenu = selectedKey
      ? await getPermissionForMenuIdByUserName(selectedKey)
      : null;

    if (permissionForMenu) {
      const permissionForMenuId = permissionForMenu[0]?.id;
      const response = permissionForMenuId
        ? await putUpdatePermissionForMenu(permissionForMenuId, formData)
        : await postAddPermissionForMenu(formData);
      if (response) onSubmit(permissionForm);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const fetchDataAsync = async () => {
      setLoading(true);
      if (mode === "edit" && initialData) {
        setSelectedKey(initialData.userName || null);
        setSelectedKeyRoles(initialData.roles?.[0]?.id || null);
        setSelectedKeyApp("059cee9c-45cc-4433-b22d-b3a1a83d88c1");
        setIsActived(initialData.isActived || false);
        const userPermissions = await getAllPermissionsForMenuByUserName(
          initialData.userName || ""
        );
        const positions = userPermissions.items.map((item) =>
          item.permissions.flatMap((permission) =>
            permission.children.map((child) => child.position)
          )
        );
        setSelectedRowKeys(positions[0]);
        setLoading(false);
      } else {
        setSelectedKeyApp("059cee9c-45cc-4433-b22d-b3a1a83d88c1");
        setSelectedKey(null);
        setSelectedKeyRoles(null);
        setIsActived(false);
        setSelectedRowKeys([]);
      }
      setLoading(false);
    };

    fetchDataAsync();
  }, [initialData, mode]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <hr className="mt-1 mb-2" />
      <div className="grid grid-cols-4 gap-6 mb-2">
        <div className="col-span-2 flex flex-col gap-[2px]">
          <span className="font-medium text-neutral-600">Mã số CB-GV-NV</span>
          <Select
            showSearch
            optionFilterProp="label"
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            options={dataUsers?.items?.map((user) => ({
              value: user.userName,
              label: `${user.fullName} - ${user.userName}`,
            }))}
            value={selectedKey}
            onChange={(value) => {
              setSelectedKey(value);
            }}
          />
        </div>
        <div className="flex flex-col gap-[2px]">
          <span className="font-medium text-neutral-600">Ứng dụng</span>
          <Select
            showSearch
            optionFilterProp="label"
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            options={dataApplications?.map((app) => ({
              value: app.id,
              label: app.name,
            }))}
            value={selectedKeyApp}
            onChange={(value) => {
              setSelectedKeyApp(value);
            }}
          />
        </div>
        <div className="flex flex-col gap-[2px]">
          <span className="font-medium text-neutral-600">Vai trò</span>
          <Select
            showSearch
            optionFilterProp="label"
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            options={dataRoles?.items?.map((role) => ({
              value: role.id,
              label: role.name,
            }))}
            value={selectedKeyRoles}
            onChange={(value) => {
              setSelectedKeyRoles(value);
            }}
          />
        </div>
      </div>
      <div className="mb-2">
        <Checkbox
          className="font-medium text-neutral-600"
          checked={isActived}
          onChange={(e) => setIsActived(e.target.checked)}
        >
          Kích hoạt
        </Checkbox>
      </div>
      <div className="flex flex-col gap-[2px] mb-2">
        <span className="font-medium text-neutral-600">
          Phân quyền chức năng
        </span>
        <Table<MenuItem>
          key={"table-menus"}
          className="custom-table-header shadow-md rounded-md"
          bordered
          rowKey={(item) => item.position}
          rowHoverable
          size="small"
          pagination={false}
          rowSelection={{
            selectedRowKeys,
            onChange: (selectedKeys) => {
              setSelectedRowKeys(selectedKeys);
            },
            checkStrictly: false,
          }}
          columns={columns}
          dataSource={data}
          locale={{ emptyText: <Empty description="No Data"></Empty> }}
        />
      </div>
    </form>
  );
};

export default FormPermission;
