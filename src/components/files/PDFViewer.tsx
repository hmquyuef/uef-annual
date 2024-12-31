"use client";

import Colors from "@/utility/Colors";
import {
  CloudDownloadOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import axios from "axios";
import saveAs from "file-saver";
import React, { FC, useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

interface InfoPDFProps {
  pathPDF: string;
}

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

const PDFViewer: FC<InfoPDFProps> = ({ pathPDF }) => {
  const [path, setPath] = useState<string>("");
  const [scale, setScale] = useState<number>(0.9);
  const [numPages, setNumPages] = React.useState<number | null>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handleDownload = async (event: React.MouseEvent) => {
    event.preventDefault();
    const fileName = pathPDF.split("/").pop();
    const response = await axios.get(path, {
      responseType: "blob",
    });
    const blob = new Blob([response.data], {
      type: "application/pdf",
    });
    saveAs(blob, fileName);
  };

  useEffect(() => {
    setPath(`https://api-annual.uef.edu.vn/${pathPDF}`);
  }, []);

  return (
    <div>
      <div className="flex gap-5 mb-4 justify-end">
        <Tooltip title="Tải về" placement="topLeft">
          <Button
            type="primary"
            icon={<CloudDownloadOutlined />}
            style={{ backgroundColor: Colors.GREEN, color: Colors.WHITE }}
            onClick={(e) => {
              e.preventDefault();
              handleDownload(e);
            }}
          >
            Tải về
          </Button>
        </Tooltip>
        <Tooltip title="Phóng to" placement="top">
          <Button
            type="primary"
            icon={<ZoomInOutlined />}
            onClick={() => setScale((prevScale) => prevScale + 0.1)}
          >
            Phóng to
          </Button>
        </Tooltip>
        <Tooltip title="Thu nhỏ" placement="topRight">
          <Button
            type="primary"
            icon={<ZoomOutOutlined />}
            onClick={() =>
              setScale((prevScale) => Math.max(prevScale - 0.1, 0.1))
            }
          >
            Thu nhỏ
          </Button>
        </Tooltip>
      </div>
      <div className="h-[760px] overflow-auto rounded-lg border border-gray-300 p-2">
        <Document file={path} onLoadSuccess={onDocumentLoadSuccess}>
          {Array.from(new Array(numPages), (el, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              scale={scale}
            />
          ))}
        </Document>
      </div>
    </div>
  );
};

export default PDFViewer;
