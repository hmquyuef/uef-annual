"use client";

import CustomNotification from "@/components/CustomNotification";
import { LoadingSkeleton } from "@/components/skeletons/LoadingSkeleton";
import {
  ActivityInput,
  AddUpdateActivityItem,
} from "@/services/forms/formsServices";
import { PaymentApprovedItem } from "@/services/forms/PaymentApprovedItem";
import { DisplayRoleItem } from "@/services/roles/rolesServices";
import { getAllUnits, UnitItem } from "@/services/units/unitsServices";
import {
  deleteFiles,
  FileItem,
  postFiles,
} from "@/services/uploads/uploadsServices";
import {
  getUsersFromHRMbyId,
  UsersFromHRMResponse,
} from "@/services/users/usersServices";
import {
  CloseCircleOutlined,
  CloudUploadOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import {
  Button,
  ConfigProvider,
  DatePicker,
  Input,
  InputNumber,
  Progress,
  Select,
  Table,
  TableColumnsType,
  Tooltip,
} from "antd";
import locale from "antd/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import moment from "moment";
import { FC, FormEvent, Key, useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import InfoApproved from "./infoApproved";
import InfoPDF from "./infoPDF";
import { handleUploadFile } from "@/components/files/UploadFile";
import { handleDeleteFile } from "@/components/files/RemoveFile";
dayjs.locale("vi");
interface FormBM05Props {
  onSubmit: (formData: Partial<AddUpdateActivityItem>) => void;
  handleShowPDF: (isVisible: boolean) => void;
  initialData?: Partial<AddUpdateActivityItem>;
  mode: "add" | "edit";
  numberActivity?: number;
  isBlock: boolean;
  isPayment?: PaymentApprovedItem;
  displayRole: DisplayRoleItem;
}

const FormBM05: FC<FormBM05Props> = ({
  onSubmit,
  handleShowPDF,
  initialData,
  mode,
  numberActivity,
  isBlock,
  isPayment,
  displayRole,
}) => {
  const { TextArea } = Input;
  const timestamp = dayjs().tz("Asia/Ho_Chi_Minh").unix();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [documentNumber, setDocumentNumber] = useState<string>("");
  const [name, setName] = useState("");
  const [deterNumber, setDeterNumber] = useState("");
  const [deterFromDate, setDeterFromDate] = useState<number | 0>(0);
  const [deterEventDate, setDeterEventDate] = useState<number | 0>(0);
  const [deterEntryDate, setDeterEntryDate] = useState<number | 0>(0);
  const [description, setDescription] = useState("");
  const [filteredUsersFromHRM, setFilteredUsersFromHRM] =
    useState<UsersFromHRMResponse | null>(null);
  const [filteredUnitsHRM, setFilteredUnitsHRM] = useState<UnitItem[]>([]);
  const [tableUsers, setTableUsers] = useState<ActivityInput[]>([]);
  const [selectedKey, setSelectedKey] = useState<Key | null>(null);
  const [selectedKeyUnit, setSelectedKeyUnit] = useState<Key | null>(null);
  const [standardValues, setStandardValues] = useState<number | 0>(0);
  const [listPicture, setListPicture] = useState<FileItem | undefined>(
    undefined
  );
  const [showPDF, setShowPDF] = useState<boolean>(false);
  const [isLoadingPDF, setIsLoadingPDF] = useState<boolean>(false);
  const [percent, setPercent] = useState<number>(0);
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

  const getListUnits = async () => {
    const response = await getAllUnits("true");
    setFilteredUnitsHRM(response.items);
  };

  const getAllUsersFromHRM = async (id: Key) => {
    const response = await getUsersFromHRMbyId(id.toString());
    setFilteredUsersFromHRM(response);
  };

  const onAddUsers = (key: Key | null, standard: number | 0) => {
    const itemUser =
      filteredUsersFromHRM?.items?.find((user) => user.id === key) ?? null;
    if (itemUser) {
      setTableUsers((prevTableUsers) => {
        const updatedUsers = prevTableUsers.map((user) => {
          if (user.id === itemUser.id) {
            return { ...user, standardNumber: standard };
          }
          return user;
        });
        const newUser: ActivityInput = {
          id: itemUser.id,
          userName: itemUser.userName,
          fullName: itemUser.fullName,
          unitId: itemUser.unitId,
          unitName: itemUser.unitName,
          standardNumber: standard,
          description: description,
        };
        return [...updatedUsers, newUser];
      });
      setStandardValues(0);
      setSelectedKey(null);
    }
  };
  const onRemoveUsers = useCallback((id: string) => {
    setTableUsers((prevTableUsers) =>
      prevTableUsers.filter((user) => user.id !== id)
    );
  }, []);

  const columns: TableColumnsType<ActivityInput> = [
    {
      title: <div className="p-2">STT</div>,
      dataIndex: "stt",
      key: "stt",
      render: (_, __, index) => <>{index + 1}</>,
      className: "text-center w-[20px]",
    },
    {
      title: "MÃ SỐ CB-GV-NV",
      dataIndex: "userName",
      key: "userName",
      render: (userName: string, record: ActivityInput) => {
        const fullName = record.fullName;
        return (
          <>
            <div className="flex flex-col">
              <span className="font-medium ">{fullName}</span>
              <span className="text-[13px]">{userName}</span>
            </div>
          </>
        );
      },
    },
    {
      title: "ĐƠN VỊ",
      dataIndex: "unitName",
      key: "unitName",
      render: (unitName: string) => <>{unitName}</>,
      className: "max-w-[100px] text-center",
    },
    {
      title: "SỐ TIẾT CHUẨN",
      dataIndex: "standardNumber",
      key: "standardNumber",
      render: (standardNumber: number, record: ActivityInput) => (
        <InputNumber
          min={0}
          defaultValue={standardNumber}
          onChange={(value) => {
            setTableUsers((prevTableUsers) =>
              prevTableUsers.map((user) =>
                user.id === record.id
                  ? { ...user, standardNumber: value ?? 0 }
                  : user
              )
            );
          }}
          style={{ width: "70%" }}
        />
      ),
      className: "w-[110px] text-center",
    },
    {
      title: "GHI CHÚ",
      dataIndex: "description",
      key: "description",
      render: (description: string, record: ActivityInput) => (
        <TextArea
          autoSize={{ minRows: 1, maxRows: 3 }}
          defaultValue={description}
          onChange={(e) => {
            const newDescription = e.target.value;
            setTableUsers((prevTableUsers) =>
              prevTableUsers.map((user) =>
                user.id === record.id
                  ? { ...user, description: newDescription }
                  : user
              )
            );
          }}
        />
      ),
      className: "max-w-32",
    },
    {
      title: "",
      dataIndex: "id",
      key: "id",
      render: (id: string) => {
        return (
          <div>
            <Tooltip placement="right" title="Xóa dữ liệu" arrow={true}>
              <Button
                disabled={isBlock || displayRole.isDelete === false}
                color="danger"
                variant="text"
                onClick={() => onRemoveUsers(id)}
              >
                <CloseCircleOutlined />
              </Button>
            </Tooltip>
          </div>
        );
      },
      className: "w-[10px]",
    },
  ];
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
      "activity", // FunctionName (Thay đổi ở đây)
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
    const formData: Partial<AddUpdateActivityItem> = {
      id: initialData?.id || "",
      name: name,
      determinations: {
        documentNumber: deterNumber,
        internalNumber: documentNumber,
        documentDate: deterEventDate / 1000,
        fromDate: deterFromDate / 1000,
        toDate: deterFromDate / 1000,
        entryDate: deterEntryDate,
        files: [
          {
            type: listPicture?.type ?? "",
            path: listPicture?.path ?? "",
            name: listPicture?.name ?? "",
            size: listPicture?.size ?? 0,
          },
        ],
      },
      participants: tableUsers.map((user) => ({
        id: user.id,
        userName: user.userName,
        fullName: user.fullName,
        unitId: user.unitId,
        unitName: user.unitName,
        standardNumber: user.standardNumber,
        description: user.description,
      })),
    };
    onSubmit(formData);
  };

  useEffect(() => {
    const resetForm = () => {
      setDeterEntryDate(timestamp);
      setName("");
      setDeterNumber("");
      setDeterFromDate(0);
      setDeterEventDate(0);
      setTableUsers([]);
      setListPicture(undefined);
      setDescription("");
      setDocumentNumber("");
    };
    const loadUsers = async () => {
      setIsLoading(true);
      if (mode === "edit" && initialData !== undefined) {
        setName(initialData.name || "");
        setDeterNumber(initialData.determinations?.documentNumber || "");
        setDeterEntryDate(
          initialData.determinations?.entryDate
            ? new Date(initialData.determinations.entryDate * 1000).getTime()
            : 0
        );
        setDeterEntryDate(
          initialData.determinations?.entryDate
            ? initialData.determinations?.entryDate
            : timestamp
        );
        setDeterEventDate(
          initialData.determinations?.documentDate
            ? new Date(initialData.determinations.documentDate * 1000).getTime()
            : 0
        );
        setDeterFromDate(
          initialData.determinations?.fromDate
            ? new Date(initialData.determinations.fromDate * 1000).getTime()
            : 0
        );
        if (initialData.participants && initialData.participants.length > 0) {
          setTableUsers(initialData.participants);
        }
        if (initialData.determinations?.files[0] !== null) {
          setListPicture(
            initialData.determinations?.files[0]
              ? initialData.determinations.files[0]
              : undefined
          );
        }
        setDocumentNumber(initialData.determinations?.internalNumber || "");
      } else {
        resetForm();
      }
    };
    loadUsers();
    getListUnits();
    setSelectedKey(null);
    setSelectedKeyUnit(null);
    setShowPDF(false);
    handleShowPDF(false);
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [initialData, mode, numberActivity, handleShowPDF]);

  useEffect(() => {
    setTimeout(() => {
      setFormNotification((prev) => ({ ...prev, isOpen: false }));
    }, 200);
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
            <div
              className={`grid grid-cols-5 mb-2 ${showPDF ? "gap-3" : "gap-6"}`}
            >
              <div className="flex flex-col gap-[2px]">
                <span className="font-medium text-neutral-600">
                  Số văn bản <span className="text-red-500">(*)</span>
                </span>
                <Input
                  value={deterNumber}
                  onChange={(e) => setDeterNumber(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-[2px]">
                <span className="font-medium text-neutral-600">
                  Ngày lập <span className="text-red-500">(*)</span>
                </span>
                <ConfigProvider locale={locale}>
                  <DatePicker
                    allowClear={false}
                    placeholder="dd/mm/yyyy"
                    format={"DD/MM/YYYY"}
                    value={deterFromDate ? moment(deterFromDate) : null}
                    onChange={(date) => {
                      if (date) {
                        const timestamp = date.valueOf();
                        setDeterFromDate(timestamp);
                      } else {
                        setDeterFromDate(0);
                      }
                    }}
                  />
                </ConfigProvider>
              </div>
              <div className="flex flex-col gap-[2px]">
                <span className="font-medium text-neutral-600">
                  Ngày hoạt động
                </span>
                <ConfigProvider locale={locale}>
                  <DatePicker
                    allowClear={false}
                    placeholder="dd/mm/yyyy"
                    format={"DD/MM/YYYY"}
                    value={deterEventDate ? moment(deterEventDate) : null}
                    onChange={(date) => {
                      if (date) {
                        const timestamp = date.valueOf();
                        setDeterEventDate(timestamp);
                      } else {
                        setDeterEventDate(0);
                      }
                    }}
                  />
                </ConfigProvider>
              </div>
              <div className="flex flex-col gap-[2px]">
                <span className="font-medium text-neutral-600">
                  Số lưu văn bản
                </span>
                <Input
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-[2px]">
                <span className="font-medium text-neutral-600">Ngày nhập</span>
                <ConfigProvider locale={locale}>
                  <DatePicker
                    disabled
                    placeholder="dd/mm/yyyy"
                    format={"DD/MM/YYYY"}
                    value={
                      deterEntryDate
                        ? dayjs.unix(deterEntryDate).tz("Asia/Ho_Chi_Minh")
                        : 0
                    }
                  />
                </ConfigProvider>
              </div>
            </div>
            <div className="flex flex-col gap-[2px] mb-2">
              <span className="font-medium text-neutral-600">
                Tên hoạt động <span className="text-red-500">(*)</span>
              </span>
              <TextArea
                autoSize
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-6 gap-6 mb-2">
              <div className="col-span-3 flex flex-col gap-[2px]">
                <span className="font-medium text-neutral-600">Đơn vị</span>
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
                  options={filteredUnitsHRM.map((unit: UnitItem, index) => ({
                    value: unit.idHrm,
                    label: unit.name,
                    key: `${unit.idHrm}-${index}`,
                  }))}
                  value={selectedKeyUnit}
                  onChange={(value) => {
                    setSelectedKeyUnit(value);
                    getAllUsersFromHRM(value);
                  }}
                />
              </div>
              <div className="col-span-3 flex flex-col gap-[2px]">
                <span className="font-medium text-neutral-600">
                  Tìm mã CB-GV-NV
                </span>
                <Select
                  showSearch
                  disabled={
                    isBlock ||
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
                  options={filteredUsersFromHRM?.items?.map((user) => ({
                    value: user.id,
                    label: `${user.fullName} - ${user.userName}`,
                  }))}
                  value={selectedKey}
                  onChange={(value) => {
                    setSelectedKey(value);
                    onAddUsers(value, standardValues);
                  }}
                />
              </div>
            </div>
            {tableUsers && tableUsers.length > 0 && (
              <>
                <div className="flex flex-col gap-[2px] mb-2">
                  <span className="font-medium text-neutral-600">
                    Danh sách nhân sự tham gia
                  </span>
                  <Table<ActivityInput>
                    bordered
                    rowKey={(item) => item.id}
                    rowHoverable
                    rowClassName={() => "editable-row"}
                    pagination={false}
                    size="small"
                    columns={columns}
                    dataSource={tableUsers}
                    className="custom-table-header shadow-md rounded-md"
                  />
                </div>
              </>
            )}
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
export default FormBM05;
