"use client";

import {
  CharitableItem,
  deleteCharitables,
  getAllCharitables,
  getExportCharitable,
  ImportCharitables,
  postCharitable,
  putCharitable,
} from "@/services/generalWorks/charitableServices";
import {
  DisplayRoleItem,
  getRoleByName,
  RoleItem,
} from "@/services/roles/rolesServices";
import { getAllSchoolYears } from "@/services/schoolYears/schoolYearsServices";
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
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  FileExcelOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  ConfigProvider,
  DatePicker,
  Dropdown,
  GetProps,
  Input,
  MenuProps,
  Select,
  TableColumnsType,
  Tag,
} from "antd";
import Link from "next/link";
import { Key, useCallback, useEffect, useState } from "react";
import CustomModal from "../CustomModal";
import CustomNotification from "../CustomNotification";
import FormBM10 from "./activity/formBM10";
import FromUpload from "./activity/formUpload";
import TemplateForms from "./workloads/TemplateForms";

import saveAs from "file-saver";
import * as XLSX from "sheetjs-style";

import locale from "antd/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { LoadingSpin } from "../skeletons/LoadingSpin";
dayjs.locale("vi");

const BM10 = () => {
  type SearchProps = GetProps<typeof Input.Search>;
  const { Search } = Input;
  const [loading, setLoading] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [charitables, setCharitables] = useState<CharitableItem[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isUpload, setIsUpload] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [selectedItem, setSelectedItem] = useState<Partial<any> | undefined>(
    undefined
  );
  const [defaultYears, setDefaultYears] = useState<any>();
  const [selectedKey, setSelectedKey] = useState<any>();
  const [startDate, setStartDate] = useState<number | 0>(0);
  const [minStartDate, setMinStartDate] = useState<number | 0>(0);
  const [endDate, setEndDate] = useState<number | 0>(0);
  const [maxEndDate, setMaxEndDate] = useState<number | 0>(0);
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
        await getListCharitables(id);
        setStartDate(startDate);
        setMinStartDate(startDate);
        setEndDate(endDate);
        setMaxEndDate(endDate);
      }
    }
  };

  const getListCharitables = async (yearId: string) => {
    const response = await getAllCharitables(yearId);
    setCharitables(response.items);
    setData(response.items);
  };

  const columns: TableColumnsType<CharitableItem> = [
    {
      title: "HOẠT ĐỘNG",
      dataIndex: "contents",
      key: "contents",
      className: "max-w-8",
      fixed: "left",
      render: (contents: string, record: CharitableItem) => {
        return (
          <span
            className="text-blue-500 font-semibold cursor-pointer"
            onClick={() => {
              handleEdit(record);
            }}
          >
            {contents}
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
      dataIndex: "documentNumber",
      key: "documentNumber",
      render: (documentNumber: string, record: CharitableItem) => {
        return (
          <div className="flex flex-col">
            <span className="text-center font-medium">{documentNumber}</span>
            <span className="text-center text-[13px]">
              {record.determinations.documentDate !== 0
                ? convertTimestampToDate(record.determinations.documentDate)
                : ""}
            </span>
          </div>
        );
      },
      className: "w-[150px]",
    },
    {
      title: (
        <>
          <span className="py-2">THỜI GIAN HOẠT ĐỘNG</span>
        </>
      ),
      dataIndex: "time",
      key: "time",
      children: [
        {
          title: (
            <>
              <span className="py-2">TỪ NGÀY</span>
            </>
          ),
          dataIndex: "fromDate",
          key: "fromDate",
          render: (_, record: CharitableItem) => {
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
          className: "text-center w-[100px]",
        },
        {
          title: (
            <>
              <span className="py-2">ĐẾN NGÀY</span>
            </>
          ),
          dataIndex: "toDate",
          key: "toDate",
          render: (_, record: CharitableItem) => {
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
          className: "text-center w-[100px]",
        },
      ],
    },
    {
      title: (
        <div className="p-1">
          DANH SÁCH <br /> THAM GIA
        </div>
      ),
      dataIndex: "members",
      key: "members",
      className: "text-center w-[110px]",
      render: (_, record: CharitableItem) => {
        return (
          <>
            {record.members && record.members.length > 0 ? (
              <>{record.members.length}</>
            ) : (
              <span>0</span>
            )}
          </>
        );
      },
    },
    {
      title: (
        <div className="p-1">
          TÀI LIỆU <br /> ĐÍNH KÈM
        </div>
      ),
      dataIndex: "file",
      key: "file",
      className: "customInfoColors text-center w-[110px]",
      render: (_, item: CharitableItem) => {
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
      render: (_, item: CharitableItem) => {
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

  const onSearch: SearchProps["onSearch"] = (value) => {
    if (value === "") setData(charitables || []);

    const filteredData = charitables.filter((item) => {
      const matchesName = item.contents
        .toLowerCase()
        .includes(value.toLowerCase());
      const matchesDate =
        startDate && endDate
          ? item.determinations.entryDate >= startDate &&
            item.determinations.entryDate <= endDate
          : true;
      return matchesName && matchesDate;
    });
    setData(filteredData || []);
  };

  const handleDelete = useCallback(async () => {
    try {
      const selectedKeysArray = Array.from(selectedRowKeys) as string[];
      if (selectedKeysArray.length > 0) {
        await deleteCharitables(selectedKeysArray);
        setFormNotification((prev) => ({
          ...prev,
          isOpen: true,
          status: "success",
          message: "Thông báo",
          description: `Đã xóa thành công ${selectedKeysArray.length} dòng thông tin!`,
        }));
        await getListCharitables(selectedKey.id);
        setSelectedRowKeys([]);
      }
    } catch (error) {
      console.error("Error deleting selected items:", error);
    }
  }, [selectedRowKeys]);

  const handleEdit = (labor: any) => {
    const updatedActivity: Partial<any> = {
      ...labor,
    };
    setSelectedItem(updatedActivity);
    setMode("edit");
    setIsOpen(true);
  };

  const handleSubmit = async (formData: Partial<any>) => {
    try {
      if (mode === "edit" && selectedItem) {
        const response = await putCharitable(formData.id as string, formData);
        if (response) {
          setFormNotification((prev) => ({
            ...prev,
            description: Messages.UPDATE_CHARITABLE,
          }));
        }
      } else {
        const response = await postCharitable(formData);
        if (response) {
          setFormNotification((prev) => ({
            ...prev,
            description: Messages.ADD_CHARITABLE,
          }));
        }
      }
      setFormNotification((prev) => ({
        ...prev,
        isOpen: true,
        status: "success",
        message: "Thông báo",
      }));
      await getListCharitables(selectedKey.id);
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
    formData.append("FunctionName", "general/charity");
    formData.append("file", fileAttachment);
    const results = await postFiles(formData);
    if (results && results !== undefined) {
      const formData = new FormData();
      formData.append("Excel", fileParticipant);
      formData.append("PDF.Type", results.type);
      formData.append("PDF.Path", results.path);
      formData.append("PDF.Name", results.name);
      formData.append("PDF.Size", results.size.toString());
      const response = await ImportCharitables(formData);
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
      await getListCharitables(selectedKey.id);
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
    const results = await getExportCharitable(selectedKey.id, null);
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
      ["", "", "", "", "", "", "", "", "", "", "", "BM-10"],
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
        "Tham gia, ủng hộ hoạt động cộng đồng, từ thiện do Trường, đơn vị thuộc Trường tổ chức",
      ],
      [""],
    ];

    const dataArray = [
      [
        "STT",
        "Mã số CB-GV-NV",
        "Họ và tên",
        "Đơn vị",
        "Nội dung hoạt động",
        "",
        "Địa điểm tổ chức",
        "",
        "Nhà tài trợ",
        "Số văn bản, ngày lập",
        "Thời gian hoạt động",
        "Ghi chú",
      ],
      ...results.data.map((item: any, index: number) => [
        index + 1,
        item.userName,
        item.fullName,
        item.unitName ?? "",
        item.contents ?? "",
        "",
        item.eventVenue ?? "",
        "",
        item.sponsor ?? "",
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
    for (let row = 7; row <= combinedData.length - 1; row++) {
      tempMerge.push({ s: { r: row, c: 4 }, e: { r: row, c: 5 } });
      tempMerge.push({ s: { r: row, c: 6 }, e: { r: row, c: 7 } });
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
      }
    }

    for (let row = combinedData.length + 1; row <= range.e.r; row++) {
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
    ).padStart(2, "0")}-${now.getFullYear()}-${String(now.getHours()).padStart(
      2,
      "0"
    )}-${String(now.getMinutes()).padStart(2, "0")}`;
    let filename = "BM10-" + formattedDate + ".xlsx";
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

  const handleChangeYear = async (value: any) => {
    setLoading(true);
    const temp = defaultYears.filter((x: any) => x.id === value)[0] as any;
    setSelectedKey(temp);
    await getListCharitables(temp.id);
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
      const response = await getRoleByName(s_role as string);
      setRole(response.items[0]);
    }
  };

  useEffect(() => {
    setLoading(true);
    document.title = PageTitles.BM10;
    getDefaultYears();
    getDisplayRole();
    onSearch("");
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (charitables.length && (startDate || endDate)) {
      onSearch("");
    }
  }, [charitables, startDate, endDate]);

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
          <div className="grid grid-cols-6 gap-3">
            <div className="col-span-2 flex flex-col justify-center gap-1">
              <span className="text-[14px] text-neutral-500">Tìm kiếm:</span>
              <Search
                placeholder=" "
                onChange={(e) => onSearch(e.target.value)}
                enterButton
              />
            </div>
            <div className="flex flex-col justify-center gap-1">
              <span className="text-[14px] text-neutral-500">Năm học:</span>
              <Select
                showSearch
                optionFilterProp="label"
                filterSort={(optionA, optionB) =>
                  (optionA?.title ?? "").localeCompare(optionB?.title ?? "")
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
              <span className="text-[14px] text-neutral-500">Từ ngày:</span>
              <ConfigProvider locale={locale}>
                <DatePicker
                  allowClear={false}
                  placeholder="dd/mm/yyyy"
                  format="DD/MM/YYYY"
                  minDate={dayjs.unix(minStartDate).tz("Asia/Ho_Chi_Minh")}
                  maxDate={dayjs.unix(maxEndDate).tz("Asia/Ho_Chi_Minh")}
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
              <span className="text-[14px] text-neutral-500">Đến ngày:</span>
              <ConfigProvider locale={locale}>
                <DatePicker
                  allowClear={false}
                  placeholder="dd/mm/yyyy"
                  format="DD/MM/YYYY"
                  minDate={dayjs.unix(minStartDate).tz("Asia/Ho_Chi_Minh")}
                  maxDate={dayjs.unix(maxEndDate).tz("Asia/Ho_Chi_Minh")}
                  value={
                    endDate ? dayjs.unix(endDate).tz("Asia/Ho_Chi_Minh") : null
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
          </div>
        </div>
        <div className="flex justify-end mt-6 gap-3">
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
                color="danger"
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
      <CustomModal
        isOpen={isOpen}
        width={isShowPdf ? "85vw" : "900px"}
        title={
          mode === "edit"
            ? Messages.TITLE_UPDATE_CHARITABLE
            : Messages.TITLE_ADD_CHARITABLE
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
                formName="bm10"
                onSubmit={handleSubmitUpload}
                handleShowPDF={setIsShowPdf}
                displayRole={role?.displayRole ?? ({} as DisplayRoleItem)}
              />
            </>
          ) : (
            <>
              <FormBM10
                key="form-charitable-bm10"
                onSubmit={handleSubmit}
                initialData={selectedItem as Partial<any>}
                mode={mode}
                formName="bm10"
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

export default BM10;
