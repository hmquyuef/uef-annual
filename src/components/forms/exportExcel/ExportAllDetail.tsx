import {
  getDataExportByUserName
} from "@/services/exports/exportDetailForUser";
import {
  convertTimestampToDate,
  defaultFooterInfo,
  setCellStyle,
} from "@/utility/Utilities";
import { saveAs } from "file-saver";
import * as XLSX from "sheetjs-style";

// export const handleExportAll = async (detailUser: DetailUserItem) => {
//   const defaultInfo = [
//     [
//       "TRƯỜNG ĐẠI HỌC KINH TẾ - TÀI CHÍNH",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM",
//     ],
//     [
//       "THÀNH PHỐ HỒ CHÍ MINH",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "Độc lập - Tự do - Hạnh phúc",
//     ],
//     [""],
//     ["CÔNG TÁC CHUNG NĂM HỌC 2024-2025"],
//     [""],
//     ["Họ và tên:", "", `${detailUser?.fullName}`],
//     ["Mã CB-GV-NV:", "", `${detailUser?.userName}`],
//     ["Học hàm/Học vị:", "", ""],
//     ["Thâm niên công tác:", "", ""],
//     ["Đơn vị:", "", `${detailUser?.unitName}`],
//     [
//       "Tổng số tiết chuẩn:",
//       "",
//       `${detailUser.items.other.reduce(
//         (acc: number, x: any) => acc + x.totalStandarNumber,
//         0
//       )}`,
//     ],
//   ];

//   const dataArrayClassLeader = [
//     [""],
//     ["BIỂU MẪU 01 - CHỦ NHIỆM LỚP"],
//     [
//       "STT",
//       "Tên hoạt động",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "Số tiết chuẩn",
//       "Số văn bản, ngày lập",
//       "Thời gian hoạt động",
//       "Ghi chú",
//     ],
//     ...(detailUser?.classLeaders.items ?? []).map((item, index) => [
//       index + 1,
//       item.activityName,
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       item.standarNumber,
//       item.proof + ", " + convertTimestampToDate(item.documentDate),
//       item.fromDate && item.toDate
//         ? `${convertTimestampToDate(item.fromDate)} - ${convertTimestampToDate(
//             item.toDate
//           )}`
//         : "",
//       item.note ?? "",
//     ]),
//     [
//       "Tổng số tiết chuẩn",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       `${detailUser?.classLeaders.items.reduce(
//         (sum, item) => sum + item.standarNumber,
//         0
//       )}`,
//       "",
//       "",
//       "",
//     ],
//   ];

//   const dataArrayAssistants = [
//     [""],
//     ["BIỂU MẪU 02 - CỐ VẤN HỌC TẬP, TRỢ GIẢNG, PHỤ ĐẠO"],
//     [
//       "STT",
//       "Tên hoạt động",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "Số tiết chuẩn",
//       "Số văn bản, ngày lập",
//       "Thời gian hoạt động",
//       "Ghi chú",
//     ],
//     ...(detailUser?.assistants.items ?? []).map((item, index) => [
//       index + 1,
//       item.activityName,
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       item.standarNumber,
//       item.proof + ", " + convertTimestampToDate(item.documentDate),
//       item.fromDate && item.toDate
//         ? `${convertTimestampToDate(item.fromDate)} - ${convertTimestampToDate(
//             item.toDate
//           )}`
//         : "",
//       item.note ?? "",
//     ]),
//     [
//       "Tổng số tiết chuẩn",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       `${detailUser?.assistants.items.reduce(
//         (sum, item) => sum + item.standarNumber,
//         0
//       )}`,
//       "",
//       "",
//       "",
//     ],
//   ];

//   const dataArrayAdmissionCounseling = [
//     [""],
//     ["BIỂU MẪU 03 - TƯ VẤN TUYỂN SINH"],
//     [
//       "STT",
//       "Tên hoạt động",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "Số tiết chuẩn",
//       "Số văn bản, ngày lập",
//       "Thời gian hoạt động",
//       "Ghi chú",
//     ],
//     ...(detailUser?.admissionCounseling.items ?? []).map((item, index) => [
//       index + 1,
//       item.activityName,
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       item.standarNumber,
//       item.proof + ", " + convertTimestampToDate(item.documentDate),
//       item.fromDate && item.toDate
//         ? `${convertTimestampToDate(item.fromDate)} - ${convertTimestampToDate(
//             item.toDate
//           )}`
//         : "",
//       item.note ?? "",
//     ]),
//     [
//       "Tổng số tiết chuẩn",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       `${detailUser?.assistants.items.reduce(
//         (sum, item) => sum + item.standarNumber,
//         0
//       )}`,
//       "",
//       "",
//       "",
//     ],
//   ];

