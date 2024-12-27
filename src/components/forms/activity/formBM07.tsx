"use client";

import { getAllUnits, UnitItem } from "@/services/units/unitsServices";
import {
  getUsersFromHRMbyId,
  UsersFromHRM,
  UsersFromHRMResponse,
} from "@/services/users/usersServices";
import { ConfigProvider, DatePicker, Input, Select } from "antd";
import moment from "moment";
import { FC, FormEvent, Key, useEffect, useState } from "react";

import { DisplayRoleItem } from "@/services/roles/rolesServices";
import locale from "antd/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");
interface FormBM07Props {
  onSubmit: (formData: Partial<any>) => void;
  initialData?: Partial<any>;
  mode: "add" | "edit";
  displayRole: DisplayRoleItem;
}

const FormBM07: FC<FormBM07Props> = ({
  onSubmit,
  initialData,
  mode,
  displayRole,
}) => {
  const { TextArea } = Input;
  const [entryDate, setEntryDate] = useState<number>(0);
  const [units, setUnits] = useState<UnitItem[]>([]);
  const [defaultUnits, setDefaultUnits] = useState<UnitItem[]>([]);
  const [users, setUsers] = useState<UsersFromHRMResponse | undefined>(
    undefined
  );
  const [selectedKey, setSelectedKey] = useState<Key | null>(null);
  const [defaultUsers, setDefaultUsers] = useState<UsersFromHRM[]>([]);
  const [contents, setContents] = useState<string>("");
  const [issuanceDate, setIssuanceDate] = useState<number>(0);
  const [issuancePlace, setIssuancePlace] = useState<string>("");
  const [type, setType] = useState<string>("");
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
      contents: contents,
      issuanceDate: issuanceDate / 1000,
      issuancePlace: issuancePlace,
      type: type,
      entryDate: entryDate / 1000,
      note: note,
    };
    onSubmit(formData);
  };

  const ResetForm = () => {
    const formattedDate = moment(new Date()).format("DD/MM/YYYY");
    const timestamp = moment(formattedDate, "DD/MM/YYYY").valueOf();
    setEntryDate(timestamp);
    setDefaultUnits([]);
    setDefaultUsers([]);
    setContents("");
    setIssuanceDate(0);
    setIssuancePlace("");
    setType("");
    setNote("");
    setSelectedKey(null);
  };

  useEffect(() => {
    getListUnits();
  }, []);

  useEffect(() => {
    const loadUsers = async () => {
      console.log("initialData :>> ", initialData);
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
        setContents(initialData.contents);
        setIssuanceDate(initialData.issuanceDate);
        setIssuancePlace(initialData.issuancePlace);
        setType(initialData.type);
        setEntryDate(initialData.entryDate * 1000);
        setNote(initialData.note);
      } else {
        ResetForm();
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
                displayRole.isCreate === false || displayRole.isUpdate === false
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
                displayRole.isCreate === false || displayRole.isUpdate === false
              }
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={users?.items?.map((user) => ({
                value: user.id,
                label: `${user.fullName} - ${user.userName}`,
                key: user.id,
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
        <div className="flex flex-col gap-1 mb-2">
          <span className="font-medium text-neutral-600">Nội dung đào tạo</span>
          <TextArea
            autoSize
            value={contents}
            onChange={(e) => setContents(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1 mb-2">
          <span className="font-medium text-neutral-600">Nơi đào tạo</span>
          <Input
            value={issuancePlace}
            onChange={(e) => setIssuancePlace(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-3 mb-2 gap-6">
          <div className="flex flex-col gap-1">
            <span className="font-medium text-neutral-600">Loại CC/GCN</span>
            <Select
              showSearch
              disabled={
                displayRole.isCreate === false || displayRole.isUpdate === false
              }
              optionFilterProp="label"
              options={[
                { value: "CC", label: "CC" },
                { value: "GCN", label: "GCN" },
              ]}
              value={type}
              onChange={(value) => {
                setType(value);
              }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-medium text-neutral-600">
              Ngày cấp CC/GCN
            </span>
            <ConfigProvider locale={locale}>
              <DatePicker
                allowClear={false}
                placeholder="dd/mm/yyyy"
                format={"DD/MM/YYYY"}
                value={issuanceDate ? moment(issuanceDate) : null}
                onChange={(date) => {
                  if (date) {
                    const timestamp = date.valueOf();
                    setIssuanceDate(timestamp);
                  } else {
                    setIssuanceDate(0);
                  }
                }}
              />
            </ConfigProvider>
          </div>
          <div className="flex flex-col gap-1">
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
        <div className="flex flex-col gap-1 mb-3">
          <span className="font-medium text-neutral-600">Ghi chú</span>
          <TextArea
            autoSize
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </form>
    </div>
  );
};
export default FormBM07;
