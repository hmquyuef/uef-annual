"use client";

import {
  Button,
  ConfigProvider,
  DatePicker,
  Drawer,
  Input,
  Progress,
} from "antd";
import moment from "moment";
import { FC, FormEvent, useEffect, useMemo, useState } from "react";

import { MembersInfomations } from "@/services/generalWorks/membersInfomation";
import { DisplayRoleItem } from "@/services/roles/rolesServices";

import CustomNotification from "@/components/CustomNotification";
import DrawerInfomation from "@/components/drawerInfo/DrawerInfomation";
import { LoadingSkeleton } from "@/components/skeletons/LoadingSkeleton";
import {
  ImportLaborUnions,
  putListMembersLaborUnion,
} from "@/services/generalWorks/laborUnionServices";
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

const FormBM08: FC<FormBM08Props> = ({
  onSubmit,
  initialData,
  mode,
  formName,
  displayRole,
}) => {
  const { TextArea } = Input;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingExcel, setIsLoadingExcel] = useState<boolean>(false);
  const [isLoadingPDF, setIsLoadingPDF] = useState<boolean>(false);
  const [percentExcel, setPercentExcel] = useState<number>(0);
  const [percentPDF, setPercentPDF] = useState<number>(0);
  const [contents, setContents] = useState<string>("");
  const [documentNumber, setDocumentNumber] = useState<string>("");
  const [internalNumber, setInternalNumber] = useState<string>("");
  const [documentDate, setDocumentDate] = useState<number>(0);
  const [fromDate, setFromDate] = useState<number>(0);
  const [toDate, setToDate] = useState<number>(0);
  const [entryDate, setEntryDate] = useState<number>(0);
  const [eventVenue, setEventVenue] = useState<string>("");
  const [sponsor, setSponsor] = useState<string>("");
  const [members, setMembers] = useState<MembersInfomations[]>([]);
  const [note, setNote] = useState<string>("");
  // const [users, setUsers] = useState<UsersFromHRMResponse | undefined>(
  //   undefined
  // );
  const [message, setMessage] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [pdf, setPdf] = useState<FileItem | undefined>(undefined);
  const [participants, setParticipants] = useState<FileItem | undefined>(
    undefined
  );
  const [openDrawer, setOpenDrawer] = useState(false);

  // const getUsersHRM = async () => {
  //   const response = await getUsersFromHRM();
  //   setUsers(response);
  // };

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
            setDescription(`Xóa tệp tin: ${participants.name} thành công!`);
            setNotificationOpen(true);
            setStatus("success");
            setMessage("Thông báo");
            setParticipants(undefined);
            setMembers([]);
            setIsLoadingExcel(false);
            return 0;
          }
          return newPercent;
        });
      }, 10);
    }
    setNotificationOpen(false);
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
                    setDescription(
                      `Tải lên tệp tin: ${results.name} thành công!`
                    );
                    setNotificationOpen(true);
                    setStatus("success");
                    setMessage("Thông báo");
                    setIsLoadingExcel(false);
                  }, 500);
                  return 100;
                }
                return newPercent;
              });
            }, 10);
          }
          setNotificationOpen(false);
        }
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
            setDescription(`Đã xóa tệp tin: ${pdf.name} thành công!`);
            setNotificationOpen(true);
            setStatus("success");
            setMessage("Thông báo");
            setIsLoadingPDF(false);
            return 0;
          }
          return newPercent;
        });
      }, 10);
    }
    setNotificationOpen(false);
  };

  const { getRootProps: getPDFRootProps, getInputProps: getPDFInputProps } =
    useDropzone({
      onDrop: useMemo(
        () => async (acceptedFiles: File[]) => {
          setIsLoadingPDF(true);
          const formData = new FormData();
          formData.append("FunctionName", "unions/labors");
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
                    setDescription(
                      `Tải lên tệp tin: ${results.name} thành công!`
                    );
                    setNotificationOpen(true);
                    setStatus("success");
                    setMessage("Thông báo");
                    setIsLoadingPDF(false);
                  }, 500);
                  return 100;
                }
                return newPercent;
              });
            }, 10);
          }
          setNotificationOpen(false);
        },
        [pdf]
      ),
    });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData: Partial<any> = {
      id: initialData?.id || "",
      contents: contents,
      documentNumber: documentNumber,
      internalNumber: "",
      documentDate: documentDate,
      fromDate: fromDate,
      toDate: toDate,
      entryDate: entryDate / 1000,
      eventVenue: eventVenue,
      sponsor: sponsor,
      members: members,
      attackmentFile: {
        type: pdf?.type ?? "",
        path: pdf?.path ?? "",
        name: pdf?.name ?? "",
        size: pdf?.size ?? 0,
      },
      attackmentExcel: {
        type: participants?.type ?? "",
        path: participants?.path ?? "",
        name: participants?.name ?? "",
        size: participants?.size ?? 0,
      },
      note: note,
    };
    onSubmit(formData);
  };

  const onClose = () => {
    setOpenDrawer(false);
  };

  const ResetForm = () => {
    const formattedDate = moment().format("DD/MM/YYYY");
    const timestamp = moment(formattedDate, "DD/MM/YYYY").valueOf();
    setEntryDate(timestamp);
    setContents("");
    setDocumentNumber("");
    setDocumentDate(0);
    setFromDate(0);
    setToDate(0);
    setEventVenue("");
    setSponsor("");
    setMembers([]);
    setNote("");
    setPdf(undefined);
    setParticipants(undefined);
  };

  // useEffect(() => {
  //   getUsersHRM();
  // }, []);

  useEffect(() => {
    console.log("initialData :>> ", initialData);
    const loadUsers = async () => {
      setIsLoading(true);
      if (mode === "edit" && initialData !== undefined) {
        setContents(initialData.contents);
        setDocumentNumber(initialData.documentNumber);
        setDocumentDate(initialData.documentDate);
        setFromDate(initialData.fromDate);
        setToDate(initialData.toDate);
        setEntryDate(initialData.entryDate ? initialData.entryDate * 1000 : 0);
        setEventVenue(initialData.eventVenue);
        setSponsor(initialData.sponsor);
        setMembers(initialData.members);
        setNote(initialData.note);
        if (initialData.attackmentFile) {
          setPdf({
            type: initialData.attackmentFile.type,
            path: initialData.attackmentFile.path,
            name: initialData.attackmentFile.name,
            size: initialData.attackmentFile.size,
          });
        }
        if (initialData.attackmentExcel) {
          setParticipants({
            type: initialData.attackmentExcel.type,
            path: initialData.attackmentExcel.path,
            name: initialData.attackmentExcel.name,
            size: initialData.attackmentExcel.size,
          });
        }
      } else {
        ResetForm();
      }
      setIsLoading(false);
    };
    loadUsers();
  }, [initialData, mode]);

  if (isLoading) {
    return (
      <div>
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 mb-2">
      <form onSubmit={handleSubmit}>
        <hr className="mt-1 mb-2" />
        <div className="grid grid-cols-6 gap-6 mb-2">
          <div className="flex flex-col gap-1">
            <span className="font-medium text-neutral-600">Số văn bản</span>
            <Input
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
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
                  documentDate
                    ? dayjs.unix(documentDate).tz("Asia/Ho_Chi_Minh")
                    : null
                }
                onChange={(date) => {
                  if (date) {
                    const timestamp = dayjs(date).tz("Asia/Ho_Chi_Minh").unix();
                    setDocumentDate(timestamp);
                  } else {
                    setDocumentDate(0);
                  }
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
                  fromDate ? dayjs.unix(fromDate).tz("Asia/Ho_Chi_Minh") : null
                }
                onChange={(date) => {
                  if (date) {
                    const timestamp = dayjs(date).tz("Asia/Ho_Chi_Minh").unix();
                    setFromDate(timestamp);
                  } else {
                    setFromDate(0);
                  }
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
                  toDate ? dayjs.unix(toDate).tz("Asia/Ho_Chi_Minh") : null
                }
                onChange={(date) => {
                  if (date) {
                    const timestamp = dayjs(date).tz("Asia/Ho_Chi_Minh").unix();
                    setToDate(timestamp);
                  } else {
                    setToDate(0);
                  }
                }}
              />
            </ConfigProvider>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-medium text-neutral-600">Số lưu văn bản</span>
            <Input
              value={internalNumber}
              onChange={(e) => setInternalNumber(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-medium text-neutral-600">Ngày nhập</span>
            <ConfigProvider locale={locale}>
              <DatePicker
                disabled
                placeholder="dd/mm/yyyy"
                format={"DD/MM/YYYY"}
                value={entryDate ? moment(entryDate) : null}
              />
            </ConfigProvider>
          </div>
        </div>
        <div className="flex flex-col gap-1 mb-2">
          <span className="font-medium text-neutral-600">Hoạt động</span>
          <TextArea
            autoSize
            value={contents}
            onChange={(e) => setContents(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1 mb-2">
          <span className="font-medium text-neutral-600">Địa điểm tổ chức</span>
          <TextArea
            autoSize
            value={eventVenue}
            onChange={(e) => setEventVenue(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1 mb-2">
          <span className="font-medium text-neutral-600">Đơn vị tài trợ</span>
          <TextArea
            autoSize
            value={sponsor}
            onChange={(e) => setSponsor(e.target.value)}
          />
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
                            <span className="text-sm">{participants.name}</span>
                            <span className="text-sm flex">
                              ({members.length} nhân sự -{" "}
                              {(participants.size / (1024 * 1024)).toFixed(2)}{" "}
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
                  <img
                    src="/upload.svg"
                    width={42}
                    loading="lazy"
                    alt="upload"
                  />
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
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </form>
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
          members={members}
          path={pdf?.path ?? ""}
          onMembersChange={(newMembers) => {
            setMembers(newMembers);
          }}
        />
      </Drawer>
      <CustomNotification
        message={message}
        description={description}
        status={status}
        isOpen={isNotificationOpen}
      />
    </div>
  );
};
export default FormBM08;
