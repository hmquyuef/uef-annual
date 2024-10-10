"use client";

import { AddUpdateClassAssistantItem } from "@/services/forms/assistantsServices";
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
import { act, FC, FormEvent, Key, useEffect, useState } from "react";

interface FormBM02Props {
  onSubmit: (formData: Partial<AddUpdateClassAssistantItem>) => void;
  initialData?: Partial<AddUpdateClassAssistantItem>;
  mode: "add" | "edit";
}

const FormBM02: FC<FormBM02Props> = ({ onSubmit, initialData, mode }) => {
  const { TextArea } = Input;
  const [units, setUnits] = useState<UnitHRMItem[]>([]);
  const [defaultUnits, setDefaultUnits] = useState<UnitHRMItem[]>([]);
  const [users, setUsers] = useState<UsersFromHRMResponse | undefined>(
    undefined
  );
  const [defaultUsers, setDefaultUsers] = useState<UsersFromHRM[]>([]);
  const [selectedKey, setSelectedKey] = useState<Key | null>(null);
  const [semester, setSemester] = useState<string>("");
  const [standardValues, setStandardValues] = useState<number>(0);
  const [activityName, setActivityName] = useState<string>("");
  const [classCode, setClassCode] = useState<string>("");
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
    const formData: Partial<AddUpdateClassAssistantItem> = {
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
      activityName: activityName,
      semester: semester,
      attendances: attendances,
      classCode: classCode,
      standardNumber: standardValues,
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
        setSemester(initialData.semester || "");
        setClassCode(initialData.classCode || "");
        setActivityName(initialData.activityName || "");
        setStandardValues(initialData.standardNumber || 0);
        setAttendances(initialData.attendances || 0);
        setEvidence(initialData.proof || "");
        setDescription(initialData.note || "");
      } else {
        setDefaultUnits([]);
        setDefaultUsers([]);
        setSemester("");
        setClassCode("");
        setActivityName("");
        setAttendances(0);
        setStandardValues(0);
        setEvidence("");
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
        <p className="font-medium text-neutral-600">
          Công tác sư phạm đã thực hiện{" "}
          <span className="text-red-500">(*)</span>
        </p>
        <TextArea
          autoSize
          value={activityName}
          onChange={(e) => setActivityName(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-6 mb-4">
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-1">
            <p className="font-medium text-neutral-600">Học kỳ</p>
            <Input
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
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
          <p className="font-medium text-neutral-600">Mã lớp</p>
          <Input
            value={classCode}
            onChange={(e) => setClassCode(e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 mb-4">
        <div className="flex flex-col gap-1">
          <p className="font-medium text-neutral-600">Minh chứng</p>
          <TextArea
            autoSize
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-medium text-neutral-600">Ngày ký</p>
          <DatePicker
            placeholder="dd/mm/yyyy"
            format={"DD/MM/YYYY"}
            value={attendances ? moment(attendances) : null}
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
export default FormBM02;
