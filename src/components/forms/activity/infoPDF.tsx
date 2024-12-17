"use client";

import {
  CloseOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";
import { Tag } from "antd";
import { FC, useState } from "react";
import { Document, Page } from "react-pdf";

interface InfoPDFProps {
  isShowPDF: boolean;
  onSetShowPDF: (showPDF: boolean) => void;
  path: string;
}

const InfoPDF: FC<InfoPDFProps> = ({ isShowPDF, onSetShowPDF, path }) => {
  const [scale, setScale] = useState<number>(1.0);
  const [numPages, setNumPages] = useState<number>(1);
  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }
  return (
    <div>
      {isShowPDF && (
        <>
          <hr className="mt-1 mb-2" />
          {path && path !== "" && (
            <>
              <div className="grid grid-cols-2 mb-[3px]">
                <span className="font-medium text-neutral-600">
                  Chế độ xem chi tiết
                </span>
                <div className="flex justify-end items-center">
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
                    onClick={() => onSetShowPDF(false)}
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
