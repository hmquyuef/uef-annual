"use client";

import { PaymentApprovedItem } from "@/services/forms/PaymentApprovedItem";
import { DisplayRoleItem } from "@/services/roles/rolesServices";
import { getAllUnits, UnitItem } from "@/services/units/unitsServices";
import {
  getUsersFromHRMbyId,
  UsersFromHRM,
  UsersFromHRMResponse,
} from "@/services/users/usersServices";
import { ConfigProvider, DatePicker, InputNumber, Select } from "antd";
import locale from "antd/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import moment from "moment";
import { FC, FormEvent, Key, useEffect, useState } from "react";
import InfoApproved from "./infoApproved";
dayjs.locale("vi");

interface FormBM15Props {
  onSubmit: (formData: Partial<any>) => void;
  initialData?: Partial<any>;
  mode: "add" | "edit";
  isBlock: boolean;
  isPayment?: PaymentApprovedItem;
  displayRole: DisplayRoleItem;
}

const FormBM15: FC<FormBM15Props> = ({
  onSubmit,
  initialData,
  mode,
  isBlock,
  isPayment,
  displayRole,
}) => {
  const [attendanceDays, setAttendanceDays] = useState<number>(0);
  const [attendanceHours, setAttendanceHours] = useState<number>(0);
  const [lateArrivals, setLateArrivals] = useState<number>(0);
  const [earlyDepartures, setEarlyDepartures] = useState<number>(0);
  const [unexcusedAbsences, setUnexcusedAbsences] = useState<number>(0);
  const [leaveDays, setLeaveDays] = useState<number>(0);
  const [maternityLeaveDays, setMaternityLeaveDays] = useState<number>(0);
  const [unpaidLeaveDays, setUnpaidLeaveDays] = useState<number>(0);
  const [businessTripDays, setBusinessTripDays] = useState<number>(0);
  const [missedFingerprint, setMissedFingerprint] = useState<number>(0);
  const [entryDate, setEntryDate] = useState<number>(0);
  const [units, setUnits] = useState<UnitItem[]>([]);
  const [defaultUnits, setDefaultUnits] = useState<UnitItem[]>([]);
  const [users, setUsers] = useState<UsersFromHRMResponse | undefined>(
    undefined
  );
  const [defaultUsers, setDefaultUsers] = useState<UsersFromHRM[]>([]);
  const [selectedKey, setSelectedKey] = useState<Key | null>(null);

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
      attendanceDays: attendanceDays,
      attendanceHours: attendanceHours,
      lateArrivals: lateArrivals,
      earlyDepartures: earlyDepartures,
      unexcusedAbsences: unexcusedAbsences,
      leaveDays: leaveDays,
      maternityLeaveDays: maternityLeaveDays,
      unpaidLeaveDays: unpaidLeaveDays,
      businessTripDays: businessTripDays,
      missedFingerprint: missedFingerprint,
      entryDate: entryDate / 1000,
      note: "",
    };
    onSubmit(formData);
  };

  const ResetForms = () => {
    const formattedDate = moment().format("DD/MM/YYYY");
    const timestamp = moment(formattedDate, "DD/MM/YYYY").valueOf();
    setEntryDate(timestamp);
    setSelectedKey(null);
    setDefaultUnits([]);
    setDefaultUsers([]);
    setAttendanceDays(0);
    setAttendanceHours(0);
    setLateArrivals(0);
    setEarlyDepartures(0);
    setUnexcusedAbsences(0);
    setLeaveDays(0);
    setMaternityLeaveDays(0);
    setUnpaidLeaveDays(0);
    setBusinessTripDays(0);
    setMissedFingerprint(0);
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
        setAttendanceDays(initialData.attendanceDays || 0);
        setAttendanceHours(initialData.attendanceHours);
        setLateArrivals(initialData.lateArrivals);
        setEarlyDepartures(initialData.earlyDepartures);
        setUnexcusedAbsences(initialData.unexcusedAbsences);
        setLeaveDays(initialData.leaveDays);
        setMaternityLeaveDays(initialData.maternityLeaveDays);
        setUnpaidLeaveDays(initialData.unpaidLeaveDays);
        setBusinessTripDays(initialData.businessTripDays);
        setMissedFingerprint(initialData.missedFingerprint);
        setEntryDate(initialData.entryDate);
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
        <div className="grid grid-cols-5 gap-6 mb-2">
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
        <div className="grid grid-cols-5 mb-2 gap-6">
          <div className="flex flex-col gap-1">
            <span className="font-medium text-neutral-600">
              Số ngày chấm công
            </span>
            <InputNumber
              min={0}
              defaultValue={0}
              value={attendanceDays}
              onChange={(value) => setAttendanceDays(value ?? 0)}
              style={{ width: "100%" }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-medium text-neutral-600">
              Số giờ chấm công
            </span>
            <InputNumber
              min={0}
              defaultValue={0}
              value={attendanceHours}
              onChange={(value) => setAttendanceHours(value ?? 0)}
              style={{ width: "100%" }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-medium text-neutral-600">Số buổi đi trễ</span>
            <InputNumber
              min={0}
              defaultValue={0}
              value={lateArrivals}
              onChange={(value) => setLateArrivals(value ?? 0)}
              style={{ width: "100%" }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-medium text-neutral-600">Số buổi về sớm</span>
            <InputNumber
              min={0}
              defaultValue={0}
              value={earlyDepartures}
              onChange={(value) => setEarlyDepartures(value ?? 0)}
              style={{ width: "100%" }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-medium text-neutral-600">
              Số ngày đi công tác
            </span>
            <InputNumber
              min={0}
              defaultValue={0}
              value={businessTripDays}
              onChange={(value) => setBusinessTripDays(value ?? 0)}
              style={{ width: "100%" }}
            />
          </div>
        </div>
        <div className="grid grid-cols-5 mb-4 gap-6">
          <div className="flex flex-col gap-1">
            <span className="font-medium text-neutral-600">
              Nghỉ không phép
            </span>
            <InputNumber
              min={0}
              defaultValue={0}
              value={unexcusedAbsences}
              onChange={(value) => setUnexcusedAbsences(value ?? 0)}
              style={{ width: "100%" }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-medium text-neutral-600">Nghỉ có phép</span>
            <InputNumber
              min={0}
              defaultValue={0}
              value={leaveDays}
              onChange={(value) => setLeaveDays(value ?? 0)}
              style={{ width: "100%" }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-medium text-neutral-600">Nghỉ hậu sản</span>
            <InputNumber
              min={0}
              defaultValue={0}
              value={maternityLeaveDays}
              onChange={(value) => setMaternityLeaveDays(value ?? 0)}
              style={{ width: "100%" }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-medium text-neutral-600">
              Nghỉ không lương
            </span>
            <InputNumber
              min={0}
              defaultValue={0}
              value={unpaidLeaveDays}
              onChange={(value) => setUnpaidLeaveDays(value ?? 0)}
              style={{ width: "100%" }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-medium text-neutral-600">
              Không bấm vân tay
            </span>
            <InputNumber
              min={0}
              defaultValue={0}
              value={missedFingerprint}
              onChange={(value) => setMissedFingerprint(value ?? 0)}
              style={{ width: "100%" }}
            />
          </div>
        </div>
        <hr />
        <InfoApproved mode={mode} isPayment={isPayment} />
      </form>
    </div>
  );
};
export default FormBM15;