//   const dataArrayQAEs = [
//     [""],
//     ["BIỂU MẪU 04 - THAM GIA HỎI VẤN ĐÁP TIẾNG ANH ĐẦU VÀO"],
//     [
//       "STT",
//       "Tên hoạt động",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "Số tiết chuẩn",
//       "Số văn bản, ngày lập",
//       "Thời gian hoạt động",
//       "Ghi chú",
//     ],
//     ...(detailUser?.qAs.items ?? []).map((item, index) => [
//       index + 1,
//       item.activityName,
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       item.standarNumber,
//       item.proof + ", " + convertTimestampToDate(item.documentDate),
//       item.fromDate && item.toDate
//         ? `${convertTimestampToDate(item.fromDate)} - ${convertTimestampToDate(
//             item.toDate
//           )}`
//         : "",
//       item.note ?? "",
//     ]),
//     [
//       "Tổng số tiết chuẩn",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       `${detailUser?.qAs.items.reduce(
//         (sum, item) => sum + item.standarNumber,
//         0
//       )}`,
//       "",
//       "",
//       "",
//     ],
//   ];

//   const dataArrayActivities = [
//     [""],
//     ["BIỂU MẪU 05 - CÁC HOẠT ĐỘNG KHÁC ĐƯỢC BAN GIÁM HIỆU PHÊ DUYỆT"],
//     [
//       "STT",
//       "Tên hoạt động",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "Số tiết chuẩn",
//       "Số văn bản, ngày lập",
//       "Thời gian hoạt động",
//       "Ghi chú",
//     ],
//     ...(detailUser?.activities.items ?? []).map((item, index) => [
//       index + 1,
//       item.activityName,
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       item.standarNumber,
//       item.proof + ", " + convertTimestampToDate(item.documentDate),
//       item.fromDate ? convertTimestampToDate(item.fromDate) : "",
//       item.note ?? "",
//     ]),
//     [
//       "Tổng số tiết chuẩn",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       `${detailUser?.activities.items.reduce(
//         (sum, item) => sum + item.standarNumber,
//         0
//       )}`,
//       "",
//       "",
//       "",
//     ],
//   ];

//   const combinedDataClassLeader = [...defaultInfo, ...dataArrayClassLeader];
//   const combinedDataAssistant = [
//     ...combinedDataClassLeader,
//     ...dataArrayAssistants,
//   ];
//   const combinedDataAdmissionCounseling = [
//     ...combinedDataAssistant,
//     ...dataArrayAdmissionCounseling,
//   ];
//   const combinedDataQAE = [
//     ...combinedDataAdmissionCounseling,
//     ...dataArrayQAEs,
//   ];
//   const combinedDataActivity = [...combinedDataQAE, ...dataArrayActivities];

//   const worksheet = XLSX.utils.aoa_to_sheet(combinedDataActivity);
//   worksheet["!pageSetup"] = {
//     paperSize: 9,
//     orientation: "landscape",
//     scale: 100,
//     fitToWidth: 1,
//     fitToHeight: 0,
//     fitToPage: true,
//   };
//   worksheet["!margins"] = {
//     left: 0.1,
//     right: 0.1,
//     top: 0.1,
//     bottom: 0.1,
//     header: 0,
//     footer: 0,
//   };
//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
//   worksheet["!rows"] = [];
//   worksheet["!rows"][3] = { hpx: 40 };
//   worksheet["!cols"] = [];
//   worksheet["!cols"][9] = { wpx: 70 };
//   setCellStyle(worksheet, "A1", 11, true, "center", "center", false, false);
//   setCellStyle(worksheet, "G1", 11, true, "center", "center", false, false);
//   setCellStyle(worksheet, "A2", 11, true, "center", "center", false, false);
//   setCellStyle(worksheet, "G2", 11, true, "center", "center", false, false);
//   setCellStyle(worksheet, "A4", 16, true, "center", "center", false, false);
//   setCellStyle(worksheet, "A6", 11, false, "left", "center", false, false);
//   setCellStyle(worksheet, "C6", 11, true, "left", "center", false, false);
//   setCellStyle(worksheet, "A7", 11, false, "left", "center", false, false);
//   setCellStyle(worksheet, "C7", 11, true, "left", "center", false, false);
//   setCellStyle(worksheet, "A8", 11, false, "left", "center", false, false);
//   setCellStyle(worksheet, "C8", 11, true, "left", "center", false, false);
//   setCellStyle(worksheet, "A9", 11, false, "left", "center", false, false);
//   setCellStyle(worksheet, "C9", 11, true, "left", "center", false, false);
//   setCellStyle(worksheet, "A10", 11, false, "left", "center", false, false);
//   setCellStyle(worksheet, "C10", 11, true, "left", "center", false, false);
//   setCellStyle(worksheet, "A11", 11, false, "left", "center", false, false);
//   setCellStyle(worksheet, "C11", 11, true, "left", "center", false, false);

