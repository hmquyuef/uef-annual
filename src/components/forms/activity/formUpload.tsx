"use client";

import CustomNotification from "@/components/CustomNotification";
import { MembersInfomations } from "@/services/generalWorks/membersInfomation";
import { DisplayRoleItem } from "@/services/roles/rolesServices";
import {
  deleteFiles,
  FileItem,
  postFiles,
} from "@/services/uploads/uploadsServices";
import Colors from "@/utility/Colors";
import {
  CloudUploadOutlined,
  DownloadOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { Button, Progress } from "antd";
import { FC, FormEvent, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

interface FromUploadProps {
  formName: string;
  onSubmit: (fileParticipant: File, fileAttachment: File) => void;
  handleShowPDF: (isVisible: boolean) => void;
  displayRole: DisplayRoleItem;
}

const FromUpload: FC<FromUploadProps> = ({
  formName,
  onSubmit,
  displayRole,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingExcel, setIsLoadingExcel] = useState<boolean>(false);
  const [isLoadingPDF, setIsLoadingPDF] = useState<boolean>(false);
  const [percentExcel, setPercentExcel] = useState<number>(0);
  const [percentPDF, setPercentPDF] = useState<number>(0);
  const [pdf, setPdf] = useState<FileItem | undefined>(undefined);
  const [excel, setExcel] = useState<FileItem | undefined>(undefined);
  const [formNotification, setFormNotification] = useState<{
    message: string;
    description: string;
    status: "success" | "error" | "info" | "warning";
    isOpen: boolean;
  }>({
    message: "",
    description: "",
    status: "success",
    isOpen: false,
  });

  const [formValues, setFormValues] = useState<{
    fileParticipant: File;
    fileAttachment: File;
  }>({
    fileParticipant: new File([""], "filename"),
    fileAttachment: new File([""], "filename"),
  });

  const handleDeleteExcel = async () => {
    setIsLoadingExcel(true);
    if (excel && excel.name !== "") {
      let intervalId = setInterval(() => {
        setPercentExcel((prevPercent) => {
          let newPercent = prevPercent === 0 ? 100 : prevPercent - 1;
          if (newPercent === 0) {
            clearInterval(intervalId);
            setExcel(undefined);
            setIsLoadingExcel(false);
            return 0;
          }
          return newPercent;
        });
      }, 10);
    }
  };

  const {
    getRootProps: getParticipantRootProps,
    getInputProps: getParticipantInputProps,
  } = useDropzone({
    onDrop: useMemo(
      () => async (acceptedFiles: File[]) => {
        if (
          acceptedFiles[0].type !==
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ) {
          setFormNotification((prev) => ({
            ...prev,
            isOpen: true,
            status: "error",
            message: "Định dạng tệp tin không hợp lệ!",
            description: `Định dạng tệp tin ${acceptedFiles[0].name} là ${acceptedFiles[0].type}. Vui lòng chọn định dạng .xlsx`,
          }));
          return;
        }
        if (acceptedFiles[0].size / (1024 * 1024) > 5) {
          setFormNotification((prev) => ({
            ...prev,
            isOpen: true,
            status: "error",
            message: "Dung lượng tệp tin quá lớn!",
            description: `Dung lượng tệp tin ${acceptedFiles[0].name} là ${(
              acceptedFiles[0].size /
              (1024 * 1024)
            ).toFixed(2)} MB, vượt quá dung lượng tối đa 5 MB!`,
          }));
          return;
        }
        if (acceptedFiles[0].size > 0) {
          setIsLoadingExcel(true);
          let intervalId = setInterval(() => {
            setPercentExcel((prevPercent) => {
              prevPercent = prevPercent === 100 ? 0 : prevPercent;
              const newPercent = prevPercent + 1;
              if (newPercent >= 100) {
                clearInterval(intervalId);
                setTimeout(() => {
                  setIsLoadingExcel(false);
                }, 500);
                return 100;
              }
              return newPercent;
            });
          }, 10);
          setExcel({
            name: acceptedFiles[0].name,
            path: "",
            type: acceptedFiles[0].type,
            size: acceptedFiles[0].size,
          });
          setFormValues((prev) => ({
            ...prev,
            fileParticipant: acceptedFiles[0],
          }));
        }
      },
      [excel, setPercentExcel]
    ),
  });

  const handleDeletePdf = async () => {
    setIsLoadingPDF(true);
    if (excel && excel.name !== "") {
      let intervalId = setInterval(() => {
        setPercentPDF((prevPercent) => {
          let newPercent = prevPercent === 0 ? 100 : prevPercent - 1;
          if (newPercent === 0) {
            clearInterval(intervalId);
            setPdf(undefined);
            setIsLoadingPDF(false);
            return 0;
          }
          return newPercent;
        });
      }, 10);
    }
  };

  const { getRootProps: getPDFRootProps, getInputProps: getPDFInputProps } =
    useDropzone({
      onDrop: useMemo(
        () => async (acceptedFiles: File[]) => {
          if (acceptedFiles[0].type !== "application/pdf") {
            setFormNotification((prev) => ({
              ...prev,
              isOpen: true,
              status: "error",
              message: "Định dạng tệp tin không hợp lệ!",
              description: `Định dạng tệp tin ${acceptedFiles[0].name} là ${acceptedFiles[0].type}. Vui lòng chọn định dạng .pdf`,
            }));
            return;
          }
          if (acceptedFiles[0].size / (1024 * 1024) > 10) {
            setFormNotification((prev) => ({
              ...prev,
              isOpen: true,
              status: "error",
              message: "Dung lượng tệp tin quá lớn!",
              description: `Dung lượng tệp tin ${acceptedFiles[0].name} là ${(
                acceptedFiles[0].size /
                (1024 * 1024)
              ).toFixed(2)} MB, vượt quá dung lượng tối đa 10 MB!`,
            }));
            return;
          }
          if (acceptedFiles[0].size > 0) {
            setIsLoadingPDF(true);
            let intervalId = setInterval(() => {
              setPercentPDF((prevPercent) => {
                prevPercent = prevPercent === 100 ? 0 : prevPercent;
                const newPercent = prevPercent + 1;
                if (newPercent >= 100) {
                  clearInterval(intervalId);
                  setTimeout(() => {
                    setIsLoadingPDF(false);
                  }, 500);
                  return 100;
                }
                return newPercent;
              });
            }, 10);
            setPdf({
              name: acceptedFiles[0].name,
              path: "",
              type: acceptedFiles[0].type,
              size: acceptedFiles[0].size,
            });
            setFormValues((prev) => ({
              ...prev,
              fileAttachment: acceptedFiles[0],
            }));
          }
        },
        [pdf, setPercentPDF]
      ),
    });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formValues.fileParticipant, formValues.fileAttachment);
  };

  useEffect(() => {
    setTimeout(() => {
      setFormNotification((prev) => ({ ...prev, isOpen: false }));
    }, 200);
  }, [formNotification.isOpen]);

  return (
    <section>
      <hr className="mb-2" />
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6 mb-2">
        <div className="flex flex-col gap-1">
          <span className="font-medium text-neutral-600">
            Danh sách nhân sự tham gia
          </span>
          <div
            {...getParticipantRootProps()}
            className="w-full min-h-28 h-fit border-2 border-dashed border-green-300 hover:border-green-500 cursor-pointer flex justify-center items-center gap-3 rounded-xl"
          >
            <input {...getParticipantInputProps()} />
            {!excel || excel.name === "" ? (
              <>
                <img src="/excel.svg" width={48} loading="lazy" alt="upload" />
                <div className="flex flex-col">
                  <span className="text-base text-center text-green-500 font-medium">
                    Tải lên danh sách nhân sự tham gia
                  </span>
                  <span className="text-sm text-center text-green-400 mb-1">
                    Định dạng <strong>.xlsx</strong>, tối đa{" "}
                    <strong>5 MB</strong>
                  </span>
                  <Button
                    style={{
                      backgroundColor: Colors.GREEN,
                      color: Colors.WHITE,
                      borderColor: Colors.GREEN,
                    }}
                    variant="filled"
                    shape="round"
                    icon={<DownloadOutlined />}
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      const fileUrl = `/template/template-${formName}.xlsx`; // Đường dẫn đến file
                      const link = document.createElement("a");
                      link.href = fileUrl;
                      link.download = `/template/template-${formName}.xlsx`;
                      link.click();
                    }}
                  >
                    Tải xuống mẫu template-{formName}.xlsx
                  </Button>
                </div>
              </>
            ) : (
              <>
                {isLoadingExcel ? (
                  <>
                    <Progress
                      key="progress-excel"
                      percent={percentExcel}
                      size={80}
                      type="circle"
                    />
                  </>
                ) : (
                  <>
                    <div className="min-h-28 flex flex-col items-center justify-center gap-1 py-2">
                      <div className="grid grid-cols-4">
                        <img
                          src={"/excel.svg"}
                          width={48}
                          loading="lazy"
                          alt="file-preview"
                        />
                        <div className="col-span-3 flex flex-col content-center">
                          <span className="text-[16px] text-green-500 font-medium">
                            {excel.name}
                          </span>
                          <span className="text-sm text-green-400">
                            Dung lượng:{" "}
                            <strong>
                              {(excel.size / (1024 * 1024)).toFixed(2)} MB
                            </strong>
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-3 items-center mt-2">
                        <Button
                          danger
                          disabled={displayRole.isUpload === false}
                          color="danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteExcel();
                          }}
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
        <div className="flex flex-col gap-1">
          <span className="font-medium text-neutral-600">
            Tài liệu đính kèm
          </span>
          <div
            {...getPDFRootProps()}
            className="w-full min-h-28 h-fit border-2 border-dashed border-blue-300 hover:border-blue-500 cursor-pointer flex justify-center items-center gap-3 rounded-xl"
          >
            <input {...getPDFInputProps()} />
            {!pdf || pdf.name === "" ? (
              <>
                <span className="text-blue-500 text-4xl">
                  <CloudUploadOutlined />
                </span>
                <div className="flex flex-col">
                  <span className="text-base text-center font-medium text-blue-500">
                    Tải lên tài liệu đính kèm
                  </span>
                  <span className="text-sm text-center text-blue-400">
                    Định dạng <strong>.pdf</strong>, tối đa{" "}
                    <strong>10 MB</strong>
                  </span>
                  <span className="text-blue-400 text-sm">
                    Kéo thả hoặc nhấn vào đây để chọn tệp!
                  </span>
                </div>
              </>
            ) : (
              <>
                {isLoadingPDF ? (
                  <>
                    <Progress
                      key="progress-pdf"
                      percent={percentPDF}
                      size={80}
                      type="circle"
                    />
                  </>
                ) : (
                  <>
                    <div className="min-h-28 flex flex-col justify-center items-center gap-1 py-2">
                      <div className="grid grid-cols-3 gap-2">
                        <img
                          src="/file-pdf.svg"
                          width={42}
                          loading="lazy"
                          alt="file-preview"
                        />
                        <div className="col-span-2 text-center content-center">
                          <span className="text-sm">{pdf.name}</span>
                          <span className="text-sm flex">
                            ({(pdf.size / (1024 * 1024)).toFixed(2)} MB -
                            <span
                              className="text-sm ms-1 cursor-pointer text-blue-500 hover:text-blue-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                // setOpenDrawer(true);
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
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePdf();
                          }}
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
      <CustomNotification
        isOpen={formNotification.isOpen}
        status={formNotification.status}
        message={formNotification.message}
        description={formNotification.description}
      />
    </section>
  );
};

export default FromUpload;
