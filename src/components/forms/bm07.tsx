"use client";

import { PaymentApprovedItem } from "@/services/forms/PaymentApprovedItem";
import {
  DisplayRoleItem,
  getRoleByName,
  RoleItem,
} from "@/services/roles/rolesServices";
import { getAllSchoolYears } from "@/services/schoolYears/schoolYearsServices";
import {
  deleteTrainingLevels,
  getAllTrainingLevels,
  ImportTrainingLevels,
  postTrainingLevel,
  putApprovedTrainingLevel,
  putTrainingLevel,
  TrainingLevelItem,
} from "@/services/trainingLevels/trainingServices";
import { getAllUnits, UnitItem } from "@/services/units/unitsServices";
import { FileItem } from "@/services/uploads/uploadsServices";
import PageTitles from "@/utility/Constraints";
import Messages from "@/utility/Messages";
import {
  convertTimestampToDate,
  defaultFooterInfo,
  setCellStyle,
} from "@/utility/Utilities";
import {
  ArrowsAltOutlined,
  CloseCircleOutlined,
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
  Tooltip,
} from "antd";
import { AnimatePresence, motion } from "motion/react";
import { Key, useCallback, useEffect, useState } from "react";
import CustomModal from "../CustomModal";
import CustomNotification from "../CustomNotification";
import FormBM07 from "./activity/formBM07";
import FromUpload from "./activity/formUpload";
import TemplateForms from "./workloads/TemplateForms";

import saveAs from "file-saver";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

import locale from "antd/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import * as XLSX from "sheetjs-style";
dayjs.locale("vi");

const BM07 = () => {
  type SearchProps = GetProps<typeof Input.Search>;
  const { Search } = Input;
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [labors, setLabors] = useState<TrainingLevelItem[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isUpload, setIsUpload] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Partial<any> | undefined>(
    undefined
  );
  const [units, setUnits] = useState<UnitItem[]>([]);
  const [defaultYears, setDefaultYears] = useState<any>();
  const [selectedKey, setSelectedKey] = useState<any>();
  const [selectedKeyUnit, setSelectedKeyUnit] = useState<Key | null>(null);
  const [message, setMessage] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
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

  const getDefaultYears = async () => {
    const { items } = await getAllSchoolYears();
    if (items) {
      setDefaultYears(items);
      const defaultYear = items.find((x: any) => x.isDefault);
      if (defaultYear) {
        const { id, startDate, endDate } = defaultYear;
        setSelectedKey(defaultYear);
        await getListTrainingLevels(id);
        setStartDate(startDate);
        setMinStartDate(startDate);
        setEndDate(endDate);
        setMaxEndDate(endDate);
      }
    }
  };

  const getListTrainingLevels = async (yearId: string) => {
    const response = await getAllTrainingLevels(yearId);
    setLabors(response.items);
    setData(response.items);
    setNotificationOpen(false);
  };

  const getListUnits = async () => {
    const response = await getAllUnits("true");
    setUnits(response.items);
  };

  const columns: TableColumnsType<TrainingLevelItem> = [
    {
      title: "MÃ SỐ CB-GV-NV",
      dataIndex: "userName",
      key: "userName",
      className: "max-w-8",
      fixed: "left",
      render: (userName: string, record: TrainingLevelItem) => {
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
      className: "max-w-10",
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
      title: "NỘI DUNG ĐÀO TẠO",
      dataIndex: "contents",
      key: "contents",
      render: (contents: string) => <>{contents}</>,
      className: "max-w-24",
    },
    {
      title: "NƠI ĐẠO TẠO",
      dataIndex: "issuancePlace",
      key: "issuancePlace",
      render: (issuancePlace: string) => <>{issuancePlace}</>,
      className: "max-w-12",
    },
    {
      title: "LOẠI CC/GCN",
      dataIndex: "type",
      key: "type",
      render: (type: string) => <>{type}</>,
      className: "text-center w-[120px]",
    },
    {
      title: (
        <div>
          THỜI GIAN CẤP <br />
          CC/GCN
        </div>
      ),
      dataIndex: "issuanceDate",
      key: "issuanceDate",
      render: (issuanceDate: number) => (
        <>{convertTimestampToDate(issuanceDate)}</>
      ),
      className: "text-center w-[120px]",
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
      setData(labors || []);
    const selectedUnit = units.find(
      (unit: UnitItem) => unit.idHrm === selectedKeyUnit
    );
    const filteredData = labors.filter((item) => {
      const matchesName =
        item.userName.toLowerCase().includes(value.toLowerCase()) ||
        item.fullName.toLowerCase().includes(value.toLowerCase());
      const matchesUnit = selectedUnit
        ? item.unitName === selectedUnit.code
        : true;
      const matchesDate =
        startDate && endDate
          ? item.entryDate >= startDate && item.entryDate <= endDate
          : true;
      return matchesName && matchesUnit && matchesDate;
    });
    setData(filteredData || []);
  };

  const handleDelete = useCallback(async () => {
    try {
      const selectedKeysArray = Array.from(selectedRowKeys) as string[];
      if (selectedKeysArray.length > 0) {
        await deleteTrainingLevels(selectedKeysArray);
        setDescription(
          `Đã xóa thành công ${selectedKeysArray.length} thông tin chủ nhiệm lớp!`
        );
        setNotificationOpen(true);
        setStatus("success");
        setMessage("Thông báo");
        await getListTrainingLevels(selectedKey.id);
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
        const response = await putTrainingLevel(
          formData.id as string,
          formData
        );
        if (response) {
          setDescription(Messages.UPDATE_CLASSLEADERS);
        }
      } else {
        const response = await postTrainingLevel(formData);
        if (response) {
          setDescription(Messages.ADD_CLASSLEADERS);
        }
      }
      setNotificationOpen(true);
      setStatus("success");
      setMessage("Thông báo");
      await getListTrainingLevels(selectedKey.id);
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

      const response = await ImportTrainingLevels(formData);
      if (response) {
        setNotificationOpen(true);
        setStatus("success");
        setMessage("Thông báo");
        setDescription(
          `Tải lên thành công ${response.totalCount} thông tin chủ nhiệm lớp!`
        );
      }
      await getListTrainingLevels(selectedKey.id);
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
        const response = await putApprovedTrainingLevel(formData);
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
      await getListTrainingLevels(selectedKey.id);
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

  const handleChangeYear = async (value: any) => {
    setLoading(true);
    const temp = defaultYears.filter((x: any) => x.id === value)[0] as any;
    setSelectedKey(temp);
    await getListTrainingLevels(temp.id);
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
    document.title = PageTitles.BM15;

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
      labors.length > 0 &&
      units.length > 0 &&
      (selectedKeyUnit || startDate || endDate)
    ) {
      onSearch("");
    }
  }, [labors, units, selectedKeyUnit, startDate, endDate]);
  return (
    <div>
      <div className="grid grid-cols-3 mb-3">
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
                formName="labor"
                onSubmit={handleSubmitUpload}
                handleShowPDF={setIsShowPdf}
                displayRole={role?.displayRole ?? ({} as DisplayRoleItem)}
              />
            </>
          ) : (
            <>
              <FormBM07
                key="form-training-levels-bm07"
                onSubmit={handleSubmit}
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
        width={700}
      >
        <Input value={reason} onChange={(e) => setReason(e.target.value)} />
      </Modal>
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

export default BM07;
