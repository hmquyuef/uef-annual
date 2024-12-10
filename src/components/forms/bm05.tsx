"use client";

import { getDataExportByUnitCode } from "@/services/exports/exportsServices";
import {
  ActivityInput,
  ActivityItem,
  AddUpdateActivityItem,
  deleteActivities,
  getAllActivities,
  ImportActivities,
  postAddActivity,
  putUpdateActivity,
  putUpdateApprovedActivity,
} from "@/services/forms/formsServices";
import { PaymentApprovedItem } from "@/services/forms/PaymentApprovedItem";
import {
  DisplayRoleItem,
  getRoleByName,
  RoleItem,
} from "@/services/roles/rolesServices";
import { getAllUnits, UnitItem } from "@/services/units/unitsServices";
import PageTitles from "@/utility/Constraints";
import Messages from "@/utility/Messages";
import {
  convertTimestampToDate,
  convertTimestampToFullDateTime,
  defaultFooterInfo,
  setCellStyle,
} from "@/utility/Utilities";
import {
  ArrowsAltOutlined,
  CheckOutlined,
  CloseCircleOutlined,
  CloseOutlined,
  DeleteOutlined,
  FileExcelOutlined,
  FileProtectOutlined,
  PlusOutlined,
  SafetyOutlined,
  ShrinkOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  ConfigProvider,
  DatePicker,
  Dropdown,
  Empty,
  Input,
  MenuProps,
  Modal,
  PaginationProps,
  Select,
  Skeleton,
  Spin,
  Table,
  TableColumnsType,
  Tag,
  Tooltip,
} from "antd";
import { TableRowSelection } from "antd/es/table/interface";
import { saveAs } from "file-saver";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { Key, useCallback, useEffect, useState } from "react";
import * as XLSX from "sheetjs-style";
import CustomModal from "../CustomModal";
import CustomNotification from "../CustomNotification";
import FormActivity from "./activity/formActivity";

import { getAllSchoolYears } from "@/services/schoolYears/schoolYearsServices";
import locale from "antd/locale/vi_VN";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");

const { Search } = Input;

