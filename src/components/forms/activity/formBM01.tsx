"use client";

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
import { ClassLeaderItem } from "@/services/forms/classLeadersServices";
import locale from "antd/locale/vi_VN";
import moment from "moment";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

interface FormBM01Props {
  onSubmit: (formData: Partial<ClassLeaderItem>) => void;
  initialData?: Partial<ClassLeaderItem>;
  mode: "add" | "edit";
}

const FormBM01: FC<FormBM01Props> = ({ onSubmit, initialData, mode }) => {
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
  const [subject, setSubject] = useState<string>("");
  const [course, setCourse] = useState<string>("");
  const [fromDate, setFromDate] = useState<number>(0);
  const [entryDate, setEntryDate] = useState<number>(0);
  const [eventDate, setEventDate] = useState<number>(0);
  const [classCode, setClassCode] = useState<string>("");
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
    const formData: Partial<ClassLeaderItem> = {
      id: initialData?.id || "",
      userName: mode !== "edit" ? tempUser?.userName : defaultUsers[0].userName,
      fullName: mode !== "edit" ? tempUser?.fullName : defaultUsers[0].fullName,
      unitName: mode !== "edit" ? tempUser?.unitName : defaultUsers[0].unitName,
      semester: semester,
      subject: subject,
      course: course,
      classCode: classCode,
      standardNumber: standardValues,
      fromDate: fromDate,
      entryDate: entryDate / 1000,
      eventDate: eventDate,
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
        setSubject(initialData.subject || "");
        setCourse(initialData.course || "");
        setClassCode(initialData.classCode || "");
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
        setSubject("");
        setCourse("");
        setClassCode("");
        setStandardValues(0);
        setFromDate(0);
        setEventDate(0);
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
        <div className="grid grid-cols-2 gap-6">
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
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-1">
            <p className="font-medium text-neutral-600">Ngày hoạt động</p>
            <ConfigProvider locale={locale}>
              <DatePicker
                placeholder="dd/mm/yyyy"
                format="DD/MM/YYYY"
                value={
                  eventDate
                    ? dayjs.unix(eventDate).tz("Asia/Ho_Chi_Minh")
                    : null
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
      <div className="grid grid-cols-2 gap-6 mb-4">
        <div className="grid grid-cols-3 gap-6">
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
          <div className="flex flex-col gap-1">
            <p className="font-medium text-neutral-600">Khóa</p>
            <Input value={course} onChange={(e) => setCourse(e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-1">
            <p className="font-medium text-neutral-600">Ngành</p>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-medium text-neutral-600">Mã lớp</p>
            <Input
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
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

export default FormBM01;
