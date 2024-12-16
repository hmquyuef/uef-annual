"use client";

import {
  getUsersFromHRM,
  UsersFromHRMResponse,
} from "@/services/users/usersServices";
import {
  getWorkloadGroups,
  WorkloadGroupResponse,
} from "@/services/workloads/groupsServices";
import { AddUpdateWorkloadType } from "@/services/workloads/typesServices";
import { Input, InputNumber, Select, SelectProps, Tag } from "antd";
import { FormEvent, useEffect, useState } from "react";
interface FormWorkloadTypeProps {
  onSubmit: (formData: Partial<AddUpdateWorkloadType>) => void;
  initialData?: Partial<AddUpdateWorkloadType>;
  workloadGroupId?: string;
  mode: "add" | "edit";
}

type TagRender = SelectProps["tagRender"];

const FormWorkloadType: React.FC<FormWorkloadTypeProps> = ({
  onSubmit,
  initialData,
  workloadGroupId,
  mode,
}) => {
  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [href, setHref] = useState("");
  const [position, setPosition] = useState<number | 0>(0);
  const [workloadGroups, setWorkloadGroups] = useState<
    WorkloadGroupResponse | undefined
  >(undefined);
  const [selectedGroupId, setSelectedGroupId] = useState<string>(
    workloadGroupId || ""
  );
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [usersHRM, setUsersHRM] = useState<UsersFromHRMResponse | undefined>(
    undefined
  );

  const filteredOptions = usersHRM?.items.filter(
    (o) => !selectedItems.includes(o.userName)
  );

  const tagRender: TagRender = (props) => {
    const { label, closable, onClose } = props;
    const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag
        color={"gold"}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ margin: 2 }}
      >
        {label}
      </Tag>
    );
  };

  const getUsersHRM = async () => {
    const response = await getUsersFromHRM();
    setUsersHRM(response);
  };

  const getListWorkloadGroups = async () => {
    const response = await getWorkloadGroups();
    setWorkloadGroups(response);
  };

  useEffect(() => {
    Promise.all([getListWorkloadGroups(), getUsersHRM()]);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData: Partial<AddUpdateWorkloadType> = {
      id: initialData?.id || "",
      name: name,
      shortName: shortName,
      href: href,
      position: position,
      workloadGroupId: selectedGroupId,
      emails: selectedItems.join(","),
      isActived: true,
    };
    onSubmit(formData);
  };
  useEffect(() => {
    console.log("initialData :>> ", initialData);
    const loadUsers = async () => {
      if (mode === "edit" && initialData !== undefined) {
        setName(initialData.name || "");
        setShortName(initialData.shortName || "");
        setHref(initialData.href || "");
        setPosition(initialData.position || 0);
        setSelectedGroupId(initialData.workloadGroupId || "");
        setSelectedItems(initialData.emails?.split(",") || []);
      } else {
        setName("");
        setShortName("");
        setHref("");
        setPosition(0);
        setSelectedGroupId(workloadGroupId || "");
        setSelectedItems([]);
      }
    };
    loadUsers();
  }, [initialData, mode]);
  return (
    <form onSubmit={handleSubmit}>
      <hr className="mt-1 mb-3" />
      <div className="grid grid-cols-6 gap-5 mb-3">
        <div className="col-span-3">
          <div className="flex flex-col gap-1">
            <p className="font-medium text-neutral-600">
              Biểu mẫu <span className="text-red-500">(*)</span>
            </p>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        </div>
        <div className="col-span-3">
          <div className="flex flex-col gap-1">
            <p className="font-medium text-neutral-600">Tên rút gọn</p>
            <Input
              value={shortName}
              onChange={(e) => setShortName(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-6 gap-5 mb-4">
        <div className="col-span-3">
          <div className="flex flex-col gap-1">
            <p className="font-medium text-neutral-600">Thuộc nhóm</p>
            <Select
              showSearch
              value={selectedGroupId}
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={workloadGroups?.items.map((group) => ({
                value: group.id,
                label: group.name,
              }))}
              onChange={(value) => {
                setSelectedGroupId(value);
              }}
            />
          </div>
        </div>
        <div className="col-span-2 flex flex-col gap-1">
          <p className="font-medium text-neutral-600">Đường dẫn</p>
          <Input value={href} onChange={(e) => setHref(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-medium text-neutral-600">Vị trí</p>
          <InputNumber
            min={0}
            value={position}
            onChange={(value) => {
              setPosition(value || 0);
            }}
            style={{ width: "100%" }}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1 mb-4">
        <p className="font-medium text-neutral-600">
          Danh sách CB-GB-NV được phân quyền ({selectedItems.length})
        </p>
        <Select
          mode="multiple"
          tagRender={tagRender}
          value={selectedItems}
          onChange={setSelectedItems}
          style={{ width: "100%" }}
          options={(filteredOptions || []).map((user) => ({
            key: user.id,
            value: user.userName,
            label: `${user.fullName} - ${user.userName}`,
          }))}
        />
      </div>
    </form>
  );
};
export default FormWorkloadType;
