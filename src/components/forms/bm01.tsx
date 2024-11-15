"use client";

import {
  ClassLeaderItem,
  ClassLeadersResponse,
  deleteClassLeaders,
  getAllClassLeaders,
  ImportClassLeaders,
  postAddClassLeader,
  putUpdateApprovedClassLeader,
  putUpdateClassLeader,
} from "@/services/forms/classLeadersServices";
import { AddUpdateActivityItem } from "@/services/forms/formsServices";
import { PaymentApprovedItem } from "@/services/forms/PaymentApprovedItem";
import {
  DisplayRoleItem,
  getRoleByName,
  RoleItem,
} from "@/services/roles/rolesServices";
import {
  getListUnitsFromHrm,
  UnitHRMItem,
} from "@/services/units/unitsServices";
import { FileItem } from "@/services/uploads/uploadsServices";
import PageTitles from "@/utility/Constraints";
import Messages from "@/utility/Messages";
import {
  convertTimestampToDate,
  convertTimestampToFullDateTime,
  defaultFooterInfo,
  setCellStyle,
} from "@/utility/Utilities";
import {
  CheckOutlined,
  CloseCircleOutlined,
  CloseOutlined,
  DeleteOutlined,
  FileExcelOutlined,
  FileProtectOutlined,
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
import locale from "antd/locale/vi_VN";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/vi";
import saveAs from "file-saver";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { Key, useCallback, useEffect, useState } from "react";
import * as XLSX from "sheetjs-style";
import CustomModal from "../CustomModal";
import CustomNotification from "../CustomNotification";
import FormBM01 from "./activity/formBM01";
import FromUpload from "./activity/formUpload";
dayjs.locale("vi");

type SearchProps = GetProps<typeof Input.Search>;
const { Search } = Input;
const { RangePicker } = DatePicker;

const BM01 = () => {
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [classLeaders, setClassLeaders] = useState<
    ClassLeadersResponse | undefined
  >(undefined);
  const [data, setData] = useState<ClassLeaderItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isUpload, setIsUpload] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<
    Partial<AddUpdateActivityItem> | undefined
  >(undefined);
  const [units, setUnits] = useState<UnitHRMItem[]>([]);
  const [selectedKeyUnit, setSelectedKeyUnit] = useState<Key | null>(null);
  const [message, setMessage] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
  const [startDate, setStartDate] = useState<number | null>(null);
  const [endDate, setEndDate] = useState<number | null>(null);
  const [selectedDates, setSelectedDates] = useState<
    [Dayjs | null, Dayjs | null] | null
  >(null);
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
  const getListClassLeaders = async () => {
    const response = await getAllClassLeaders();
    setClassLeaders(response);
    setData(response.items);
    setNotificationOpen(false);
  };
  const getAllUnitsFromHRM = async () => {
    const response = await getListUnitsFromHrm();
    setUnits(response.model);
  };

  const onSelectChange = (newSelectedRowKeys: Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection: TableRowSelection<ClassLeaderItem> = {
    selectedRowKeys,
    getCheckboxProps: (record: ClassLeaderItem) => ({
      disabled: record.payments?.isBlockData ?? false,
    }),
    onChange: onSelectChange,
  };
  const showTotal: PaginationProps["showTotal"] = (total) => (
    <p className="w-full text-start">
      Đã chọn {selectedRowKeys.length} / {total} dòng dữ liệu
    </p>
  );
  const columns: TableColumnsType<ClassLeaderItem> = [
    {
      title: <div className="py-3">STT</div>,
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
      render: (userName: string, record: ClassLeaderItem) => {
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
      render: (fullName: string) => <span>{fullName}</span>,
      className: "w-[10rem]",
    },
    {
      title: "ĐƠN VỊ",
      dataIndex: "unitName",
      key: "unitName",
      className: "text-center w-[80px]",
      render: (unitName: string) => <p>{unitName}</p>,
    },
    {
      title: "HỌC KỲ",
      dataIndex: "semester",
      key: "semester",
      className: "text-center w-[50px]",
      render: (semester: string) => <p>{semester}</p>,
    },
    {
      title: "SỐ TIẾT CHUẨN",
      dataIndex: "standardNumber",
      key: "standardNumber",
      className: "text-center w-[90px]",
      render: (standardNumber: string) => <p>{standardNumber}</p>,
    },
    {
      title: "NGÀNH",
      dataIndex: "subject",
      key: "subject",
      render: (subject: string) => <p>{subject}</p>,
      className: "text-center w-[5rem]",
    },
    {
      title: "KHÓA",
      dataIndex: "course",
      key: "course",
      render: (course: string) => <p>{course}</p>,
      className: "text-center w-[50px]",
    },
    {
      title: "MÃ LỚP",
      dataIndex: "classCode",
      key: "classCode",
      render: (classCode: string) => <p>{classCode}</p>,
      className: "text-center w-[70px]",
    },
    {
      title: (
        <>
          SỐ VĂN BẢN <br /> NGÀY LẬP
        </>
      ),
      dataIndex: "proof",
      key: "proof",
      render: (proof: string, record: ClassLeaderItem) => {
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
      className: "w-[5rem]",
    },
    {
      title: (
        <>
          THỜI GIAN <br /> HOẠT ĐỘNG
        </>
      ),
      dataIndex: "fromDate",
      key: "fromDate",
      render: (_, record: ClassLeaderItem) => {
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
    // {
    //   title: "GHI CHÚ",
    //   dataIndex: "note",
    //   key: "note",
    //   render: (note: string) => <p>{note}</p>,
    //   className: "w-[5rem]",
    // },
    {
      title: (
        <div className="bg-rose-500 p-1 rounded-tr-lg">
          PHÊ DUYỆT <br /> THANH TOÁN
        </div>
      ),
      dataIndex: ["payments", "isRejected"],
      key: "isRejected",
      render: (isRejected: boolean, record: ClassLeaderItem) => {
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
      setData(classLeaders?.items || []);
    const selectedUnit = units.find((unit) => unit.id === selectedKeyUnit);
    const filteredData = classLeaders?.items.filter((item) => {
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

  useEffect(() => {
    onSearch("");
  }, [selectedKeyUnit, startDate, endDate]);

  const handleDelete = useCallback(async () => {
    try {
      const selectedKeysArray = Array.from(selectedRowKeys) as string[];
      if (selectedKeysArray.length > 0) {
        await deleteClassLeaders(selectedKeysArray);
        setDescription(
          `Đã xóa thành công ${selectedKeysArray.length} thông tin chủ nhiệm lớp!`
        );
        setNotificationOpen(true);
        setStatus("success");
        setMessage("Thông báo");
        await getListClassLeaders();
        setSelectedRowKeys([]);
      }
    } catch (error) {
      console.error("Error deleting selected items:", error);
    }
  }, [selectedRowKeys]);
  const handleEdit = (classLeader: ClassLeaderItem) => {
    const updatedActivity: Partial<ClassLeaderItem> = {
      ...classLeader,
    };
    setSelectedItem(updatedActivity);
    setMode("edit");
    setIsOpen(true);
  };
  const handleSubmit = async (formData: Partial<ClassLeaderItem>) => {
    console.log("formData :>> ", formData);
    try {
      if (mode === "edit" && selectedItem) {
        const response = await putUpdateClassLeader(
          formData.id as string,
          formData
        );
        if (response) {
          setDescription(Messages.UPDATE_CLASSLEADERS);
        }
      } else {
        const response = await postAddClassLeader(formData);
        if (response) {
          setDescription(Messages.ADD_CLASSLEADERS);
        }
      }
      setNotificationOpen(true);
      setStatus("success");
      setMessage("Thông báo");
      await getListClassLeaders();
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

      const response = await ImportClassLeaders(formData);
      if (response) {
        setNotificationOpen(true);
        setStatus("success");
        setMessage("Thông báo");
        setDescription(
          `Tải lên thành công ${response.totalCount} thông tin chủ nhiệm lớp!`
        );
      }
      await getListClassLeaders();
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
      const currentYear = new Date().getFullYear();
      const nextYear = currentYear + 1;
      const defaultInfo = [
        ["", "", "", "", "", "", "", "", "", "", "", "BM-01"],
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
        [`Chủ nhiệm lớp trong năm học ${currentYear}-${nextYear}`],
        [""],
      ];

      const dataArray = [
        [
          "STT",
          "Mã số CB-GV-NV",
          "Họ và tên",
          "Đơn vị",
          "Học kỳ",
          "Số tiết chuẩn",
          "Ngành",
          "Khóa",
          "Mã lớp",
          "Số văn bản, ngày lập",
          "Thời gian hoạt động",
          "Ghi chú",
        ],
        ...data.map((item, index) => [
          index + 1,
          item.userName,
          item.fullName,
          item.unitName ?? "",
          item.semester ?? "",
          item.standardNumber,
          item.subject ?? "",
          item.course ?? "",
          item.classCode ?? "",
          item.proof + ", " + convertTimestampToDate(item.fromDate),
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
          `${data.reduce((acc, x) => acc + x.standardNumber, 0)}`,
          "",
          "",
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
      worksheet["!cols"] = [];
      worksheet["!cols"][0] = { wch: 4 };
      worksheet["!cols"][1] = { wch: 20 };
      worksheet["!cols"][2] = { wch: 20 };
      worksheet["!cols"][6] = { wch: 15 };
      worksheet["!cols"][9] = { wch: 10 };
      worksheet["!cols"][10] = { wch: 10 };
      worksheet["L1"].s = {
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
      for (let row = 7; row <= range.e.r; row++) {
        if (row === combinedData.length - 1) {
          tempMerge.push({ s: { r: row, c: 0 }, e: { r: row, c: 4 } });
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
          if (col === 1 || col === 2 || col === 11) {
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
          } else {
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
          tempMerge.push({ s: { r: row, c: 0 }, e: { r: row, c: 11 } });
        else {
          tempMerge.push({ s: { r: row, c: 0 }, e: { r: row, c: 3 } });
          tempMerge.push({ s: { r: row, c: 8 }, e: { r: row, c: 9 } });
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

      const defaultMerges = [
        { s: { r: 1, c: 0 }, e: { r: 1, c: 3 } },
        { s: { r: 1, c: 6 }, e: { r: 1, c: 10 } },
        { s: { r: 2, c: 0 }, e: { r: 2, c: 3 } },
        { s: { r: 2, c: 6 }, e: { r: 2, c: 10 } },
        { s: { r: 3, c: 0 }, e: { r: 3, c: 3 } },
        { s: { r: 4, c: 0 }, e: { r: 4, c: 10 } },
        { s: { r: 5, c: 0 }, e: { r: 5, c: 10 } },
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
      saveAs(blob, "BM01-" + formattedDate + ".xlsx");
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
        const response = await putUpdateApprovedClassLeader(formData);
        if (response) {
          setDescription(
            isRejected
              ? `${Messages.REJECTED_CLASSLEADERS} (${
                  selectedRowKeys.length > 0 ? selectedRowKeys.length : 1
                } dòng)`
              : `${Messages.APPROVED_CLASSLEADERS} (${
                  selectedRowKeys.length > 0 ? selectedRowKeys.length : 1
                } dòng)`
          );
        }
      }
      setSelectedRowKeys([]);
      setNotificationOpen(true);
      setStatus("success");
      setMessage("Thông báo");
      await getListClassLeaders();
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

  const getDisplayRole = async (name: string) => {
    const response = await getRoleByName(name);
    setRole(response.items[0]);
  };

  useEffect(() => {
    setLoading(true);
    document.title = PageTitles.BM01;
    const pageState = Cookies.get("p_s");
    if (pageState) {
      const [current, pageSize] = JSON.parse(pageState);
      setPagination({
        current,
        pageSize,
      });
    }
    Promise.all([getListClassLeaders(), getAllUnitsFromHRM()]);
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
      setLoading(false);
    }
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
        <div className="flex justify-end gap-3">
          {loading ? (
            <>
              <Skeleton.Input active size="small" />
              <Skeleton.Input active size="small" />
              <Skeleton.Input active size="small" />
            </>
          ) : (
            <>
              {role?.displayRole.isApprove && role?.displayRole.isReject && (
                <>
                  <Tooltip
                    placement="top"
                    title="Phê duyệt dữ liệu"
                    arrow={true}
                  >
                    <Dropdown
                      menu={{ items: itemsApproved }}
                      trigger={["click"]}
                    >
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
                    title="Thêm mới hoạt động"
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
          width={isShowPdf ? "85vw" : "800px"}
          title={
            mode === "edit"
              ? Messages.TITLE_UPDATE_CLASSLEADER
              : Messages.TITLE_ADD_CLASSLEADER
          }
          onOk={() => {
            const formElement = document.querySelector("form");
            formElement?.dispatchEvent(
              new Event("submit", { cancelable: true, bubbles: true })
            );
          }}
          role={role || undefined}
          isBlock={isBlock}
          onApprove={() => handleApproved(false)}
          onReject={() => setIsModalVisible(true)}
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
                  formName="classleader"
                  onSubmit={handleSubmitUpload}
                  handleShowPDF={setIsShowPdf}
                />
              </>
            ) : (
              <>
                <FormBM01
                  key="form-classleader-bm01"
                  onSubmit={handleSubmit}
                  handleShowPDF={setIsShowPdf}
                  initialData={selectedItem as Partial<ClassLeaderItem>}
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
          <Table<ClassLeaderItem>
            key={"table-activity-bm01"}
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

export default BM01;