//   const range = XLSX.utils.decode_range(worksheet["!ref"]!);
//   worksheet["!merges"] = [];
//   const tempMerge = [];
//   const defaultMerges = [
//     { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } },
//     { s: { r: 0, c: 6 }, e: { r: 0, c: 10 } },
//     { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } },
//     { s: { r: 1, c: 6 }, e: { r: 1, c: 10 } },
//     { s: { r: 2, c: 0 }, e: { r: 2, c: 3 } },
//     { s: { r: 3, c: 0 }, e: { r: 3, c: 10 } },
//     { s: { r: 5, c: 0 }, e: { r: 5, c: 1 } },
//     { s: { r: 5, c: 2 }, e: { r: 5, c: 4 } },
//     { s: { r: 6, c: 0 }, e: { r: 6, c: 1 } },
//     { s: { r: 6, c: 2 }, e: { r: 6, c: 4 } },
//     { s: { r: 7, c: 0 }, e: { r: 7, c: 1 } },
//     { s: { r: 7, c: 2 }, e: { r: 7, c: 4 } },
//     { s: { r: 8, c: 0 }, e: { r: 8, c: 1 } },
//     { s: { r: 8, c: 2 }, e: { r: 8, c: 4 } },
//     { s: { r: 9, c: 0 }, e: { r: 9, c: 1 } },
//     { s: { r: 9, c: 2 }, e: { r: 9, c: 4 } },
//     { s: { r: 10, c: 0 }, e: { r: 10, c: 1 } },
//     { s: { r: 10, c: 2 }, e: { r: 10, c: 4 } },
//   ];
//   const countDefaultInfo = 12;
//   const countClassLeader = countDefaultInfo + dataArrayClassLeader.length;
//   const countAssistant = dataArrayAssistants.length + countClassLeader;
//   const countAdmissionCounseling =
//     dataArrayAdmissionCounseling.length + countAssistant;
//   const countQAEs = dataArrayQAEs.length + countAdmissionCounseling;
//   const countActivities = dataArrayActivities.length + countQAEs;
//   for (let row = 12; row <= range.e.r; row++) {
//     if (
//       row === countDefaultInfo ||
//       row === countClassLeader ||
//       row === countAssistant ||
//       row == countAdmissionCounseling ||
//       row === countQAEs
//     ) {
//       tempMerge.push({ s: { r: row, c: 0 }, e: { r: row, c: 11 } });
//       const cellRefPre = XLSX.utils.encode_cell({ r: row - 1, c: 0 });
//       const cellRef = XLSX.utils.encode_cell({ r: row, c: 0 });
//       setCellStyle(
//         worksheet,
//         cellRefPre,
//         11,
//         true,
//         "left",
//         "center",
//         true,
//         false
//       );
//       setCellStyle(worksheet, cellRef, 11, true, "left", "center", true, false);
//       continue;
//     } else if (
//       row === countClassLeader - 2 ||
//       row === countAssistant - 2 ||
//       row === countAdmissionCounseling - 2 ||
//       row === countQAEs - 2 ||
//       row === countActivities - 2
//     ) {
//       tempMerge.push({ s: { r: row, c: 0 }, e: { r: row, c: 7 } });
//     } else {
//       tempMerge.push({ s: { r: row, c: 1 }, e: { r: row, c: 7 } });
//     }

