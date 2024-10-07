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
      title: "Mã số CBGVNV",
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
  const handleExportExcel = useCallback(async () => {
    const results = await getDataExportById(
      "b46ee628-bfe3-4d27-a10b-9d0c47145613"
    );
    if (results) {
      const defaultInfo = [
        ["", "", "", "", "", "", "", "", "", "", "", "", "BM-05"],
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
          "Tham gia Ban tổ chức các hoạt động báo cáo chuyên đề, Hội thảo khoa học; Các cuộc thi học thuật; Hướng dẫn/hỗ trợ sinh viên tham gia các cuộc thi, … được BĐH phê duyệt tiết chuẩn",
        ],
        [""], // Dòng 9 để trống
      ];

      const defaultFooterInfo = [
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
        ["", "LÃNH ĐẠO ĐƠN VỊ", "", "", "", "", "", "", "", "NGƯỜI LẬP"],
      ];

      const dataArray = [
        [
          "STT",
          "Mã số CBGVNV",
          "Họ và chữ lót",
          "Tên",
          "Đơn vị",
          "Tên hoạt động đã thực hiện",
          "",
          "",
          "",
          "Số tiết chuẩn được BGH phê duyệt",
          "Minh chứng",
          "",
          "Ghi chú",
        ], // Tên cột ở dòng 10
        ...results.data.map((item, index) => [
          index + 1,
          item.userName,
          item.middleName,
          item.firstName,
          item.faculityName,
          item.activityName,
          "",
          "",
          "",
          item.standNumber,
          item.determination,
          "",
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
      // Thiết lập chiều cao của hàng 6 (ô đã merge) thành 40 pixel
      worksheet["!rows"] = [];
      worksheet["!rows"][5] = { hpx: 40 }; // Chiều cao hàng thứ 6 là 40 pixel
      worksheet["!cols"] = [];
      worksheet["!cols"][0] = { wch: 4 };
      worksheet["!cols"][1] = { wch: 20 };
      worksheet["!cols"][2] = { wch: 20 };
      worksheet["!cols"][4] = { wch: 13 };
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
      worksheet["A2"].s = {
        font: {
          name: "Times New Roman",
          sz: 11,
        },
        alignment: {
          wrapText: true,
          vertical: "center",
          horizontal: "center",
        },
      };
      worksheet["G2"].s = {
        font: {
          name: "Times New Roman",
          sz: 11,
          bold: true,
        },
        alignment: {
          wrapText: true,
          vertical: "center",
          horizontal: "center",
        },
      };
      worksheet["A3"].s = {
        font: {
          name: "Times New Roman",
          sz: 11,
        },
        alignment: {
          wrapText: true,
          vertical: "center",
          horizontal: "center",
        },
      };
      worksheet["G3"].s = {
        font: {
          name: "Times New Roman",
          sz: 11,
          bold: true,
        },
        alignment: {
          wrapText: true,
          vertical: "center",
          horizontal: "center",
        },
      };
      worksheet["A4"].s = {
        font: {
          name: "Times New Roman",
          sz: 11,
          bold: true,
        },
        alignment: {
          wrapText: true,
          vertical: "center",
          horizontal: "center",
        },
      };
      worksheet["A5"].s = {
        font: {
          name: "Times New Roman",
          sz: 15,
          bold: true,
        },
        alignment: {
          wrapText: true,
          vertical: "center",
          horizontal: "center",
        },
      };
      worksheet["A6"].s = {
        font: {
          name: "Times New Roman",
          sz: 13,
          bold: true,
        },
        alignment: {
          wrapText: true,
          vertical: "center",
          horizontal: "center",
        },
      };
      // Merge các ô từ A6 đến M6
      worksheet["!merges"] = [];
      const temp = [];
      const range = XLSX.utils.decode_range(worksheet["!ref"]!);
      for (let row = 7; row <= results.data.length + 7; row++) {
        temp.push(
          { s: { r: row, c: 5 }, e: { r: row, c: 8 } },
          { s: { r: row, c: 10 }, e: { r: row, c: 11 } }
        );
        worksheet["!rows"][row + 1] = { hpx: 45 };
        for (let col = range.s.c; col <= range.e.c; col++) {
          const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
          if (worksheet[cellRef]) {
            worksheet[cellRef].s = {
              font: {
                name: "Times New Roman",
                sz: 11,
                bold:
                  row === 7 || col === 1 || col === 2 || col === 3 || col === 4
                    ? true
                    : false,
              },
              alignment: {
                wrapText: true,
                vertical: "center",
                horizontal:
                  row > 7 &&
                  (col === 1 ||
                    col === 2 ||
                    col === 3 ||
                    col === 4 ||
                    col === 5)
                    ? "left"
                    : "center",
              },
              border: {
                top: { style: "thin" },
                left: { style: "thin" },
                right: { style: "thin" },
                bottom: { style: "thin" },
              },
            };
          }
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
        {
          s: { r: results.data.length + 15, c: 1 },
          e: { r: results.data.length + 15, c: 2 },
        },
        {
          s: { r: results.data.length + 15, c: 9 },
          e: { r: results.data.length + 15, c: 10 },
        },
      ];
      for (
        let row = results.data.length + 8;
        row < results.data.length + 14;
        row++
      ) {
        const cellRef = XLSX.utils.encode_cell({ r: row, c: 0 });
        if (worksheet[cellRef]) {
          worksheet[cellRef].s = {
            font: {
              name: "Times New Roman",
              sz: 11,
            },
          };
        }
      }
      const cellNote = XLSX.utils.encode_cell({
        r: results.data.length + 9,
        c: 0,
      });
      const cellHeadUnit = XLSX.utils.encode_cell({
        r: results.data.length + 15,
        c: 1,
      });
      const cellPersionCreate = XLSX.utils.encode_cell({
        r: results.data.length + 15,
        c: 9,
      });
      worksheet[`${cellNote}`].s = {
        font: {
          name: "Times New Roman",
          sz: 11,
          bold: true,
        },
      };
      worksheet[`${cellHeadUnit}`].s = {
        font: {
          name: "Times New Roman",
          sz: 11,
          bold: true,
        },
        alignment: {
          vertical: "center",
          horizontal: "center",
        },
      };
      worksheet[`${cellPersionCreate}`].s = {
        font: {
          name: "Times New Roman",
          sz: 11,
          bold: true,
        },
        alignment: {
          vertical: "center",
          horizontal: "center",
        },
      };
      worksheet["!merges"].push(...defaultMerges, ...temp);
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
  }, []);

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
