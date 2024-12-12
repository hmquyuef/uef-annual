"use client";

import { Checkbox, Input, InputNumber } from "antd";
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
  const [position, setPosition] = useState<number | 0>(0);
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
      setPosition(initialData.position || 0);
      setIsActived(initialData.isActived || false);
    } else {
      setName("");
      setDescription("");
      setPosition(0);
      setIsActived(false);
    }
  }, [initialData, mode]);

  return (
    <form onSubmit={handleSubmit}>
      <hr className="mt-1 mb-2" />
      <div className="grid grid-cols-4 gap-5">
        <div className="col-span-3 flex flex-col gap-1 mb-2">
          <span className="font-medium text-neutral-600">Nhóm biểu mẫu</span>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1 mb-2">
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
      <div className="flex flex-col gap-1 mb-2">
        <span className="font-medium text-neutral-600">Mô tả</span>
        <TextArea
          autoSize
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="mb-2 flex items-end">
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
