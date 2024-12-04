"use client";

import { Checkbox, Input } from "antd";
import { FC, FormEvent, useEffect, useState } from "react";

interface FormUnitProps {
  onSubmit: (formData: Partial<any>) => void;
  initialData?: Partial<any>;
  mode: "add" | "edit";
}

const FormUnit: FC<FormUnitProps> = ({ onSubmit, initialData, mode }) => {
  const { TextArea } = Input;
  const [loading, setLoading] = useState(true);
  const [idHrm, setIdHrm] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [isActived, setIsActived] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData: Partial<any> = {
      id: initialData?.id || "",
      setIdHrm: initialData?.idHrm || "",
      idHrm: idHrm,
      name: name,
      code: code,
      description: description,
      isActived: isActived,
    };
    onSubmit(formData);
  };

  useEffect(() => {
    setLoading(true);
    if (mode === "edit" && initialData) {
      setName(initialData.name || "");
      setCode(initialData.code || "");
      setDescription(initialData.description || "");
      setIsActived(initialData.isActived || false);
    } else {
      setName("");
      setCode("");
      setDescription("");
      setIsActived(false);
    }
    setLoading(false);
  }, [initialData, mode]);
  return (
    <form onSubmit={handleSubmit}>
      <hr className="mt-1 mb-2" />
      <div className="flex flex-col gap-[2px] mb-2">
        <span className="font-medium text-neutral-600">Đơn vị</span>
        <TextArea
          autoSize
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-[2px] mb-2">
        <span className="font-medium text-neutral-600">Mã đơn vị</span>
        <Input value={code} onChange={(e) => setCode(e.target.value)} />
      </div>
      <div className="flex flex-col gap-[2px] mb-2">
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

export default FormUnit;
