"use client";

import {
  AdmissionCounselingItem,
  deleteAdmissionCounseling,
  getAllAdmissionCounseling,
  getExportAdmissionCounseling,
  ImportAdmissionCounseling,
  postAddAdmissionCounseling,
  putUpdateAdmissionCounseling,
  putUpdateApprovedAdmissionCounseling,
} from "@/services/forms/admissionCounseling";
import { PaymentApprovedItem } from "@/services/forms/PaymentApprovedItem";
import {
  DisplayRoleItem,
  getRoleByName,
  RoleItem,
} from "@/services/roles/rolesServices";
import { getAllSchoolYears } from "@/services/schoolYears/schoolYearsServices";
import { getAllUnits, UnitItem } from "@/services/units/unitsServices";
import { postFiles } from "@/services/uploads/uploadsServices";
import PageTitles from "@/utility/Constraints";
import Messages from "@/utility/Messages";
import {
  convertTimestampToDate,
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
  ConfigProvider,
  DatePicker,
  Dropdown,
  GetProps,
  Input,
  MenuProps,
  Modal,
  Select,
  TableColumnsType,
  Tag
} from "antd";
import saveAs from "file-saver";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { Key, useCallback, useEffect, useState } from "react";
import * as XLSX from "sheetjs-style";
import CustomModal from "../CustomModal";
import CustomNotification from "../CustomNotification";
import FormBM03 from "./activity/formBM03";
import FromUpload from "./activity/formUpload";

import Colors from "@/utility/Colors";
import locale from "antd/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { LoadingSpin } from "../skeletons/LoadingSpin";
import TemplateForms from "./workloads/TemplateForms";
dayjs.locale("vi");

type SearchProps = GetProps<typeof Input.Search>;

