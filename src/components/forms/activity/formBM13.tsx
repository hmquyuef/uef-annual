"use client";

import { getAllUnits, UnitItem } from "@/services/units/unitsServices";
import {
  getUsersFromHRMbyId,
  UsersFromHRM,
  UsersFromHRMResponse,
} from "@/services/users/usersServices";
import { ConfigProvider, DatePicker, Input, InputNumber, Select } from "antd";
import { FC, FormEvent, Key, useEffect, useState } from "react";

import { LoadingSkeleton } from "@/components/skeletons/LoadingSkeleton";
import { DisplayRoleItem } from "@/services/roles/rolesServices";
import locale from "antd/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");
interface FormBM13Props {
  onSubmit: (formData: Partial<any>) => void;
  initialData?: Partial<any>;
  mode: "add" | "edit";
  displayRole: DisplayRoleItem;
}

const FormBM13: FC<FormBM13Props> = (props) => {
  const { onSubmit, initialData, mode, displayRole } = props;
  const { TextArea } = Input;
  const timestamp = dayjs().tz("Asia/Ho_Chi_Minh").unix();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [units, setUnits] = useState<UnitItem[]>([]);
  const [defaultUnits, setDefaultUnits] = useState<UnitItem[]>([]);
  const [users, setUsers] = useState<UsersFromHRMResponse | undefined>(
    undefined
  );
  const [defaultUsers, setDefaultUsers] = useState<UsersFromHRM[]>([]);
  const [selectedKey, setSelectedKey] = useState<Key | null>(null);

  const [formValues, setFormValues] = useState({
    notifiedAbsences: 0,
    unnotifiedAbsences: 0,
    lateEarly: 0,
    entryDate: timestamp,
    note: "",
  });

  const getListUnits = async () => {
    const response = await getAllUnits("true");
    setUnits(response.items);
  };

  const getAllUsersFromHRM = async (id: Key) => {
    const response = await getUsersFromHRMbyId(id.toString());
    setUsers(response);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const tempUser = users?.items?.find((user) => user.id === selectedKey);
    const formData: Partial<any> = {
      id: initialData?.id || "",
      userName: mode !== "edit" ? tempUser?.userName : defaultUsers[0].userName,
      fullName: mode !== "edit" ? tempUser?.fullName : defaultUsers[0].fullName,
      unitName: mode !== "edit" ? tempUser?.unitName : defaultUsers[0].unitName,
      notifiedAbsences: formValues.notifiedAbsences,
      unnotifiedAbsences: formValues.unnotifiedAbsences,
      lateEarly: formValues.lateEarly,
      entryDate: formValues.entryDate,
      note: formValues.note,
    };
    onSubmit(formData);
  };

  const ResetForms = () => {
    setDefaultUnits([]);
    setDefaultUsers([]);
    setSelectedKey(null);
    setFormValues({
      notifiedAbsences: 0,
      unnotifiedAbsences: 0,
      lateEarly: 0,
      entryDate: timestamp,
      note: "",
    });
  };

  useEffect(() => {
    setIsLoading(true);
    const loadUsers = async () => {
      if (mode === "edit" && initialData !== undefined) {
        const units = await getAllUnits("true");
        const unit = units.items.find(
          (unit) => unit.code === initialData.unitName
        );
        if (unit) {
          setDefaultUnits([unit]);
          const usersTemp = await getUsersFromHRMbyId(unit.idHrm);
          const userTemp = usersTemp.items.find(
            (user) =>
              user.userName.toUpperCase() ===
              initialData.userName?.toUpperCase()
          );
          setDefaultUsers([userTemp] as UsersFromHRM[]);
        }
        setFormValues({
          notifiedAbsences: initialData.notifiedAbsences,
          unnotifiedAbsences: initialData.unnotifiedAbsences,
          lateEarly: initialData.lateEarly,
          entryDate: initialData?.entryDate ? initialData.entryDate : timestamp,
          note: initialData.note,
        });
      } else {
        ResetForms();
      }
    };
    getListUnits();
    loadUsers();
    const timeoutId = setTimeout(() => {}, 500);
    return () => clearTimeout(timeoutId);
  }, [initialData, mode]);

  return (
    <div className="grid grid-cols-1 mb-2">
      {isLoading ? (
        <>
          <LoadingSkeleton />
        </>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <hr className="mt-1 mb-2" />
            <div className="grid grid-cols-4 gap-6 mb-2">
              <div className="col-span-2 flex flex-col gap-1">
                <span className="font-medium text-neutral-600">Đơn vị</span>
                <Select
                  showSearch
                  disabled={
                    displayRole.isCreate === false ||
                    displayRole.isUpdate === false
                  }
                  optionFilterProp="label"
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  options={units.map((unit: UnitItem, index) => ({
                    value: unit.idHrm,
                    label: unit.name,
                    key: `${unit.idHrm}-${index}`,
                  }))}
                  value={
                    defaultUnits.length > 0 ? defaultUnits[0].name : undefined
                  }
                  onChange={(value) => {
                    getAllUsersFromHRM(value);
                  }}
                />
              </div>
              <div className="col-span-2 flex flex-col gap-1">
                <span className="font-medium text-neutral-600">
                  Tìm mã CB-GV-NV
                </span>
                <Select
                  showSearch
                  disabled={
                    displayRole.isCreate === false ||
                    displayRole.isUpdate === false
                  }
                  optionFilterProp="label"
                  defaultValue={""}
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  options={users?.items?.map((user) => ({
                    value: user.id,
                    label: `${user.fullName} - ${user.userName}`,
                  }))}
                  value={
                    defaultUsers.length > 0
                      ? `${defaultUsers[0].fullName} - ${defaultUsers[0].userName}`
                      : undefined
                  }
                  onChange={(value) => {
                    setSelectedKey(value);
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 mb-2 gap-6">
              <div className="flex flex-col gap-1">
                <span className="font-medium text-neutral-600">
                  Số ngày nghỉ có báo
                </span>
                <InputNumber
                  min={0}
                  defaultValue={0}
                  value={formValues.notifiedAbsences}
                  onChange={(value) =>
                    setFormValues({
                      ...formValues,
                      notifiedAbsences: value ?? 0,
                    })
                  }
                  style={{ width: "100%" }}
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-medium text-neutral-600">
                  Số ngày nghỉ không báo
                </span>
                <InputNumber
                  min={0}
                  defaultValue={0}
                  value={formValues.unnotifiedAbsences}
                  onChange={(value) =>
                    setFormValues({
                      ...formValues,
                      unnotifiedAbsences: value ?? 0,
                    })
                  }
                  style={{ width: "100%" }}
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-medium text-neutral-600">
                  Số lần đi trễ/về sớm
                </span>
                <InputNumber
                  min={0}
                  defaultValue={0}
                  value={formValues.lateEarly}
                  onChange={(value) =>
                    setFormValues({ ...formValues, lateEarly: value ?? 0 })
                  }
                  style={{ width: "100%" }}
                />
              </div>
              <div className="flex flex-col gap-[2px]">
                <span className="font-medium text-neutral-600">Ngày nhập</span>
                <ConfigProvider locale={locale}>
                  <DatePicker
                    disabled
                    placeholder="dd/mm/yyyy"
                    format={"DD/MM/YYYY"}
                    value={
                      formValues.entryDate
                        ? dayjs
                            .unix(formValues.entryDate)
                            .tz("Asia/Ho_Chi_Minh")
                        : 0
                    }
                  />
                </ConfigProvider>
              </div>
            </div>
            <div className="flex flex-col gap-1 mb-2">
              <p className="font-medium text-neutral-600">Ghi chú</p>
              <TextArea
                autoSize
                value={formValues.note}
                onChange={(e) =>
                  setFormValues({ ...formValues, note: e.target.value })
                }
              />
            </div>
          </form>
        </>
      )}
    </div>
  );
};
export default FormBM13;
