"use client";

import {
  deleteLecturerRegulations,
  getAllLecturerRegulations,
  getExportLecturers,
  ImportLecturerRegulations,
  LecturerRegulationItem,
  postLecturerRegulation,
  putLecturerRegulation,
} from "@/services/regulations/lecturersServices";
import {
  DisplayRoleItem,
  getRoleByName,
  RoleItem,
} from "@/services/roles/rolesServices";
import { getAllSchoolYears } from "@/services/schoolYears/schoolYearsServices";
import { getAllUnits, UnitItem } from "@/services/units/unitsServices";
import { postFiles } from "@/services/uploads/uploadsServices";
import Colors from "@/utility/Colors";
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
  CloseOutlined,
  DeleteOutlined,
  FallOutlined,
  FileExcelOutlined,
  PlusOutlined,
  RiseOutlined,
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
  Tag,
} from "antd";

import saveAs from "file-saver";
import { AnimatePresence, motion } from "motion/react";
import { Key, useCallback, useEffect, useState } from "react";
import * as XLSX from "sheetjs-style";
import CustomModal from "../CustomModal";
import CustomNotification from "../CustomNotification";
import { LoadingSpin } from "../skeletons/LoadingSpin";
import FormBM13 from "./activity/formBM13";
import FromUpload from "./activity/formUpload";
import TemplateForms from "./workloads/TemplateForms";

import locale from "antd/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import Link from "next/link";
dayjs.locale("vi");

