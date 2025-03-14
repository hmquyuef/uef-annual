import { ConfigProvider, DatePicker, Input } from "antd";
import { FC, FormEvent, useEffect, useState } from "react";

import locale from "antd/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");

interface FormBM07ContentsProps {
  onSubmit: (formData: Partial<any>) => void;
  initialData?: Partial<any>;
  mode: "addContent" | "editContent";
}

const FormBM07Contents: FC<FormBM07ContentsProps> = (props) => {
  const { TextArea } = Input;
  const { onSubmit, initialData, mode } = props;
  const [formValues, setFormValues] = useState({
    name: "",
    startDate: 0,
    endDate: 0,
    location: "",
    abbreviation: "",
    note: "",
  });
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData: Partial<any> = {
      id: initialData?.id || "",
      name: formValues.name,
      startDate: formValues.startDate,
      endDate: formValues.endDate,
      location: formValues.location,
      abbreviation: formValues.abbreviation,
      note: formValues.note,
    };

    onSubmit(formData);
  };

  const ResetForm = () => {
    setFormValues({
      name: "",
      startDate: 0,
      endDate: 0,
      location: "",
      abbreviation: "",
      note: "",
    });
  };

  useEffect(() => {
    if (mode === "editContent" && initialData) {
      setFormValues({
        name: initialData.name,
        startDate: initialData.startDate,
        endDate: initialData.endDate,
        location: initialData.location,
        abbreviation: initialData.abbreviation,
        note: initialData.note,
      });
    } else {
      ResetForm();
    }
  }, [initialData, mode]);

  return (
    <>
      <form id="form-contents" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2 mb-4 border-t border-neutral-200 pt-3">
          <span className="font-medium text-neutral-600">Nội dung đào tạo</span>
          <TextArea
            autoSize
            value={formValues.name}
            onChange={(e) =>
              setFormValues({ ...formValues, name: e.target.value })
            }
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col gap-2">
            <span className="font-medium text-neutral-600">Từ ngày</span>
            <ConfigProvider locale={locale}>
              <DatePicker
                allowClear={false}
                placeholder="dd/mm/yyyy"
                format={"DD/MM/YYYY"}
                value={
                  formValues.startDate
                    ? dayjs.unix(formValues.startDate).tz("Asia/Ho_Chi_Minh")
                    : null
                }
                onChange={(date) => {
                  setFormValues((prev) => ({
                    ...prev,
                    startDate: date
                      ? dayjs(date).tz("Asia/Ho_Chi_Minh").unix()
                      : 0,
                  }));
                }}
              />
            </ConfigProvider>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-medium text-neutral-600">Đến ngày</span>
            <ConfigProvider locale={locale}>
              <DatePicker
                allowClear={true}
                placeholder="dd/mm/yyyy"
                format={"DD/MM/YYYY"}
                value={
                  formValues.endDate
                    ? dayjs.unix(formValues.endDate).tz("Asia/Ho_Chi_Minh")
                    : null
                }
                onChange={(date) => {
                  setFormValues((prev) => ({
                    ...prev,
                    endDate: date
                      ? dayjs(date).tz("Asia/Ho_Chi_Minh").unix()
                      : 0,
                  }));
                }}
              />
            </ConfigProvider>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col gap-2 mb-4">
            <span className="font-medium text-neutral-600">Địa điểm</span>
            <TextArea
              autoSize
              value={formValues.location}
              onChange={(e) =>
                setFormValues({ ...formValues, location: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-2 mb-4">
            <span className="font-medium text-neutral-600">Viết tắt</span>
            <TextArea
              autoSize
              value={formValues.abbreviation}
              onChange={(e) =>
                setFormValues({ ...formValues, abbreviation: e.target.value })
              }
            />
          </div>
        </div>
      </form>
    </>
  );
};

export default FormBM07Contents;
