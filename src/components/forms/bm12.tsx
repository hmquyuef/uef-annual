"use client";

import {
  deleteUnitLevels,
  ImportUnitLevels,
  postUnitLevel,
  putUnitLevel,
  UnitLevelItem,
} from "@/services/generalWorks/unitLevelServices";
import {
  DisplayRoleItem,
  getRoleByName,
  RoleItem,
} from "@/services/roles/rolesServices";
import { getAllSchoolYears } from "@/services/schoolYears/schoolYearsServices";
import { FileItem } from "@/services/uploads/uploadsServices";
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
  Tooltip,
} from "antd";
import { Key, useCallback, useEffect, useState } from "react";
import CustomModal from "../CustomModal";
import CustomNotification from "../CustomNotification";
import FormBM12 from "./activity/formBM12";
import FromUpload from "./activity/formUpload";
import TemplateForms from "./workloads/TemplateForms";

import { getAllSchoolLevels } from "@/services/generalWorks/schoolLevelServices";
import locale from "antd/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import saveAs from "file-saver";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import * as XLSX from "sheetjs-style";
dayjs.locale("vi");

const BM12 = () => {
  type SearchProps = GetProps<typeof Input.Search>;
  const { Search } = Input;
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [unitLevels, setUnitLevels] = useState<UnitLevelItem[]>([]);
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
        await getListUnitLevels(id);
        setStartDate(startDate);
        setMinStartDate(startDate);
        setEndDate(endDate);
        setMaxEndDate(endDate);
      }
    }
  };

  const getListUnitLevels = async (yearId: string) => {
    const response = await getAllSchoolLevels(yearId);
    setUnitLevels(response.items);
    setData(response.items);
  };

  const columns: TableColumnsType<UnitLevelItem> = [
    {
      title: "HOẠT ĐỘNG",
      dataIndex: "contents",
      key: "contents",
      className: "max-w-8",
      fixed: "left",
      render: (contents: string, record: UnitLevelItem) => {
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
      render: (documentNumber: string, record: UnitLevelItem) => {
        const ngayLap = record.documentDate;
        return (
          <div className="flex flex-col">
            <span className="text-center font-medium">{documentNumber}</span>
            <span className="text-center text-[13px]">
              {convertTimestampToDate(ngayLap)}
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
          render: (_, record: UnitLevelItem) => {
            return (
              <>
                {record.fromDate ? (
                  <div className="flex flex-col">
                    <span>{convertTimestampToDate(record.fromDate)}</span>
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
          render: (_, record: UnitLevelItem) => {
            return (
              <>
                {record.toDate ? (
                  <div className="flex flex-col">
                    <span>{convertTimestampToDate(record.toDate)}</span>
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
      render: (_, record: UnitLevelItem) => {
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
      dataIndex: ["attackmentFile", "path"],
      key: "path",
      className: "text-center w-[110px]",
      sorter: (a, b) =>
        a.attackmentFile?.path.localeCompare(b.attackmentFile?.path),
      render: (path: string) => {
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
    if (value === "") setData(unitLevels || []);

    const filteredData = unitLevels.filter((item) => {
      const matchesName = item.contents
        .toLowerCase()
        .includes(value.toLowerCase());
      const matchesDate =
        startDate && endDate
          ? item.entryDate >= startDate && item.entryDate <= endDate
          : true;
      return matchesName && matchesDate;
    });
    setData(filteredData || []);
  };

  const handleDelete = useCallback(async () => {
    try {
      const selectedKeysArray = Array.from(selectedRowKeys) as string[];
      if (selectedKeysArray.length > 0) {
        await deleteUnitLevels(selectedKeysArray);
        setFormNotification((prev) => ({
          ...prev,
          isOpen: true,
          status: "success",
          message: "Thông báo",
          description: `Đã xóa thành công ${selectedKeysArray.length} dòng thông tin!`,
        }));
        await getListUnitLevels(selectedKey.id);
        setSelectedRowKeys([]);
      }
    } catch (error) {
      console.error("Error deleting selected items:", error);
    }
    setFormNotification((prev) => ({
      ...prev,
      isOpen: false,
    }));
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
        const response = await putUnitLevel(formData.id as string, formData);
        if (response) {
          setFormNotification((prev) => ({
            ...prev,
            description: Messages.UPDATE_UNITS_LEVEL,
          }));
        }
      } else {
        const response = await postUnitLevel(formData);
        if (response) {
          setFormNotification((prev) => ({
            ...prev,
            description: Messages.ADD_UNITS_LEVEL,
          }));
        }
      }
      setFormNotification((prev) => ({
        ...prev,
        isOpen: true,
        status: "success",
        message: "Thông báo",
      }));
      await getListUnitLevels(selectedKey.id);
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
    setFormNotification((prev) => ({
      ...prev,
      isOpen: false,
    }));
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

      const response = await ImportUnitLevels(formData);
      if (response) {
        setFormNotification((prev) => ({
          ...prev,
          isOpen: true,
          status: "error",
          message: "Thông báo",
          description: `Tải lên thành công ${response.totalCount} dòng dữ liệu!`,
        }));
      }
      await getListUnitLevels(selectedKey.id);
      setIsOpen(false);
      setSelectedItem(undefined);
      setMode("add");
      setIsUpload(false);
    } catch (error) {
      setFormNotification((prev) => ({
        ...prev,
        isOpen: true,
        status: "error",
        message: "Thông báo",
        description: Messages.ERROR,
      }));
      setIsOpen(false);
      setIsUpload(false);
    }
    setFormNotification((prev) => ({
      ...prev,
      isOpen: false,
    }));
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

  const handleChangeYear = async (value: any) => {
    setLoading(true);
    const temp = defaultYears.filter((x: any) => x.id === value)[0] as any;
    setSelectedKey(temp);
    await getListUnitLevels(temp.id);
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
    document.title = PageTitles.BM12;

    getDefaultYears();
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
    }
    setLoading(false);
    onSearch("");
  }, []);

  useEffect(() => {
    if (unitLevels.length > 0 && (startDate || endDate)) {
      onSearch("");
    }
  }, [unitLevels, startDate, endDate]);
  return (
    <div>
      <div className="grid grid-cols-3 mb-3">
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
              <Tooltip placement="top" title="Thêm mới hoạt động" arrow={true}>
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
            ? Messages.TITLE_UPDATE_UNITS_LEVEL
            : Messages.TITLE_ADD_UNITS_LEVEL
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
                formName="youth-union"
                onSubmit={handleSubmitUpload}
                handleShowPDF={setIsShowPdf}
                displayRole={role?.displayRole ?? ({} as DisplayRoleItem)}
              />
            </>
          ) : (
            <>
              <FormBM12
                key="form-unit-levels-bm12"
                onSubmit={handleSubmit}
                initialData={selectedItem as Partial<any>}
                mode={mode}
                formName="unit-levels"
                displayRole={role?.displayRole ?? ({} as DisplayRoleItem)}
              />
            </>
          )
        }
      />
      <hr className="mb-3" />
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

export default BM12;