const BM05 = () => {
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [units, setUnits] = useState<UnitItem[]>([]);
  const [selectedKeyUnit, setSelectedKeyUnit] = useState<Key | null>(null);
  const [data, setData] = useState<ActivityItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isUpload, setIsUpload] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<
    Partial<AddUpdateActivityItem> | undefined
  >(undefined);
  const [message, setMessage] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
  const [defaultYears, setDefaultYears] = useState<any>();
  const [selectedKey, setSelectedKey] = useState<any>();
  const [startDate, setStartDate] = useState<number | 0>(0);
  const [minStartDate, setMinStartDate] = useState<number | 0>(0);
  const [endDate, setEndDate] = useState<number | 0>(0);
  const [maxEndDate, setMaxEndDate] = useState<number | 0>(0);
  const [advanced, setAdvanced] = useState(false);
  const [isShowPdf, setIsShowPdf] = useState(false);
  const [selectedDates, setSelectedDates] = useState<
    [Dayjs | null, Dayjs | null] | null
  >(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [role, setRole] = useState<RoleItem>();
  const [isBlock, setIsBlock] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [reason, setReason] = useState("");
  const [isPayments, setIsPayments] = useState<PaymentApprovedItem>();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
  });

  const getDefaultYears = async () => {
    const { items } = await getAllSchoolYears();
    if (items) {
      setDefaultYears(items);
      const defaultYear = items.find((x: any) => x.isDefault);
      if (defaultYear) {
        const { id, startDate, endDate } = defaultYear;
        setSelectedKey(defaultYear);
        getListActivities(id);
        setStartDate(startDate);
        setMinStartDate(startDate);
        setEndDate(endDate);
        setMaxEndDate(endDate);
      }
    }
  };

  const getListActivities = async (yearId: string) => {
    const response = await getAllActivities(yearId);
    setActivities(response.items);
    setData(response.items);
    setNotificationOpen(false);
    setIsUpload(false);
  };

  const getListUnits = async () => {
    const response = await getAllUnits("true");
    setUnits(response.items);
  };
  const onSelectChange = (newSelectedRowKeys: Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection: TableRowSelection<ActivityItem> = {
    selectedRowKeys,
    getCheckboxProps: (record: ActivityItem) => ({
      disabled: record.payments?.isBlockData ?? false,
    }),
    onChange: onSelectChange,
  };
  const showTotal: PaginationProps["showTotal"] = (total) => (
    <p className="w-full text-start">
      Đã chọn {selectedRowKeys.length} / {total} dòng dữ liệu
    </p>
  );

  //render columns
  const columns: TableColumnsType<ActivityItem> = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      render: (_, __, index) => (
        <>{pagination.pageSize * (pagination.current - 1) + index + 1}</>
      ),
      className: "text-center w-[40px]",
    },
    {
      title: "TÊN HOẠT ĐỘNG",
      dataIndex: "name",
      key: "name",
      className: "max-w-24",
      render: (name: string, record: ActivityItem) => {
        const path = record.determinations?.file?.path;
        return (
          <span
            className={`${
              path ? "text-blue-500" : "text-red-400"
            } font-semibold cursor-pointer`}
            onClick={() => {
              handleEdit(record);
              setIsBlock(record.payments?.isBlockData ?? false);
              setIsPayments(record.payments);
            }}
          >
            {name}
          </span>
        );
      },
    },
    {
      title: (
        <>
          SỐ VĂN BẢN <br /> NGÀY LẬP
        </>
      ),
      dataIndex: ["determinations", "number"],
      key: "number",
      className: "w-[9rem]",
      render: (number: string, record: ActivityItem) => {
        const ngayLap = record.determinations?.fromDate;
        return (
          <div className="flex flex-col">
            <span className="text-center font-medium">{number}</span>
            <span className="text-center text-[13px]">
              {convertTimestampToDate(ngayLap)}
            </span>
          </div>
        );
      },
    },
    {
      title: "ĐƠN VỊ",
      dataIndex: ["participants", 0, "unitName"],
      key: "unitName",
      render: (unitName: string) => <p>{unitName}</p>,
      className: "text-center w-[6rem]",
    },
    {
      title: (
        <>
          THỜI GIAN <br /> HOẠT ĐỘNG
        </>
      ),
      dataIndex: ["determinations", "eventDate"],
      key: "eventDate",
      render: (eventDate: number) =>
        eventDate ? convertTimestampToDate(eventDate) : " ",
      className: "text-center w-[100px]",
    },
    {
      title: (
        <div className="p-1">
          TÀI LIỆU <br /> ĐÍNH KÈM
        </div>
      ),
      dataIndex: ["determinations", "file", "path"],
      key: "path",
      className: "text-center w-[95px]",
      sorter: (a, b) =>
        a.determinations?.file?.path.localeCompare(
          b.determinations?.file?.path
        ),
      render: (path: string) => {
        return path !== "" && path !== undefined ? (
          <>
            <Link
              href={"https://api-annual.uef.edu.vn/" + path}
              target="__blank"
            >
              <p className="text-green-500">
                <CheckOutlined />
              </p>
            </Link>
          </>
        ) : (
          <>
            <p className="text-red-400">
              <CloseOutlined />
            </p>
          </>
        );
      },
    },
    {
      title: (
        <div className="bg-orange-400 p-1">
          SỐ LƯU <br /> VĂN BẢN
        </div>
      ),
      dataIndex: "documentNumber",
      key: "documentNumber",
      className: "text-center w-[5rem]",
      render: (number: string, item: ActivityItem) => {
        const path = item.determinations?.file?.path;
        return (
          <>
            <p className="ml-2">
              <Tag
                color={`${
                  path !== "" && path !== undefined ? "blue" : "error"
                }`}
              >
                {number}
              </Tag>
            </p>
          </>
        );
      },
    },
    {
      title: <div className="bg-orange-400 p-1">NGÀY NHẬP VĂN BẢN</div>,
      dataIndex: ["determinations", "entryDate"],
      key: "entryDate",
      sorter: (a, b) =>
        a.determinations?.entryDate - b.determinations?.entryDate,
      render: (fromDate: number) =>
        fromDate ? convertTimestampToDate(fromDate) : "",
      className: "text-center w-[100px]",
    },
    {
      title: (
        <div className="bg-rose-500 p-1 rounded-tr-lg">
          PHÊ DUYỆT <br /> THANH TOÁN
        </div>
      ),
      dataIndex: ["payments", "isRejected"],
      key: "isRejected",
      render: (isRejected: boolean, record: ActivityItem) => {
        const time = record.payments?.approvedTime
          ? convertTimestampToFullDateTime(record.payments.approvedTime)
          : "";
        const reason = record.payments?.reason;
        return (
          <>
            {record.payments ? (
              <>
                {isRejected ? (
                  <Tooltip
                    title={
                      <>
                        <div>- P.TC đã từ chối vào lúc {time}</div>
                        <div>- Lý do: {reason}</div>
                      </>
                    }
                  >
                    <span className="text-red-500">
                      <CloseOutlined className="me-1" /> Từ chối
                    </span>
                  </Tooltip>
                ) : (
                  <Tooltip
                    title={
                      <>
                        <div>- P.TC đã phê duyệt vào lúc {time}</div>
                      </>
                    }
                  >
                    <span className="text-green-500">
                      <SafetyOutlined className="me-1" /> Đã duyệt
                    </span>
                  </Tooltip>
                )}
              </>
            ) : (
              <>
                <Tooltip
                  title={
                    <>
                      <div>- Đợi phê duyệt từ P.TC</div>
                    </>
                  }
                >
                  <span className="text-sky-500 flex justify-center items-center gap-2">
                    <Spin size="small" /> Chờ duyệt
                  </span>
                </Tooltip>
              </>
            )}
          </>
        );
      },
      className: "text-center w-[110px]",
    },
  ];

  const itemsApproved: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <p onClick={() => handleApproved(false)} className="font-medium">
          Chấp nhận
        </p>
      ),
      icon: <SafetyOutlined />,
      style: { color: "#52c41a" },
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: (
        <p onClick={() => setIsModalVisible(true)} className="font-medium">
          Từ chối
        </p>
      ),
      icon: <CloseCircleOutlined />,
      style: { color: "rgb(220 38 38)" },
    },
  ];

  const onSearch = (value: string) => {
    if (
      value === "" &&
      (!selectedKeyUnit || selectedKeyUnit === "all") &&
      (!startDate || !endDate)
    ) {
      setData(activities);
      return;
    }
    const selectedUnit = units.find(
      (unit: UnitItem) => unit.idHrm === selectedKeyUnit
    );

    const filteredData = activities.filter((item) => {
      const matchesNameOrDocument =
        item.name.toLowerCase().includes(value.toLowerCase()) ||
        item.documentNumber.toLowerCase().includes(value.toLowerCase()) ||
        item.determinations.number
          .toLocaleLowerCase()
          .includes(value.toLocaleLowerCase());
      const matchesUnit = selectedUnit
        ? item.participants[0]?.unitName
            .toString()
            .includes(
              selectedUnit.code.toString().replace(/&/g, "-").replace(/_/g, "")
            )
        : true;

      const matchesDate =
        startDate && endDate
          ? item.determinations.eventDate >= startDate &&
            item.determinations.eventDate <= endDate
          : true;

      return matchesNameOrDocument && matchesUnit && matchesDate;
    });
    setData(filteredData);
  };

  const handleDelete = useCallback(async () => {
    try {
      const selectedKeysArray = Array.from(selectedRowKeys) as string[];
      if (selectedKeysArray.length > 0) {
        await deleteActivities(selectedKeysArray);
        setNotificationOpen(true);
        setStatus("success");
        setMessage("Thông báo");
        setDescription(
          `Đã xóa thành công ${selectedKeysArray.length} hoạt động!`
        );
        await getListActivities(selectedKey.id);
        setSelectedRowKeys([]);
      }
    } catch (error) {
      console.error("Error deleting selected items:", error);
    }
  }, [selectedRowKeys]);

  const handleEdit = (activity: ActivityItem) => {
    const updatedActivity: Partial<AddUpdateActivityItem> = {
      ...activity,
      participants: activity.participants.map((participant) => ({
        ...participant,
        unitName: participant.unitName.toString(),
        userName: participant.userName,
        description: participant.description,
      })),
    };
    setSelectedItem(updatedActivity);
    setIsPayments(activity.payments);
    setMode("edit");
    setIsOpen(true);
  };
  const handleSubmit = async (formData: Partial<AddUpdateActivityItem>) => {
    try {
      if (mode === "edit" && selectedItem) {
        const updatedFormData: Partial<AddUpdateActivityItem> = {
          ...formData,
          participants: formData.participants as ActivityInput[],
        };
        const response = await putUpdateActivity(
          formData.id as string,
          updatedFormData
        );
        if (response) {
          setDescription("Cập nhật hoạt động thành công!");
        }
      } else {
        const newFormData: Partial<AddUpdateActivityItem> = {
          ...formData,
          participants: formData.participants as ActivityInput[],
        };
        const response = await postAddActivity(newFormData);
        if (response) {
          setDescription("Thêm mới hoạt động thành công!");
        }
      }
      setNotificationOpen(true);
      setStatus("success");
      setMessage("Thông báo");
      await getListActivities(selectedKey.id);
      setIsOpen(false);
      setSelectedItem(undefined);
      setMode("add");
    } catch (error) {
      setNotificationOpen(true);
      setStatus("error");
      setMessage("Thông báo");
      setDescription(Messages.ERROR);
    }
  };

  const handleSubmitUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await ImportActivities(formData);
      if (response) {
        setNotificationOpen(true);
        setStatus("success");
        setMessage("Thông báo");
        setDescription(`Tải lên thành công ${response.totalCount} hoạt động!`);
      }
      await getListActivities(selectedKey.id);
      setIsOpen(false);
      setSelectedItem(undefined);
      setMode("add");
      setIsUpload(false);
    } catch (error) {
      setIsOpen(false);
      setNotificationOpen(true);
      setStatus("error");
      setMessage("Thông báo");
      setDescription(Messages.ERROR);
      setIsUpload(false);
    }
  };

  const handleExportExcel = async () => {
    const unit = units.find(
      (unit: any) => unit.idHrm === selectedKeyUnit
    ) as any;
    const formData: Partial<any> = {
      unitCode: unit?.code,
      years: selectedKey.id,
      startDate,
      endDate,
    };
    const results = await getDataExportByUnitCode(formData);
    if (results) {
      const defaultInfo = [
        ["", "", "", "", "", "", "", "", "BM-05"],
        [
          "TRƯỜNG ĐẠI HỌC KINH TẾ - TÀI CHÍNH",
          "",
          "",
          "",
          "",
          "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM",
        ],
        [
          "THÀNH PHỐ HỒ CHÍ MINH",
          "",
          "",
          "",
          "",
          "Độc lập - Tự do - Hạnh phúc",
        ],
        ["(ĐƠN VỊ)", "", "", ""],
        ["TỔNG HỢP DANH SÁCH"],
        [
          "Tham gia Ban tổ chức các hoạt động báo cáo chuyên đề, Hội thảo khoa học; Các cuộc thi học thuật; Hướng dẫn/hỗ trợ sinh viên tham gia các cuộc thi, … được BĐH phê duyệt tiết chuẩn",
        ],
        [""],
      ];

      const dataArray = [
        [
          "STT",
          "Mã số CB-GV-NV",
          "Họ và Tên",
          "Đơn vị",
          "Tên hoạt động",
          "Số tiết chuẩn",
          "Số văn bản, ngày lập",
          "Thời gian hoạt động",
          "Ghi chú",
        ],
        ...(unit?.code === undefined || unit?.code === null
          ? results.data.map((item: any, index: number) => [
              index + 1,
              item.userName,
              item.middleName + " " + item.firstName,
              item.faculityName,
              item.activityName,
              item.standNumber,
              item.determination + ", " + convertTimestampToDate(item.fromDate),
              item.eventDate ? convertTimestampToDate(item.eventDate) : "",
              item.note ?? "",
            ])
          : results.data
              .sort((a: any, b: any) => {
                if (a.eventDate === b.eventDate) {
                  return a.userName.localeCompare(b.userName);
                }
                return a.eventDate - b.eventDate;
              })
              .map((item: any, index: number) => [
                index + 1,
                item.userName,
                item.middleName + " " + item.firstName,
                item.faculityName,
                item.activityName,
                item.standNumber,
                item.determination +
                  ", " +
                  convertTimestampToDate(item.fromDate),
                item.eventDate ? convertTimestampToDate(item.eventDate) : "",
                item.note ?? "",
              ])),
        [
          "TỔNG SỐ TIẾT CHUẨN",
          "",
          "",
          "",
          "",
          `${results.data.reduce((acc, x) => acc + x.standNumber, 0)}`,
          "",
          "",
          "",
        ],
      ];

      const combinedData = [...defaultInfo, ...dataArray];
      const combinedFooterData = [...combinedData, ...defaultFooterInfo];
      const worksheet = XLSX.utils.aoa_to_sheet(combinedFooterData);
      worksheet["!pageSetup"] = {
        paperSize: 9,
        orientation: "landscape",
        scale: 100,
        fitToWidth: 1,
        fitToHeight: 0,
        fitToPage: true,
      };
      worksheet["!margins"] = {
        left: 0.1,
        right: 0.1,
        top: 0.1,
        bottom: 0.1,
        header: 0,
        footer: 0,
      };
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      worksheet["!rows"] = [];
      worksheet["!rows"][5] = { hpx: 40 }; // Chiều cao hàng thứ 6 là 40 pixel
      worksheet["!cols"] = [];
      worksheet["!cols"][0] = { wch: 4 };
      worksheet["!cols"][1] = { wch: 20 };
      worksheet["!cols"][2] = { wch: 20 };
      worksheet["!cols"][3] = { wch: 15 };
      worksheet["!cols"][4] = { wch: 45 };
      worksheet["!cols"][6] = { wch: 12 };
      worksheet["!cols"][7] = { wch: 10 };
      worksheet["!cols"][8] = { wch: 15 };
      worksheet["I1"].s = {
        fill: {
          fgColor: { rgb: "FFFF00" },
        },
        font: {
          name: "Times New Roman",
          sz: 11,
        },
        alignment: {
          wrapText: true,
          vertical: "center",
          horizontal: "center",
        },
        border: {
          top: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
          bottom: { style: "thin" },
        },
      };
      setCellStyle(worksheet, "A2", 11, true, "center", "center", false, false);
      setCellStyle(worksheet, "F2", 11, true, "center", "center", false, false);
      setCellStyle(worksheet, "A3", 11, true, "center", "center", false, false);
      setCellStyle(worksheet, "F3", 11, true, "center", "center", false, false);
      setCellStyle(worksheet, "A4", 11, true, "center", "center", false, false);
      setCellStyle(worksheet, "A5", 16, true, "center", "center", false, false);
      setCellStyle(worksheet, "A6", 11, true, "center", "center", true, false);

      // Merge các ô từ A6 đến M6
      worksheet["!merges"] = [];
      const tempMerge = [];
      const range = XLSX.utils.decode_range(worksheet["!ref"]!);
      for (let row = 7; row <= range.e.r - 1; row++) {
        if (row === range.e.r - defaultFooterInfo.length)
          tempMerge.push({ s: { r: row, c: 0 }, e: { r: row, c: 4 } });
        if (row < range.e.r - defaultFooterInfo.length)
          worksheet["!rows"][row + 1] = { hpx: 45 };
        for (let col = 0; col <= range.e.c; col++) {
          const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
          if (worksheet[cellRef]) {
            worksheet[cellRef].s = {
              font: {
                name: "Times New Roman",
                sz: 11,
                bold:
                  row === 7 || col === 1 || col === 2 || col === 3
                    ? true
                    : false,
              },
              alignment: {
                wrapText: true,
                vertical: "center",
                horizontal:
                  row > 7 && (col === 1 || col === 2 || col === 4 || col === 8)
                    ? "left"
                    : "center",
              },
              border: {
                top: { style: "thin" },
                left: { style: "thin" },
                right: { style: "thin" },
                bottom: { style: "thin" },
              },
            };
          }
          if (row === range.e.r - defaultFooterInfo.length)
            setCellStyle(
              worksheet,
              cellRef,
              11,
              true,
              "center",
              "center",
              true,
              true
            );
        }
      }

      const defaultMerges = [
        { s: { r: 1, c: 0 }, e: { r: 1, c: 3 } },
        { s: { r: 1, c: 5 }, e: { r: 1, c: 8 } },
        { s: { r: 2, c: 0 }, e: { r: 2, c: 3 } },
        { s: { r: 2, c: 5 }, e: { r: 2, c: 8 } },
        { s: { r: 3, c: 0 }, e: { r: 3, c: 3 } },
        { s: { r: 4, c: 0 }, e: { r: 4, c: 8 } },
        { s: { r: 5, c: 0 }, e: { r: 5, c: 8 } },
      ];

      for (
        let row = range.e.r - defaultFooterInfo.length + 1;
        row <= range.e.r;
        row++
      ) {
        if (row < range.e.r)
          tempMerge.push({ s: { r: row, c: 0 }, e: { r: row, c: 8 } });
        else tempMerge.push({ s: { r: row, c: 0 }, e: { r: row, c: 2 } });
        for (let col = range.s.c; col <= range.e.c; col++) {
          const cellRef = XLSX.utils.encode_cell({ r: row, c: col });

          if (row === range.e.r - 6)
            setCellStyle(
              worksheet,
              cellRef,
              11,
              true,
              "left",
              "center",
              true,
              false
            );
          else
            setCellStyle(
              worksheet,
              cellRef,
              11,
              false,
              "left",
              "center",
              true,
              false
            );
          if (row === range.e.r)
            setCellStyle(
              worksheet,
              cellRef,
              11,
              true,
              "center",
              "center",
              true,
              false
            );
        }
      }
      worksheet["!merges"].push(...defaultMerges, ...tempMerge);
      // Xuất file Excel
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const blob = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });
      const now = new Date();
      const formattedDate = `${String(now.getDate()).padStart(2, "0")}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}-${now.getFullYear()}-${String(
        now.getHours()
      ).padStart(2, "0")}-${String(now.getMinutes()).padStart(2, "0")}`;
      let filename = unit?.code
        ? "BM05-" + unit?.code + "-" + formattedDate + ".xlsx"
        : "BM05-" + formattedDate + ".xlsx";
      saveAs(blob, filename);
    }
  };

  const handleTableChange = (pagination: PaginationProps) => {
    setPagination({
      current: pagination.current || 1,
      pageSize: pagination.pageSize || 15,
    });
    Cookies.set(
      "p_s",
      JSON.stringify([pagination.current, pagination.pageSize])
    );
  };
  const handleApproved = async (isRejected: boolean) => {
    const formData = {
      ids: selectedRowKeys.length > 0 ? selectedRowKeys : [selectedItem?.id],
      paymentInfo: {
        approver: userName,
        approvedTime: Math.floor(Date.now() / 1000),
        isRejected: isRejected,
        reason: reason,
        isBlockData: true,
      },
    };
    try {
      if (selectedRowKeys.length > 0 || selectedItem) {
        const response = await putUpdateApprovedActivity(formData);
        if (response) {
          setDescription(
            isRejected
              ? `${Messages.REJECTED_ACTIVITY} (${
                  selectedRowKeys.length > 0 ? selectedRowKeys.length : 1
                } dòng)`
              : `${Messages.APPROVED_ACTIVITY} (${
                  selectedRowKeys.length > 0 ? selectedRowKeys.length : 1
                } dòng)`
          );
        }
      }
      setSelectedRowKeys([]);
      setNotificationOpen(true);
      setStatus("success");
      setMessage("Thông báo");
      await getListActivities(selectedKey.id);
      setIsOpen(false);
      setSelectedItem(undefined);
      setMode("add");
    } catch (error) {
      setNotificationOpen(true);
      setStatus("error");
      setMessage("Thông báo");
      setDescription(Messages.ERROR);
    }
  };

  const handleChangeYear = (value: any) => {
    setLoading(true);
    const temp = defaultYears.filter((x: any) => x.id === value)[0] as any;
    setSelectedKey(temp);
    getListActivities(temp.id);
    setStartDate(temp.startDate);
    setEndDate(temp.endDate);
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timeoutId);
  };

  const getDisplayRole = async (name: string) => {
    const response = await getRoleByName(name);
    setRole(response.items[0]);
  };

  useEffect(() => {
    setLoading(true);
    document.title = PageTitles.BM05;
    const pageState = Cookies.get("p_s");
    if (pageState) {
      const [current, pageSize] = JSON.parse(pageState);
      setPagination({
        current,
        pageSize,
      });
    }
    Promise.all([getDefaultYears(), getListUnits()]);
    const token = Cookies.get("s_t");
    if (token) {
      const decodedRole = jwtDecode<{
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
      }>(token);
      const role =
        decodedRole[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];
      getDisplayRole(role as string);
      const decodedUserName = jwtDecode(token);
      if (decodedUserName.sub) {
        setUserName(decodedUserName.sub);
      }
      if (role === "secretary") {
        const decodedUnitId = jwtDecode<{
          family_name: string;
        }>(token);
        const unitId = decodedUnitId.family_name;
        if (unitId && unitId !== selectedKeyUnit) {
          setSelectedKeyUnit(unitId.toLowerCase());
        }
      }
    }
    setLoading(false);
    onSearch("");
  }, []);

  useEffect(() => {
    if (
      activities.length > 0 &&
      units.length > 0 &&
      (selectedKeyUnit || startDate || endDate)
    ) {
      onSearch("");
    }
  }, [activities, units, selectedKeyUnit, startDate, endDate]);

  return (
    <div>
      <div className="grid grid-cols-3 mb-4">
        <div className="col-span-2">
          <AnimatePresence>
            <motion.div
              initial={{ height: "h-fit", opacity: 1 }}
              animate={
                advanced
                  ? { height: "auto", opacity: 1 }
                  : { height: 57, opacity: 1 }
              }
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className={`grid ${
                advanced ? "grid-rows-2" : "grid-cols-1"
              } gap-2`}
            >
              <div className="grid grid-cols-6 gap-3">
                <div className="col-span-2 flex flex-col justify-center gap-1">
                  <span className="text-[14px] text-neutral-500">
                    Tìm kiếm:
                  </span>
                  <Search placeholder=" " onSearch={onSearch} enterButton />
                </div>
                <div
                  className="col-span-2"
                  hidden={role && role.name === "secretary"}
                >
                  <div className="flex flex-col justify-center gap-1">
                    <span className="text-[14px] text-neutral-500">
                      Đơn vị:
                    </span>
                    <Select
                      showSearch
                      allowClear
                      placeholder="Tất cả đơn vị"
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
                      value={selectedKeyUnit}
                      onChange={(value) => {
                        setSelectedKeyUnit(value);
                      }}
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <Button
                    color="primary"
                    variant="filled"
                    icon={advanced ? <ShrinkOutlined /> : <ArrowsAltOutlined />}
                    onClick={() => setAdvanced(!advanced)}
                  >
                    {advanced ? "Thu nhỏ" : "Mở rộng"}
                  </Button>
                </div>
              </div>
              <AnimatePresence>
                {advanced && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="grid grid-cols-6 gap-3"
                  >
                    <div className="flex flex-col justify-center gap-1">
                      <span className="text-[14px] text-neutral-500">
                        Năm học:
                      </span>
                      <Select
                        showSearch
                        optionFilterProp="label"
                        filterSort={(optionA, optionB) =>
                          (optionA?.title ?? "").localeCompare(
                            optionB?.title ?? ""
                          )
                        }
                        options={defaultYears?.map((year: any) => ({
                          value: year.id,
                          label: year.title,
                        }))}
                        //
                        value={selectedKey && selectedKey.title}
                        onChange={(value) => handleChangeYear(value)}
                        className="w-full"
                      />
                    </div>
                    <div className="flex flex-col justify-center gap-1">
                      <span className="text-[14px] text-neutral-500">
                        Từ ngày:
                      </span>
                      <ConfigProvider locale={locale}>
                        <DatePicker
                          allowClear={false}
                          placeholder="dd/mm/yyyy"
                          format="DD/MM/YYYY"
                          minDate={dayjs
                            .unix(minStartDate)
                            .tz("Asia/Ho_Chi_Minh")}
                          maxDate={dayjs
                            .unix(maxEndDate)
                            .tz("Asia/Ho_Chi_Minh")}
                          value={
                            startDate
                              ? dayjs.unix(startDate).tz("Asia/Ho_Chi_Minh")
                              : null
                          }
                          onChange={(date) => {
                            if (date) {
                              const timestamp = dayjs(date)
                                .tz("Asia/Ho_Chi_Minh")
                                .unix();
                              setStartDate(timestamp);
                            } else {
                              setStartDate(0);
                            }
                          }}
                        />
                      </ConfigProvider>
                    </div>
                    <div className="flex flex-col justify-center gap-1">
                      <span className="text-[14px] text-neutral-500">
                        Đến ngày:
                      </span>
                      <ConfigProvider locale={locale}>
                        <DatePicker
                          allowClear={false}
                          placeholder="dd/mm/yyyy"
                          format="DD/MM/YYYY"
                          minDate={dayjs
                            .unix(minStartDate)
                            .tz("Asia/Ho_Chi_Minh")}
                          maxDate={dayjs
                            .unix(maxEndDate)
                            .tz("Asia/Ho_Chi_Minh")}
                          value={
                            endDate
                              ? dayjs.unix(endDate).tz("Asia/Ho_Chi_Minh")
                              : null
                          }
                          onChange={(date) => {
                            if (date) {
                              const timestamp = dayjs(date)
                                .tz("Asia/Ho_Chi_Minh")
                                .unix();
                              setEndDate(timestamp);
                            } else {
                              setEndDate(0);
                            }
                          }}
                        />
                      </ConfigProvider>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex justify-end mt-6 gap-3">
          {role?.displayRole.isApprove && role?.displayRole.isReject && (
            <>
              <Tooltip placement="top" title="Phê duyệt dữ liệu" arrow={true}>
                <Dropdown menu={{ items: itemsApproved }} trigger={["click"]}>
                  <a onClick={(e) => e.preventDefault()}>
                    <Button
                      type="primary"
                      icon={<FileProtectOutlined />}
                      disabled={selectedRowKeys.length === 0}
                    >
                      Phê duyệt{" "}
                      {selectedRowKeys.length !== 0
                        ? `(${selectedRowKeys.length})`
                        : ""}
                    </Button>
                  </a>
                </Dropdown>
              </Tooltip>
            </>
          )}
          {role?.displayRole.isExport && (
            <>
              <Tooltip placement="top" title="Xuất dữ liệu Excel" arrow={true}>
                <Button
                  icon={<FileExcelOutlined />}
                  onClick={handleExportExcel}
                  iconPosition="start"
                  style={{
                    backgroundColor: "#52c41a",
                    borderColor: "#52c41a",
                    color: "#fff",
                  }}
                >
                  Xuất Excel
                </Button>
              </Tooltip>
            </>
          )}
          {role?.displayRole.isCreate && (
            <>
              <Tooltip
                placement="top"
                title={"Thêm mới hoạt động"}
                arrow={true}
              >
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setIsOpen(true);
                    setMode("add");
                  }}
                  iconPosition="start"
                >
                  Thêm hoạt động
                </Button>
              </Tooltip>
            </>
          )}
          {role?.displayRole.isDelete && (
            <>
              <Tooltip placement="top" title="Xóa các hoạt động" arrow={true}>
                <Button
                  type="dashed"
                  disabled={selectedRowKeys.length === 0}
                  danger
                  onClick={handleDelete}
                  icon={<DeleteOutlined />}
                >
                  Xóa{" "}
                  {selectedRowKeys.length !== 0
                    ? `(${selectedRowKeys.length})`
                    : ""}
                </Button>
              </Tooltip>
            </>
          )}
        </div>
        <CustomNotification
          message={message}
          description={description}
          status={status}
          isOpen={isNotificationOpen}
        />
        <CustomModal
          isOpen={isOpen}
          width={isShowPdf ? "85vw" : ""}
          title={mode === "edit" ? "Cập nhật hoạt động" : "Thêm mới hoạt động"}
          role={role || undefined}
          isBlock={isBlock}
          onApprove={() => handleApproved(false)}
          onReject={() => setIsModalVisible(true)}
          onOk={() => {
            const formElement = document.querySelector("form");
            formElement?.dispatchEvent(
              new Event("submit", { cancelable: true, bubbles: true })
            );
          }}
          onCancel={() => {
            setNotificationOpen(false);
            setIsOpen(false);
            setSelectedItem(undefined);
            setMode("add");
            setIsUpload(false);
            setIsShowPdf(false);
          }}
          bodyContent={
            <FormActivity
              key="form-activity-bm05"
              onSubmit={handleSubmit}
              handleShowPDF={setIsShowPdf}
              initialData={selectedItem as Partial<AddUpdateActivityItem>}
              mode={mode}
              numberActivity={data.length}
              isBlock={isBlock}
              isPayment={isPayments}
              displayRole={role?.displayRole ?? ({} as DisplayRoleItem)}
            />
          }
        />
        <Modal
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            setReason("");
          }}
          onOk={() => {
            setIsModalVisible(false);
            handleApproved(true);
            setReason("");
          }}
          title="Lý do từ chối"
          width={700}
        >
          <Input value={reason} onChange={(e) => setReason(e.target.value)} />
        </Modal>
      </div>
      <hr className="mb-3" />
      {loading ? (
        <>
          <Card>
            <Skeleton active />
          </Card>
        </>
      ) : (
        <>
          <Table<ActivityItem>
            key={"table-activity-bm05"}
            className="custom-table-header shadow-md rounded-md bg-white"
            bordered
            rowKey={(item) => item.id}
            rowHoverable
            size="small"
            pagination={{
              ...pagination,
              total: data.length,
              showTotal: showTotal,
              showSizeChanger: true,
              position: ["bottomRight"],
              defaultPageSize: 15,
              pageSizeOptions: ["15", "25", "50", "100"],
            }}
            rowSelection={rowSelection}
            columns={columns}
            dataSource={data}
            locale={{
              emptyText: <Empty description="Không có dữ liệu..."></Empty>,
            }}
            onChange={handleTableChange}
          />
        </>
      )}
    </div>
  );
};
export default BM05;
