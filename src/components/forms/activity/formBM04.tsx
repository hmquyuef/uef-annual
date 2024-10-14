"use client";

import { AddUpdateQAItem } from "@/services/forms/qaServices";
import {
  getListUnitsFromHrm,
  UnitHRMItem,
} from "@/services/units/unitsServices";
import {
  getUsersFromHRMbyId,
  UsersFromHRM,
  UsersFromHRMResponse,
} from "@/services/users/usersServices";
import { DatePicker, Input, InputNumber, Select } from "antd";
import moment from "moment";
import { FC, FormEvent, Key, useEffect, useState } from "react";

interface FormBM04Props {
  onSubmit: (formData: Partial<AddUpdateQAItem>) => void;
  initialData?: Partial<AddUpdateQAItem>;
  mode: "add" | "edit";
}

const FormBM04: FC<FormBM04Props> = ({ onSubmit, initialData, mode }) => {
  const { TextArea } = Input;
  const [units, setUnits] = useState<UnitHRMItem[]>([]);
  const [defaultUnits, setDefaultUnits] = useState<UnitHRMItem[]>([]);
  const [users, setUsers] = useState<UsersFromHRMResponse | undefined>(
    undefined
  );
  const [defaultUsers, setDefaultUsers] = useState<UsersFromHRM[]>([]);
  const [selectedKey, setSelectedKey] = useState<Key | null>(null);
  const [standardValues, setStandardValues] = useState<number>(0);
  const [contents, setContents] = useState<string>("");
  const [totalStudent, setTotalStudent] = useState<number | 0>(0);
  const [attendances, setAttendances] = useState<number>(0);
  const [evidence, setEvidence] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const getListUnitsFromHRM = async () => {
    const response = await getListUnitsFromHrm();
    setUnits(response.model);
  };

  const getUsersFromHRMByUnitId = async (unitId: string) => {
    const response = await getUsersFromHRMbyId(unitId);
    setUsers(response);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const tempUser = users?.items?.find((user) => user.id === selectedKey);
    const formData: Partial<AddUpdateQAItem> = {
      id: initialData?.id || "",
      userName: mode !== "edit" ? tempUser?.userName : defaultUsers[0].userName,
      middleName:
        mode !== "edit"
          ? tempUser?.middleName
            ? tempUser.lastName + " " + tempUser.middleName
            : tempUser?.lastName
          : defaultUsers[0]?.middleName
          ? defaultUsers[0].lastName + " " + defaultUsers[0].middleName
          : defaultUsers[0]?.lastName,
      firstName:
        mode !== "edit" ? tempUser?.firstName : defaultUsers[0].firstName,
      unitName: mode !== "edit" ? tempUser?.unitName : defaultUsers[0].unitName,
      contents: contents,
      totalStudent: totalStudent,
      standardNumber: standardValues,
      attendances: attendances,
      proof: evidence,
      note: description,
    };
    onSubmit(formData);
  };

  useEffect(() => {
    getListUnitsFromHRM();
  }, []);

  useEffect(() => {
    const loadUsers = async () => {
      if (mode === "edit" && initialData !== undefined) {
        const units = await getListUnitsFromHrm();
        const unit = units.model.find(
          (unit) => unit.code === initialData.unitName
        );
        if (unit) {
          setDefaultUnits([unit]);
          const usersTemp = await getUsersFromHRMbyId(unit.id);
          const userTemp = usersTemp.items.find(
            (user) =>
              user.userName.toUpperCase() ===
              initialData.userName?.toUpperCase()
          );
          setDefaultUsers([userTemp] as UsersFromHRM[]);
        }
        setContents(initialData.contents || "");
        setTotalStudent(initialData.totalStudent || 0);
        setAttendances(initialData.attendances || 0);
        setStandardValues(initialData.standardNumber || 0);
        setDescription(initialData.note || "");
      } else {
        setDefaultUnits([]);
        setDefaultUsers([]);
        setContents("");
        setTotalStudent(0);
        setStandardValues(0);
        setAttendances(0);
        setDescription("");
      }
    };
    loadUsers();
  }, [initialData, mode]);
  return (
    <form onSubmit={handleSubmit}>
      <hr className="mt-1 mb-3" />
      <div className="grid grid-cols-2 gap-6 mb-4">
        <div className="flex flex-col gap-1">
          <p className="font-medium text-neutral-600">Đơn vị</p>
          <Select
            showSearch
            optionFilterProp="label"
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            options={units.map((unit) => ({
              value: unit.id,
              label: unit.name,
            }))}
            value={defaultUnits.length > 0 ? defaultUnits[0].id : undefined}
            onChange={(value) => {
              getUsersFromHRMByUnitId(value);
            }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-medium text-neutral-600">Tìm mã CB-GV-NV</p>
          <Select
            showSearch
            optionFilterProp="label"
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
      <div className="flex flex-col gap-1 mb-4">
        <p className="font-medium text-neutral-600">Nội dung</p>
        <TextArea
          autoSize
          value={contents}
          onChange={(e) => setContents(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-6 mb-4">
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-1">
            <p className="font-medium text-neutral-600">Số lượng SV</p>
            <InputNumber
              min={0}
              defaultValue={1}
              value={totalStudent}
              onChange={(value) => setTotalStudent(value ?? 0)}
              style={{ width: "100%" }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-medium text-neutral-600">Số tiết chuẩn</p>
            <InputNumber
              min={0}
              defaultValue={1}
              value={standardValues}
              onChange={(value) => setStandardValues(value ?? 0)}
              style={{ width: "100%" }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-medium text-neutral-600">Thời gian tham dự</p>
          <DatePicker
            placeholder="dd/mm/yyyy"
            format={"DD/MM/YYYY"}
            value={attendances ? moment(attendances * 1000) : null}
            onChange={(date) => {
              if (date) {
                const timestamp = date.valueOf();
                setAttendances(timestamp / 1000);
              } else {
                setAttendances(0);
              }
            }}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1 mb-4">
        <p className="font-medium text-neutral-600">Minh chứng</p>
        <TextArea
          autoSize
          value={evidence}
          onChange={(e) => setEvidence(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1 mb-4">
        <p className="font-medium text-neutral-600">Ghi chú</p>
        <TextArea
          autoSize
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
    </form>
  );
};
export default FormBM04;
