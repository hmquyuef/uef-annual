"use client";

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
  Progress,
  Select,
} from "antd";
import { FC, FormEvent, Key, useEffect, useState } from "react";

import CustomNotification from "@/components/CustomNotification";
import { LoadingSkeleton } from "@/components/skeletons/LoadingSkeleton";
import { DisplayRoleItem } from "@/services/roles/rolesServices";
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
import InfoPDF from "./infoPDF";
dayjs.locale("vi");
interface FormBM07Props {
  onSubmit: (formData: Partial<any>) => void;
  initialData?: Partial<any>;
  handleShowPDF: (isVisible: boolean) => void;
  mode: "add" | "edit";
  displayRole: DisplayRoleItem;
}

const FormBM07: FC<FormBM07Props> = (props) => {
  const { onSubmit, initialData, handleShowPDF, mode, displayRole } = props;
  const { TextArea } = Input;
  const timestamp = dayjs().tz("Asia/Ho_Chi_Minh").unix();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [units, setUnits] = useState<UnitItem[]>([]);
  const [defaultUnits, setDefaultUnits] = useState<UnitItem[]>([]);
  const [users, setUsers] = useState<UsersFromHRMResponse | undefined>(
    undefined
  );
  const [selectedKey, setSelectedKey] = useState<Key | null>(null);
  const [defaultUsers, setDefaultUsers] = useState<UsersFromHRM[]>([]);
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
    contents: "",
    issuanceDate: 0,
    issuancePlace: "",
    entryDate: timestamp,
    documentDate: 0,
    attackment: {
      type: "",
      path: "",
      name: "",
      size: 0,
    },
    type: "",
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
    disabled: displayRole.isUpload === false,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const tempUser = users?.items?.find((user) => user.id === selectedKey);
    const formData: Partial<any> = {
      id: initialData?.id || "",
      userName: mode !== "edit" ? tempUser?.userName : defaultUsers[0].userName,
      fullName: mode !== "edit" ? tempUser?.fullName : defaultUsers[0].fullName,
      unitName: mode !== "edit" ? tempUser?.unitName : defaultUsers[0].unitName,
      contents: formValues.contents,
      issuanceDate: formValues.issuanceDate,
      issuancePlace: formValues.issuancePlace,
      entryDate: formValues.entryDate,
      attackment: {
        type: listPicture?.type ?? "",
        path: listPicture?.path ?? "",
        name: listPicture?.name ?? "",
        size: listPicture?.size ?? 0,
      },
      type: formValues.type,
      note: formValues.note,
    };
    onSubmit(formData);
    setFormNotification((prev) => ({ ...prev, isOpen: false }));
  };

  const ResetForm = () => {
    setFormValues({
      contents: "",
      issuanceDate: 0,
      issuancePlace: "",
      entryDate: timestamp,
      documentDate: 0,
      attackment: {
        type: "",
        path: "",
        name: "",
        size: 0,
      },
      type: "",
      note: "",
    });
    setDefaultUnits([]);
    setDefaultUsers([]);
    setUsers(undefined);
    setSelectedKey(null);
    setListPicture(undefined);
  };

  useEffect(() => {
    setIsLoading(true);
    const loadUsers = async () => {
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
          contents: initialData.contents || "",
          issuanceDate: initialData.issuanceDate || 0,
          issuancePlace: initialData.issuancePlace || "",
          entryDate: initialData?.entryDate ? initialData.entryDate : timestamp,
          documentDate: initialData.documentDate || 0,
          attackment: {
            type: initialData.attackment.type || "",
            path: initialData.attackment.path || "",
            name: initialData.attackment.name || "",
            size: initialData.attackment.size || 0,
          },
          type: initialData.type || "",
          note: initialData.note || "",
        });
        setListPicture(initialData?.attackment || undefined);
      } else {
        ResetForm();
        getListUnits();
      }
    };
    loadUsers();
    handleShowPDF(false);
    setShowPDF(false);
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [initialData, mode]);

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
          {" "}
          <form onSubmit={handleSubmit}>
            <hr className="mt-1 mb-2" />
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
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  options={users?.items?.map((user) => ({
                    value: user.id,
                    label: `${user.fullName} - ${user.userName}`,
                    key: user.id,
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
            <div className="flex flex-col gap-1 mb-2">
              <span className="font-medium text-neutral-600">
                Nội dung đào tạo
              </span>
              <TextArea
                autoSize
                value={formValues.contents}
                onChange={(e) =>
                  setFormValues({ ...formValues, contents: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-1 mb-2">
              <span className="font-medium text-neutral-600">Nơi đào tạo</span>
              <Input
                value={formValues.issuancePlace}
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    issuancePlace: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid grid-cols-3 mb-2 gap-6">
              <div className="flex flex-col gap-1">
                <span className="font-medium text-neutral-600">
                  Loại CC/GCN
                </span>
                <Select
                  showSearch
                  disabled={
                    displayRole.isCreate === false ||
                    displayRole.isUpdate === false
                  }
                  optionFilterProp="label"
                  options={[
                    { value: "CC", label: "CC" },
                    { value: "GCN", label: "GCN" },
                  ]}
                  value={formValues.type}
                  onChange={(value) => {
                    setFormValues({ ...formValues, type: value });
                  }}
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-medium text-neutral-600">
                  Ngày cấp CC/GCN
                </span>
                <ConfigProvider locale={locale}>
                  <DatePicker
                    allowClear={false}
                    placeholder="dd/mm/yyyy"
                    format={"DD/MM/YYYY"}
                    value={
                      formValues.issuanceDate
                        ? dayjs
                            .unix(formValues.issuanceDate)
                            .tz("Asia/Ho_Chi_Minh")
                        : null
                    }
                    onChange={(date) => {
                      setFormValues((prev) => ({
                        ...prev,
                        issuanceDate: date
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
            <div className="flex flex-col gap-1 mb-3">
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
export default FormBM07;