//     for (let col = range.s.c; col <= range.e.c; col++) {
//       const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
//       if (worksheet[cellRef] && (col === 0 || col === 8 || col === 9)) {
//         setCellStyle(
//           worksheet,
//           cellRef,
//           11,
//           false,
//           "center",
//           "center",
//           true,
//           true
//         );
//       } else {
//         setCellStyle(
//           worksheet,
//           cellRef,
//           11,
//           false,
//           "left",
//           "center",
//           true,
//           true
//         );
//       }
//       if (
//         row - 1 === countDefaultInfo ||
//         row - 1 === countClassLeader ||
//         row - 1 === countAssistant ||
//         row - 1 === countAdmissionCounseling ||
//         row - 1 === countQAEs
//       ) {
//         setCellStyle(
//           worksheet,
//           cellRef,
//           11,
//           true,
//           "center",
//           "center",
//           true,
//           true
//         );
//       }
//       if (
//         row === countClassLeader - 2 ||
//         row === countAssistant - 2 ||
//         row === countAdmissionCounseling - 2 ||
//         row === countQAEs - 2 ||
//         row === countActivities - 2
//       ) {
//         setCellStyle(
//           worksheet,
//           cellRef,
//           11,
//           true,
//           "center",
//           "center",
//           true,
//           true
//         );
//       }
//     }
//   }
//   worksheet["!merges"].push(...defaultMerges, ...tempMerge);

//   const excelBuffer = XLSX.write(workbook, {
//     bookType: "xlsx",
//     type: "array",
//   });
//   const blob = new Blob([excelBuffer], {
//     type: "application/octet-stream",
//   });
//   const now = new Date();
//   const formattedDate = `${String(now.getDate()).padStart(2, "0")}-${String(
//     now.getMonth() + 1
//   ).padStart(2, "0")}-${now.getFullYear()}-${String(now.getHours()).padStart(
//     2,
//     "0"
//   )}-${String(now.getMinutes()).padStart(2, "0")}`;
//   saveAs(
//     blob,
//     "Export-All-BM-" +
//       `${detailUser?.userName}` +
//       "-" +
//       `${detailUser?.unitName}` +
//       "-" +
//       formattedDate +
//       ".xlsx"
//   );
// };

