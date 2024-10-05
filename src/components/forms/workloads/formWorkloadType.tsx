"use client";

import {
  getWorkloadGroups,
  WorkloadGroupResponse,
} from "@/services/workloads/groupsServices";
import { AddUpdateWorkloadType } from "@/services/workloads/typesServices";
import { Input, Select } from "antd";
import { FormEvent, useEffect, useState } from "react";
const { TextArea } = Input;
interface FormWorkloadTypeProps {
  onSubmit: (formData: Partial<AddUpdateWorkloadType>) => void;
  initialData?: Partial<AddUpdateWorkloadType>;
  mode: "add" | "edit";
}

const FormWorkloadType: React.FC<FormWorkloadTypeProps> = ({
  onSubmit,
  initialData,
  mode,
}) => {
  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [href, setHref] = useState("");
  const [emails, setEmails] = useState("");
  const [workloadGroups, setWorkloadGroups] = useState<
    WorkloadGroupResponse | undefined
  >(undefined);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const getListWorkloadGroups = async () => {
    const response = await getWorkloadGroups();
    setWorkloadGroups(response);
  };
  useEffect(() => {
    getListWorkloadGroups();
  }, []);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData: Partial<AddUpdateWorkloadType> = {
      id: initialData?.id || "",
      name: name,
      shortName: shortName,
      href: href,
      workloadGroupId: selectedGroupId,
      emails: emails,
      isActived: true,
    };
    onSubmit(formData);
  };
  useEffect(() => {
    const loadUsers = async () => {
      if (mode === "edit" && initialData !== undefined) {
        setName(initialData.name || "");
        setShortName(initialData.shortName || "");
        setHref(initialData.href || "");
        setEmails(initialData.emails || "");
        setSelectedGroupId(initialData.workloadGroupId || "");
      } else {
        setName("");
        setShortName("");
        setHref("");
        setEmails("");
        setSelectedGroupId("");
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
            <p className="font-medium text-neutral-600">
              Thuộc nhóm <span className="text-red-500">(*)</span>
            </p>
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
        <div className="col-span-3">
          <div className="flex flex-col gap-1">
            <p className="font-medium text-neutral-600">Đường dẫn</p>
            <Input value={href} onChange={(e) => setHref(e.target.value)} />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-1 mb-4">
        <p className="font-medium text-neutral-600">
          Danh sách Email được phép khai thác
        </p>
        <TextArea autoSize value={emails} onChange={(e) => setEmails(e.target.value.trim())} />
      </div>
    </form>
  );
};
export default FormWorkloadType;
