export function convertTimestampToDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function convertTimestampToFullDateTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
}

export function convertTimestampToDayMonth(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}`;
}

export const setCellStyle = (
  worksheet: any,
  cell: string,
  fontSize: number,
  isBold: boolean,
  hAlign: string,
  vAlign: string,
  wrapText: boolean,
  hasBorder: boolean
) => {
  const style: any = {
    font: {
      name: "Times New Roman",
      sz: fontSize,
      bold: isBold,
    },
    alignment: {
      wrapText: wrapText,
      vertical: vAlign,
      horizontal: hAlign,
    },
  };
  if (hasBorder) {
    style.border = {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    };
  }
  if (worksheet[cell]) {
    worksheet[cell].s = style;
  }
};

export const defaultFooterInfo = [
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