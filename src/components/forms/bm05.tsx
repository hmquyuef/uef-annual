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
import { DisplayRoleItem, getRoleByName, RoleItem } from "@/services/roles/rolesServices";
import {
  getListUnitsFromHrm,
  UnitHRMItem,
} from "@/services/units/unitsServices";
import PageTitles from "@/utility/Constraints";
import {
  convertTimestampToDate,
  convertTimestampToFullDateTime,
  defaultFooterInfo,
  setCellStyle,
} from "@/utility/Utilities";
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  FileExcelOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  SafetyOutlined,
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
import locale from "antd/locale/vi_VN";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/vi";
import { saveAs } from "file-saver";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { Key, useCallback, useEffect, useState } from "react";
import * as XLSX from "sheetjs-style";
import CustomModal from "../CustomModal";
import CustomNotification from "../CustomNotification";
import FormActivity from "./activity/formActivity";
import FromUpload from "./activity/formUpload";
import { PaymentApprovedItem } from "@/services/forms/PaymentApprovedItem";
dayjs.locale("vi");

const { Search } = Input;
const { RangePicker } = DatePicker;

const BM05 = () => {
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [units, setUnits] = useState<UnitHRMItem[]>([]);
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
  const [startDate, setStartDate] = useState<number | null>(null);
  const [endDate, setEndDate] = useState<number | null>(null);
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
  const getListActivities = async () => {
    const response = await getAllActivities();
    setActivities(response.items);
    setData(response.items);
    setNotificationOpen(false);
    setIsUpload(false);
  };

  const getAllUnitsFromHRM = async () => {
    const response = await getListUnitsFromHrm();
    setUnits(response.model);
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
      className: "text-center w-[20px]",
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
      className: "text-center w-[80px]",
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
      render: (fromDate: number) =>
        fromDate ? convertTimestampToDate(fromDate) : "",
      className: "text-center w-[2rem]",
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

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <p
          onClick={() => {
            setIsOpen(true);
            setMode("add");
          }}
          className="font-medium"
        >
          Thêm mới
        </p>
      ),
      icon: <PlusCircleOutlined />,
      style: { color: "#1890ff" },
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: (
        <p
          onClick={() => {
            setIsOpen(true);
            setMode("add");
            setIsUpload(true);
          }}
          className="font-medium"
        >
          Import Excel
        </p>
      ),
      icon: <FileExcelOutlined />,
      style: { color: "#52c41a" },
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

    const selectedUnit = units.find((unit) => unit.id === selectedKeyUnit);
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

  useEffect(() => {
    onSearch("");
  }, [selectedKeyUnit, startDate, endDate]);

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
        await getListActivities();
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
      await getListActivities();
      setIsOpen(false);
      setSelectedItem(undefined);
      setMode("add");
    } catch (error) {
      setNotificationOpen(true);
      setStatus("error");
      setMessage("Thông báo");
      setDescription("Đã có lỗi xảy ra!");
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
      await getListActivities();
      setIsOpen(false);
      setSelectedItem(undefined);
      setMode("add");
      setIsUpload(false);
    } catch (error) {
      setIsOpen(false);
      setNotificationOpen(true);
      setStatus("error");
      setMessage("Thông báo");
      setDescription("Đã có lỗi xảy ra!");
      setIsUpload(false);
    }
  };

  const handleExportExcel = async () => {
    const unit = units.find((unit) => unit.id === selectedKeyUnit);
    const results = await getDataExportByUnitCode(
      unit?.code ?? null,
      startDate,
      endDate
    );
    if (results) {
      const defaultInfo = [
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "BM-05"],
        [
          "TRƯỜNG ĐẠI HỌC KINH TẾ - TÀI CHÍNH",
          "",
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
          "",
          "Đơn vị",
          "Tên hoạt động",
          "",
          "",
          "",
          "Số tiết chuẩn",
          "Số văn bản, ngày lập",
          "",
          "Thời gian hoạt động",
          "Ghi chú",
        ],
        ...(unit?.code === undefined || unit?.code === null
          ? results.data.map((item: any, index: number) => [
              index + 1,
              item.userName,
              item.middleName + " " + item.firstName,
              "",
              item.faculityName,
              item.activityName,
              "",
              "",
              "",
              item.standNumber,
              item.determination + ", " + convertTimestampToDate(item.fromDate),
              "",
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
                "",
                item.faculityName,
                item.activityName,
                "",
                "",
                "",
                item.standNumber,
                item.determination +
                  ", " +
                  convertTimestampToDate(item.fromDate),
                "",
                item.eventDate ? convertTimestampToDate(item.eventDate) : "",
                item.note ?? "",
              ])),
        [
          "TỔNG SỐ TIẾT CHUẨN",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          `${results.data.reduce((acc, x) => acc + x.standNumber, 0)}`,
          "",
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
      worksheet["!cols"][4] = { wch: 13 };
      worksheet["N1"].s = {
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
      setCellStyle(worksheet, "G2", 11, true, "center", "center", false, false);
      setCellStyle(worksheet, "A3", 11, true, "center", "center", false, false);
      setCellStyle(worksheet, "G3", 11, true, "center", "center", false, false);
      setCellStyle(worksheet, "A4", 11, true, "center", "center", false, false);
      setCellStyle(worksheet, "A5", 16, true, "center", "center", false, false);
      setCellStyle(worksheet, "A6", 11, true, "center", "center", true, false);

      // Merge các ô từ A6 đến M6
      worksheet["!merges"] = [];
      const tempMerge = [];
      const range = XLSX.utils.decode_range(worksheet["!ref"]!);
      for (let row = 7; row <= results.data.length + 8; row++) {
        if (row < results.data.length + 8) {
          tempMerge.push(
            { s: { r: row, c: 2 }, e: { r: row, c: 3 } },
            { s: { r: row, c: 5 }, e: { r: row, c: 8 } },
            { s: { r: row, c: 10 }, e: { r: row, c: 11 } }
          );
        } else {
          tempMerge.push({ s: { r: row, c: 0 }, e: { r: row, c: 8 } });
          tempMerge.push({ s: { r: row, c: 10 }, e: { r: row, c: 11 } });
        }
        worksheet["!rows"][row + 1] = { hpx: 45 };
        for (let col = range.s.c; col <= range.e.c; col++) {
          const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
          if (worksheet[cellRef]) {
            worksheet[cellRef].s = {
              font: {
                name: "Times New Roman",
                sz: 11,
                bold:
                  row === 7 || col === 1 || col === 2 || col === 3 || col === 4
                    ? true
                    : false,
              },
              alignment: {
                wrapText: true,
                vertical: "center",
                horizontal:
                  row > 7 &&
                  (col === 1 ||
                    col === 2 ||
                    col === 3 ||
                    col === 4 ||
                    col === 5)
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
          if (row === results.data.length + 8) {
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
      }

      const defaultMerges = [
        { s: { r: 1, c: 0 }, e: { r: 1, c: 3 } },
        { s: { r: 1, c: 6 }, e: { r: 1, c: 12 } },
        { s: { r: 2, c: 0 }, e: { r: 2, c: 3 } },
        { s: { r: 2, c: 6 }, e: { r: 2, c: 12 } },
        { s: { r: 3, c: 0 }, e: { r: 3, c: 3 } },
        { s: { r: 4, c: 0 }, e: { r: 4, c: 13 } },
        { s: { r: 5, c: 0 }, e: { r: 5, c: 13 } },
      ];

      for (
        let row = range.e.r - defaultFooterInfo.length + 1;
        row <= range.e.r;
        row++
      ) {
        if (row < range.e.r)
          tempMerge.push({ s: { r: row, c: 0 }, e: { r: row, c: 13 } });
        else {
          tempMerge.push({ s: { r: row, c: 0 }, e: { r: row, c: 3 } });
          tempMerge.push({ s: { r: row, c: 9 }, e: { r: row, c: 10 } });
        }

        for (let col = range.s.c; col <= range.e.c; col++) {
          const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
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
      approver: userName,
      approvedTime: Math.floor(Date.now() / 1000),
      isRejected: isRejected,
      reason: reason,
      isBlockData: true,
    };
    try {
      if (mode === "edit" && selectedItem) {
        const response = await putUpdateApprovedActivity(
          selectedItem.id as string,
          formData
        );
        if (response) {
          setDescription(
            isRejected
              ? "Đã từ chối phê duyệt thông tin hoạt động!"
              : "Phê duyệt thông tin hoạt động thành công!"
          );
        }
      }
      setNotificationOpen(true);
      setStatus("success");
      setMessage("Thông báo");
      await getListActivities();
      setIsOpen(false);
      setSelectedItem(undefined);
      setMode("add");
    } catch (error) {
      setNotificationOpen(true);
      setStatus("error");
      setMessage("Thông báo");
      setDescription("Đã có lỗi xảy ra!");
    }
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
    Promise.all([getListActivities(), getAllUnitsFromHRM()]);
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
    }
    setLoading(false);
  }, []);

  return (
    <div>
      <div className="grid grid-cols-3 mb-4">
        <div className="col-span-2">
          <div className="grid grid-cols-3 gap-4">
            {loading ? (
              <>
                <Skeleton.Input active size="small" style={{ width: "100%" }} />
                <Skeleton.Input active size="small" style={{ width: "100%" }} />
                <Skeleton.Input active size="small" style={{ width: "100%" }} />
              </>
            ) : (
              <>
                <Search
                  placeholder="Tìm kiếm hoạt động..."
                  onSearch={onSearch}
                  enterButton
                />
                <Select
                  showSearch
                  allowClear
                  // size="large"
                  placeholder="Tất cả đơn vị"
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
                  value={selectedKeyUnit}
                  onChange={(value) => {
                    setSelectedKeyUnit(value);
                  }}
                />
                <ConfigProvider locale={locale}>
                  <RangePicker
                    placeholder={["Từ ngày", "Đến ngày"]}
                    format={"DD/MM/YYYY"}
                    value={
                      selectedDates || [
                        dayjs(`01/09/${dayjs().year()}`, "DD/MM/YYYY"),
                        dayjs(`31/08/${dayjs().year() + 1}`, "DD/MM/YYYY"),
                      ]
                    }
                    onChange={(dates, dateStrings) => {
                      if (dates) {
                        const [startDate, endDate] = dateStrings;
                        const startTimestamp = startDate
                          ? new Date(
                              startDate.split("/").reverse().join("-")
                            ).valueOf() / 1000
                          : null;
                        const endTimestamp = endDate
                          ? new Date(
                              endDate.split("/").reverse().join("-")
                            ).valueOf() / 1000
                          : null;
                        setStartDate(startTimestamp);
                        setEndDate(endTimestamp);
                        setSelectedDates(dates);
                      } else {
                        setSelectedDates(null);
                        setStartDate(
                          new Date(`01/09/${dayjs().year()}`).valueOf() / 1000
                        );
                        setEndDate(
                          new Date(`31/08/${dayjs().year() + 1}`).valueOf() /
                            1000
                        );
                      }
                    }}
                  />
                </ConfigProvider>
              </>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-4">
          {loading ? (
            <>
              <Skeleton.Input active size="small" />
              <Skeleton.Input active size="small" />
              <Skeleton.Input active size="small" />
            </>
          ) : (
            <>
              {role?.displayRole.isExport && (
                <>
                  <Tooltip
                    placement="top"
                    title="Xuất dữ liệu Excel"
                    arrow={true}
                  >
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
                    <Dropdown menu={{ items }} trigger={["click"]}>
                      <a onClick={(e) => e.preventDefault()}>
                        <Button type="primary" icon={<PlusOutlined />}>
                          Thêm hoạt động
                        </Button>
                      </a>
                    </Dropdown>
                  </Tooltip>
                </>
              )}

              {role?.displayRole.isDelete && (
                <>
                  <Tooltip
                    placement="top"
                    title="Xóa các hoạt động"
                    arrow={true}
                  >
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
            isUpload ? (
              <>
                <FromUpload onSubmit={handleSubmitUpload} />
              </>
            ) : (
              <>
                <FormActivity
                  key="form-activity-bm05"
                  onSubmit={handleSubmit}
                  handleShowPDF={setIsShowPdf}
                  initialData={selectedItem as Partial<AddUpdateActivityItem>}
                  mode={mode}
                  numberActivity={data.length}
                  isBlock={isBlock}
                  isPayment={isPayments}
                  displayRole={role?.displayRole ?? {} as DisplayRoleItem}
                />
              </>
            )
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
            locale={{ emptyText: <Empty description="No Data"></Empty> }}
            onChange={handleTableChange}
          />
        </>
      )}
    </div>
  );
};
export default BM05;
