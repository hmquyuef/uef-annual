"use client";

import {
  deleteQAs,
  getAllQAs,
  ImportQAs,
  postAddQA,
  putUpdateApprovedQA,
  putUpdateQA,
  QAItem,
  QAResponse,
} from "@/services/forms/qaServices";
import { getAllUnits, UnitItem } from "@/services/units/unitsServices";
import PageTitles from "@/utility/Constraints";
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
  GetProps,
  Input,
  MenuProps,
  Modal,
  PaginationProps,
  Select,
  Skeleton,
  Spin,
  Table,
  TableColumnsType,
  Tooltip,
} from "antd";
import { TableRowSelection } from "antd/es/table/interface";
import saveAs from "file-saver";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { Key, useCallback, useEffect, useState } from "react";
import * as XLSX from "sheetjs-style";
import CustomModal from "../CustomModal";
import CustomNotification from "../CustomNotification";
import FormBM04 from "./activity/formBM04";
import FromUpload from "./activity/formUpload";

import { PaymentApprovedItem } from "@/services/forms/PaymentApprovedItem";
import {
  DisplayRoleItem,
  getRoleByName,
  RoleItem,
} from "@/services/roles/rolesServices";
import { FileItem } from "@/services/uploads/uploadsServices";
import Messages from "@/utility/Messages";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";

import locale from "antd/locale/vi_VN";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/vi";
import { getAllSchoolYears } from "@/services/schoolYears/schoolYearsServices";
dayjs.locale("vi");

type SearchProps = GetProps<typeof Input.Search>;
const { Search } = Input;
const { RangePicker } = DatePicker;

