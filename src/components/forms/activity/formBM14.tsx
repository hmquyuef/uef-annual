"use client";

import { DisplayRoleItem } from "@/services/roles/rolesServices";
import { getAllUnits, UnitItem } from "@/services/units/unitsServices";
import {
  getUsersFromHRMbyId,
  UsersFromHRM,
  UsersFromHRMResponse,
} from "@/services/users/usersServices";
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

import CustomNotification from "@/components/CustomNotification";
import { handleDeleteFile } from "@/components/files/RemoveFile";
import { handleUploadFile } from "@/components/files/UploadFile";
import { LoadingSkeleton } from "@/components/skeletons/LoadingSkeleton";
import { getCheckExistInvigilator } from "@/services/forms/invigilatorsServices";
import { PaymentApprovedItem } from "@/services/forms/PaymentApprovedItem";
import {
  deleteFiles,
  FileItem,
  postFiles,
} from "@/services/uploads/uploadsServices";
import { CloudUploadOutlined, MinusCircleOutlined } from "@ant-design/icons";
import locale from "antd/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { useDropzone } from "react-dropzone";
import InfoApproved from "./infoApproved";
import InfoPDF from "./infoPDF";
dayjs.locale("vi");

interface FormBM14Props {
  onSubmit: (formData: Partial<any>) => void;
  initialData?: Partial<any>;
  handleShowPDF: (isVisible: boolean) => void;
  mode: "add" | "edit";
  isBlock: boolean;
  isPayment?: PaymentApprovedItem;
  displayRole: DisplayRoleItem;
}

