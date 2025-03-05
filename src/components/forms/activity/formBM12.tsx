"use client";

import {
  deleteFiles,
  FileItem,
  postFiles,
} from "@/services/uploads/uploadsServices";
import {
  CloudUploadOutlined,
  DownloadOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import {
  Button,
  ConfigProvider,
  DatePicker,
  Drawer,
  Input,
  Progress,
  Select,
} from "antd";
import { FC, FormEvent, Key, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";

import CustomNotification from "@/components/CustomNotification";
import DrawerInfomation from "@/components/drawerInfo/DrawerInfomation";
import {
  handleDeleteFile,
  handleDeleteFileExcel,
} from "@/components/files/RemoveFile";
import { handleFileUpload } from "@/components/files/UploadExcel";
import { handleUploadFile } from "@/components/files/UploadFile";
import { LoadingSkeleton } from "@/components/skeletons/LoadingSkeleton";
import { MembersInfomations } from "@/services/generalWorks/membersInfomation";
import { ImportUnitLevelsMembers } from "@/services/generalWorks/unitLevelServices";
import { DisplayRoleItem } from "@/services/roles/rolesServices";
import { getAllUnits, UnitItem } from "@/services/units/unitsServices";
import Colors from "@/utility/Colors";
import locale from "antd/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");
interface FormBM12Props {
  onSubmit: (formData: Partial<any>) => void;
  initialData?: Partial<any>;
  mode: "add" | "edit";
  formName: string;
  displayRole: DisplayRoleItem;
}

const FormBM12: FC<FormBM12Props> = (props) => {
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
  const [selectedKeyUnit, setSelectedKeyUnit] = useState<Key | null>(null);
  const [UnitsHRM, setUnitsHRM] = useState<UnitItem[]>([]);
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
    eventsOrganizer: "",
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

  const getListUnits = async () => {
    const response = await getAllUnits("true");
    setUnitsHRM(response.items);
  };

  const handleDeleteExcel = async () => {
    await handleDeleteFileExcel(
      participants,
      setIsLoadingExcel,
      setPercentExcel,
      setFormNotification,
      deleteFiles,
      setParticipants,
      setMembers
    );
  };

  const {
    getRootProps: getParticipantRootProps,
    getInputProps: getParticipantInputProps,
  } = useDropzone({
    onDrop: useMemo(
      () => (acceptedFiles: File[]) =>
        handleFileUpload(
          acceptedFiles,
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          5, // Giới hạn 5MB
          setIsLoadingExcel,
          setPercentExcel,
          setFormNotification,
          ImportUnitLevelsMembers,
          deleteFiles,
          participants,
          setParticipants,
          setMembers
        ),
      [participants]
    ),
  });

  const handleDeletePicture = async () => {
    await handleDeleteFile(
      pdf,
      setIsLoadingPDF,
      setPercentPDF,
      setFormNotification,
      deleteFiles,
      setPdf
    );
  };
  const { getRootProps: getPDFRootProps, getInputProps: getPDFInputProps } =
    useDropzone({
      onDrop: useMemo(
        () => async (acceptedFiles: File[]) => {
          await handleUploadFile(
            acceptedFiles,
            "general/units",
            setPercentPDF,
            setIsLoadingPDF,
            setFormNotification,
            deleteFiles,
            postFiles,
            setPdf,
            pdf
          );
        },
        [pdf]
      ),
    });

  const ResetForm = () => {
    setFormValues({
      eventsOrganizer: "",
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData: Partial<any> = {
      id: initialData?.id || "",
      eventsOrganizer: formValues.eventsOrganizer,
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

  useEffect(() => {
    const findFile = (type: string) =>
      initialData?.determinations?.files?.find(
        (file: any) => file.type === type
      );

    const loadUsers = async () => {
      setIsLoading(true);
      try {
        if (mode === "edit" && initialData) {
          const file = findFile("application/pdf");
          const excel = findFile(
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          );

          const unit = UnitsHRM.find(
            (unit) => unit.code === initialData.eventsOrganizer
          );
          setSelectedKeyUnit(unit?.idHrm ?? null);

          setFormValues((prev) => {
            const newValues = {
              eventsOrganizer: initialData.eventsOrganizer ?? "",
              contents: initialData.contents ?? "",
              documentNumber: initialData.determinations?.documentNumber ?? "",
              internalNumber: initialData.determinations?.internalNumber ?? "",
              documentDate: initialData.determinations?.documentDate ?? 0,
              fromDate: initialData.determinations?.fromDate ?? 0,
              toDate: initialData.determinations?.toDate ?? 0,
              entryDate: initialData.determinations?.entryDate ?? timestamp,
              eventVenue: initialData.eventVenue ?? "",
              sponsor: initialData.sponsor ?? "",
              attackmentFile: file ?? null,
              attackmentExcel: excel ?? null,
              note: initialData.note ?? "",
            };
            return JSON.stringify(prev) !== JSON.stringify(newValues)
              ? newValues
              : prev;
          });

          setMembers((prev) =>
            JSON.stringify(prev) !== JSON.stringify(initialData.members)
              ? initialData.members
              : prev
          );

          if (file?.path) {
            setPdf((prev) =>
              JSON.stringify(prev) !== JSON.stringify(file) ? file : prev
            );
          }

          if (excel?.path) {
            setParticipants((prev) =>
              JSON.stringify(prev) !== JSON.stringify(excel) ? excel : prev
            );
          }
        } else {
          ResetForm();
        }
      } catch (error) {
        console.error("Error loading users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getListUnits();
    loadUsers();
  }, [initialData, mode]);

  useEffect(() => {
    if (formNotification.isOpen) {
      const timeoutId = setTimeout(() => {
        setFormNotification((prev) => ({ ...prev, isOpen: false }));
      }, 200);
      return () => clearTimeout(timeoutId);
    }
  }, [formNotification.isOpen]);

  return (
    <div className="grid grid-cols-1 mb-2">
      {isLoading ? (
        <>
          <LoadingSkeleton />
        </>
      ) : (
        <>
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
                <span className="font-medium text-neutral-600">Từ ngày</span>
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
                <span className="font-medium text-neutral-600">Đến ngày</span>
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
                  Đơn vị tổ chức
                </span>
                <Select
                  showSearch
                  disabled={
                    displayRole.isCreate === false ||
                    displayRole.isUpdate === false
                  }
                  optionFilterProp="label"
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  options={UnitsHRM.map((unit: UnitItem, index) => ({
                    value: unit.idHrm,
                    label: unit.name,
                    key: `${unit.idHrm}-${index}`,
                  }))}
                  value={selectedKeyUnit}
                  onChange={(value) => {
                    setSelectedKeyUnit(value);
                    const unitSelect = UnitsHRM.find(
                      (item) => item.idHrm === value.toString()
                    );
                    if (unitSelect) {
                      setFormValues((prev) => {
                        return {
                          ...prev,
                          eventsOrganizer: unitSelect.code,
                        };
                      });
                    }
                  }}
                />
              </div>
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
            </div>
            <div className="grid grid-cols-2 gap-6 mb-2">
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
                <span className="font-medium text-neutral-600">
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
                </span>
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
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
        height={"100%"}
        key="drawer-infomation-bm08"
      >
        <DrawerInfomation
          formId={initialData?.id || ""}
          formName="unitLevel"
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
export default FormBM12;
