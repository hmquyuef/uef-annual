"use client";

import dynamic from "next/dynamic";
import React, { useEffect } from "react";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

const Document = dynamic(
  () => import("react-pdf").then((mod) => mod.Document),
  {
    ssr: false,
  }
);
const Page = dynamic(() => import("react-pdf").then((mod) => mod.Page), {
  ssr: false,
});

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

const PDFViewer = ({ fileUrl }: { fileUrl: string }) => {
  const [path, setPath] = React.useState<string>("");
  const [numPages, setNumPages] = React.useState<number | null>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  useEffect(() => {
    setPath(`https://api-annual.uef.edu.vn/${fileUrl}`);
  }, [fileUrl]);

  return (
    <div className="pdf-viewer">
      <Document file={path} onLoadSuccess={onDocumentLoadSuccess}>
        {Array.from(new Array(numPages), (el, index) => (
          <Page key={`page_${index + 1}`} pageNumber={index + 1} />
        ))}
      </Document>
    </div>
  );
};

export default PDFViewer;
