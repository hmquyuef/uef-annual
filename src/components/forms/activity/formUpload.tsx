"use client";

import CustomNotification from "@/components/CustomNotification";
import { DisplayRoleItem } from "@/services/roles/rolesServices";
import {
  deleteFiles,
  FileItem,
  postFiles,
} from "@/services/uploads/uploadsServices";
import Messages from "@/utility/Messages";
import {
  CloseOutlined,
  CloudUploadOutlined,
  DownloadOutlined,
  MinusCircleOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";
import { Button, Tag } from "antd";
import { FC, FormEvent, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

interface FromUploadProps {
  formName: string;
  onSubmit: (fileParticipant: File, fileAttachment: FileItem) => void;
  handleShowPDF: (isVisible: boolean) => void;
  displayRole: DisplayRoleItem;
}

const FromUpload: FC<FromUploadProps> = ({
  formName,
  onSubmit,
  handleShowPDF,
  displayRole,
}) => {
  const [selectedFileParticipant, setSelectedFileParticipant] =
    useState<File | null>(null);
  const [selectedFileAttachment, setSelectedFileAttachment] = useState<
    FileItem | undefined
  >(undefined);
  const [pathPDF, setPathPDF] = useState<string>("");
  const [showPDF, setShowPDF] = useState(false);
  const [isUploadedFileParticipant, setIsUploadedFileParticipant] =
    useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [numPages, setNumPages] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);

  const [message, setMessage] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
  const [isNotificationOpen, setNotificationOpen] = useState(false);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const handleDeleteExcel = async () => {
    if (selectedFileParticipant && selectedFileParticipant !== undefined) {
      setIsUploadedFileParticipant(false);
      setSelectedFileParticipant(null);
    } else {
      console.log("Không có file nào để xóa.");
    }
  };

  const {
    getRootProps: getParticipantRootProps,
    getInputProps: getParticipantInputProps,
  } = useDropzone({
    onDrop: useMemo(
      () => async (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
          if (
            acceptedFiles[0].type !==
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          ) {
            setNotificationOpen(true);
            setStatus("error");
            setMessage("Thông báo");
            setDescription(Messages.ERROR_EXCEL);
          } else {
            handleDeleteExcel();
            setIsUploadedFileParticipant(true);
            setSelectedFileParticipant(acceptedFiles[0]);
          }
        }
      },
      [selectedFileAttachment]
    ),
  });

  const handleDeletePicture = async () => {
    if (selectedFileAttachment && selectedFileAttachment !== undefined) {
      await deleteFiles(
        selectedFileAttachment.path.replace(
          "https://api-annual.uef.edu.vn/",
          ""
        )
      );
      setIsUploaded(false);
      setSelectedFileAttachment(undefined);
      setPathPDF("");
    } else {
      console.log("Không có file nào để xóa.");
    }
  };

  // Dropzone for Attachment File
  const {
    getRootProps: getAttachmentRootProps,
    getInputProps: getAttachmentInputProps,
  } = useDropzone({
    onDrop: useMemo(
      () => async (acceptedFiles: File[]) => {
        if (acceptedFiles[0].type !== "application/pdf") {
          setNotificationOpen(true);
          setStatus("error");
          setMessage("Thông báo");
          setDescription(Messages.ERROR_PDF);
        } else {
          const formData = new FormData();
          formData.append("FunctionName", formName);
          formData.append("file", acceptedFiles[0]);
          if (selectedFileAttachment && selectedFileAttachment !== undefined) {
            await deleteFiles(
              selectedFileAttachment.path.replace(
                "https://api-annual.uef.edu.vn/",
                ""
              )
            );
            setPathPDF("");
          }
          const results = await postFiles(formData);
          if (results && results !== undefined) {
            setIsUploaded(true);
            setSelectedFileAttachment(results);
            setPathPDF(results.path);
          }
        }
      },
      [selectedFileAttachment]
    ),
  });

  const handleSubmitUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (selectedFileParticipant && selectedFileAttachment) {
      onSubmit(selectedFileParticipant, selectedFileAttachment);
      setIsUploadedFileParticipant(false);
      setIsUploaded(false);
      setSelectedFileParticipant(null);
      setSelectedFileAttachment(undefined);
      setShowPDF(false);
    } else {
      setNotificationOpen(true);
      setStatus("error");
      setMessage("Thông báo");
      setDescription(Messages.ERROR_IMPORT);
    }
  };

  useEffect(() => {
    handleShowPDF(showPDF);
    isNotificationOpen && setNotificationOpen(!isNotificationOpen);
  }, [showPDF, isNotificationOpen]);

  return (
    <div
      className={`grid ${showPDF ? "grid-cols-2 gap-4" : "grid-cols-1"} mb-2`}
    >
      <form onSubmit={handleSubmitUpload}>
        <hr className="mt-1 mb-2" />

        {/* Dropzone for Participant File */}
        <div className="flex flex-col gap-1 mb-2">
          <p className="font-medium text-neutral-600">
            Danh sách nhân sự tham gia <span className="text-red-500">(*)</span>
          </p>
          <div
            {...getParticipantRootProps()}
            className="w-full min-h-20 h-fit border-2 border-dashed border-neutral-300 cursor-pointer flex justify-center items-center gap-3 rounded-xl"
          >
            <input {...getParticipantInputProps()} />
            {!isUploadedFileParticipant ? (
              <>
                <img src="/upload.svg" width={50} loading="lazy" alt="upload" />
                <div className="flex flex-col gap-2">
                  <span className="text-sm">
                    Kéo và thả một tập tin vào đây hoặc nhấp để chọn một tập tin
                  </span>
                  <Button
                    color="primary"
                    variant="filled"
                    shape="round"
                    icon={<DownloadOutlined />}
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      const fileUrl = `/template-${formName}.xlsx`; // Đường dẫn đến file
                      const link = document.createElement("a");
                      link.href = fileUrl;
                      link.download = `template-${formName}.xlsx`;
                      link.click();
                    }}
                  >
                    Tải xuống mẫu template-{formName}.xlsx
                  </Button>
                </div>
              </>
            ) : (
              <>
                {selectedFileParticipant && (
                  <>
                    <div className="flex flex-col items-center gap-1 py-2">
                      <div className="grid grid-cols-3 gap-2">
                        <img
                          src={"/excel.svg"}
                          width={50}
                          loading="lazy"
                          alt="file-preview"
                        />
                        <div className="col-span-2 text-center content-center">
                          <span className="text-sm">
                            {selectedFileParticipant.name}
                          </span>
                          <span className="text-sm flex">
                            (
                            {(
                              selectedFileParticipant.size /
                              (1024 * 1024)
                            ).toFixed(2)}{" "}
                            MB)
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-3 items-center mt-2">
                        <Button
                          danger
                          disabled={displayRole.isUpload === false}
                          color="danger"
                          onClick={handleDeleteExcel}
                          size="small"
                          icon={<MinusCircleOutlined />}
                        >
                          Hủy tệp
                        </Button>
                        <Button
                          type="primary"
                          size="small"
                          disabled={displayRole.isUpload === false}
                          icon={<CloudUploadOutlined />}
                        >
                          Chọn tệp thay thế
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Dropzone for Attachment File */}
        <div className="flex flex-col gap-1 mb-2">
          <p className="font-medium text-neutral-600">
            Tài liệu đính kèm <span className="text-red-500">(*)</span>
          </p>
          <div
            {...getAttachmentRootProps()}
            className="w-full min-h-20 h-fit border-2 border-dashed border-neutral-300 cursor-pointer flex justify-center items-center gap-3 rounded-xl"
          >
            <input {...getAttachmentInputProps()} />
            {!isUploaded ? (
              <>
                <img src="/upload.svg" width={50} loading="lazy" alt="upload" />
                <span className="text-sm">
                  Kéo và thả một tập tin vào đây hoặc nhấp để chọn một tập tin
                </span>
              </>
            ) : (
              <>
                {selectedFileAttachment && (
                  <>
                    <div className="flex flex-col items-center gap-1 py-2">
                      <div className="grid grid-cols-3 gap-2">
                        <img
                          src={
                            selectedFileAttachment.type === "image/jpeg" ||
                            selectedFileAttachment.type === "image/png"
                              ? "https://api-annual.uef.edu.vn/" +
                                selectedFileAttachment.path
                              : "/file-pdf.svg"
                          }
                          width={50}
                          loading="lazy"
                          alt="file-preview"
                        />
                        <div className="col-span-2 text-center content-center">
                          <span className="text-sm">
                            {selectedFileAttachment.name}
                          </span>
                          <span className="text-sm flex">
                            (
                            {(
                              selectedFileAttachment.size /
                              (1024 * 1024)
                            ).toFixed(2)}{" "}
                            MB -
                            <span
                              className="text-sm ms-1 cursor-pointer text-blue-500 hover:text-blue-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowPDF(!showPDF);
                              }}
                            >
                              xem chi tiết
                            </span>
                            )
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-3 items-center mt-2">
                        <Button
                          danger
                          disabled={displayRole.isUpload === false}
                          color="danger"
                          onClick={handleDeletePicture}
                          size="small"
                          icon={<MinusCircleOutlined />}
                        >
                          Hủy tệp
                        </Button>
                        <Button
                          type="primary"
                          size="small"
                          disabled={displayRole.isUpload === false}
                          icon={<CloudUploadOutlined />}
                        >
                          Chọn tệp thay thế
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </form>
      {showPDF === true && (
        <div>
          <hr className="mt-1 mb-2" />
          {pathPDF && pathPDF !== "" && (
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
                    onClick={() => setShowPDF(!showPDF)}
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
                  file={`https://api-annual.uef.edu.vn/${pathPDF}`}
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
        </div>
      )}
      <CustomNotification
        message={message}
        description={description}
        status={status}
        isOpen={isNotificationOpen}
      />
    </div>
  );
};

export default FromUpload;
