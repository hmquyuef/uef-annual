"use client";

import {
  Button,
  ConfigProvider,
  DatePicker,
  Drawer,
  Input,
  Progress,
} from "antd";
import { FC, FormEvent, useEffect, useMemo, useState } from "react";

import { MembersInfomations } from "@/services/generalWorks/membersInfomation";
import { DisplayRoleItem } from "@/services/roles/rolesServices";

import CustomNotification from "@/components/CustomNotification";
import DrawerInfomation from "@/components/drawerInfo/DrawerInfomation";
import { LoadingSkeleton } from "@/components/skeletons/LoadingSkeleton";
import { ImportLaborUnions } from "@/services/generalWorks/laborUnionServices";
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
import { useDropzone } from "react-dropzone";

import locale from "antd/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");

interface FormBM08Props {
  onSubmit: (formData: Partial<any>) => void;
  initialData?: Partial<any>;
  mode: "add" | "edit";
  formName: string;
  displayRole: DisplayRoleItem;
}

const FormBM08: FC<FormBM08Props> = (props) => {
  const { onSubmit, initialData, mode, formName, displayRole } = props;
  const { TextArea } = Input;
  const timestamp = dayjs().tz("Asia/Ho_Chi_Minh").unix();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingExcel, setIsLoadingExcel] = useState<boolean>(false);
  const [isLoadingPDF, setIsLoadingPDF] = useState<boolean>(false);
  const [percentExcel, setPercentExcel] = useState<number>(0);
  const [percentPDF, setPercentPDF] = useState<number>(0);
  const [members, setMembers] = useState<MembersInfomations[]>([]);
  const [pdf, setPdf] = useState<FileItem | undefined>(undefined);
  const [participants, setParticipants] = useState<FileItem | undefined>(
    undefined
  );
  const [openDrawer, setOpenDrawer] = useState(false);

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

  const [formValues, setFormValues] = useState({
    contents: "",
    documentNumber: "",
    internalNumber: "",
    documentDate: 0,
    fromDate: 0,
    toDate: 0,
    entryDate: timestamp,
    eventVenue: "",
    sponsor: "",
    attackmentFile: {
      type: "",
      path: "",
      name: "",
      size: 0,
    },
    attackmentExcel: {
      type: "",
      path: "",
      name: "",
      size: 0,
    },
    note: "",
  });

  const handleDeleteExcel = async () => {
    setIsLoadingExcel(true);
    if (participants && participants !== undefined) {
      await deleteFiles(
        participants.path.replace("https://api-annual.uef.edu.vn/", "")
      );
      let intervalId = setInterval(() => {
        setPercentExcel((prevPercent) => {
          let newPercent = prevPercent === 0 ? 100 : prevPercent - 1;
          if (newPercent === 0) {
            clearInterval(intervalId);
            setFormNotification({
              isOpen: true,
              status: "success",
              message: "Thông báo",
              description: `Đã xóa tệp tin: ${participants.name} thành công!`,
            });
            setParticipants(undefined);
            setMembers([]);
            setIsLoadingExcel(false);
            return 0;
          }
          return newPercent;
        });
      }, 10);
    }
    setFormNotification((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  const {
    getRootProps: getParticipantRootProps,
    getInputProps: getParticipantInputProps,
  } = useDropzone({
    onDrop: useMemo(
      () => async (acceptedFiles: File[]) => {
        setIsLoadingExcel(true);
        const formData = new FormData();
        formData.append("FunctionName", "general/unions/labors");
        formData.append("file", acceptedFiles[0]);
        if (participants && participants.path !== "") {
          await deleteFiles(
            participants.path.replace("https://api-annual.uef.edu.vn/", "")
          );
          setMembers([]);
        }
        const results = await postFiles(formData);
        if (results && results !== undefined) {
          setParticipants(results);
          const formDataImport = new FormData();
          formDataImport.append("path", results.path);
          const response = await ImportLaborUnions(formDataImport);
          if (response && response.items && response.items.length > 0) {
            setMembers(response.items);
            let intervalId = setInterval(() => {
              setPercentExcel((prevPercent) => {
                const newPercent = prevPercent + 1;
                if (newPercent >= 100) {
                  clearInterval(intervalId);
                  setTimeout(() => {
                    setFormNotification({
                      isOpen: true,
                      status: "success",
                      message: "Thông báo",
                      description: `Đã tải lên tệp tin: ${results.name} thành công!`,
                    });
                    setIsLoadingExcel(false);
                  }, 500);
                  return 100;
                }
                return newPercent;
              });
            }, 10);
          }
        }
        setFormNotification((prev) => ({
          ...prev,
          isOpen: false,
        }));
      },
      [participants, setPercentExcel]
    ),
  });

  const handleDeletePicture = async () => {
    setIsLoadingPDF(true);
    if (pdf && pdf.path !== "") {
      await deleteFiles(pdf.path.replace("https://api-annual.uef.edu.vn/", ""));
      let intervalId = setInterval(() => {
        setPercentPDF((prevPercent) => {
          let newPercent = prevPercent === 0 ? 100 : prevPercent - 1;
          if (newPercent === 0) {
            clearInterval(intervalId);
            setPdf(undefined);
            setFormNotification({
              isOpen: true,
              status: "success",
              message: "Thông báo",
              description: `Đã xóa tệp tin: ${pdf.name} thành công!`,
            });
            setIsLoadingPDF(false);
            return 0;
          }
          return newPercent;
        });
      }, 10);
    }
    setFormNotification((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  const { getRootProps: getPDFRootProps, getInputProps: getPDFInputProps } =
    useDropzone({
      onDrop: useMemo(
        () => async (acceptedFiles: File[]) => {
          setIsLoadingPDF(true);
          const formData = new FormData();
          formData.append("FunctionName", "general/unions/labors");
          formData.append("file", acceptedFiles[0]);
          if (pdf && pdf.path !== "") {
            await deleteFiles(
              pdf.path.replace("https://api-annual.uef.edu.vn/", "")
            );
          }
          const results = await postFiles(formData);
          if (results && results !== undefined) {
            setPdf(results);
            let intervalId = setInterval(() => {
              setPercentPDF((prevPercent) => {
                const newPercent = prevPercent + 1;
                if (newPercent >= 100) {
                  clearInterval(intervalId);
                  setTimeout(() => {
                    setFormNotification({
                      isOpen: true,
                      status: "success",
                      message: "Thông báo",
                      description: `Đã tải lên tệp tin: ${results.name} thành công!`,
                    });
                    setIsLoadingPDF(false);
                  }, 500);
                  return 100;
                }
                return newPercent;
              });
            }, 10);
          }
          setFormNotification((prev) => ({
            ...prev,
            isOpen: false,
          }));
        },
        [pdf]
      ),
    });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData: Partial<any> = {
      id: initialData?.id || "",
      contents: formValues.contents,
      eventVenue: formValues.eventVenue,
      sponsor: formValues.sponsor,
      members: members,
      determinations: {
        documentNumber: formValues.documentNumber,
        internalNumber: formValues.internalNumber,
        documentDate: formValues.documentDate,
        fromDate: formValues.fromDate,
        toDate: formValues.toDate,
        entryDate: formValues.entryDate,
        files: [
          {
            type: pdf?.type ?? "",
            path: pdf?.path ?? "",
            name: pdf?.name ?? "",
            size: pdf?.size ?? 0,
          },
          {
            type: participants?.type ?? "",
            path: participants?.path ?? "",
            name: participants?.name ?? "",
            size: participants?.size ?? 0,
          },
        ],
      },
      note: formValues.note,
    };
    onSubmit(formData);
  };

  const onClose = () => {
    setOpenDrawer(false);
  };

  const ResetForm = () => {
    setFormValues({
      contents: "",
      documentNumber: "",
      internalNumber: "",
      documentDate: 0,
      fromDate: 0,
      toDate: 0,
      entryDate: timestamp,
      eventVenue: "",
      sponsor: "",
      attackmentFile: {
        type: "",
        path: "",
        name: "",
        size: 0,
      },
      attackmentExcel: {
        type: "",
        path: "",
        name: "",
        size: 0,
      },
      note: "",
    });
    setMembers([]);
    setPdf(undefined);
    setParticipants(undefined);
  };

  useEffect(() => {
    setIsLoading(true);
    const loadUsers = async () => {
      if (mode === "edit" && initialData !== undefined) {
        const file = initialData.determinations.files.find(
          (x: { type: string }) => x.type === "application/pdf"
        );
        const excel = initialData.determinations.files.find(
          (x: { type: string }) => x.type === "application/pdf"
        );
        setFormValues({
          contents: initialData.contents,
          documentNumber: initialData.documentNumber,
          internalNumber: initialData.internalNumber,
          documentDate: initialData.determinations.documentDate,
          fromDate: initialData.determinations.fromDate,
          toDate: initialData.determinations.toDate,
          entryDate: initialData.determinations.entryDate,
          eventVenue: initialData.eventVenue,
          sponsor: initialData.sponsor,
          attackmentFile: file,
          attackmentExcel: excel,
          note: initialData.note,
        });
        setMembers(initialData.members);
        if (initialData.attackmentFile) {
          setPdf(initialData.attackmentFile);
        }
        if (initialData.attackmentExcel) {
          setParticipants(initialData.attackmentExcel);
        }
      } else {
        ResetForm();
      }
    };
    loadUsers();
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [initialData, mode]);

  return (
    <div className="grid grid-cols-1 mb-2">
      {isLoading ? (
        <>
          <LoadingSkeleton />
        </>
      ) : (
        <>
          {" "}
          <form onSubmit={handleSubmit}>
            <hr className="mt-1 mb-2" />
            <div className="grid grid-cols-6 gap-6 mb-2">
              <div className="flex flex-col gap-1">
                <span className="font-medium text-neutral-600">Số văn bản</span>
                <Input
                  value={formValues.documentNumber}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      documentNumber: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-medium text-neutral-600">Ngày lập</span>
                <ConfigProvider locale={locale}>
                  <DatePicker
                    allowClear={false}
                    placeholder="dd/mm/yyyy"
                    format={"DD/MM/YYYY"}
                    value={
                      formValues.documentDate
                        ? dayjs
                            .unix(formValues.documentDate)
                            .tz("Asia/Ho_Chi_Minh")
                        : null
                    }
                    onChange={(date) => {
                      setFormValues((prev) => ({
                        ...prev,
                        documentDate: date
                          ? dayjs(date).tz("Asia/Ho_Chi_Minh").unix()
                          : 0,
                      }));
                    }}
                  />
                </ConfigProvider>
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-medium text-neutral-600">Từ ngày</p>
                <ConfigProvider locale={locale}>
                  <DatePicker
                    allowClear={false}
                    placeholder="dd/mm/yyyy"
                    format="DD/MM/YYYY"
                    value={
                      formValues.fromDate
                        ? dayjs.unix(formValues.fromDate).tz("Asia/Ho_Chi_Minh")
                        : null
                    }
                    onChange={(date) => {
                      setFormValues((prev) => ({
                        ...prev,
                        fromDate: date
                          ? dayjs(date).tz("Asia/Ho_Chi_Minh").unix()
                          : 0,
                      }));
                    }}
                  />
                </ConfigProvider>
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-medium text-neutral-600">Đến ngày</p>
                <ConfigProvider locale={locale}>
                  <DatePicker
                    allowClear={false}
                    placeholder="dd/mm/yyyy"
                    format="DD/MM/YYYY"
                    value={
                      formValues.toDate
                        ? dayjs.unix(formValues.toDate).tz("Asia/Ho_Chi_Minh")
                        : 0
                    }
                    onChange={(date) => {
                      setFormValues((prev) => ({
                        ...prev,
                        toDate: date
                          ? dayjs(date).tz("Asia/Ho_Chi_Minh").unix()
                          : 0,
                      }));
                    }}
                  />
                </ConfigProvider>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-medium text-neutral-600">
                  Số lưu văn bản
                </span>
                <Input
                  value={formValues.internalNumber}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      internalNumber: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-medium text-neutral-600">Ngày nhập</span>
                <ConfigProvider locale={locale}>
                  <DatePicker
                    disabled
                    placeholder="dd/mm/yyyy"
                    format={"DD/MM/YYYY"}
                    value={
                      formValues.entryDate
                        ? dayjs
                            .unix(formValues.entryDate)
                            .tz("Asia/Ho_Chi_Minh")
                        : 0
                    }
                  />
                </ConfigProvider>
              </div>
            </div>
            <div className="flex flex-col gap-1 mb-2">
              <span className="font-medium text-neutral-600">Hoạt động</span>
              <TextArea
                autoSize
                value={formValues.contents}
                onChange={(e) =>
                  setFormValues({ ...formValues, contents: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-6 mb-2">
              <div className="flex flex-col gap-1">
                <span className="font-medium text-neutral-600">
                  Địa điểm tổ chức
                </span>
                <TextArea
                  autoSize
                  value={formValues.eventVenue}
                  onChange={(e) =>
                    setFormValues({ ...formValues, eventVenue: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-medium text-neutral-600">
                  Đơn vị tài trợ
                </span>
                <TextArea
                  autoSize
                  value={formValues.sponsor}
                  onChange={(e) =>
                    setFormValues({ ...formValues, sponsor: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 mb-2">
              <div className="flex flex-col gap-1">
                <p className="font-medium text-neutral-600">
                  Danh sách nhân sự tham gia
                  {members && members.length > 0 && (
                    <>
                      <span
                        className="ms-1 text-sm text-blue-400 cursor-pointer"
                        onClick={() => setOpenDrawer(true)}
                      >
                        (xem danh sách)
                      </span>
                    </>
                  )}
                </p>
                <div
                  {...getParticipantRootProps()}
                  className="w-full min-h-28 h-fit border-2 border-dashed border-green-300 hover:border-green-500 cursor-pointer flex justify-center items-center gap-3 rounded-xl"
                >
                  <input {...getParticipantInputProps()} />
                  {!participants || participants.path === "" ? (
                    <>
                      <img
                        src="/excel.svg"
                        width={42}
                        loading="lazy"
                        alt="upload"
                      />
                      <div className="flex flex-col">
                        <span className="text-[16px] text-center text-green-500 font-medium">
                          Tải lên tệp danh sách nhân sự
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
                            <div className="grid grid-cols-3 gap-2">
                              <img
                                src={"/excel.svg"}
                                width={42}
                                loading="lazy"
                                alt="file-preview"
                              />
                              <div className="col-span-2 text-center content-center">
                                <span className="text-sm">
                                  {participants.name}
                                </span>
                                <span className="text-sm flex">
                                  ({members.length} nhân sự -{" "}
                                  {(participants.size / (1024 * 1024)).toFixed(
                                    2
                                  )}{" "}
                                  MB)
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
                  {!pdf || pdf.path === "" ? (
                    <>
                      <span className="text-blue-500 text-4xl">
                        <CloudUploadOutlined />
                      </span>
                      <div className="flex flex-col">
                        <span className="text-[16px] text-center font-medium text-blue-500">
                          Tải lên tệp tài liệu đính kèm
                        </span>
                        <span className="text-blue-300 text-[13px]">
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
                                      setOpenDrawer(true);
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
                                  handleDeletePicture();
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
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-medium text-neutral-600">Ghi chú</span>
              <TextArea
                autoSize
                value={formValues.note}
                onChange={(e) =>
                  setFormValues({ ...formValues, note: e.target.value })
                }
              />
            </div>
          </form>
        </>
      )}
      <Drawer
        title="Chi tiết danh sách nhân sự tham gia sự kiện"
        placement={"bottom"}
        closable={true}
        onClose={onClose}
        open={openDrawer}
        height={"100%"}
        key="drawer-infomation-bm08"
      >
        <DrawerInfomation
          formId={initialData?.id || ""}
          formName="labor"
          members={members}
          path={pdf?.path ?? ""}
          onMembersChange={(newMembers) => {
            setMembers(newMembers);
          }}
        />
      </Drawer>
      <CustomNotification
        message={formNotification.message}
        description={formNotification.description}
        status={formNotification.status}
        isOpen={formNotification.isOpen}
      />
    </div>
  );
};
export default FormBM08;