const BM13 = () => {
  type SearchProps = GetProps<typeof Input.Search>;
  const { Search } = Input;
  const [loading, setLoading] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFormdata, setSelectedFormdata] = useState<any>();
  const [lecturer, setLecturer] = useState<LecturerRegulationItem[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isUpload, setIsUpload] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [selectedItem, setSelectedItem] = useState<Partial<any> | undefined>(
    undefined
  );
  const [units, setUnits] = useState<UnitItem[]>([]);
  const [defaultYears, setDefaultYears] = useState<any>();
  const [selectedKey, setSelectedKey] = useState<any>();
  const [selectedKeyUnit, setSelectedKeyUnit] = useState<Key | null>(null);
  const [startDate, setStartDate] = useState<number | 0>(0);
  const [minStartDate, setMinStartDate] = useState<number | 0>(0);
  const [endDate, setEndDate] = useState<number | 0>(0);
  const [maxEndDate, setMaxEndDate] = useState<number | 0>(0);
  const [advanced, setAdvanced] = useState(false);
  const [role, setRole] = useState<RoleItem>();
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
        await getListTeachingRegulations(id);
        setStartDate(startDate);
        setMinStartDate(startDate);
        setEndDate(endDate);
        setMaxEndDate(endDate);
      }
    }
  };

  const getListTeachingRegulations = async (yearId: string) => {
    const response = await getAllLecturerRegulations(yearId);
    setLecturer(response.items);
    setData(response.items);
  };

  const getListUnits = async () => {
    const response = await getAllUnits("true");
    setUnits(response.items);
  };

  const columns: TableColumnsType<LecturerRegulationItem> = [
    {
      title: "MÃ SỐ CB-GV-NV",
      dataIndex: "userName",
      key: "userName",
      className: "w-[6rem]",
      fixed: "left",
      render: (userName: string, record: LecturerRegulationItem) => {
        return (
          <span
            className="text-blue-500 font-semibold cursor-pointer"
            onClick={() => {
              handleEdit(record);
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
      fixed: "left",
    },
    {
      title: "ĐƠN VỊ",
      dataIndex: "unitName",
      key: "unitName",
      className: "text-center w-[80px]",
      render: (unitName: string) => <>{unitName}</>,
      fixed: "left",
    },
    {
      title: <div className="py-1">SỐ LẦN NGHỈ</div>,
      dataIndex: "attendance",
      key: "attendance",
      className: "text-center w-[70px]",
      children: [
        {
          title: <div className="py-1">CÓ THÔNG BÁO</div>,
          dataIndex: "notifiedAbsences",
          key: "notifiedAbsences",
          className: "text-center w-[70px]",
          render: (notifiedAbsences: number) => <>{notifiedAbsences}</>,
        },
        {
          title: <div className="py-1">KHÔNG THÔNG BÁO</div>,
          dataIndex: "unnotifiedAbsences",
          key: "unnotifiedAbsences",
          className: "text-center w-[70px]",
          render: (unnotifiedAbsences: number) => <>{unnotifiedAbsences}</>,
        },
      ],
    },
    {
      title: (
        <div>
          SỐ LẦN <br /> ĐI TRỄ/VỀ SỚM
        </div>
      ),
      dataIndex: "lateEarly",
      key: "lateEarly",
      render: (lateEarly: number) => <>{lateEarly}</>,
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
      render: (_, record: LecturerRegulationItem) => {
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
      title: (
        <div className="p-1">
          TÀI LIỆU <br /> ĐÍNH KÈM
        </div>
      ),
      dataIndex: "file",
      key: "file",
      className: "customInfoColors text-center w-[100px]",
      render: (_, item: LecturerRegulationItem) => {
        const file = item.determinations.files.find(
          (x) => x.type === "application/pdf"
        );
        return file && file !== undefined ? (
          <>
            <Link
              href={"https://api-annual.uef.edu.vn/" + file.path}
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
      render: (_, item: LecturerRegulationItem) => {
        const path = item.determinations?.files[0]?.path;
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

  const onSearch: SearchProps["onSearch"] = (value) => {
    if ((value === "" && !selectedKeyUnit) || selectedKeyUnit === "all")
      setData(lecturer || []);
    const selectedUnit = units.find(
      (unit: UnitItem) => unit.idHrm === selectedKeyUnit
    );
    const filteredData = lecturer.filter((item) => {
      const matchesName =
        item.userName.toLowerCase().includes(value.toLowerCase()) ||
        item.fullName.toLowerCase().includes(value.toLowerCase());
      const matchesUnit = selectedUnit
        ? item.unitName === selectedUnit.code
        : true;
      const matchesDate =
        startDate && endDate
          ? item.determinations.entryDate >= startDate &&
            item.determinations.entryDate <= endDate
          : true;
      return matchesName && matchesUnit && matchesDate;
    });
    setData(filteredData || []);
  };

  const handleDelete = useCallback(async () => {
    try {
      const selectedKeysArray = Array.from(selectedRowKeys) as string[];
      if (selectedKeysArray.length > 0) {
        await deleteLecturerRegulations(selectedKeysArray);
        setFormNotification((prev) => ({
          ...prev,
          isOpen: true,
          status: "success",
          message: "Thông báo",
          description: `Đã xóa thành công ${selectedKeysArray.length} dòng thông tin!`,
        }));
        await getListTeachingRegulations(selectedKey.id);
        setSelectedRowKeys([]);
      }
    } catch (error) {
      console.error("Error deleting selected items:", error);
    }
  }, [selectedRowKeys]);

  const handleEdit = (Teaching: any) => {
    const updatedActivity: Partial<any> = {
      ...Teaching,
    };
    setSelectedItem(updatedActivity);
    setMode("edit");
    setIsOpen(true);
  };

  const handleSubmit = async (formData: Partial<any>) => {
    const { userName } = formData;
    const checkExist = lecturer.find((x) => x.userName === userName);
    if (checkExist && mode === "add") {
      setSelectedFormdata(formData);
      return setIsModalVisible(true);
    }
    setLoadingUpload(true);
    const apiCall =
      mode === "add"
        ? postLecturerRegulation(formData)
        : putLecturerRegulation(formData.id, formData);

    try {
      const response = await apiCall;
      if (response) {
        setFormNotification((prev) => ({
          ...prev,
          isOpen: true,
          status: "success",
          message: "Thông báo",
          description:
            mode === "add"
              ? Messages.ADD_REGULATION_TEACHING
              : Messages.UPDATE_REGULATION_TEACHING,
        }));
        await getListTeachingRegulations(selectedKey.id);
      }
    } catch (error) {
      setFormNotification((prev) => ({
        ...prev,
        isOpen: true,
        status: "error",
        message: "Không thể cập nhật thông tin!",
        description: `${error}`,
      }));
    } finally {
      setTimeout(() => {
        setLoadingUpload(false);
        setIsOpen(false);
        setSelectedItem(undefined);
        setMode("add");
      }, 300);
    }
  };

  const handleSubmitUpload = async (
    fileParticipant: File,
    fileAttachment: File
  ) => {
    try {
      setLoadingUpload(true);
      const formDataAttachment = new FormData();
      formDataAttachment.append("FunctionName", "regulations/lecturers");
      formDataAttachment.append("file", fileAttachment);
      const results = await postFiles(formDataAttachment);

      const formDataExcel = new FormData();
      formDataExcel.append("Excel", fileParticipant);
      Object.entries(results).forEach(([key, value]) =>
        formDataExcel.append(`PDF.${key}`, value.toString())
      );

      const response = await ImportLecturerRegulations(formDataExcel);
      setFormNotification((prev) => ({
        ...prev,
        isOpen: true,
        status: response.totalError > 0 ? "error" : "success",
        message: response.totalError > 0 ? "Đã có lỗi xảy ra!" : "Thông báo",
        description:
          response.totalError > 0
            ? response.messageError
            : `Tải lên thành công ${response.totalCount} dòng thông tin chủ nhiệm lớp!`,
      }));

      await getListTeachingRegulations(selectedKey.id);
    } catch (error) {
      setFormNotification((prev) => ({
        ...prev,
        isOpen: true,
        status: "error",
        message: "Không thể xử lý thông tin!",
        description: `${error}`,
      }));
    } finally {
      setTimeout(() => {
        setIsOpen(false);
        setLoadingUpload(false);
        setIsUpload(false);
      }, 300);
    }
  };

  const handleExportExcel = async () => {
    setLoadingUpload(true);
    const unit = units.find(
      (unit: any) => unit.idHrm === selectedKeyUnit
    ) as any;
    const results = await getExportLecturers(unit?.code, selectedKey.id);
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
      ["", "", "", "", "", "", "", "", "", "BM-13"],
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
      ["Vi phạm nội quy giảng dạy"],
      [""],
    ];

    const dataArray = [
      [
        "STT",
        "Mã số CB-GV-NV",
        "Họ và tên",
        "Đơn vị",
        "Số lần nghỉ có báo",
        "Số lần nghỉ không báo",
        "Số lần đi trễ/về sớm",
        "Số văn bản, ngày lập",
        "Số lưu văn bản",
        "Ghi chú",
      ],
      ...results.data.map((item: any) => [
        item.stt,
        item.userName,
        item.fullName,
        item.unitName ?? "",
        item.notifiedAbsences ?? "",
        item.unnotifiedAbsences,
        item.lateEarly ?? "",
        item.determinations.documentNumber !== ""
          ? item.determinations.documentNumber +
            ", " +
            convertTimestampToDate(item.determinations.documentDate)
          : "",
        item.determinations.internalNumber ?? "",
        item.note ?? "",
      ]),
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
    worksheet["!cols"][0] = { wch: 5 };
    worksheet["!cols"][1] = { wch: 20 };
    worksheet["!cols"][2] = { wch: 20 };
    worksheet["!cols"][4] = { wch: 10 };
    worksheet["!cols"][5] = { wch: 10 };
    worksheet["!cols"][6] = { wch: 10 };
    worksheet["!cols"][7] = { wch: 13 };
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
    for (let row = 7; row <= range.e.r - defaultFooterInfo.length; row++) {
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
        if (col === 1 || col === 2 || col === 9) {
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
      }
    }

    for (
      let row = range.e.r - defaultFooterInfo.length + 1;
      row <= range.e.r;
      row++
    ) {
      if (row < range.e.r)
        tempMerge.push({ s: { r: row, c: 0 }, e: { r: row, c: 9 } });
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
      { s: { r: 1, c: 0 }, e: { r: 1, c: 2 } },
      { s: { r: 1, c: 6 }, e: { r: 1, c: 9 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: 2 } },
      { s: { r: 2, c: 6 }, e: { r: 2, c: 9 } },
      { s: { r: 3, c: 0 }, e: { r: 3, c: 2 } },
      { s: { r: 4, c: 0 }, e: { r: 4, c: 9 } },
      { s: { r: 5, c: 0 }, e: { r: 5, c: 9 } },
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
      ? "BM04-" + unit?.code + "-" + formattedDate + ".xlsx"
      : "BM04-" + formattedDate + ".xlsx";
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

  const handleChangeYear = (value: any) => {
    setLoading(true);
    const temp = defaultYears.filter((x: any) => x.id === value)[0] as any;
    setSelectedKey(temp);
    getListTeachingRegulations(temp.id);
    setStartDate(temp.startDate);
    setEndDate(temp.endDate);
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timeoutId);
  };

  const getDisplayRole = async () => {
    if (typeof window !== "undefined") {
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
    document.title = PageTitles.BM13;
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
      lecturer.length &&
      units.length &&
      (selectedKeyUnit || startDate || endDate)
    ) {
      onSearch("");
    }
  }, [lecturer, units, selectedKeyUnit, startDate, endDate]);

  useEffect(() => {
    const timer = setTimeout(
      () => setFormNotification((prev) => ({ ...prev, isOpen: false })),
      100
    );
    return () => clearTimeout(timer);
  }, [formNotification.isOpen]);

  return (
    <div>
      <div className="grid grid-cols-3 mb-3 border-b border-neutral-300 pb-3">
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
          {role?.displayRole.isExport && (
            <>
              <Button
                color="green"
                variant="solid"
                icon={<FileExcelOutlined />}
                onClick={handleExportExcel}
                iconPosition="start"
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
                color="red"
                variant="solid"
                disabled={selectedRowKeys.length === 0}
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
      </div>
      <CustomNotification
        isOpen={formNotification.isOpen}
        status={formNotification.status}
        message={formNotification.message}
        description={formNotification.description}
      />
      {isModalVisible &&
        (() => {
          const oldData = lecturer.find(
            (x) => x.userName === selectedFormdata?.userName
          );
          const newData = selectedFormdata;
          const fields: {
            key: keyof LecturerRegulationItem;
            label: string;
          }[] = [
            { key: "notifiedAbsences", label: "Số lần nghỉ có thông báo" },
            { key: "unnotifiedAbsences", label: "Số lần nghỉ không thông báo" },
            { key: "lateEarly", label: "Số lần đi trễ/về sớm" },
          ];
          return (
            <Modal
              open={isModalVisible}
              onCancel={() => {
                setIsModalVisible(false);
                setIsOpen(false);
                setSelectedItem(undefined);
                setMode("add");
              }}
              onOk={async () => {
                setLoadingUpload(true);
                try {
                  const response = await putLecturerRegulation(
                    oldData?.id as string,
                    newData
                  );
                  if (response) {
                    setFormNotification((prev) => ({
                      ...prev,
                      isOpen: true,
                      status: "success",
                      message: "Thông báo",
                      description: Messages.UPDATE_REGULATION_TEACHING,
                    }));
                    await getListTeachingRegulations(selectedKey.id);
                    const timeoutId = setTimeout(() => {
                      setLoadingUpload(false);
                      setIsModalVisible(false);
                      setIsOpen(false);
                      setSelectedItem(undefined);
                      setMode("add");
                    }, 300);
                    return () => clearTimeout(timeoutId);
                  }
                } catch (error) {
                  setFormNotification((prev) => ({
                    ...prev,
                    isOpen: true,
                    status: "error",
                    message: "Không thể cập nhật thông tin!",
                    description: `${error}`,
                  }));
                }
              }}
              title={Messages.TITLE_UPDATE_REGULATION_TEACHING}
              width={500}
            >
              <hr className="mb-2" />
              <div className="flex flex-col justify-center items-center">
                <span>
                  Xác nhận thông tin cập nhật nội quy lao động cho nhân sự
                </span>
                <span>{oldData?.fullName}</span>
                <div>
                  <span>{oldData?.userName}</span>-
                  <span>{oldData?.unitName}</span>
                </div>
              </div>
              {oldData && newData && (
                <>
                  <span className="font-semibold mt-4">Thông tin cập nhật</span>
                  {fields.map(({ key, label }) => (
                    <div key={key}>
                      <div className="grid grid-cols-2 gap-1">
                        <span className="text-neutral-500">{label}:</span>
                        <div className="flex justify-center gap-5">
                          <span className="font-medium">
                            {oldData?.[key].toString()}
                          </span>
                          <span>
                            {oldData[key] > newData[key] ? (
                              <span className="text-red-500">
                                <FallOutlined />
                              </span>
                            ) : oldData[key] < newData[key] ? (
                              <span className="text-green-500">
                                <RiseOutlined />
                              </span>
                            ) : (
                              "="
                            )}
                          </span>
                          <span className="font-medium">{newData[key]}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </Modal>
          );
        })()}
      <CustomModal
        isOpen={isOpen}
        width={isShowPdf ? "85vw" : "800px"}
        title={
          mode === "edit"
            ? Messages.TITLE_UPDATE_REGULATION_TEACHING
            : Messages.TITLE_ADD_REGULATION_TEACHING
        }
        onOk={() => {
          const formElement = document.querySelector("form");
          formElement?.dispatchEvent(
            new Event("submit", { cancelable: true, bubbles: true })
          );
        }}
        role={role || undefined}
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
                formName="bm13"
                onSubmit={handleSubmitUpload}
                handleShowPDF={setIsShowPdf}
                displayRole={role?.displayRole ?? ({} as DisplayRoleItem)}
              />
            </>
          ) : (
            <>
              <FormBM13
                key="form-regulations-teachings-bm13"
                onSubmit={handleSubmit}
                handleShowPDF={setIsShowPdf}
                initialData={selectedItem as Partial<any>}
                mode={mode}
                displayRole={role?.displayRole ?? ({} as DisplayRoleItem)}
              />
            </>
          )
        }
      />
      {loadingUpload && (
        <>
          <LoadingSpin isLoadingSpin={loadingUpload} />
        </>
      )}
      <TemplateForms
        loading={loading}
        data={data}
        title={columns}
        onEdit={handleEdit}
        onSelectionChange={(selectedRowKeys) =>
          setSelectedRowKeys(selectedRowKeys)
        }
      />
    </div>
  );
};

export default BM13;
