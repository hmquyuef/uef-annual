"use client";

import {
  Button,
  Empty,
  GetProps,
  Input,
  PaginationProps,
  Table,
  TableColumnsType,
  Tooltip,
} from "antd";
import FormBM04 from "./activity/formBM04";
import {
  AddUpdateQAItem,
  deleteQAs,
  getAllQAs,
  postAddQA,
  putUpdateQA,
  QAItem,
  QAResponse,
} from "@/services/forms/qaServices";
import CustomModal from "../CustomModal";
import CustomNotification from "../CustomNotification";
import {
  DeleteOutlined,
  FileExcelOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Key, useCallback, useEffect, useState } from "react";
import saveAs from "file-saver";
import * as XLSX from "sheetjs-style";
import { TableRowSelection } from "antd/es/table/interface";
import { getDataExportById } from "@/services/exports/exportsServices";
import { convertTimestampToDate, setCellStyle } from "@/utility/Utilities";

type SearchProps = GetProps<typeof Input.Search>;
const { Search } = Input;

const BM04 = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [classLeaders, setClassLeaders] = useState<QAResponse | undefined>(
    undefined
  );
  const [data, setData] = useState<QAItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<
    Partial<AddUpdateQAItem> | undefined
  >(undefined);
  const [message, setMessage] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
  const getListQAs = async () => {
    const response = await getAllQAs();
    setClassLeaders(response);
    setData(response.items);
    setNotificationOpen(false);
  };
  const onSelectChange = (newSelectedRowKeys: Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection: TableRowSelection<QAItem> = {
    selectedRowKeys,
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
      render: (_, __, index) => <p>{index + 1}</p>,
      className: "text-center w-[1rem]",
    },
    {
      title: "Mã số CB-GV-NV",
      dataIndex: "userName",
      key: "userName",
      className: "w-[3rem]",
      render: (userName: string, record: QAItem) => {
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
      title: "Họ và chữ lót",
      dataIndex: "middleName",
      key: "middleName",
      render: (middleName: string) => <p>{middleName}</p>,
      className: "w-[5rem]",
    },
    {
      title: "Tên",
      dataIndex: "firstName",
      key: "firstName",
      render: (firstName: string) => <p>{firstName}</p>,
      className: "text-center w-[3rem]",
    },
    {
      title: "Đơn vị",
      dataIndex: "unitName",
      key: "unitName",
      className: "text-center w-[5rem]",
      render: (unitName: string) => <p>{unitName}</p>,
    },
    {
      title: "Nội dung",
      dataIndex: "contents",
      key: "contents",
      render: (contents: string) => <p>{contents}</p>,
      className: "w-[15rem]",
    },
    {
      title: "Số lượng SV",
      dataIndex: "totalStudent",
      key: "totalStudent",
      className: "text-center w-[3rem]",
      render: (totalStudent: string) => <p>{totalStudent}</p>,
    },
    {
      title: "Số tiết chuẩn được phê duyệt",
      dataIndex: "standardNumber",
      key: "standardNumber",
      className: "text-center w-[4rem]",
      render: (standardNumber: string) => <p>{standardNumber}</p>,
    },
    {
      title: "Minh chứng",
      dataIndex: "proof",
      key: "proof",
      render: (proof: string) => <p>{proof}</p>,
      className: "w-[5rem]",
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      render: (note: string) => <p>{note}</p>,
      className: "text-center w-[2rem]",
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
        await deleteQAs(selectedKeysArray);
        setNotificationOpen(true);
        setStatus("success");
        setMessage("Thông báo");
        setDescription(
          `Đã xóa thành công ${selectedKeysArray.length} thông tin!`
        );
        await getListQAs();
        setSelectedRowKeys([]);
      }
    } catch (error) {
      console.error("Error deleting selected items:", error);
    }
  }, [selectedRowKeys]);
  const handleEdit = (classLeader: QAItem) => {
    const updatedActivity: Partial<AddUpdateQAItem> = {
      ...classLeader,
    };
    setSelectedItem(updatedActivity);
    setMode("edit");
    setIsOpen(true);
  };
  const handleSubmit = async (formData: Partial<AddUpdateQAItem>) => {
    try {
      if (mode === "edit" && selectedItem) {
        const response = await putUpdateQA(formData.id as string, formData);
        if (response) {
          setNotificationOpen(true);
          setStatus("success");
          setMessage("Thông báo");
          setDescription(
            "Cập nhật thông tin tham gia hỏi vấn đáp thi xếp lớp Anh văn đầu vào thành công!"
          );
        }
      } else {
        const response = await postAddQA(formData);
        if (response) {
          setNotificationOpen(true);
          setStatus("success");
          setMessage("Thông báo");
          setDescription(
            "Thêm mới thông tin tham gia hỏi vấn đáp thi xếp lớp Anh văn đầu vào thành công!"
          );
        }
      }
      await getListQAs();
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
  const handleExportExcel = async () => {
    if (data) {
      const defaultInfo = [
        ["", "", "", "", "", "", "", "", "", "", "", "", "BM-04"],
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
        ["Giảng viên tham gia Hỏi vấn đáp thi xếp lớp Anh văn đầu vào"],
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
        ["LÃNH ĐẠO ĐƠN VỊ", "", "", "", "", "", "", "NGƯỜI LẬP"],
      ];

      const dataArray = [
        [
          "STT",
          "Mã số CB-GV-NV",
          "Họ và chữ lót",
          "Tên",
          "Đơn vị",
          "Nội dung",
          "",
          "",
          "",
          "",
          "Số SV",
          "Thời gian tham dự",
          "Ghi chú",
        ], // Tên cột ở dòng 10
        ...data.map((item, index) => [
          index + 1,
          item.userName,
          item.middleName,
          item.firstName,
          item.unitName,
          item.contents,
          "",
          "",
          "",
          "",
          item.totalStudent,
          convertTimestampToDate(item.attendances),
          item.note,
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
      worksheet["!cols"] = [];
      worksheet["!cols"][0] = { wch: 4 };
      worksheet["!cols"][1] = { wch: 20 };
      worksheet["!cols"][2] = { wch: 20 };
      worksheet["M1"].s = {
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
      setCellStyle(worksheet, "A6", 11, true, "center", "center", false, false);

      // Merge các ô từ A6 đến M6
      worksheet["!merges"] = [];
      const tempMerge = [];
      const range = XLSX.utils.decode_range(worksheet["!ref"]!);
      for (let row = 7; row <= data.length + 7; row++) {
        tempMerge.push({ s: { r: row, c: 5 }, e: { r: row, c: 9 } });
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
          if (col === 0 || col === 4 || col === 9 || col === 10) {
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
          tempMerge.push({ s: { r: row, c: 0 }, e: { r: row, c: 12 } });
        else {
          tempMerge.push({ s: { r: row, c: 0 }, e: { r: row, c: 4 } });
          tempMerge.push({ s: { r: row, c: 7 }, e: { r: row, c: 10 } });
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
        { s: { r: 1, c: 6 }, e: { r: 1, c: 12 } },
        { s: { r: 2, c: 0 }, e: { r: 2, c: 3 } },
        { s: { r: 2, c: 6 }, e: { r: 2, c: 12 } },
        { s: { r: 3, c: 0 }, e: { r: 3, c: 3 } },
        { s: { r: 4, c: 0 }, e: { r: 4, c: 12 } },
        { s: { r: 5, c: 0 }, e: { r: 5, c: 12 } },
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

  useEffect(() => {
    getListQAs();
  }, []);
  return (
    <div>
      <div className="grid grid-cols-4 mb-4">
        <Search
          placeholder="Tìm kiếm hoạt động..."
          onSearch={onSearch}
          size="large"
          enterButton
        />
        <div className="col-span-3">
          <div className="flex justify-end gap-4">
            <Tooltip placement="top" title="Xuất dữ liệu Excel" arrow={true}>
              <Button
                icon={<FileExcelOutlined />}
                onClick={handleExportExcel}
                size="large"
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
            <Tooltip
              placement="bottom"
              title="Thêm mới thông tham gia hỏi đáp"
              arrow={true}
            >
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setIsOpen(true);
                  setMode("add");
                }}
                size="large"
                iconPosition="start"
              >
                Thêm mới
              </Button>
            </Tooltip>
            <Tooltip placement="top" title="Xóa các thông tin" arrow={true}>
              <Button
                type="dashed"
                disabled={selectedRowKeys.length === 0}
                danger
                onClick={handleDelete}
                icon={<DeleteOutlined />}
                size="large"
                iconPosition="start"
              >
                Xóa
              </Button>
            </Tooltip>
          </div>
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
          title={
            mode === "edit"
              ? "Cập nhật thông tin tham gia hỏi vấn đáp Tiếng Anh đầu vào"
              : "Thêm mới thông tin tham gia hỏi vấn đáp Tiếng Anh đầu vào"
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
          }}
          bodyContent={
            <FormBM04
              onSubmit={handleSubmit}
              initialData={selectedItem as Partial<AddUpdateQAItem>}
              mode={mode}
            />
          }
        />
      </div>
      <Table<QAItem>
        key={"table-activity-bm01"}
        className="custom-table-header shadow-md rounded-md"
        bordered
        rowKey={(item) => item.id}
        rowHoverable
        size="small"
        pagination={{
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
      />
    </div>
  );
};
export default BM04;