export const handleExportForBMAll = async (formData: Partial<any>) => {
  const response = await getDataExportByUserName(formData);
  if (response === null) {
    return;
  }
  const defaultInfo = [
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
    [""],
    ["TỔNG HỢP DANH SÁCH"],
    [`${response?.items.other[0]?.name}`],
    [""],
    ["Họ và tên:", "", `${response?.fullName}`],
    ["Mã CB-GV-NV:", "", `${response?.userName}`],
    ["Học hàm/Học vị:", "", ""],
    ["Thâm niên công tác:", "", ""],
    ["Đơn vị:", "", `${response?.unitName}`],
  ];

  let resultsDataArray: any = [];
  const data = [
    [""],
    [
      "STT",
      "Hoạt động",
      "",
      "",
      "",
      "Số tiết chuẩn",
      "",
      "Số văn bản, ngày lập",
      "",
      "Thời gian hoạt động",
      "",
    ],
    ...response.items.other[0]?.items.map((item: any, index: number) => [
      index + 1,
      item.name,
      "",
      "",
      "",
      item.standarNumber,
      "",
      item.determinations?.documentNumber +
        ", " +
        convertTimestampToDate(item.determinations?.documentDate),
      "",
      item.determinations?.fromDate
        ? `${convertTimestampToDate(item.determinations.fromDate)}${
            item.determinations?.toDate !== 0 &&
            item.determinations?.toDate !== item.determinations.fromDate
              ? `-${convertTimestampToDate(item.determinations.toDate)}`
              : ""
          }`
        : "",
      "",
    ]),
    [
      "Tổng số tiết chuẩn",
      "",
      "",
      "",
      "",
      `${response.items.other[0]?.totalStandarNumber as Number}`,
      "",
      "",
      "",
      "",
      "",
    ],
  ];
  resultsDataArray = [
    ...[[`${response.items.other[0].shortName}`]],
    ...defaultInfo,
    ...data,
  ];

  const worksheet = XLSX.utils.aoa_to_sheet([
    ...resultsDataArray,
    ...defaultFooterInfo,
  ]);
  setCellStyle(worksheet, "A1", 11, true, "right", "center", false, false);
  setCellStyle(worksheet, "A2", 11, true, "center", "center", false, false);
  setCellStyle(worksheet, "G2", 11, true, "center", "center", false, false);
  setCellStyle(worksheet, "A3", 11, true, "center", "center", false, false);
  setCellStyle(worksheet, "G3", 11, true, "center", "center", false, false);
  setCellStyle(worksheet, "A5", 16, true, "center", "center", false, false);
  setCellStyle(worksheet, "A6", 11, true, "center", "center", true, false);
  setCellStyle(worksheet, "A8", 11, false, "left", "center", false, false);
  setCellStyle(worksheet, "C8", 11, true, "left", "center", false, false);
  setCellStyle(worksheet, "A9", 11, false, "left", "center", false, false);
  setCellStyle(worksheet, "C9", 11, true, "left", "center", false, false);
  setCellStyle(worksheet, "A10", 11, false, "left", "center", false, false);
  setCellStyle(worksheet, "C10", 11, true, "left", "center", false, false);
  setCellStyle(worksheet, "A11", 11, false, "left", "center", false, false);
  setCellStyle(worksheet, "C11", 11, true, "left", "center", false, false);
  setCellStyle(worksheet, "A12", 11, false, "left", "center", false, false);
  setCellStyle(worksheet, "C12", 11, true, "left", "center", false, false);

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
    header: 0.1,
    footer: 0.1,
  };
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  const range = XLSX.utils.decode_range(worksheet["!ref"]!);
  worksheet["!merges"] = [];
  const tempMerge: any[] = [];
  const defaultMerges = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 10 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } },
    { s: { r: 1, c: 6 }, e: { r: 1, c: 10 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: 4 } },
    { s: { r: 2, c: 6 }, e: { r: 2, c: 10 } },
    { s: { r: 3, c: 0 }, e: { r: 3, c: 3 } },
    { s: { r: 4, c: 0 }, e: { r: 4, c: 10 } },
    { s: { r: 5, c: 0 }, e: { r: 5, c: 10 } },
    { s: { r: 6, c: 0 }, e: { r: 6, c: 1 } },
    { s: { r: 6, c: 2 }, e: { r: 6, c: 4 } },
    { s: { r: 7, c: 0 }, e: { r: 7, c: 1 } },
    { s: { r: 7, c: 2 }, e: { r: 7, c: 4 } },
    { s: { r: 8, c: 0 }, e: { r: 8, c: 1 } },
    { s: { r: 8, c: 2 }, e: { r: 8, c: 4 } },
    { s: { r: 9, c: 0 }, e: { r: 9, c: 1 } },
    { s: { r: 9, c: 2 }, e: { r: 9, c: 4 } },
    { s: { r: 10, c: 0 }, e: { r: 10, c: 1 } },
    { s: { r: 10, c: 2 }, e: { r: 10, c: 4 } },
    { s: { r: 11, c: 0 }, e: { r: 11, c: 1 } },
    { s: { r: 11, c: 2 }, e: { r: 11, c: 4 } },
  ];

  for (
    let row = defaultInfo.length + 1;
    row <= range.e.r - defaultFooterInfo.length;
    row++
  ) {
    if (row === range.e.r - defaultFooterInfo.length) {
      tempMerge.push({ s: { r: row, c: 0 }, e: { r: row, c: 4 } });
      tempMerge.push({ s: { r: row, c: 5 }, e: { r: row, c: 6 } });
      tempMerge.push({ s: { r: row, c: 7 }, e: { r: row, c: 10 } });
    } else {
      tempMerge.push({ s: { r: row, c: 1 }, e: { r: row, c: 4 } });
      tempMerge.push({ s: { r: row, c: 5 }, e: { r: row, c: 6 } });
      tempMerge.push({ s: { r: row, c: 7 }, e: { r: row, c: 8 } });
      tempMerge.push({ s: { r: row, c: 9 }, e: { r: row, c: 10 } });
    }

    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
      if (row === defaultInfo.length + 1) {
        setCellStyle(
          worksheet,
          cellRef,
          11,
          false,
          "center",
          "center",
          true,
          false
        );
        continue;
      }
      if (
        row === defaultInfo.length + 2 ||
        row === range.e.r - defaultFooterInfo.length
      ) {
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
      if (col === 1) {
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
      tempMerge.push({ s: { r: row, c: 0 }, e: { r: row, c: 10 } });
    else {
      tempMerge.push({ s: { r: row, c: 0 }, e: { r: row, c: 4 } });
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

  worksheet["!merges"].push(...defaultMerges, ...tempMerge);

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
  saveAs(blob, "Export-" + response.userName + "-" + formattedDate + ".xlsx");
};
export const handleExportForBMGeneral = async (formData: Partial<any>) => {
  const response = await getDataExportByUserName(formData);
  if (response === null) {
    return;
  }
  const defaultInfo = [
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
    [""],
    ["TỔNG HỢP DANH SÁCH"],
    [`${response?.items.general[0]?.name}`],
    [""],
    ["Họ và tên:", "", `${response?.fullName}`],
    ["Mã CB-GV-NV:", "", `${response?.userName}`],
    ["Học hàm/Học vị:", "", ""],
    ["Thâm niên công tác:", "", ""],
    ["Đơn vị:", "", `${response?.unitName}`],
  ];

  let resultsDataArray: any = [];
  const data = [
    [""],
    [
      "STT",
      "Hoạt động",
      "",
      "",
      "",
      "Địa điểm sự kiện",
      "",
      "Số văn bản, ngày lập",
      "",
      "Thời gian hoạt động",
      "",
    ],
    ...response.items.general[0]?.items.map((item: any, index: number) => [
      index + 1,
      item.contents,
      "",
      "",
      "",
      item.eventVenue,
      "",
      item.determinations?.documentNumber +
        ", " +
        convertTimestampToDate(item.determinations?.documentDate),
      "",
      item.determinations?.fromDate
        ? `${convertTimestampToDate(item.determinations.fromDate)}${
            item.determinations?.toDate !== 0 &&
            item.determinations?.toDate !== item.determinations.fromDate
              ? `-${convertTimestampToDate(item.determinations.toDate)}`
              : ""
          }`
        : "",
      "",
    ]),
  ];
  resultsDataArray = [
    ...[[`${response.items.general[0].shortName}`]],
    ...defaultInfo,
    ...data,
  ];

  const worksheet = XLSX.utils.aoa_to_sheet([
    ...resultsDataArray,
    ...defaultFooterInfo,
  ]);
  setCellStyle(worksheet, "A1", 11, true, "right", "center", false, false);
  setCellStyle(worksheet, "A2", 11, true, "center", "center", false, false);
  setCellStyle(worksheet, "G2", 11, true, "center", "center", false, false);
  setCellStyle(worksheet, "A3", 11, true, "center", "center", false, false);
  setCellStyle(worksheet, "G3", 11, true, "center", "center", false, false);
  setCellStyle(worksheet, "A5", 16, true, "center", "center", false, false);
  setCellStyle(worksheet, "A6", 11, true, "center", "center", true, false);
  setCellStyle(worksheet, "A8", 11, false, "left", "center", false, false);
  setCellStyle(worksheet, "C8", 11, true, "left", "center", false, false);
  setCellStyle(worksheet, "A9", 11, false, "left", "center", false, false);
  setCellStyle(worksheet, "C9", 11, true, "left", "center", false, false);
  setCellStyle(worksheet, "A10", 11, false, "left", "center", false, false);
  setCellStyle(worksheet, "C10", 11, true, "left", "center", false, false);
  setCellStyle(worksheet, "A11", 11, false, "left", "center", false, false);
  setCellStyle(worksheet, "C11", 11, true, "left", "center", false, false);
  setCellStyle(worksheet, "A12", 11, false, "left", "center", false, false);
  setCellStyle(worksheet, "C12", 11, true, "left", "center", false, false);

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
    header: 0.1,
    footer: 0.1,
  };
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  const range = XLSX.utils.decode_range(worksheet["!ref"]!);
  worksheet["!merges"] = [];
  const tempMerge: any[] = [];
  const defaultMerges = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 10 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } },
    { s: { r: 1, c: 6 }, e: { r: 1, c: 10 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: 4 } },
    { s: { r: 2, c: 6 }, e: { r: 2, c: 10 } },
    { s: { r: 3, c: 0 }, e: { r: 3, c: 3 } },
    { s: { r: 4, c: 0 }, e: { r: 4, c: 10 } },
    { s: { r: 5, c: 0 }, e: { r: 5, c: 10 } },
    { s: { r: 6, c: 0 }, e: { r: 6, c: 1 } },
    { s: { r: 6, c: 2 }, e: { r: 6, c: 4 } },
    { s: { r: 7, c: 0 }, e: { r: 7, c: 1 } },
    { s: { r: 7, c: 2 }, e: { r: 7, c: 4 } },
    { s: { r: 8, c: 0 }, e: { r: 8, c: 1 } },
    { s: { r: 8, c: 2 }, e: { r: 8, c: 4 } },
    { s: { r: 9, c: 0 }, e: { r: 9, c: 1 } },
    { s: { r: 9, c: 2 }, e: { r: 9, c: 4 } },
    { s: { r: 10, c: 0 }, e: { r: 10, c: 1 } },
    { s: { r: 10, c: 2 }, e: { r: 10, c: 4 } },
    { s: { r: 11, c: 0 }, e: { r: 11, c: 1 } },
    { s: { r: 11, c: 2 }, e: { r: 11, c: 4 } },
  ];

  for (
    let row = defaultInfo.length + 1;
    row <= range.e.r - defaultFooterInfo.length;
    row++
  ) {
    tempMerge.push({ s: { r: row, c: 1 }, e: { r: row, c: 4 } });
    tempMerge.push({ s: { r: row, c: 5 }, e: { r: row, c: 6 } });
    tempMerge.push({ s: { r: row, c: 7 }, e: { r: row, c: 8 } });
    tempMerge.push({ s: { r: row, c: 9 }, e: { r: row, c: 10 } });

    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
      if (row === defaultInfo.length + 1) {
        setCellStyle(
          worksheet,
          cellRef,
          11,
          false,
          "center",
          "center",
          true,
          false
        );
        continue;
      }
      if (row === defaultInfo.length + 2) {
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
      if (col === 1 || col === 5) {
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
      tempMerge.push({ s: { r: row, c: 0 }, e: { r: row, c: 10 } });
    else {
      tempMerge.push({ s: { r: row, c: 0 }, e: { r: row, c: 4 } });
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

  worksheet["!merges"].push(...defaultMerges, ...tempMerge);

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
  saveAs(
    blob,
    "Export-" +
      formData.formName.toUpperCase() +
      "-" +
      response.userName +
      "-" +
      formattedDate +
      ".xlsx"
  );
};
export const handleExportForBMOther = async (formData: Partial<any>) => {
  const response = await getDataExportByUserName(formData);
  if (response === null) {
    return;
  }
  const defaultInfo = [
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
    [""],
    ["TỔNG HỢP DANH SÁCH"],
    [`${response?.items.other[0]?.name}`],
    [""],
    ["Họ và tên:", "", `${response?.fullName}`],
    ["Mã CB-GV-NV:", "", `${response?.userName}`],
    ["Học hàm/Học vị:", "", ""],
    ["Thâm niên công tác:", "", ""],
    ["Đơn vị:", "", `${response?.unitName}`],
  ];

  let resultsDataArray: any = [];
  const data = [
    [""],
    [
      "STT",
      "Hoạt động",
      "",
      "",
      "",
      "Số tiết chuẩn",
      "",
      "Số văn bản, ngày lập",
      "",
      "Thời gian hoạt động",
      "",
    ],
    ...response.items.other[0]?.items.map((item: any, index: number) => [
      index + 1,
      item.name,
      "",
      "",
      "",
      item.standarNumber,
      "",
      item.determinations?.documentNumber +
        ", " +
        convertTimestampToDate(item.determinations?.documentDate),
      "",
      item.determinations?.fromDate
        ? `${convertTimestampToDate(item.determinations.fromDate)}${
            item.determinations?.toDate !== 0 &&
            item.determinations?.toDate !== item.determinations.fromDate
              ? `-${convertTimestampToDate(item.determinations.toDate)}`
              : ""
          }`
        : "",
      "",
    ]),
    [
      "Tổng số tiết chuẩn",
      "",
      "",
      "",
      "",
      `${response.items.other[0]?.totalStandarNumber as Number}`,
      "",
      "",
      "",
      "",
      "",
    ],
  ];
  resultsDataArray = [
    ...[[`${response.items.other[0].shortName}`]],
    ...defaultInfo,
    ...data,
  ];

  const worksheet = XLSX.utils.aoa_to_sheet([
    ...resultsDataArray,
    ...defaultFooterInfo,
  ]);
  setCellStyle(worksheet, "A1", 11, true, "right", "center", false, false);
  setCellStyle(worksheet, "A2", 11, true, "center", "center", false, false);
  setCellStyle(worksheet, "G2", 11, true, "center", "center", false, false);
  setCellStyle(worksheet, "A3", 11, true, "center", "center", false, false);
  setCellStyle(worksheet, "G3", 11, true, "center", "center", false, false);
  setCellStyle(worksheet, "A5", 16, true, "center", "center", false, false);
  setCellStyle(worksheet, "A6", 11, true, "center", "center", true, false);
  setCellStyle(worksheet, "A8", 11, false, "left", "center", false, false);
  setCellStyle(worksheet, "C8", 11, true, "left", "center", false, false);
  setCellStyle(worksheet, "A9", 11, false, "left", "center", false, false);
  setCellStyle(worksheet, "C9", 11, true, "left", "center", false, false);
  setCellStyle(worksheet, "A10", 11, false, "left", "center", false, false);
  setCellStyle(worksheet, "C10", 11, true, "left", "center", false, false);
  setCellStyle(worksheet, "A11", 11, false, "left", "center", false, false);
  setCellStyle(worksheet, "C11", 11, true, "left", "center", false, false);
  setCellStyle(worksheet, "A12", 11, false, "left", "center", false, false);
  setCellStyle(worksheet, "C12", 11, true, "left", "center", false, false);

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
    header: 0.1,
    footer: 0.1,
  };
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  const range = XLSX.utils.decode_range(worksheet["!ref"]!);
  worksheet["!merges"] = [];
  const tempMerge: any[] = [];
  const defaultMerges = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 10 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } },
    { s: { r: 1, c: 6 }, e: { r: 1, c: 10 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: 4 } },
    { s: { r: 2, c: 6 }, e: { r: 2, c: 10 } },
    { s: { r: 3, c: 0 }, e: { r: 3, c: 3 } },
    { s: { r: 4, c: 0 }, e: { r: 4, c: 10 } },
    { s: { r: 5, c: 0 }, e: { r: 5, c: 10 } },
    { s: { r: 6, c: 0 }, e: { r: 6, c: 1 } },
    { s: { r: 6, c: 2 }, e: { r: 6, c: 4 } },
    { s: { r: 7, c: 0 }, e: { r: 7, c: 1 } },
    { s: { r: 7, c: 2 }, e: { r: 7, c: 4 } },
    { s: { r: 8, c: 0 }, e: { r: 8, c: 1 } },
    { s: { r: 8, c: 2 }, e: { r: 8, c: 4 } },
    { s: { r: 9, c: 0 }, e: { r: 9, c: 1 } },
    { s: { r: 9, c: 2 }, e: { r: 9, c: 4 } },
    { s: { r: 10, c: 0 }, e: { r: 10, c: 1 } },
    { s: { r: 10, c: 2 }, e: { r: 10, c: 4 } },
    { s: { r: 11, c: 0 }, e: { r: 11, c: 1 } },
    { s: { r: 11, c: 2 }, e: { r: 11, c: 4 } },
  ];

  for (
    let row = defaultInfo.length + 1;
    row <= range.e.r - defaultFooterInfo.length;
    row++
  ) {
    if (row === range.e.r - defaultFooterInfo.length) {
      tempMerge.push({ s: { r: row, c: 0 }, e: { r: row, c: 4 } });
      tempMerge.push({ s: { r: row, c: 5 }, e: { r: row, c: 6 } });
      tempMerge.push({ s: { r: row, c: 7 }, e: { r: row, c: 10 } });
    } else {
      tempMerge.push({ s: { r: row, c: 1 }, e: { r: row, c: 4 } });
      tempMerge.push({ s: { r: row, c: 5 }, e: { r: row, c: 6 } });
      tempMerge.push({ s: { r: row, c: 7 }, e: { r: row, c: 8 } });
      tempMerge.push({ s: { r: row, c: 9 }, e: { r: row, c: 10 } });
    }

    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
      if (row === defaultInfo.length + 1) {
        setCellStyle(
          worksheet,
          cellRef,
          11,
          false,
          "center",
          "center",
          true,
          false
        );
        continue;
      }
      if (
        row === defaultInfo.length + 2 ||
        row === range.e.r - defaultFooterInfo.length
      ) {
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
      if (col === 1) {
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
      tempMerge.push({ s: { r: row, c: 0 }, e: { r: row, c: 10 } });
    else {
      tempMerge.push({ s: { r: row, c: 0 }, e: { r: row, c: 4 } });
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

  worksheet["!merges"].push(...defaultMerges, ...tempMerge);

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
  saveAs(
    blob,
    "Export-" +
      formData.formName.toUpperCase() +
      "-" +
      response.userName +
      "-" +
      formattedDate +
      ".xlsx"
  );
};
