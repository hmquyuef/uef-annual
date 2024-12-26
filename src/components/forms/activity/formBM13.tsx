"use client";

import { getAllUnits, UnitItem } from "@/services/units/unitsServices";
import {
  getUsersFromHRMbyId,
  UsersFromHRM,
  UsersFromHRMResponse,
} from "@/services/users/usersServices";
import { ConfigProvider, DatePicker, Input, InputNumber, Select } from "antd";
import moment from "moment";
import { FC, FormEvent, Key, useEffect, useState } from "react";

import { PaymentApprovedItem } from "@/services/forms/PaymentApprovedItem";
import { DisplayRoleItem } from "@/services/roles/rolesServices";
import locale from "antd/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import InfoApproved from "./infoApproved";
dayjs.locale("vi");
interface FormBM13Props {
  onSubmit: (formData: Partial<any>) => void;
  initialData?: Partial<any>;
  mode: "add" | "edit";
  isBlock: boolean;
  isPayment?: PaymentApprovedItem;
  displayRole: DisplayRoleItem;
}

const FormBM13: FC<FormBM13Props> = ({
  onSubmit,
  initialData,
  mode,
  isBlock,
  isPayment,
  displayRole,
}) => {
  const { TextArea } = Input;
  const [entryDate, setEntryDate] = useState<number>(0);
  const [units, setUnits] = useState<UnitItem[]>([]);
  const [defaultUnits, setDefaultUnits] = useState<UnitItem[]>([]);
  const [users, setUsers] = useState<UsersFromHRMResponse | undefined>(
    undefined
  );
  const [defaultUsers, setDefaultUsers] = useState<UsersFromHRM[]>([]);
  const [selectedKey, setSelectedKey] = useState<Key | null>(null);
  const [notifiedAbsences, setNotifiedAbsences] = useState<number>(0);
  const [unnotifiedAbsences, setUnnotifiedAbsences] = useState<number>(0);
  const [lateEarly, setLateEarly] = useState<number>(0);
  const [note, setNote] = useState<string>("");

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
      notifiedAbsences: notifiedAbsences,
      unnotifiedAbsences: unnotifiedAbsences,
      lateEarly: lateEarly,
      entryDate: entryDate / 1000,
      note: note,
    };
    onSubmit(formData);
  };

  const ResetForms = () => {
    const formattedDate = moment().format("DD/MM/YYYY");
    const timestamp = moment(formattedDate, "DD/MM/YYYY").valueOf();
    setEntryDate(timestamp);
    setDefaultUnits([]);
    setDefaultUsers([]);
    setSelectedKey(null);
    setNotifiedAbsences(0);
    setUnnotifiedAbsences(0);
    setLateEarly(0);
    setNote("");
  };

  useEffect(() => {
    getListUnits();
  }, []);

  useEffect(() => {
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
        setNotifiedAbsences(initialData.notifiedAbsences);
        setUnnotifiedAbsences(initialData.unnotifiedAbsences);
        setLateEarly(initialData.lateEarly);
        setEntryDate(initialData.entryDate);
        setNote(initialData.note);
      } else {
        ResetForms();
      }
    };
    loadUsers();
  }, [initialData, mode]);

  return (
    <div className="grid grid-cols-1 mb-2">
      <form onSubmit={handleSubmit}>
        <hr className="mt-1 mb-2" />
        <div className="grid grid-cols-4 gap-6 mb-2">
          <div className="col-span-2 flex flex-col gap-1">
            <span className="font-medium text-neutral-600">Đơn vị</span>
            <Select
              showSearch
              disabled={
                isBlock ||
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
              value={defaultUnits.length > 0 ? defaultUnits[0].name : undefined}
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
                isBlock ||
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
              value={notifiedAbsences}
              onChange={(value) => setNotifiedAbsences(value ?? 0)}
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
              value={unnotifiedAbsences}
              onChange={(value) => setUnnotifiedAbsences(value ?? 0)}
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
              value={lateEarly}
              onChange={(value) => setLateEarly(value ?? 0)}
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
                value={entryDate ? moment(entryDate) : null}
              />
            </ConfigProvider>
          </div>
        </div>
        <div className="flex flex-col gap-1 mb-2">
          <p className="font-medium text-neutral-600">Ghi chú</p>
          <TextArea
            autoSize
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <hr />
        <InfoApproved mode={mode} isPayment={isPayment} />
      </form>
    </div>
  );
};
export default FormBM13;
