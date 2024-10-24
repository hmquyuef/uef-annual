"use client";

import { getAllApplications } from "@/services/applications/applicationServices";
import { RoleItem } from "@/services/roles/rolesServices";
import { Checkbox, Input, Select } from "antd";
import { FC, FormEvent, Key, useEffect, useState } from "react";

interface FormRoleProps {
  onSubmit: (formData: Partial<RoleItem>) => void;
  initialData?: Partial<RoleItem>;
  mode: "add" | "edit";
}

const FormRole: FC<FormRoleProps> = ({ onSubmit, initialData, mode }) => {
  const [loading, setLoading] = useState(true);
  const [selectedKeyApp, setSelectedKeyApp] = useState<Key | null>(
    "059cee9c-45cc-4433-b22d-b3a1a83d88c1"
  );
  const [dataApplications, setDataApplications] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [isActived, setIsActived] = useState(false);

  const getListApplications = async () => {
    setLoading(true);
    const response = await getAllApplications();
    setDataApplications(response.items);
    setLoading(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData: Partial<any> = {
      id: initialData?.id || "",
      name: name,
      appId: selectedKeyApp,
      isActived: isActived,
    };
    onSubmit(formData);
  };

  useEffect(() => {
    getListApplications();
  }, []);

  useEffect(() => {
    setLoading(true);
    if (mode === "edit" && initialData) {
      setName(initialData.name || "");
      setSelectedKeyApp("059cee9c-45cc-4433-b22d-b3a1a83d88c1");
      setIsActived(initialData.isActived || false);
    } else {
      setName("");
      setSelectedKeyApp("059cee9c-45cc-4433-b22d-b3a1a83d88c1");
      setIsActived(false);
    }
    setLoading(false);
  }, [initialData, mode]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <hr className="mt-1 mb-2" />
      <div className="flex flex-col gap-[2px] mb-2">
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
      <div className="flex flex-col gap-[2px] mb-2">
        <span className="font-medium text-neutral-600">Vai trò</span>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
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
    </form>
  );
};

export default FormRole;
