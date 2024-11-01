"use client";

import {
  ClassAssistantItem,
  ClassAssistantResponse,
  deleteClassAssistants,
  getAllClassAssistants,
  ImportClassAssistants,
  postAddClassAssistant,
  putUpdateClassAssistant,
} from "@/services/forms/assistantsServices";
import {
  convertTimestampToDate,
  defaultFooterInfo,
  setCellStyle,
} from "@/utility/Utilities";
import {
  DeleteOutlined,
  FileExcelOutlined,
  PlusOutlined,
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
  PaginationProps,
  Select,
  Table,
  TableColumnsType,
  Tooltip,
} from "antd";
import { TableRowSelection } from "antd/es/table/interface";
import saveAs from "file-saver";
import { Key, useCallback, useEffect, useState } from "react";
import * as XLSX from "sheetjs-style";
import CustomModal from "../CustomModal";
import CustomNotification from "../CustomNotification";
import FormBM02 from "./activity/formBM02";
import Cookies from "js-cookie";
import FromUpload from "./activity/formUpload";
import {
  getListUnitsFromHrm,
  UnitHRMItem,
} from "@/services/units/unitsServices";
import PageTitles from "@/utility/Constraints";

import locale from "antd/locale/vi_VN";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");

type SearchProps = GetProps<typeof Input.Search>;
const { Search } = Input;
const { RangePicker } = DatePicker;