const BM04 = () => {
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [qaes, setQAEs] = useState<QAItem[]>([]);
  const [data, setData] = useState<QAItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isUpload, setIsUpload] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Partial<QAItem> | undefined>(
    undefined
  );
  const [units, setUnits] = useState<UnitItem[]>([]);
  const [selectedKeyUnit, setSelectedKeyUnit] = useState<Key | null>(null);
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
  const [userName, setUserName] = useState<string | null>(null);
  const [role, setRole] = useState<RoleItem>();
  const [isBlock, setIsBlock] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [reason, setReason] = useState("");
  const [isPayments, setIsPayments] = useState<PaymentApprovedItem>();
  const [isShowPdf, setIsShowPdf] = useState(false);
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
        getListQAs(id);
        setStartDate(startDate);
        setMinStartDate(startDate);
        setEndDate(endDate);
        setMaxEndDate(endDate);
      }
    }
  };

  const getListQAs = async (yearId: string) => {
    const response = await getAllQAs(yearId);
    setQAEs(response.items);
    setData(response.items);
    setNotificationOpen(false);
  };

  const getListUnits = async () => {
    const response = await getAllUnits("true");
    setUnits(response.items);
  };

  const onSelectChange = (newSelectedRowKeys: Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection: TableRowSelection<QAItem> = {
    selectedRowKeys,
    getCheckboxProps: (record: QAItem) => ({
      disabled: record.payments?.isBlockData ?? false,
    }),
    onChange: onSelectChange,
  };
  const showTotal: PaginationProps["showTotal"] = (total) => (
    <p className="w-full text-start">
      Đã chọn {selectedRowKeys.length} / {total} dòng dữ liệu
    </p>
  );
  const columns: TableColumnsType<QAItem> = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      render: (_, __, index) => <>{index + 1}</>,
      className: "text-center w-[1rem]",
    },
    {
      title: "MÃ SỐ CB-GV-NV",
      dataIndex: "userName",
      key: "userName",
      className: "w-[5rem]",
      render: (userName: string, record: QAItem) => {
        return (
          <span
            className="text-blue-500 font-semibold cursor-pointer"
            onClick={() => {
              handleEdit(record);
              setIsBlock(record.payments?.isBlockData ?? false);
              setIsPayments(record.payments);
            }}
          >
            {userName}
          </span>
        );
      },
    },
    {
      title: "HỌ VÀ TÊN",
      dataIndex: "fullName",
      key: "fullName",
      render: (fullName: string) => <>{fullName}</>,
      className: "w-[10rem]",
    },
    {
      title: "ĐƠN VỊ",
      dataIndex: "unitName",
      key: "unitName",
      className: "text-center w-[80px]",
      render: (unitName: string) => <>{unitName}</>,
    },
    {
      title: "NỘI DUNG",
      dataIndex: "contents",
      key: "contents",
      render: (contents: string) => <>{contents}</>,
      className: "w-[15rem]",
    },
    {
      title: "SỐ LƯỢNG SINH VIÊN",
      dataIndex: "totalStudent",
      key: "totalStudent",
      className: "text-center w-[60px]",
      render: (totalStudent: string) => <>{totalStudent}</>,
    },
    {
      title: "SỐ TIẾT CHUẨN",
      dataIndex: "standardNumber",
      key: "standardNumber",
      className: "text-center w-[60px]",
      render: (standardNumber: string) => <>{standardNumber}</>,
    },
    {
      title: (
        <>
          SỐ VĂN BẢN <br /> NGÀY LẬP
        </>
      ),
      dataIndex: "proof",
      key: "proof",
      render: (proof: string, record: QAItem) => {
        const ngayLap = record.fromDate;
        return (
          <div className="flex flex-col">
            <span className="text-center font-medium">{proof}</span>
            <span className="text-center text-[13px]">
              {convertTimestampToDate(ngayLap)}
            </span>
          </div>
        );
      },
      className: "text-center w-[100px]",
    },
    {
      title: (
        <>
          THỜI GIAN <br /> HOẠT ĐỘNG
        </>
      ),
      dataIndex: "fromDate",
      key: "fromDate",
      render: (_, record: QAItem) => {
        return (
          <>
            {record.fromDate && record.toDate ? (
              <div className="flex flex-col">
                <span>{convertTimestampToDate(record.fromDate)}</span>
                <span>{convertTimestampToDate(record.toDate)}</span>
              </div>
            ) : (
              ""
            )}
          </>
        );
      },
      className: "text-center w-[70px]",
    },
    {
      title: (
        <div className="p-1">
          TÀI LIỆU <br /> ĐÍNH KÈM
        </div>
      ),
      dataIndex: ["attackment", "path"],
      key: "path",
      className: "text-center w-[80px]",
      sorter: (a, b) => a.attackment?.path.localeCompare(b.attackment?.path),
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
      title: <div className="bg-orange-400 p-1">NGÀY NHẬP VĂN BẢN</div>,
      dataIndex: "entryDate",
      key: "entryDate",
      sorter: (a, b) => a.entryDate - b.entryDate,
      render: (fromDate: number) =>
        fromDate ? convertTimestampToDate(fromDate) : "",
      className: "text-center w-[80px]",
    },
    {
      title: (
        <div className="bg-rose-500 p-1 rounded-tr-lg">
          PHÊ DUYỆT <br /> THANH TOÁN
        </div>
      ),
      dataIndex: ["payments", "isRejected"],
      key: "isRejected",
      render: (isRejected: boolean, record: QAItem) => {
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
      icon: <PlusOutlined />,
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

  const onSearch: SearchProps["onSearch"] = (value) => {
    if ((value === "" && !selectedKeyUnit) || selectedKeyUnit === "all")
      setData(qaes || []);
    const selectedUnit = units.find(
      (unit: UnitItem) => unit.idHrm === selectedKeyUnit
    );
    const filteredData = qaes.filter((item) => {
      const matchesName =
        item.userName.toLowerCase().includes(value.toLowerCase()) ||
        item.fullName.toLowerCase().includes(value.toLowerCase());
      const matchesUnit = selectedUnit
        ? item.unitName === selectedUnit.code
        : true;
      const matchesDate =
        startDate && endDate
          ? item.fromDate >= startDate && item.toDate <= endDate
          : true;
      return matchesName && matchesUnit && matchesDate;
    });
    setData(filteredData || []);
  };

  const handleDelete = useCallback(async () => {
    try {
      const selectedKeysArray = Array.from(selectedRowKeys) as string[];
      if (selectedKeysArray.length > 0) {
        await deleteQAs(selectedKeysArray);
        setNotificationOpen(true);
        setStatus("success");
        setMessage("Thông báo");
        setDescription(
          `Đã xóa thành công ${selectedKeysArray.length} thông tin!`
        );
        await getListQAs(selectedKey.id);
        setSelectedRowKeys([]);
      }
    } catch (error) {
      console.error("Error deleting selected items:", error);
    }
  }, [selectedRowKeys]);
  const handleEdit = (classLeader: QAItem) => {
    const updatedActivity: Partial<QAItem> = {
      ...classLeader,
    };
    setSelectedItem(updatedActivity);
    setMode("edit");
    setIsOpen(true);
  };
  const handleSubmit = async (formData: Partial<QAItem>) => {
    try {
      if (mode === "edit" && selectedItem) {
        const response = await putUpdateQA(formData.id as string, formData);
        if (response) {
          setDescription(
            "Cập nhật thông tin tham gia hỏi vấn đáp thi xếp lớp Anh văn đầu vào thành công!"
          );
        }
      } else {
        const response = await postAddQA(formData);
        if (response) {
          setDescription(
            "Thêm mới thông tin tham gia hỏi vấn đáp thi xếp lớp Anh văn đầu vào thành công!"
          );
        }
      }
      setNotificationOpen(true);
      setStatus("success");
      setMessage("Thông báo");
      await getListQAs(selectedKey.id);
      setIsOpen(false);
      setSelectedItem(undefined);
      setMode("add");
    } catch (error) {
      setNotificationOpen(true);
      setStatus("error");
      setMessage("Thông báo");
      setDescription(Messages.ERROR);
    }
    setNotificationOpen(false);
  };

  const handleSubmitUpload = async (
    fileParticipant: File,
    fileAttackment: FileItem
  ) => {
    try {
      const formData = new FormData();
      formData.append("File", fileParticipant);
      formData.append("Type", fileAttackment.type);
      formData.append("Path", fileAttackment.path);
      formData.append("Name", fileAttackment.name);
      formData.append("Size", fileAttackment.size.toString());

      const response = await ImportQAs(formData);
      if (response) {
        setNotificationOpen(true);
        setStatus("success");
        setMessage("Thông báo");
        setDescription(`Tải lên thành công ${response.totalCount} hoạt động!`);
      }
      await getListQAs(selectedKey.id);
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
    if (data) {
      const defaultInfo = [
        ["", "", "", "", "", "", "", "", "", "BM-04"],
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
        ["Giảng viên tham gia Hỏi vấn đáp thi xếp lớp Anh văn đầu vào"],
        [""],
      ];

      const dataArray = [
        [
          "STT",
          "Mã số CB-GV-NV",
          "Họ và Tên",
          "Đơn vị",
          "Nội dung",
          "Số lượng SV",
          "Số tiết chuẩn",
          "Số văn bản, ngày lập",
          "Thời gian hoạt động",
          "Ghi chú",
        ],
        ...data.map((item, index) => [
          index + 1,
          item.userName,
          item.fullName,
          item.unitName ?? "",
          item.contents ?? "",
          item.totalStudent,
          item.standardNumber,
          item.proof + ", " + convertTimestampToDate(item.documentDate),
          item.fromDate && item.toDate
            ? convertTimestampToDate(item.fromDate) +
              " - " +
              convertTimestampToDate(item.toDate)
            : "",
          item.note ?? "",
        ]),
        [
          "TỔNG SỐ TIẾT CHUẨN",
          "",
          "",
          "",
          "",
          "",
          `${data.reduce((acc, x) => acc + x.standardNumber, 0)}`,
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
      worksheet["!cols"] = [];
      worksheet["!cols"][0] = { wch: 4 };
      worksheet["!cols"][1] = { wch: 20 };
      worksheet["!cols"][2] = { wch: 20 };
      worksheet["!cols"][3] = { wch: 15 };
      worksheet["!cols"][4] = { wch: 30 };
      worksheet["!cols"][7] = { wch: 10 };
      worksheet["!cols"][8] = { wch: 10 };
      worksheet["!cols"][9] = { wch: 15 };
      worksheet["J1"].s = {
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
      setCellStyle(worksheet, "A6", 11, true, "center", "center", false, false);

      // Merge các ô từ A6 đến M6
      worksheet["!merges"] = [];
      const tempMerge = [];
      const range = XLSX.utils.decode_range(worksheet["!ref"]!);
      for (let row = 7; row <= range.e.r; row++) {
        if (row === combinedData.length - 1) {
          tempMerge.push({ s: { r: row, c: 0 }, e: { r: row, c: 5 } });
        }
        for (let col = range.s.c; col <= range.e.c; col++) {
          const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
          if (row === 7) {
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
            continue;
          }
          if (
            col === 0 ||
            col === 3 ||
            col === 5 ||
            col === 6 ||
            col === 7 ||
            col === 8
          ) {
            setCellStyle(
              worksheet,
              cellRef,
              11,
              false,
              "center",
              "center",
              true,
              true
            );
          } else {
            setCellStyle(
              worksheet,
              cellRef,
              11,
              false,
              "left",
              "center",
              true,
              true
            );
          }
          if (row === combinedData.length - 1) {
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
      for (
        let row = range.e.r - defaultFooterInfo.length + 1;
        row <= range.e.r;
        row++
      ) {
        if (row < range.e.r)
          tempMerge.push({ s: { r: row, c: 0 }, e: { r: row, c: 9 } });
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
          if (row === range.e.r - 6) {
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
          }
          if (row === range.e.r) {
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
      }

      const defaultMerges = [
        { s: { r: 1, c: 0 }, e: { r: 1, c: 2 } },
        { s: { r: 1, c: 5 }, e: { r: 1, c: 9 } },
        { s: { r: 2, c: 0 }, e: { r: 2, c: 2 } },
        { s: { r: 2, c: 5 }, e: { r: 2, c: 9 } },
        { s: { r: 3, c: 0 }, e: { r: 3, c: 3 } },
        { s: { r: 4, c: 0 }, e: { r: 4, c: 9 } },
        { s: { r: 5, c: 0 }, e: { r: 5, c: 9 } },
        { s: { r: range.e.r, c: 0 }, e: { r: range.e.r, c: 2 } },
        { s: { r: range.e.r, c: 8 }, e: { r: range.e.r, c: 9 } },
      ];

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
      saveAs(blob, "BM04-" + formattedDate + ".xlsx");
    }
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
        const response = await putUpdateApprovedQA(formData);
        if (response) {
          setDescription(
            isRejected
              ? `${Messages.REJECTED_QAE} (${
                  selectedRowKeys.length > 0 ? selectedRowKeys.length : 1
                } dòng)`
              : `${Messages.APPROVED_QAE} (${
                  selectedRowKeys.length > 0 ? selectedRowKeys.length : 1
                } dòng)`
          );
        }
      }
      setSelectedRowKeys([]);
      setNotificationOpen(true);
      setStatus("success");
      setMessage("Thông báo");
      await getListQAs(selectedKey.id);
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
    getListQAs(temp.id);
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
  useEffect(() => {
    setLoading(true);
    document.title = PageTitles.BM04;
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
      qaes.length > 0 &&
      units.length > 0 &&
      (selectedKeyUnit || startDate || endDate)
    ) {
      onSearch("");
    }
  }, [qaes, units, selectedKeyUnit, startDate, endDate]);
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
          isOpen={isNotificationOpen} // Truyền trạng thái mở
        />
        <CustomModal
          isOpen={isOpen}
          width={isShowPdf ? "85vw" : "800px"}
          title={
            mode === "edit"
              ? "Cập nhật thông tin tham gia hỏi vấn đáp Tiếng Anh đầu vào"
              : "Thêm mới thông tin tham gia hỏi vấn đáp Tiếng Anh đầu vào"
          }
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
                <FromUpload
                  formName="qae"
                  onSubmit={handleSubmitUpload}
                  handleShowPDF={setIsShowPdf}
                  displayRole={role?.displayRole ?? ({} as DisplayRoleItem)}
                />
              </>
            ) : (
              <>
                <FormBM04
                  onSubmit={handleSubmit}
                  handleShowPDF={setIsShowPdf}
                  initialData={selectedItem as Partial<QAItem>}
                  mode={mode}
                  isBlock={isBlock}
                  isPayment={isPayments}
                  displayRole={role?.displayRole ?? ({} as DisplayRoleItem)}
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
          width={500}
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
          <Table<QAItem>
            key={"table-qae-bm04"}
            className="custom-table-header shadow-md rounded-md"
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
export default BM04;
