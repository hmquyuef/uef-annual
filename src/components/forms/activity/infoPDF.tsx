"use client";

import {
  CloseOutlined,
  CloudDownloadOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";
import { Tag } from "antd";
import axios from "axios";
import saveAs from "file-saver";
import { FC, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

interface InfoPDFProps {
  isShowPDF: boolean;
  onSetShowPDF?: (showPDF: boolean) => void;
  path: string;
}

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

const InfoPDF: FC<InfoPDFProps> = ({ isShowPDF, onSetShowPDF, path }) => {
  const [scale, setScale] = useState<number>(1.0);
  const [numPages, setNumPages] = useState<number>(1);
  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }
  const handleDownload = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const fileName = path.split("/").pop();
    const linkSource = `https://api-annual.uef.edu.vn/${path}`;
    const response = await axios.get(linkSource, {
      responseType: "blob",
    });
    const blob = new Blob([response.data], {
      type: "application/pdf",
    });
    saveAs(blob, fileName);
  };
  return (
    <div>
      {isShowPDF && (
        <>
          {path && path !== "" && (
            <>
              <div className="grid grid-cols-2 mb-2 border-t border-neutral-300 pt-3">
                <span className="font-medium text-neutral-600">
                  Chế độ xem chi tiết
                </span>
                <div className="flex justify-end items-center">
                  <Tag
                    icon={<CloudDownloadOutlined />}
                    color="success"
                    className="cursor-pointer"
                    onClick={handleDownload}
                  >
                    Tải về
                  </Tag>
                  <Tag
                    icon={<ZoomInOutlined />}
                    color="processing"
                    className="cursor-pointer"
                    onClick={() => setScale((prevScale) => prevScale + 0.1)}
                  >
                    Phóng to
                  </Tag>
                  <Tag
                    icon={<ZoomOutOutlined />}
                    color="processing"
                    className="cursor-pointer"
                    onClick={() =>
                      setScale((prevScale) => Math.max(prevScale - 0.1, 0.1))
                    }
                  >
                    Thu nhỏ
                  </Tag>
                  <Tag
                    icon={<CloseOutlined />}
                    color="error"
                    className="cursor-pointer"
                    onClick={() => onSetShowPDF && onSetShowPDF(false)}
                  >
                    Đóng
                  </Tag>
                </div>
              </div>
              <div
                className="flex flex-col overflow-x-auto overflow-y-auto rounded-md shadow-md"
                style={{
                  maxHeight: "72vh",
                }}
              >
                <Document
                  file={`https://api-annual.uef.edu.vn/${path}`}
                  onLoadSuccess={onDocumentLoadSuccess}
                  loading={
                    <div className="flex justify-center items-center h-full">
                      <span>Đang tải...</span>
                    </div>
                  }
                  error={
                    <div
                      className="flex flex-col items-center justify-center"
                      style={{
                        maxHeight: `calc(100vh - ${
                          document
                            .querySelector("form")
                            ?.getBoundingClientRect().top
                        }px - 42px)`,
                      }}
                    >
                      <img
                        src="/review.svg"
                        width={"100px"}
                        alt="review"
                        className="mb-4"
                      />
                      <span>Không tìm thấy tệp tin phù hợp</span>
                    </div>
                  }
                >
                  {Array.from(new Array(numPages), (_, index) => (
                    <Page
                      key={`page_${index + 1}`}
                      pageNumber={index + 1}
                      scale={scale}
                    />
                  ))}
                </Document>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default InfoPDF;