const BM02 = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [classAssistants, setclassAssistants] = useState<
    ClassAssistantResponse | undefined
  >(undefined);
  const [data, setData] = useState<ClassAssistantItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isUpload, setIsUpload] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<
    Partial<ClassAssistantItem> | undefined
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
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
  });
  const getListClassAssistants = async () => {
    const response = await getAllClassAssistants();
    setclassAssistants(response);
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
  const rowSelection: TableRowSelection<ClassAssistantItem> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const showTotal: PaginationProps["showTotal"] = (total) => (
    <p className="w-full text-start">
      Đã chọn {selectedRowKeys.length} / {total} dòng dữ liệu
    </p>
  );
  const columns: TableColumnsType<ClassAssistantItem> = [
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
      render: (userName: string, record: ClassAssistantItem) => {
        return (
          <span
            className="text-blue-500 font-semibold cursor-pointer"
            onClick={() => {
              setMode("edit");
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
    },
    {
      title: "ĐƠN VỊ",
      dataIndex: "unitName",
      key: "unitName",
      className: "text-center w-[80px]",
      render: (unitName: string) => <>{unitName}</>,
    },
    {
      title: "TÊN CÔNG TÁC SƯ PHẠM",
      dataIndex: "activityName",
      key: "activityName",
      render: (activityName: string) => <>{activityName}</>,
      className: "w-[20rem]",
    },
    {
      title: "MÃ LỚP",
      dataIndex: "classCode",
      key: "classCode",
      render: (classCode: string) => <>{classCode}</>,
      className: "text-center w-[70px]",
    },
    {
      title: "HỌC KỲ",
      dataIndex: "semester",
      key: "semester",
      render: (semester: string) => <>{semester}</>,
      className: "text-center w-[50px]",
    },
    {
      title: "SỐ TIẾT CHUẨN",
      dataIndex: "standardNumber",
      key: "standardNumber",
      className: "text-center w-[90px]",
      render: (standardNumber: string) => <>{standardNumber}</>,
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
      className: "text-center w-[4rem]",
    },
    {
      title: (
        <>
          SỐ VĂN BẢN <br /> NGÀY LẬP
        </>
      ),
      dataIndex: "proof",
      key: "proof",
      render: (proof: string, record: ClassAssistantItem) => {
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
      render: (note: string) => <>{note}</>,
      className: "text-center w-[5rem]",
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
      setData(classAssistants?.items || []);
    const selectedUnit = units.find((unit) => unit.id === selectedKeyUnit);

    const filteredData = classAssistants?.items.filter((item) => {
      const matchesName =
        item.userName.toLowerCase().includes(value.toLowerCase()) ||
        item.fullName.toLowerCase().includes(value.toLowerCase()) ||
        item.activityName.toLowerCase().includes(value.toLowerCase());
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
        await deleteClassAssistants(selectedKeysArray);
        setNotificationOpen(true);
        setStatus("success");
        setMessage("Thông báo");
        setDescription(
          `Đã xóa thành công ${selectedKeysArray.length} thông tin!`
        );
        await getListClassAssistants();
        setSelectedRowKeys([]);
      }
    } catch (error) {
      console.error("Error deleting selected items:", error);
    }
    setNotificationOpen(false);
  }, [selectedRowKeys]);
  const handleEdit = (classLeader: ClassAssistantItem) => {
    const updatedActivity: Partial<ClassAssistantItem> = {
      ...classLeader,
    };
    setSelectedItem(updatedActivity);
    setMode("edit");
    setIsOpen(true);
  };
  const handleSubmit = async (formData: Partial<ClassAssistantItem>) => {
    try {
      if (mode === "edit" && selectedItem) {
        const response = await putUpdateClassAssistant(
          formData.id as string,
          formData
        );
        if (response) {
          setDescription(
            "Cập nhật thông tin tham gia cố vấn môn học, trợ giảng, phụ đạo thành công!"
          );
        }
      } else {
        const response = await postAddClassAssistant(formData);
        if (response) {
          setDescription(
            "Thêm mới thông tin tham gia cố vấn môn học, trợ giảng, phụ đạo thành công!"
          );
        }
      }
      setNotificationOpen(true);
      setStatus("success");
      setMessage("Thông báo");
      await getListClassAssistants();
      setIsOpen(false);
      setSelectedItem(undefined);
      setMode("add");
    } catch (error) {
      setNotificationOpen(true);
      setStatus("error");
      setMessage("Thông báo");
      setDescription("Đã có lỗi xảy ra!");
    }
    setNotificationOpen(false);
  };

  const handleSubmitUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await ImportClassAssistants(formData);
      if (response) {
        setDescription(`Tải lên thành công ${response.totalCount} hoạt động!`);
      }
      setNotificationOpen(true);
      setStatus("success");
      setMessage("Thông báo");
      await getListClassAssistants();
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
    setNotificationOpen(false);
  };

  const handleExportExcel = async () => {
    if (data) {
      const defaultInfo = [
        ["", "", "", "", "", "", "", "", "", "", "BM-02"],
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
          "Tham gia cố vấn môn học, trợ giảng, phụ đạo được Ban điều hành phê duyệt tiết chuẩn",
        ],
        [""],
      ];

      const dataArray = [
        [
          "STT",
          "Mã số CB-GV-NV",
          "Họ và Tên",
          "Đơn vị",
          "Tên công tác sư phạm",
          "Tên lớp",
          "Học kỳ",
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
          item.activityName ?? "",
          item.classCode ?? "",
          item.semester ?? "",
          item.standardNumber,
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
      worksheet["!cols"][3] = { wch: 10 };
      worksheet["!cols"][4] = { wch: 30 };
      worksheet["!cols"][8] = { wch: 10 };
      worksheet["!cols"][10] = { wch: 15 };
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
      ).padStart(2, "0")}-${now.getFullYear()}-${String(
        now.getHours()
      ).padStart(2, "0")}-${String(now.getMinutes()).padStart(2, "0")}`;
      saveAs(blob, "BM02-" + formattedDate + ".xlsx");
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
  useEffect(() => {
    document.title = PageTitles.BM02;
    const pageState = Cookies.get("p_s");
    if (pageState) {
      const [current, pageSize] = JSON.parse(pageState);
      setPagination({
        current,
        pageSize,
      });
    }
    Promise.all([getListClassAssistants(), getAllUnitsFromHRM()]);
  }, []);
  return (
    <div>
      <div className="grid grid-cols-3 mb-4">
        <div className="col-span-2">
          <div className="grid grid-cols-3 gap-4">
            <Search
              placeholder="Tìm kiếm hoạt động..."
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
          <Tooltip placement="top" title={"Thêm mới hoạt động"} arrow={true}>
            <Dropdown menu={{ items }} trigger={["click"]}>
              <a onClick={(e) => e.preventDefault()}>
                <Button type="primary" icon={<PlusOutlined />}>
                  Thêm hoạt động
                </Button>
              </a>
            </Dropdown>
          </Tooltip>
          <Tooltip placement="top" title="Xóa các thông tin" arrow={true}>
            <Button
              type="dashed"
              disabled={selectedRowKeys.length === 0}
              danger
              onClick={handleDelete}
              icon={<DeleteOutlined />}
              iconPosition="start"
            >
              Xóa
            </Button>
          </Tooltip>
        </div>
        <CustomNotification
          message={message}
          description={description}
          status={status}
          isOpen={isNotificationOpen} // Truyền trạng thái mở
        />
        <CustomModal
          isOpen={isOpen}
          isOk={true}
          width="700px"
          title={
            mode === "edit"
              ? "Cập nhật thông tin cố vấn học tập, trợ giảng, phụ đạo"
              : "Thêm mới thông tin cố vấn học tập, trợ giảng, phụ đạo"
          }
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
          }}
          bodyContent={
            isUpload ? (
              <>
                <FromUpload onSubmit={handleSubmitUpload} />
              </>
            ) : (
              <>
                <FormBM02
                  onSubmit={handleSubmit}
                  initialData={selectedItem as Partial<ClassAssistantItem>}
                  mode={mode}
                />
              </>
            )
          }
        />
      </div>
      <Table<ClassAssistantItem>
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
export default BM02;
