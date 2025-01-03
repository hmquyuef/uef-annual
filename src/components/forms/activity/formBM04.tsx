"use client";

import CustomNotification from "@/components/CustomNotification";
import { PaymentApprovedItem } from "@/services/forms/PaymentApprovedItem";
import { QAItem } from "@/services/forms/qaServices";
import { DisplayRoleItem } from "@/services/roles/rolesServices";
import { getAllUnits, UnitItem } from "@/services/units/unitsServices";
import {
  deleteFiles,
  FileItem,
  postFiles,
} from "@/services/uploads/uploadsServices";
import {
  getUsersFromHRMbyId,
  UsersFromHRM,
  UsersFromHRMResponse,
} from "@/services/users/usersServices";
import { CloudUploadOutlined, MinusCircleOutlined } from "@ant-design/icons";
import {
  Button,
  ConfigProvider,
  DatePicker,
  Input,
  InputNumber,
  Progress,
  Select,
} from "antd";
import { FC, FormEvent, Key, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import InfoApproved from "./infoApproved";
import InfoPDF from "./infoPDF";

import { LoadingSkeleton } from "@/components/skeletons/LoadingSkeleton";
import locale from "antd/locale/vi_VN";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
dayjs.extend(timezone);

interface FormBM04Props {
  onSubmit: (formData: Partial<QAItem>) => void;
  initialData?: Partial<QAItem>;
  handleShowPDF: (isVisible: boolean) => void;
  mode: "add" | "edit";
  isBlock: boolean;
  isPayment?: PaymentApprovedItem;
  displayRole: DisplayRoleItem;
}

const FormBM04: FC<FormBM04Props> = (props) => {
  const {
    onSubmit,
    handleShowPDF,
    initialData,
    mode,
    isBlock,
    isPayment,
    displayRole,
  } = props;
  const { TextArea } = Input;
  const timestamp = dayjs().tz("Asia/Ho_Chi_Minh").unix();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [units, setUnits] = useState<UnitItem[]>([]);
  const [defaultUnits, setDefaultUnits] = useState<UnitItem[]>([]);
  const [users, setUsers] = useState<UsersFromHRMResponse | undefined>(
    undefined
  );
  const [defaultUsers, setDefaultUsers] = useState<UsersFromHRM[]>([]);
  const [selectedKey, setSelectedKey] = useState<Key | null>(null);
  const [listPicture, setListPicture] = useState<FileItem | undefined>(
    undefined
  );
  const [isLoadingPDF, setIsLoadingPDF] = useState<boolean>(false);
  const [percent, setPercent] = useState<number>(0);
  const [showPDF, setShowPDF] = useState<boolean>(false);
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
    standardValues: 0,
    contents: "",
    totalStudent: 0,
    fromDate: 0,
    toDate: 0,
    entryDate: timestamp,
    documentDate: 0,
    attackment: {
      type: "",
      path: "",
      name: "",
      size: 0,
    },
    proof: "",
    note: "",
  });

  const getListUnits = async () => {
    const response = await getAllUnits("true");
    setUnits(response.items);
  };

  const getUsersFromHRMByUnitId = async (unitId: string) => {
    const response = await getUsersFromHRMbyId(unitId);
    setUsers(response);
  };

  const handleDeletePicture = async () => {
    setIsLoadingPDF(true);
    if (listPicture && listPicture.path !== "") {
      await deleteFiles(
        listPicture.path.replace("https://api-annual.uef.edu.vn/", "")
      );
      let intervalId = setInterval(() => {
        setPercent((prevPercent) => {
          let newPercent = prevPercent === 0 ? 100 : prevPercent - 1;
          if (newPercent === 0) {
            clearInterval(intervalId);
            setListPicture({ type: "", path: "", name: "", size: 0 });
            setFormNotification({
              isOpen: true,
              status: "success",
              message: "Thông báo",
              description: `Đã xóa tệp tin: ${listPicture.name} thành công!`,
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

  const handleUploadPDF = async (acceptedFiles: File[]) => {
    setIsLoadingPDF(true);
    const formData = new FormData();
    formData.append("FunctionName", "qae");
    formData.append("file", acceptedFiles[0]);

    if (listPicture && listPicture.path !== "") {
      await deleteFiles(
        listPicture.path.replace("https://api-annual.uef.edu.vn/", "")
      );
    }
    const results = await postFiles(formData);
    if (results && results !== undefined) {
      setListPicture(results);
      let intervalId = setInterval(() => {
        setPercent((prevPercent) => {
          const newPercent = prevPercent + 1;
          if (newPercent >= 100) {
            clearInterval(intervalId);
            setTimeout(() => {
              setFormNotification({
                message: "Thông báo",
                description: `Tải lên tệp tin: ${results.name} thành công!`,
                status: "success",
                isOpen: true,
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
  };
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleUploadPDF,
    disabled: isBlock || displayRole.isUpload === false,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const tempUser = users?.items?.find((user) => user.id === selectedKey);
    const formData: Partial<QAItem> = {
      id: initialData?.id || "",
      userName: mode !== "edit" ? tempUser?.userName : defaultUsers[0].userName,
      fullName: mode !== "edit" ? tempUser?.fullName : defaultUsers[0].fullName,
      unitName: mode !== "edit" ? tempUser?.unitName : defaultUsers[0].unitName,
      contents: formValues.contents,
      totalStudent: formValues.totalStudent,
      standardNumber: formValues.standardValues,
      fromDate: formValues.fromDate,
      toDate: formValues.toDate,
      entryDate: formValues.entryDate,
      documentDate: formValues.documentDate,
      attackment: {
        type: listPicture?.type ?? "",
        path: listPicture?.path ?? "",
        name: listPicture?.name ?? "",
        size: listPicture?.size ?? 0,
      },
      proof: formValues.proof,
      note: formValues.note,
    };
    onSubmit(formData);
    setFormNotification((prev) => ({ ...prev, isOpen: false }));
  };

  useEffect(() => {
    const resetForm = () => {
      setFormValues({
        standardValues: 0,
        contents: "",
        totalStudent: 0,
        fromDate: 0,
        toDate: 0,
        entryDate: timestamp,
        documentDate: 0,
        attackment: {
          type: "",
          path: "",
          name: "",
          size: 0,
        },
        proof: "",
        note: "",
      });
      setDefaultUnits([]);
      setDefaultUsers([]);
      setListPicture(undefined);
    };
    const loadUsers = async () => {
      setIsLoading(true);
      if (mode === "edit" && initialData !== undefined) {
        const units = await getAllUnits("true");
        const unit = units.items.find(
          (unit) => unit.code === initialData.unitName
        );
        if (unit) {
          setDefaultUnits([unit]);
          const usersTemp = await getUsersFromHRMbyId(unit.idHrm);
          const userTemp = usersTemp.items.find(
            (user) =>
              user.userName.toUpperCase() ===
              initialData.userName?.toUpperCase()
          );
          setDefaultUsers([userTemp] as UsersFromHRM[]);
        }
        setFormValues({
          standardValues: initialData.standardNumber || 0,
          contents: initialData.contents || "",
          totalStudent: initialData.totalStudent || 0,
          fromDate: initialData.fromDate || 0,
          toDate: initialData.toDate || 0,
          entryDate: initialData?.entryDate ? initialData.entryDate : timestamp,
          documentDate: initialData.documentDate || 0,
          attackment: {
            type: initialData.attackment?.type || "",
            path: initialData.attackment?.path || "",
            name: initialData.attackment?.name || "",
            size: initialData.attackment?.size || 0,
          },
          proof: initialData.proof || "",
          note: initialData.note || "",
        });
        setListPicture(initialData?.attackment || undefined);
      } else {
        resetForm();
      }
    };
    getListUnits();
    loadUsers();
    setShowPDF(false);
    handleShowPDF(false);
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [initialData, mode, handleShowPDF]);
  return (
    <div
      className={`grid ${showPDF ? "grid-cols-2 gap-4" : "grid-cols-1"} mb-2`}
    >
      {isLoading ? (
        <>
          <LoadingSkeleton />
        </>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <hr className="mt-1 mb-3" />
            <div className="grid grid-cols-5 gap-6 mb-4">
              <div className="flex flex-col gap-1">
                <span className="font-medium text-neutral-600">Số văn bản</span>
                <TextArea
                  autoSize
                  value={formValues.proof}
                  onChange={(e) =>
                    setFormValues({ ...formValues, proof: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-medium text-neutral-600">Ngày lập</span>
                <ConfigProvider locale={locale}>
                  <DatePicker
                    allowClear={false}
                    placeholder="dd/mm/yyyy"
                    format="DD/MM/YYYY"
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
            <div className="grid grid-cols-2 gap-6 mb-4">
              <div className="flex flex-col gap-1">
                <p className="font-medium text-neutral-600">Đơn vị</p>
                <Select
                  showSearch
                  disabled={
                    isBlock ||
                    displayRole.isCreate === false ||
                    displayRole.isUpdate === false
                  }
                  optionFilterProp="label"
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  options={units.map((unit: UnitItem, index) => ({
                    value: unit.idHrm,
                    label: unit.name,
                    key: `${unit.idHrm}-${index}`,
                  }))}
                  value={
                    defaultUnits.length > 0 ? defaultUnits[0].name : undefined
                  }
                  onChange={(value) => {
                    getUsersFromHRMByUnitId(value);
                  }}
                />
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-medium text-neutral-600">Tìm mã CB-GV-NV</p>
                <Select
                  showSearch
                  disabled={
                    isBlock ||
                    displayRole.isCreate === false ||
                    displayRole.isUpdate === false
                  }
                  optionFilterProp="label"
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  options={users?.items?.map((user) => ({
                    value: user.id,
                    label: `${user.fullName} - ${user.userName}`,
                  }))}
                  value={
                    defaultUsers.length > 0
                      ? `${defaultUsers[0].fullName} - ${defaultUsers[0].userName}`
                      : undefined
                  }
                  onChange={(value) => {
                    setSelectedKey(value);
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1 mb-4">
              <span className="font-medium text-neutral-600">Nội dung</span>
              <TextArea
                autoSize
                value={formValues.contents}
                onChange={(e) =>
                  setFormValues({ ...formValues, contents: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-6 mb-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-neutral-600">
                    Số lượng SV
                  </span>
                  <InputNumber
                    min={0}
                    defaultValue={0}
                    value={formValues.totalStudent}
                    onChange={(value) =>
                      setFormValues({ ...formValues, totalStudent: value ?? 0 })
                    }
                    style={{ width: "100%" }}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-neutral-600">
                    Số tiết chuẩn
                  </span>
                  <InputNumber
                    min={0}
                    defaultValue={0}
                    value={formValues.standardValues}
                    onChange={(value) =>
                      setFormValues({
                        ...formValues,
                        standardValues: value ?? 0,
                      })
                    }
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-[2px] mb-2">
              <span className="font-medium text-neutral-600">
                Tài liệu đính kèm
              </span>
              <div
                {...getRootProps()}
                className="w-full h-24 border-2 border-dashed border-blue-200 hover:border-blue-400 cursor-pointer flex justify-center items-center gap-3 rounded-xl"
              >
                <input {...getInputProps()} />
                {!listPicture || listPicture.path === "" ? (
                  <>
                    <span className="text-blue-500 text-4xl">
                      <CloudUploadOutlined />
                    </span>
                    <div className="flex flex-col">
                      <span className="text-base text-center font-medium text-blue-500">
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
                        <div>
                          <Progress
                            key="progress-upload-pdf"
                            status="active"
                            percent={percent}
                            size={[600, 15]}
                            type="line"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex flex-col items-center gap-1 py-2">
                          <div className="grid grid-cols-3 gap-2">
                            <img
                              src="/file-pdf.svg"
                              width={42}
                              loading="lazy"
                              alt="file-preview"
                            />
                            <div className="col-span-2 text-center content-center">
                              <span className="text-sm">
                                {listPicture.name}
                              </span>
                              <span className="text-sm flex">
                                ({(listPicture.size / (1024 * 1024)).toFixed(2)}{" "}
                                MB -
                                <span
                                  className="text-sm ms-1 cursor-pointer text-blue-500 hover:text-blue-600"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowPDF(true);
                                    handleShowPDF(true);
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
                              disabled={
                                isBlock || displayRole.isUpload === false
                              }
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
                              disabled={
                                isBlock || displayRole.isUpload === false
                              }
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
            <div className="flex flex-col gap-1 mb-4">
              <span className="font-medium text-neutral-600">Ghi chú</span>
              <TextArea
                autoSize
                value={formValues.note}
                onChange={(e) =>
                  setFormValues({ ...formValues, note: e.target.value })
                }
              />
            </div>
            <InfoApproved mode={mode} isPayment={isPayment} />
          </form>
        </>
      )}
      <InfoPDF
        path={listPicture?.path ?? ""}
        isShowPDF={showPDF}
        onSetShowPDF={(value) => {
          setShowPDF(value);
          handleShowPDF(value);
        }}
      />
      <CustomNotification
        message={formNotification.message}
        description={formNotification.description}
        status={formNotification.status}
        isOpen={formNotification.isOpen}
      />
    </div>
  );
};
export default FormBM04;
