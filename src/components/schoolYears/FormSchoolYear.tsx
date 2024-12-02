"use client";

import { Checkbox, ConfigProvider, DatePicker, Input } from "antd";
import locale from "antd/locale/vi_VN";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { FC, FormEvent, useEffect, useState } from "react";

dayjs.extend(utc);
dayjs.extend(timezone);

interface FormSchoolYearProps {
  onSubmit: (formData: Partial<any>) => void;
  initialData?: Partial<any>;
  mode: "add" | "edit";
}

const FormSchoolYear: FC<FormSchoolYearProps> = ({
  onSubmit,
  initialData,
  mode,
}) => {
  const { TextArea } = Input;
  const [title, setTitle] = useState("");
  const [fromDate, setFromDate] = useState<number>(0);
  const [toDate, setToDate] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [isActived, setIsActived] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData: Partial<any> = {
      id: initialData?.id || "",
      title: title,
      startDate: fromDate,
      endDate: toDate,
      isDefault: isDefault,
      description: description,
      isActived: isActived,
    };
    onSubmit(formData);
  };

  useEffect(() => {
    const loadUsers = async () => {
      if (mode === "edit" && initialData !== undefined) {
        setTitle(initialData.title || "");
        setFromDate(initialData.startDate || 0);
        setToDate(initialData.endDate || 0);
        setIsDefault(initialData.isDefault || false);
        setDescription(initialData.description || "");
        setIsActived(initialData.isActived || false);
      } else {
        setTitle("");
        setFromDate(0);
        setToDate(0);
        setIsDefault(false);
        setDescription("");
        setIsActived(false);
      }
    };
    loadUsers();
  }, [initialData, mode]);

  return (
    <form onSubmit={handleSubmit}>
      <hr className="mt-1 mb-2" />
      <div className="flex flex-col gap-1 mb-2">
        <span className="font-medium text-neutral-600">Năm học</span>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-5 mb-2">
        <div className="flex flex-col gap-1">
          <span className="font-medium text-neutral-600">Từ ngày</span>
          <ConfigProvider locale={locale}>
            <DatePicker
              placeholder="dd/mm/yyyy"
              format="DD/MM/YYYY"
              value={
                fromDate ? dayjs.unix(fromDate).tz("Asia/Ho_Chi_Minh") : null
              }
              onChange={(date) => {
                if (date) {
                  const timestamp = dayjs(date).tz("Asia/Ho_Chi_Minh").unix();
                  setFromDate(timestamp);
                } else {
                  setFromDate(0);
                }
              }}
            />
          </ConfigProvider>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-medium text-neutral-600">Đến ngày</span>
          <ConfigProvider locale={locale}>
            <DatePicker
              placeholder="dd/mm/yyyy"
              format="DD/MM/YYYY"
              value={toDate ? dayjs.unix(toDate).tz("Asia/Ho_Chi_Minh") : null}
              onChange={(date) => {
                if (date) {
                  const timestamp = dayjs(date).tz("Asia/Ho_Chi_Minh").unix();
                  setToDate(timestamp);
                } else {
                  setToDate(0);
                }
              }}
            />
          </ConfigProvider>
        </div>
      </div>
      <div className="flex flex-col gap-1 mb-2">
        <span className="font-medium text-neutral-600">Tên hoạt động</span>
        <TextArea
          autoSize
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="mb-2">
        <Checkbox
          className="text-neutral-600"
          checked={isDefault}
          onChange={(e) => setIsDefault(e.target.checked)}
        >
          Đặt làm mặc định
        </Checkbox>
      </div>
      <div className="mb-2">
        <Checkbox
          className="text-neutral-600"
          checked={isActived}
          onChange={(e) => setIsActived(e.target.checked)}
        >
          Kích hoạt
        </Checkbox>
      </div>
    </form>
  );
};

export default FormSchoolYear;
