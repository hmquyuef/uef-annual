"use client";

import {
  AddUpdateClassLeaderItem,
  ClassLeaderItem,
  ClassLeadersResponse,
  deleteClassLeaders,
  getAllClassLeaders,
  ImportClassLeaders,
  postAddClassLeader,
  putUpdateClassLeader,
} from "@/services/forms/classLeadersServices";
import { AddUpdateActivityItem } from "@/services/forms/formsServices";
import { convertTimestampToDate, setCellStyle } from "@/utility/Utilities";
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
import FormBM01 from "./activity/formBM01";
import FromUpload from "./activity/formUpload";
import {
  getListUnitsFromHrm,
  UnitHRMItem,
} from "@/services/units/unitsServices";
import locale from "antd/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import PageTitles from "@/utility/Constraints";
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
    onChange: onSelectChange,
  };
  const showTotal: PaginationProps["showTotal"] = (total) => (
    <p className="w-full text-start">
      Đã chọn {selectedRowKeys.length} / {total} dòng dữ liệu
    </p>
  );
  const columns: TableColumnsType<ClassLeaderItem> = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      render: (_, __, index) => <p>{index + 1}</p>,
      className: "text-center w-[1rem]",
    },
    {
      title: "MÃ SỐ CB-GV-NV",
      dataIndex: "userName",
      key: "userName",
      className: "w-[3rem]",
      render: (userName: string, record: ClassLeaderItem) => {
        return (
          <p
            className="text-blue-500 font-semibold cursor-pointer"
            onClick={() => {
              setMode("edit");
              handleEdit(record);
            }}
          >
            {userName}
          </p>
        );
      },
    },
    {
      title: "HỌ VÀ CHỮ LÓT",
      dataIndex: "middleName",
      key: "middleName",
      render: (middleName: string) => <p>{middleName}</p>,
      className: "w-[5rem]",
    },
    {
      title: "TÊN",
      dataIndex: "firstName",
      key: "firstName",
      render: (firstName: string) => <p>{firstName}</p>,
      className: "text-center w-[3rem]",
    },
    {
      title: "ĐƠN VỊ",
      dataIndex: "unitName",
      key: "unitName",
      className: "text-center w-[5rem]",
      render: (unitName: string) => <p>{unitName}</p>,
    },
    {
      title: "HỌC KỲ",
      dataIndex: "semester",
      key: "semester",
      className: "text-center w-[3rem]",
      render: (semester: string) => <p>{semester}</p>,
    },
    {
      title: "SỐ TIẾT CHUẨN ĐƯỢC PHÊ DUYỆT",
      dataIndex: "standardNumber",
      key: "standardNumber",
      className: "text-center w-[5rem]",
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
      className: "text-center w-[2rem]",
    },
    {
      title: "MÃ LỚP",
      dataIndex: "classCode",
      key: "classCode",
      render: (classCode: string) => <p>{classCode}</p>,
      className: "text-center w-[2rem]",
    },
    {
      title: "THỜI GIAN THAM DỰ",
      dataIndex: "attendances",
      key: "attendances",
      render: (attendances: number) =>
        attendances ? convertTimestampToDate(attendances) : "",
      className: "text-center w-[4rem]",
    },
    {
      title: "MINH CHỨNG",
      dataIndex: "proof",
      key: "proof",
      render: (proof: string) => <p>{proof}</p>,
      className: "w-[10rem]",
    },
    {
      title: "GHI CHÚ",
      dataIndex: "note",
      key: "note",
      render: (note: string) => <p>{note}</p>,
      className: "text-center w-[2rem]",
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
    if (value === "") setData(classLeaders?.items || []);
    const filteredData = classLeaders?.items.filter((item) =>
      item.fullName.toLowerCase().includes(value.toLowerCase())
    );
    setData(filteredData || []);
  };

  const handleDelete = useCallback(async () => {
    try {
      const selectedKeysArray = Array.from(selectedRowKeys) as string[];
      if (selectedKeysArray.length > 0) {
        await deleteClassLeaders(selectedKeysArray);
        setNotificationOpen(true);
        setStatus("success");
        setMessage("Thông báo");
        setDescription(
          `Đã xóa thành công ${selectedKeysArray.length} thông tin chủ nhiệm lớp!`
        );
        await getListClassLeaders();
        setSelectedRowKeys([]);
      }
    } catch (error) {
      console.error("Error deleting selected items:", error);
    }
  }, [selectedRowKeys]);
  const handleEdit = (classLeader: ClassLeaderItem) => {
    const updatedActivity: Partial<AddUpdateClassLeaderItem> = {
      ...classLeader,
    };
    setSelectedItem(updatedActivity);
    setMode("edit");
    setIsOpen(true);
  };
  const handleSubmit = async (formData: Partial<AddUpdateClassLeaderItem>) => {
    try {
      if (mode === "edit" && selectedItem) {
        const response = await putUpdateClassLeader(
          formData.id as string,
          formData
        );
        if (response) {
          setNotificationOpen(true);
          setStatus("success");
          setMessage("Thông báo");
          setDescription("Cập nhật thông tin chủ nhiệm lớp thành công!");
        }
      } else {
        const response = await postAddClassLeader(formData);
        if (response) {
          setNotificationOpen(true);
          setStatus("success");
          setMessage("Thông báo");
          setDescription("Thêm mới thông tin chủ nhiệm lớp thành công!");
        }
      }
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

      const defaultFooterInfo = [
        [""],
        [""],
        ["Ghi chú:"],
        [
          "- Mã số CB-GV-NV yêu cầu cung cấp phải chính xác. Đơn vị có thể tra cứu Mã CB-GV-NV trên trang Portal UEF.",
        ],
        ["- Biểu mẫu này dành cho các khoa, viện, Phòng Đào tạo."],
        [
          "- Photo Tờ trình, Kế hoạch đã được BĐH phê duyệt tiết chuẩn nộp về VPT. Các trường hợp không được phê duyệt hoặc đã thanh toán thù lao thì không đưa vào biểu mẫu này.",
        ],
        [
          "- Mỗi cá nhân có thể có nhiều dòng dữ liệu tương ứng với các hoạt động đã thực hiện... được BĐH phê duyệt tiết chuẩn.",
        ],
        [
          "- Việc quy đổi tiết chuẩn căn cứ theo Phụ lục III, Quyết định số 720/QĐ-UEF ngày 01 tháng 9 năm 2023.								",
        ],
        [""],
        ["LÃNH ĐẠO ĐƠN VỊ", "", "", "", "", "", "", "", "NGƯỜI LẬP"],
      ];

      const dataArray = [
        [
          "STT",
          "Mã số CB-GV-NV",
          "Họ và chữ lót",
          "Tên",
          "Đơn vị",
          "Học kỳ",
          "Số tiết chuẩn được duyệt",
          "Ngành",
          "Khóa",
          "Mã lớp",
          "Minh chứng",
          "Ghi chú",
        ], // Tên cột ở dòng 10
        ...data.map((item, index) => [
          index + 1,
          item.userName,
          item.middleName,
          item.firstName,
          item.unitName ?? "",
          item.semester ?? "",
          item.standardNumber,
          item.subject ?? "",
          item.course ?? "",
          item.classCode ?? "",
          item.proof ?? "",
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
      worksheet["!cols"][1] = { wch: 15 };
      worksheet["!cols"][2] = { wch: 15 };
      worksheet["!cols"][6] = { wch: 12 };
      worksheet["!cols"][7] = { wch: 15 };
      worksheet["!cols"][10] = { wch: 20 };
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
      for (let row = 7; row <= data.length + 7; row++) {
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
            col === 4 ||
            col === 5 ||
            col === 6 ||
            col === 8 ||
            col === 9
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
  };
  useEffect(() => {
    document.title = PageTitles.BM01;
    Promise.all([getListClassLeaders(), getAllUnitsFromHRM()]);
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
                // console.log("value :>> ", value);
                setSelectedKeyUnit(value);
              }}
            />
            <div className="grid grid-cols-3 gap-4">
              <ConfigProvider locale={locale}>
                <RangePicker
                  placeholder={["Từ ngày", "Đến ngày"]}
                  format={"DD/MM/YYYY"}
                  onChange={(dates, dateStrings) => {
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
                  }}
                  className="col-span-2"
                />
              </ConfigProvider>
            </div>
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
          width="900px"
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
                  initialData={selectedItem as Partial<AddUpdateActivityItem>}
                  mode={mode}
                />
              </>
            )
          }
        />
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
