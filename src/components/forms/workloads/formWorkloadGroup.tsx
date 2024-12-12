"use client";

import { Checkbox, Input } from "antd";
import { FC, FormEvent, useEffect, useState } from "react";

interface FormWorkloadGroupProps {
  onSubmit: (formData: Partial<any>) => void;
  initialData?: Partial<any>;
  mode: "add" | "edit";
}

const FormWorkloadGroup: FC<FormWorkloadGroupProps> = ({
  onSubmit,
  initialData,
  mode,
}) => {
  const { TextArea } = Input;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActived, setIsActived] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData: Partial<any> = {
      id: initialData?.id || "",
      name: name,
      description: description,
      isActived: isActived,
    };
    onSubmit(formData);
  };

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
      setIsActived(initialData.isActived || false);
    } else {
      setName("");
      setDescription("");
      setIsActived(false);
    }
  }, [initialData, mode]);

  return (
    <form onSubmit={handleSubmit}>
      <hr className="mt-1 mb-2" />
      <div className="flex flex-col gap-1 mb-2">
        <span className="font-medium text-neutral-600">Nhóm biểu mẫu</span>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="flex flex-col gap-1 mb-2">
        <span className="font-medium text-neutral-600">Mô tả</span>
        <TextArea
          autoSize
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
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

export default FormWorkloadGroup;