const FormBM14: FC<FormBM14Props> = (props) => {
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
  const [isExist, setIsExist] = useState<boolean>(false);
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
    documentNumber: "",
    internalNumber: "",
    documentDate: 0,
    totalSessions: 0,
    standardNumber: 0,
    entryDate: timestamp,
    attackmentFile: {
      type: "",
      path: "",
      name: "",
      size: 0,
    },
    note: "",
  });

  const getListUnits = async () => {
    const response = await getAllUnits("true");
    setUnits(response.items);
  };

  const getAllUsersFromHRM = async (id: Key) => {
    const response = await getUsersFromHRMbyId(id.toString());
    setUsers(response);
  };

  const checkExistInvigilator = async (userName: string) => {
    const response = await getCheckExistInvigilator(userName);
    if (response) {
      setIsExist(response);
      setFormNotification({
        isOpen: true,
        status: "info",
        message: "Đã tồn tại thông tin nội quy định cho nhân viên này",
        description: "Vui lòng kiểm tra lại thông tin!",
      });
    }
  };

  const handleDeletePicture = async () => {
    await handleDeleteFile(
      listPicture, // Danh sách tệp tin (có thể thay đổi)
      setIsLoadingPDF, // Hàm cập nhật trạng thái loading
      setPercent, // Hàm cập nhật phần trăm xóa
      setFormNotification, // Hàm hiển thị thông báo
      deleteFiles, // Hàm xóa tệp tin
      setListPicture // Hàm cập nhật danh sách tệp tin sau khi xóa
    );
  };

  const handleUploadPDF = async (acceptedFiles: File[]) => {
    await handleUploadFile(
      acceptedFiles, // Dữ liệu tệp tin được chấp nhận
      "invigilators", // FunctionName (Thay đổi ở đây)
      setPercent, // Hàm cập nhật phần trăm
      setIsLoadingPDF, // Hàm cập nhật trạng thái loading
      setFormNotification, // Hàm hiển thị thông báo
      deleteFiles, // Hàm xóa tệp tin
      postFiles, // Hàm gọi API tải lên tệp
      setListPicture, // Hàm cập nhật danh sách hình ảnh
      listPicture // Danh sách hình ảnh
    );
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleUploadPDF,
    disabled: isBlock || displayRole.isUpload === false,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const tempUser = users?.items?.find((user) => user.id === selectedKey);
    const formData: Partial<any> = {
      id: initialData?.id || "",
      userName: mode !== "edit" ? tempUser?.userName : defaultUsers[0].userName,
      fullName: mode !== "edit" ? tempUser?.fullName : defaultUsers[0].fullName,
      unitName: mode !== "edit" ? tempUser?.unitName : defaultUsers[0].unitName,
      totalSessions: formValues.totalSessions,
      standardNumber: formValues.standardNumber,
      determinations: {
        documentNumber: formValues.documentNumber,
        internalNumber: formValues.internalNumber,
        documentDate: formValues.documentDate,
        fromDate: formValues.entryDate,
        toDate: formValues.entryDate,
        entryDate: formValues.entryDate,
        files: [
          {
            type: listPicture?.type ?? "",
            path: listPicture?.path ?? "",
            name: listPicture?.name ?? "",
            size: listPicture?.size ?? 0,
          },
        ],
      },
      note: formValues.note,
    };
    if (isExist) {
      setFormNotification({
        isOpen: true,
        status: "info",
        message: "Đã tồn tại thông tin nội quy định cho nhân viên này",
        description: "Vui lòng kiểm tra lại thông tin!",
      });
      return;
    }
    onSubmit(formData);
  };

  const ResetForms = () => {
    setDefaultUnits([]);
    setDefaultUsers([]);
    setSelectedKey(null);
    setFormValues({
      documentNumber: "",
      internalNumber: "",
      documentDate: 0,
      totalSessions: 0,
      standardNumber: 0,
      entryDate: timestamp,
      attackmentFile: {
        type: "",
        path: "",
        name: "",
        size: 0,
      },
      note: "",
    });
    setDefaultUnits([]);
    setDefaultUsers([]);
    setListPicture(undefined);
  };

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      try {
        if (mode !== "edit" || !initialData) {
          ResetForms();
          return;
        }

        // Lấy danh sách đơn vị
        const units = await getAllUnits("true");
        const unit = units.items.find((u) => u.code === initialData.unitName);

        if (unit) {
          setDefaultUnits([unit]);

          // Lấy danh sách người dùng của đơn vị
          const usersTemp = await getUsersFromHRMbyId(unit.idHrm);
          const userTemp = usersTemp.items.find(
            (user) =>
              user.userName.toUpperCase() ===
              initialData.userName?.toUpperCase()
          );

          if (userTemp) setDefaultUsers([userTemp] as UsersFromHRM[]);
        }

        // Hàm lấy thông tin file đính kèm
        const getFileData = (files?: any[]) => {
          if (!files?.length) return null;
          const file = files[0];
          return {
            type: file.type || "",
            path: file.path || "",
            name: file.name || "",
            size: file.size || 0,
          };
        };

        setFormValues({
          totalSessions: initialData.totalSessions,
          standardNumber: initialData.standardNumber,
          documentNumber: initialData.determinations.documentNumber,
          internalNumber: initialData.determinations.internalNumber,
          documentDate: initialData.determinations.documentDate,
          entryDate: initialData?.determinations.entryDate
            ? initialData.determinations.entryDate
            : timestamp,
          attackmentFile: {
            type: initialData?.determinations?.files[0]?.type || "",
            path: initialData?.determinations?.files[0]?.path || "",
            name: initialData?.determinations?.files[0]?.name || "",
            size: initialData?.determinations?.files[0]?.size || 0,
          },
          note: initialData.note,
        });

        // Cập nhật danh sách ảnh nếu có file đính kèm
        const fileData = getFileData(initialData.determinations.files);
        if (fileData) setListPicture(fileData);
      } catch (error) {
        console.error("Error loading users:", error);
      } finally {
        setIsLoading(false);
        setIsExist(false);
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
            <hr className="mt-1 mb-2" />
            <div className="grid grid-cols-4 gap-6 mb-2">
              <div className="flex flex-col gap-1">
                <span className="font-medium text-neutral-600">Số văn bản</span>
                <Input
                  value={formValues.documentNumber}
                  onChange={(e) =>
                    setFormValues((prev) => ({
                      ...prev,
                      documentNumber: e.target.value,
                    }))
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
                <span className="font-medium text-neutral-600">
                  Số lưu văn bản
                </span>
                <Input
                  value={formValues.internalNumber}
                  onChange={(e) => {
                    setFormValues((prev) => ({
                      ...prev,
                      internalNumber: e.target.value,
                    }));
                  }}
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
            <div className="grid grid-cols-4 gap-6 mb-2">
              <div className="col-span-2 flex flex-col gap-1">
                <span className="font-medium text-neutral-600">Đơn vị</span>
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
                  options={units.map((unit: UnitItem, index) => ({
                    value: unit.idHrm,
                    label: unit.name,
                    key: `${unit.idHrm}-${index}`,
                  }))}
                  value={
                    defaultUnits.length > 0 ? defaultUnits[0].name : undefined
                  }
                  onChange={(value) => {
                    getAllUsersFromHRM(value);
                  }}
                />
              </div>
              <div className="col-span-2 flex flex-col gap-1">
                <span className="font-medium text-neutral-600">
                  Tìm mã CB-GV-NV
                </span>
                <Select
                  showSearch
                  disabled={
                    displayRole.isCreate === false ||
                    displayRole.isUpdate === false
                  }
                  optionFilterProp="label"
                  defaultValue={""}
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
                    const user = users?.items?.find(
                      (user) => user.id === value
                    );
                    if (user) {
                      checkExistInvigilator(user.userName);
                    }
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 mb-2 gap-6">
              <div className="flex flex-col gap-1">
                <span className="font-medium text-neutral-600">
                  Số buổi coi thi
                </span>
                <InputNumber
                  min={0}
                  defaultValue={0}
                  value={formValues.totalSessions}
                  onChange={(value) =>
                    setFormValues({
                      ...formValues,
                      totalSessions: value ?? 0,
                    })
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
                  value={formValues.standardNumber}
                  onChange={(value) =>
                    setFormValues({
                      ...formValues,
                      standardNumber: value ?? 0,
                    })
                  }
                  style={{ width: "100%" }}
                />
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
            <div className="flex flex-col gap-1 mb-2">
              <p className="font-medium text-neutral-600">Ghi chú</p>
              <TextArea
                autoSize
                value={formValues.note}
                onChange={(e) =>
                  setFormValues({ ...formValues, note: e.target.value })
                }
              />
            </div>
            <InfoApproved mode={mode} isPayment={isPayment} />
            {isExist && (
              <>
                <div className="flex flex-col mt-3">
                  <span className="text-red-600 font-medium">Lưu ý:</span>
                  <span className="font-medium text-neutral-500 pl-3">
                    - Thông tin nhân sự đã tồn tại.
                  </span>
                  <span className="font-medium text-neutral-500 pl-3">
                    - Cần kiểm tra lại thông tin trước khi xác nhận.
                  </span>
                </div>
              </>
            )}
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
export default FormBM14;
