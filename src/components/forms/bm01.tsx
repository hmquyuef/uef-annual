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
import {
  DisplayRoleItem,
  getRoleByName,
  RoleItem,
} from "@/services/roles/rolesServices";
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
  LoadingOutlined,
  PlusOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import {
  Button,
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
import { Key, useCallback, useEffect, useState } from "react";
import * as XLSX from "sheetjs-style";
import CustomModal from "../CustomModal";
import CustomNotification from "../CustomNotification";
import FormBM01 from "./activity/formBM01";
import FromUpload from "./activity/formUpload";
import { PaymentApprovedItem } from "@/services/forms/PaymentApprovedItem";
dayjs.locale("vi");

type SearchProps = GetProps<typeof Input.Search>;
const { Search } = Input;
const { RangePicker } = DatePicker;

const BM01 = () => {
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
          THỜI GIAN <br /> HOẠT ĐỘNG
        </>
      ),
      dataIndex: "eventDate",
      key: "eventDate",
      render: (eventDate: number) =>
        eventDate ? convertTimestampToDate(eventDate) : "",
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
      title: "GHI CHÚ",
      dataIndex: "note",
      key: "note",
      render: (note: string) => <p>{note}</p>,
      className: "w-[5rem]",
    },
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
          ? item.eventDate >= startDate && item.eventDate <= endDate
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
    setNotificationOpen(false);
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
    try {
      if (mode === "edit" && selectedItem) {
        const response = await putUpdateClassLeader(
          formData.id as string,
          formData
        );
        if (response) {
          setDescription("Cập nhật thông tin chủ nhiệm lớp thành công!");
        }
      } else {
        const response = await postAddClassLeader(formData);
        if (response) {
          setDescription("Thêm mới thông tin chủ nhiệm lớp thành công!");
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
      setDescription("Đã có lỗi xảy ra!");
    }
  };

  const handleSubmitUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await ImportClassLeaders(formData);
      if (response) {
        setNotificationOpen(true);
        setStatus("success");
        setMessage("Thông báo");
        setDescription(`Tải lên thành công ${response.totalCount} hoạt động!`);
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
      setDescription("Đã có lỗi xảy ra!");
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
          item.eventDate ? convertTimestampToDate(item.eventDate) : "",
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
      approver: userName,
      approvedTime: Math.floor(Date.now() / 1000),
      isRejected: isRejected,
      reason: reason,
      isBlockData: true,
    };
    try {
      if (mode === "edit" && selectedItem) {
        const response = await putUpdateApprovedClassLeader(
          selectedItem.id as string,
          formData
        );
        if (response) {
          setDescription(
            isRejected
              ? "Đã từ chối phê duyệt thông tin chủ nhiệm lớp!"
              : "Phê duyệt thông tin chủ nhiệm lớp thành công!"
          );
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
      setDescription("Đã có lỗi xảy ra!");
    }
  };

  const getDisplayRole = async (name: string) => {
    const response = await getRoleByName(name);
    setRole(response.items[0]);
  };

  useEffect(() => {
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
    }
  }, []);
  return (
    <div>
      <div className="grid grid-cols-3 mb-4">
        <div className="col-span-2">
          <div className="grid grid-cols-3 gap-4">
            <Search
              placeholder="Tìm kiếm thông tin..."
              onSearch={onSearch}
              enterButton
            />
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
                format="DD/MM/YYYY"
                value={
                  selectedDates || [
                    dayjs(`01/09/${dayjs().year()}`, "DD/MM/YYYY"),
                    dayjs(`31/08/${dayjs().year() + 1}`, "DD/MM/YYYY"),
                  ]
                }
                onChange={(dates, dateStrings) => {
                  if (dates) {
                    const [startDate, endDate] = dates;
                    const startTimestamp = startDate ? startDate.unix() : null;
                    const endTimestamp = endDate ? endDate.unix() : null;
                    setStartDate(startTimestamp);
                    setEndDate(endTimestamp);
                    setSelectedDates(dates);
                  } else {
                    setSelectedDates(null);
                    setStartDate(
                      dayjs(`01/09/${dayjs().year()}`, "DD/MM/YYYY").unix()
                    );
                    setEndDate(
                      dayjs(`31/08/${dayjs().year() + 1}`, "DD/MM/YYYY").unix()
                    );
                  }
                }}
              />
            </ConfigProvider>
          </div>
        </div>
        <div className="flex justify-end gap-4">
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
              <Tooltip placement="top" title="Xóa các thông tin" arrow={true}>
                <Button
                  type="dashed"
                  disabled={selectedRowKeys.length === 0}
                  danger
                  onClick={handleDelete}
                  icon={<DeleteOutlined />}
                  iconPosition="start"
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
          width="700px"
          title={
            mode === "edit"
              ? "Cập nhật thông tin chủ nhiệm lớp"
              : "Thêm mới thông tin chủ nhiệm lớp"
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
          }}
          bodyContent={
            isUpload ? (
              <>
                <FromUpload onSubmit={handleSubmitUpload} />
              </>
            ) : (
              <>
                <FormBM01
                  onSubmit={handleSubmit}
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
          width={500}
        >
          <Input value={reason} onChange={(e) => setReason(e.target.value)} />
        </Modal>
      </div>
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
        locale={{ emptyText: <Empty description="No Data"></Empty> }}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default BM01;
