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
import { ConfigProvider, DatePicker, Input, InputNumber, Select, Spin } from "antd";
import { FC, FormEvent, Key, useEffect, useState } from "react";

import locale from "antd/locale/vi_VN";
import moment from "moment";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { PaymentApprovedItem } from "@/services/forms/PaymentApprovedItem";
import { CloseOutlined, SafetyOutlined } from "@ant-design/icons";
import { convertTimestampToFullDateTime } from "@/utility/Utilities";
dayjs.extend(utc);
dayjs.extend(timezone);

interface FormBM03Props {
  onSubmit: (formData: Partial<any>) => void;
  initialData?: Partial<any>;
  mode: "add" | "edit";
  isBlock: boolean;
  isPayment?: PaymentApprovedItem;
}

const FormBM03: FC<FormBM03Props> = ({
  onSubmit,
  initialData,
  mode,
  isBlock,
  isPayment,
}) => {
  const { TextArea } = Input;
  const [units, setUnits] = useState<UnitHRMItem[]>([]);
  const [defaultUnits, setDefaultUnits] = useState<UnitHRMItem[]>([]);
  const [users, setUsers] = useState<UsersFromHRMResponse | undefined>(
    undefined
  );
  const [defaultUsers, setDefaultUsers] = useState<UsersFromHRM[]>([]);
  const [selectedKey, setSelectedKey] = useState<Key | null>(null);
  const [standardValues, setStandardValues] = useState<number>(0);
  const [location, setLocation] = useState<string>("");
  const [position, setPosition] = useState<string>("");
  const [numberOfTime, setNumberOfTime] = useState<number | 0>(0);
  const [fromDate, setFromDate] = useState<number>(0);
  const [toDate, setToDate] = useState<number>(0);
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
    const formData: Partial<any> = {
      id: initialData?.id || "",
      userName: mode !== "edit" ? tempUser?.userName : defaultUsers[0].userName,
      fullName: mode !== "edit" ? tempUser?.fullName : defaultUsers[0].fullName,
      unitName: mode !== "edit" ? tempUser?.unitName : defaultUsers[0].unitName,
      location: location,
      position: position,
      numberOfTime: numberOfTime,
      standardNumber: standardValues,
      fromDate: fromDate,
      toDate: toDate,
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
        setLocation(initialData.location || "");
        setNumberOfTime(initialData.numberOfTime || 0);
        setFromDate(initialData.fromDate || 0);
        setToDate(initialData.toDate || 0);
        setEntryDate((initialData.entryDate ?? 0) * 1000);
        setEventDate(initialData.eventDate || 0);
        setStandardValues(initialData.standardNumber || 0);
        setEvidence(initialData.proof || "");
        setDescription(initialData.note || "");
      } else {
        const formattedDate = moment(new Date()).format("DD/MM/YYYY");
        const timestamp = moment(formattedDate, "DD/MM/YYYY").valueOf();
        setEntryDate(timestamp);
        setDefaultUnits([]);
        setDefaultUsers([]);
        setLocation("");
        setNumberOfTime(0);
        setStandardValues(0);
        setFromDate(0);
        setToDate(0);
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
      <div className="grid grid-cols-5 gap-5 mb-3">
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
          <p className="font-medium text-neutral-600">Từ ngày</p>
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
          <p className="font-medium text-neutral-600">Đến ngày</p>
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
      <div className="flex flex-col gap-1 mb-3">
        <p className="font-medium text-neutral-600">
          Địa điểm <span className="text-red-500">(*)</span>
        </p>

        <TextArea
          autoSize
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-6 mb-3">
        <div className="flex flex-col gap-1">
          <p className="font-medium text-neutral-600">Đơn vị</p>
          <Select
            showSearch
            disabled={isBlock}
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
            disabled={isBlock}
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
      <div className="grid grid-cols-3 gap-6 mb-3">
        <div className="flex flex-col gap-1">
          <p className="font-medium text-neutral-600">Vị trí tham gia</p>
          <Input
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-medium text-neutral-600">Số tiết chuẩn</p>
          <InputNumber
            min={0}
            defaultValue={0}
            value={standardValues}
            onChange={(value) => setStandardValues(value ?? 0)}
            style={{ width: "100%" }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-medium text-neutral-600">Số buổi</p>
          <InputNumber
            min={0}
            defaultValue={0}
            value={numberOfTime}
            onChange={(value) => setNumberOfTime(value ?? 0)}
            style={{ width: "100%" }}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1 mb-3">
        <p className="font-medium text-neutral-600">Ghi chú</p>
        <TextArea
          autoSize
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-[2px]">
        <span className="font-medium text-neutral-600">
          Thông tin thanh toán
        </span>
        <div>
          {isPayment ? (
            <>
              {isPayment.isRejected ? (
                <>
                  <div>
                    <span className="text-red-500">
                      <CloseOutlined className="me-1" /> Từ chối
                    </span>
                    {" - "}P.TC đã từ chối vào lúc{" "}
                    <strong>
                      {convertTimestampToFullDateTime(isPayment.approvedTime)}
                    </strong>
                  </div>
                  <div>- Lý do: {isPayment.reason}</div>
                </>
              ) : (
                <>
                  <div>
                    <span className="text-green-500">
                      <SafetyOutlined className="me-1" /> Đã duyệt
                    </span>
                    {" - "}P.TC đã phê duyệt vào lúc{" "}
                    <strong>
                      {convertTimestampToFullDateTime(isPayment.approvedTime)}
                    </strong>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <div>
                <span className="text-sky-500">
                  <Spin size="small" className="mx-1" /> Chờ duyệt
                </span>{" "}
                {" - "} Đợi phê duyệt từ P.TC
              </div>
            </>
          )}
        </div>
      </div>
    </form>
  );
};

export default FormBM03;
