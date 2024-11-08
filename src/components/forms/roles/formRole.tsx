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
  const [isRead, setIsRead] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isExport, setIsExport] = useState(false);
  const [isImport, setIsImport] = useState(false);
  const [isUpload, setIsUpload] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const [isApprove, setIsApprove] = useState(false);
  const [isReject, setIsReject] = useState(false);
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
      displayRole: {
        isRead: isRead,
        isCreate: isCreate,
        isUpdate: isUpdate,
        isDelete: isDelete,
        isExport: isExport,
        isImport: isImport,
        isUpload: isUpload,
        isConfirm: isConfirm,
        isApprove: isApprove,
        isReject: isReject,
      },
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
      setIsRead(initialData.displayRole?.isRead || false);
      setIsCreate(initialData.displayRole?.isCreate || false);
      setIsUpdate(initialData.displayRole?.isUpdate || false);
      setIsDelete(initialData.displayRole?.isDelete || false);
      setIsExport(initialData.displayRole?.isExport || false);
      setIsImport(initialData.displayRole?.isImport || false);
      setIsUpload(initialData.displayRole?.isUpload || false);
      setIsConfirm(initialData.displayRole?.isConfirm || false);
      setIsApprove(initialData.displayRole?.isApprove || false);
      setIsReject(initialData.displayRole?.isReject || false);
      setIsActived(initialData.isActived || false);
    } else {
      setName("");
      setSelectedKeyApp("059cee9c-45cc-4433-b22d-b3a1a83d88c1");
      setIsActived(false);
      setIsRead(false);
      setIsCreate(false);
      setIsUpdate(false);
      setIsDelete(false);
      setIsExport(false);
      setIsImport(false);
      setIsUpload(false);
      setIsConfirm(false);
      setIsApprove(false);
      setIsReject(false);
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
        <span className="font-medium text-neutral-600">
          Thiết lập quyền hiển thị
        </span>
        <div className="grid grid-cols-2 gap-1">
          <Checkbox
            checked={isRead}
            onChange={(e) => setIsRead(e.target.checked)}
          >
            Quyền xem nội dung
          </Checkbox>
          <Checkbox
            checked={isCreate}
            onChange={(e) => setIsCreate(e.target.checked)}
          >
            Quyền khởi tạo
          </Checkbox>
          <Checkbox
            checked={isUpdate}
            onChange={(e) => setIsUpdate(e.target.checked)}
          >
            Quyền cập nhật
          </Checkbox>
          <Checkbox
            checked={isDelete}
            onChange={(e) => setIsDelete(e.target.checked)}
          >
            Quyền xóa
          </Checkbox>
          <Checkbox
            checked={isExport}
            onChange={(e) => setIsExport(e.target.checked)}
          >
            Quyền xuất dữ liệu
          </Checkbox>
          <Checkbox
            checked={isImport}
            onChange={(e) => setIsImport(e.target.checked)}
          >
            Quyền import dữ liệu
          </Checkbox>
          <Checkbox
            checked={isUpload}
            onChange={(e) => setIsUpload(e.target.checked)}
          >
            Quyền Upload file
          </Checkbox>
          <Checkbox
            checked={isConfirm}
            onChange={(e) => setIsConfirm(e.target.checked)}
          >
            Quyền xác nhận thông tin
          </Checkbox>
          <Checkbox
            checked={isApprove}
            onChange={(e) => setIsApprove(e.target.checked)}
          >
            Quyền phê duyệt biểu mẫu
          </Checkbox>
          <Checkbox
            checked={isReject}
            onChange={(e) => setIsReject(e.target.checked)}
          >
            Quyền từ chối biểu mẫu
          </Checkbox>
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
    </form>
  );
};

export default FormRole;
