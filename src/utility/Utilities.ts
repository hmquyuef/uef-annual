export function convertTimestampToDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
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