const BM03 = () => {
  const { Search } = Input;
  const [loading, setLoading] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [admissionCounseling, setAdmissionCounseling] = useState<
    AdmissionCounselingItem[]
  >([]);
  const [data, setData] = useState<AdmissionCounselingItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isUpload, setIsUpload] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [selectedItem, setSelectedItem] = useState<
    Partial<AdmissionCounselingItem> | undefined
  >(undefined);
  const [units, setUnits] = useState<UnitItem[]>([]);
  const [selectedKeyUnit, setSelectedKeyUnit] = useState<Key | null>(null);

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

  const [formNotification, setFormNotification] = useState<{
    message: string;
    description: string;
    status: "success" | "error" | "info" | "warning";
    isOpen: boolean;
  }>({
    message: "",
    description: "",
    status: "success",
    isOpen: false,
  });

  const getDefaultYears = async () => {
    const { items } = await getAllSchoolYears();
    if (items) {
      setDefaultYears(items);
      const defaultYear = items.find((x: any) => x.isDefault);
      if (defaultYear) {
        const { id, startDate, endDate } = defaultYear;
        setSelectedKey(defaultYear);
        getListAdmissionCounseling(id);
        setStartDate(startDate);
        setMinStartDate(startDate);
        setEndDate(endDate);
        setMaxEndDate(endDate);
      }
    }
  };

  const getListAdmissionCounseling = async (yearId: string) => {
    const response = await getAllAdmissionCounseling(yearId);
    setAdmissionCounseling(response.items);
    setData(response.items);
  };

  const getListUnits = async () => {
    const response = await getAllUnits("true");
    setUnits(response.items);
  };

  const columns: TableColumnsType<AdmissionCounselingItem> = [
    {
      title: "MÃ SỐ CB-GV-NV",
      dataIndex: "userName",
      key: "userName",
      className: "w-[8rem]",
      render: (userName: string, record: AdmissionCounselingItem) => {
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
      title: "ĐỊA ĐIỂM",
      dataIndex: "location",
      key: "location",
      render: (location: string) => <>{location}</>,
      className: "w-[15rem]",
    },
    {
      title: "SỐ TIẾT CHUẨN",
      dataIndex: "standardNumber",
      key: "standardNumber",
      className: "text-center w-[50px]",
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
      render: (_, record: AdmissionCounselingItem) => {
        return (
          <div className="flex flex-col">
            <span className="text-center font-medium">
              {record.determinations.documentNumber}
            </span>
            <span className="text-center text-[13px]">
              {record.determinations.documentDate !== 0
                ? convertTimestampToDate(record.determinations.documentDate)
                : ""}
            </span>
          </div>
        );
      },
      className: "text-center w-[100px]",
    },
    {
      title: <div className="py-1">THỜI GIAN HOẠT ĐỘNG</div>,
      dataIndex: "eventTime",
      key: "eventTime",
      className: "text-center w-[80px]",
      children: [
        {
          title: <div className="py-1">TỪ NGÀY</div>,
          dataIndex: "fromDate",
          key: "fromDate",
          render: (_, record: AdmissionCounselingItem) => {
            return (
              <>
                {record.determinations.fromDate ? (
                  <div className="flex flex-col">
                    <span>
                      {convertTimestampToDate(record.determinations.fromDate)}
                    </span>
                  </div>
                ) : (
                  ""
                )}
              </>
            );
          },
          className: "text-center w-[80px]",
        },
        {
          title: <div className="py-1">ĐẾN NGÀY</div>,
          dataIndex: "toDate",
          key: "toDate",
          render: (_, record: AdmissionCounselingItem) => {
            return (
              <>
                {record.determinations.toDate ? (
                  <div className="flex flex-col">
                    <span>
                      {convertTimestampToDate(record.determinations.toDate)}
                    </span>
                  </div>
                ) : (
                  ""
                )}
              </>
            );
          },
          className: "text-center w-[80px]",
        },
      ],
    },
    {
      title: (
        <div className="p-1">
          TÀI LIỆU <br /> ĐÍNH KÈM
        </div>
      ),
      dataIndex: "file",
      key: "file",
      className: "customInfoColors text-center w-[80px]",
      render: (_, item: AdmissionCounselingItem) => {
        const path = item.determinations.files[0]?.path;
        return path !== "" && path !== undefined ? (
          <>
            <Link
              href={"https://api-annual.uef.edu.vn/" + path}
              target="__blank"
            >
              <span className="text-green-500">
                <CheckOutlined />
              </span>
            </Link>
          </>
        ) : (
          <>
            <span className="text-red-400">
              <CloseOutlined />
            </span>
          </>
        );
      },
    },
    {
      title: (
        <div className="p-1">
          SỐ LƯU <br /> VĂN BẢN
        </div>
      ),
      dataIndex: "internalNumber",
      key: "internalNumber",
      className: "customInfoColors text-center w-[70px]",
      render: (_, item: AdmissionCounselingItem) => {
        const path = item.determinations.files[0]?.path;
        return (
          <>
            {item.determinations.internalNumber && (
              <>
                <span className="ml-2">
                  <Tag
                    color={`${
                      path !== "" && path !== undefined ? "blue" : "error"
                    }`}
                  >
                    {item.determinations.internalNumber}
                  </Tag>
                </span>
              </>
            )}
          </>
        );
      },
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
      style: { color: Colors.BLUE },
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
      style: { color: Colors.GREEN },
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
      style: { color: Colors.GREEN },
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
      style: { color: Colors.RED },
    },
  ];

  const onSearch: SearchProps["onSearch"] = (value) => {
    if ((value === "" && !selectedKeyUnit) || selectedKeyUnit === "all")
      setData(admissionCounseling || []);
    const selectedUnit = units.find(
      (unit: UnitItem) => unit.idHrm === selectedKeyUnit
    );

    const filteredData = admissionCounseling.filter((item) => {
      const matchesName =
        item.userName.toLowerCase().includes(value.toLowerCase()) ||
        item.fullName.toLowerCase().includes(value.toLowerCase()) ||
        item.location.toLowerCase().includes(value.toLowerCase());
      const matchesUnit = selectedUnit
        ? item.unitName === selectedUnit.code
        : true;
      const matchesDate =
        startDate && endDate
          ? item.determinations.fromDate >= startDate &&
            item.determinations.toDate <= endDate
          : true;
      return matchesName && matchesUnit && matchesDate;
    });
    setData(filteredData || []);
  };

  const handleDelete = useCallback(async () => {
    try {
      const selectedKeysArray = Array.from(selectedRowKeys) as string[];
      if (selectedKeysArray.length > 0) {
        await deleteAdmissionCounseling(selectedKeysArray);
        setFormNotification((prev) => ({
          ...prev,
          isOpen: true,
          status: "success",
          message: "Thông báo",
          description: `Đã xóa thành công ${selectedKeysArray.length} dòng thông tin!`,
        }));
        await getListAdmissionCounseling(selectedKey.id);
        setSelectedRowKeys([]);
      }
    } catch (error) {
      console.error("Error deleting selected items:", error);
    }
  }, [selectedRowKeys]);
  const handleEdit = (classLeader: AdmissionCounselingItem) => {
    const updatedActivity: Partial<AdmissionCounselingItem> = {
      ...classLeader,
    };
    setSelectedItem(updatedActivity);
    setMode("edit");
    setIsOpen(true);
  };
  const handleSubmit = async (formData: Partial<AdmissionCounselingItem>) => {
    try {
      if (mode === "edit" && selectedItem) {
        const response = await putUpdateAdmissionCounseling(
          formData.id as string,
          formData
        );
        if (response) {
          setFormNotification((prev) => ({
            ...prev,
            description: Messages.UPDATE_ADMISSION_COUNSELING,
          }));
        }
      } else {
        const response = await postAddAdmissionCounseling(formData);
        if (response) {
          setFormNotification((prev) => ({
            ...prev,
            description: Messages.ADD_ADMISSION_COUNSELING,
          }));
        }
      }
      setFormNotification((prev) => ({
        ...prev,
        isOpen: true,
        status: "success",
        message: "Thông báo",
      }));
      await getListAdmissionCounseling(selectedKey.id);
      setIsOpen(false);
      setSelectedItem(undefined);
      setMode("add");
    } catch (error) {
      setFormNotification((prev) => ({
        ...prev,
        isOpen: true,
        status: "error",
        message: "Thông báo",
        description: Messages.ERROR,
      }));
    }
  };

  const handleSubmitUpload = async (
    fileParticipant: File,
    fileAttachment: File
  ) => {
    setLoadingUpload(true);
    const formData = new FormData();
    formData.append("FunctionName", "admission");
    formData.append("file", fileAttachment);
    const results = await postFiles(formData);
    if (results && results !== undefined) {
      const formData = new FormData();
      formData.append("Excel", fileParticipant);
      formData.append("PDF.Type", results.type);
      formData.append("PDF.Path", results.path);
      formData.append("PDF.Name", results.name);
      formData.append("PDF.Size", results.size.toString());
      const response = await ImportAdmissionCounseling(formData);
      if (response.totalError !== 0) {
        setFormNotification((prev) => ({
          ...prev,
          status: "error",
          message: "Đã có lỗi xảy ra!",
          description: `${response.messageError}`,
        }));
      } else {
        setFormNotification((prev) => ({
          ...prev,
          status: "success",
          message: "Thông báo",
          description: `Tải lên thành công ${response.totalCount} dòng thông tin chủ nhiệm lớp!`,
        }));
      }
      setFormNotification((prev) => ({
        ...prev,
        isOpen: true,
      }));
      await getListAdmissionCounseling(selectedKey.id);
      const timeoutId = setTimeout(() => {
        setLoadingUpload(false);
        setIsOpen(false);
        setIsUpload(false);
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  };

  const handleExportExcel = async () => {
    setLoadingUpload(true);
    const unit = units.find(
      (unit: any) => unit.idHrm === selectedKeyUnit
    ) as any;
    const results = await getExportAdmissionCounseling(
      unit?.code,
      selectedKey.id
    );
    if (results.totalError > 0) {
      setFormNotification((prev) => ({
        ...prev,
        isOpen: true,
        status: "error",
        message: "Không thể tải tệp báo cáo!",
        description: `${results.messageError}`,
      }));
      setLoadingUpload(false);
      return;
    }
    const defaultInfo = [
      ["", "", "", "", "", "", "", "", "", "", "BM-03"],
      [
        "TRƯỜNG ĐẠI HỌC KINH TẾ - TÀI CHÍNH",
        "",
        "",
        "",
        "",
        "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM",
      ],
      ["THÀNH PHỐ HỒ CHÍ MINH", "", "", "", "", "Độc lập - Tự do - Hạnh phúc"],
      ["(ĐƠN VỊ)", "", "", ""],
      ["TỔNG HỢP DANH SÁCH"],
      ["Tham gia hoạt động tư vấn tuyển sinh trực tiếp"],
      [""],
    ];

    const dataArray = [
      [
        "STT",
        "Mã số CB-GV-NV",
        "Họ và Tên",
        "Đơn vị",
        "Địa điểm",
        "Vị trí tham gia",
        "Số buổi",
        "Số tiết chuẩn",
        "Số văn bản, ngày lập",
        "Thời gian hoạt động",
        "Ghi chú",
      ],
      ...results.data.map((item: any, index: number) => [
        index + 1,
        item.userName,
        item.fullName,
        item.unitName ?? "",
        item.location ?? "",
        item.position ?? "",
        item.numberOfTime ?? 0,
        item.standardNumber,
        item.determinations.documentNumber +
          ", " +
          convertTimestampToDate(item.determinations.documentDate),
        item.determinations.fromDate !== 0 && item.determinations.toDate !== 0
          ? convertTimestampToDate(item.determinations.fromDate) +
            " - " +
            convertTimestampToDate(item.determinations.toDate)
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
    worksheet["!cols"][8] = { wch: 12 };
    worksheet["!cols"][9] = { wch: 10 };
    worksheet["K1"].s = {
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
        tempMerge.push({ s: { r: row, c: 0 }, e: { r: row, c: 6 } });
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
        if (col === 1 || col === 2 || col === 4 || col === 10) {
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
        tempMerge.push({ s: { r: row, c: 0 }, e: { r: row, c: 10 } });
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
      { s: { r: 1, c: 5 }, e: { r: 1, c: 10 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: 2 } },
      { s: { r: 2, c: 5 }, e: { r: 2, c: 10 } },
      { s: { r: 3, c: 0 }, e: { r: 3, c: 2 } },
      { s: { r: 4, c: 0 }, e: { r: 4, c: 10 } },
      { s: { r: 5, c: 0 }, e: { r: 5, c: 10 } },
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
    ).padStart(2, "0")}-${now.getFullYear()}-${String(now.getHours()).padStart(
      2,
      "0"
    )}-${String(now.getMinutes()).padStart(2, "0")}`;
    let filename = unit?.code
      ? "BM03-" + unit?.code + "-" + formattedDate + ".xlsx"
      : "BM03-" + formattedDate + ".xlsx";
    saveAs(blob, filename);
    setFormNotification((prev) => ({
      ...prev,
      isOpen: true,
      status: "success",
      message: "Thông báo",
      description: `Tải xuống tệp ${filename} thành công!`,
    }));
    const timeoutId = setTimeout(() => {
      setLoadingUpload(false);
    }, 500);
    return () => clearTimeout(timeoutId);
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
        const response = await putUpdateApprovedAdmissionCounseling(formData);
        if (response) {
          setFormNotification((prev) => ({
            ...prev,
            description: isRejected
              ? `${Messages.REJECTED_CLASSLEADERS} (${
                  selectedRowKeys.length > 0 ? selectedRowKeys.length : 1
                } dòng)`
              : `${Messages.APPROVED_CLASSLEADERS} (${
                  selectedRowKeys.length > 0 ? selectedRowKeys.length : 1
                } dòng)`,
          }));
        }
      }
      setFormNotification((prev) => ({
        ...prev,
        isOpen: true,
        status: "success",
        message: "Thông báo",
      }));
      setSelectedRowKeys([]);
      await getListAdmissionCounseling(selectedKey.id);
      setIsOpen(false);
      setSelectedItem(undefined);
      setMode("add");
    } catch (error) {
      setFormNotification((prev) => ({
        ...prev,
        isOpen: true,
        status: "error",
        message: "Thông báo",
        description: Messages.ERROR,
      }));
    }
  };

  const handleChangeYear = (value: any) => {
    setLoading(true);
    const temp = defaultYears.filter((x: any) => x.id === value)[0] as any;
    setSelectedKey(temp);
    getListAdmissionCounseling(temp.id);
    setStartDate(temp.startDate);
    setEndDate(temp.endDate);
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timeoutId);
  };

  const getDisplayRole = async () => {
    if (typeof window !== "undefined") {
      const s_username = localStorage.getItem("s_username");
      setUserName(s_username as string);
      const s_role = localStorage.getItem("s_role");
      const s_family = localStorage.getItem("s_family");
      if (s_family && s_role === "secretary") {
        setSelectedKeyUnit(s_family.toLowerCase());
      }
      const response = await getRoleByName(s_role as string);
      setRole(response.items[0]);
    }
  };

  useEffect(() => {
    setLoading(true);
    document.title = PageTitles.BM03;

    Promise.all([getDefaultYears(), getListUnits()]);
    getDisplayRole();
    onSearch("");
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (
      admissionCounseling.length &&
      units.length &&
      (selectedKeyUnit || startDate || endDate)
    ) {
      onSearch("");
    }
  }, [admissionCounseling, units, selectedKeyUnit, startDate, endDate]);

  useEffect(() => {
    const timer = setTimeout(
      () => setFormNotification((prev) => ({ ...prev, isOpen: false })),
      100
    );
    return () => clearTimeout(timer);
  }, [formNotification.isOpen]);

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
                  <Search
                    placeholder=" "
                    onChange={(e) => onSearch(e.target.value)}
                    enterButton
                  />
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
            </>
          )}
          {role?.displayRole.isExport && (
            <>
              <Button
                icon={<FileExcelOutlined />}
                onClick={handleExportExcel}
                iconPosition="start"
                style={{
                  backgroundColor: Colors.GREEN,
                  borderColor: Colors.GREEN,
                  color: Colors.WHITE,
                }}
              >
                Xuất Excel
              </Button>
            </>
          )}
          {role?.displayRole.isCreate && (
            <>
              <Dropdown menu={{ items }} trigger={["click"]}>
                <a onClick={(e) => e.preventDefault()}>
                  <Button type="primary" icon={<PlusOutlined />}>
                    Thêm hoạt động
                  </Button>
                </a>
              </Dropdown>
            </>
          )}
          {role?.displayRole.isDelete && (
            <>
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
            </>
          )}
        </div>
        <CustomNotification
          isOpen={formNotification.isOpen}
          status={formNotification.status}
          message={formNotification.message}
          description={formNotification.description}
        />
        <CustomModal
          isOpen={isOpen}
          width={isShowPdf ? "85vw" : "1000px"}
          title={
            mode === "edit"
              ? Messages.UPDATE_ADMISSION_COUNSELING
              : Messages.ADD_ADMISSION_COUNSELING
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
            setFormNotification((prev) => ({
              ...prev,
              isOpen: false,
            }));
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
                  formName="bm03"
                  onSubmit={handleSubmitUpload}
                  handleShowPDF={setIsShowPdf}
                  displayRole={role?.displayRole ?? ({} as DisplayRoleItem)}
                />
              </>
            ) : (
              <>
                <FormBM03
                  onSubmit={handleSubmit}
                  handleShowPDF={setIsShowPdf}
                  initialData={selectedItem as Partial<any>}
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
      {loadingUpload && (
        <>
          <LoadingSpin isLoadingSpin={loadingUpload} />
        </>
      )}
      <hr className="mb-3" />
      <TemplateForms
        loading={loading}
        data={data}
        title={columns}
        onEdit={handleEdit}
        onSetBlock={setIsBlock}
        onSetPayments={setIsPayments}
        onSelectionChange={(selectedRowKeys) =>
          setSelectedRowKeys(selectedRowKeys)
        }
      />
    </div>
  );
};
export default BM03;
