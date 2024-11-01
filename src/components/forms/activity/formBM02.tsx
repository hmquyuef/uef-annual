"use client";

import { ClassAssistantItem } from "@/services/forms/assistantsServices";
import {
  getListUnitsFromHrm,
  UnitHRMItem,
} from "@/services/units/unitsServices";
import {
  getUsersFromHRMbyId,
  UsersFromHRM,
  UsersFromHRMResponse,
} from "@/services/users/usersServices";
import { ConfigProvider, DatePicker, Input, InputNumber, Select } from "antd";
import { FC, FormEvent, Key, useEffect, useState } from "react";
import locale from "antd/locale/vi_VN";
import moment from "moment";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

interface FormBM02Props {
  onSubmit: (formData: Partial<ClassAssistantItem>) => void;
  initialData?: Partial<ClassAssistantItem>;
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
  const [fromDate, setFromDate] = useState<number>(0);
  const [entryDate, setEntryDate] = useState<number>(0);
  const [eventDate, setEventDate] = useState<number>(0);
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
    const formData: Partial<ClassAssistantItem> = {
      id: initialData?.id || "",
      userName: mode !== "edit" ? tempUser?.userName : defaultUsers[0].userName,
      fullName: mode !== "edit" ? tempUser?.fullName : defaultUsers[0].fullName,
      unitName: mode !== "edit" ? tempUser?.unitName : defaultUsers[0].unitName,
      activityName: activityName,
      semester: semester,
      fromDate: fromDate,
      entryDate: entryDate / 1000,
      eventDate: eventDate,
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
        setFromDate(initialData.fromDate || 0);
        setEntryDate((initialData.entryDate ?? 0) * 1000);
        setEventDate(initialData.eventDate || 0);
        setEvidence(initialData.proof || "");
        setDescription(initialData.note || "");
      } else {
        const formattedDate = moment(new Date()).format("DD/MM/YYYY");
        const timestamp = moment(formattedDate, "DD/MM/YYYY").valueOf();
        setEntryDate(timestamp);
        setDefaultUnits([]);
        setDefaultUsers([]);
        setSemester("");
        setClassCode("");
        setActivityName("");
        setFromDate(0);
        setEventDate(0);
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
      <div className="grid grid-cols-4 gap-6 mb-4">
        <div className="flex flex-col gap-1">
          <p className="font-medium text-neutral-600">
            Số văn bản <span className="text-red-500">(*)</span>
          </p>
          <TextArea
            autoSize
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-medium text-neutral-600">
            Ngày lập <span className="text-red-500">(*)</span>
          </p>
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
          <p className="font-medium text-neutral-600">Ngày hoạt động</p>
          <ConfigProvider locale={locale}>
            <DatePicker
              placeholder="dd/mm/yyyy"
              format="DD/MM/YYYY"
              value={
                eventDate ? dayjs.unix(eventDate).tz("Asia/Ho_Chi_Minh") : null
              }
              onChange={(date) => {
                if (date) {
                  const timestamp = dayjs(date).tz("Asia/Ho_Chi_Minh").unix();
                  setEventDate(timestamp);
                } else {
                  setEventDate(0);
                }
              }}
            />
          </ConfigProvider>
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-medium text-neutral-600">Ngày nhập</p>
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
          Công tác sư phạm <span className="text-red-500">(*)</span>
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
      <div className="flex flex-col gap-1 mb-2">
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
