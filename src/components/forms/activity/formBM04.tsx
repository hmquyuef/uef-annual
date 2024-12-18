"use client";

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
import {
  CloudUploadOutlined,
  MinusCircleOutlined
} from "@ant-design/icons";
import {
  Button,
  ConfigProvider,
  DatePicker,
  Input,
  InputNumber,
  Select
} from "antd";
import locale from "antd/locale/vi_VN";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import moment from "moment";
import { FC, FormEvent, Key, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import InfoApproved from "./infoApproved";
import InfoPDF from "./infoPDF";
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

const FormBM04: FC<FormBM04Props> = ({
  onSubmit,
  initialData,
  handleShowPDF,
  mode,
  isBlock,
  isPayment,
  displayRole,
}) => {
  const { TextArea } = Input;
  const [units, setUnits] = useState<UnitItem[]>([]);
  const [defaultUnits, setDefaultUnits] = useState<UnitItem[]>([]);
  const [users, setUsers] = useState<UsersFromHRMResponse | undefined>(
    undefined
  );
  const [defaultUsers, setDefaultUsers] = useState<UsersFromHRM[]>([]);
  const [selectedKey, setSelectedKey] = useState<Key | null>(null);
  const [standardValues, setStandardValues] = useState<number>(0);
  const [contents, setContents] = useState<string>("");
  const [totalStudent, setTotalStudent] = useState<number | 0>(0);
  const [fromDate, setFromDate] = useState<number>(0);
  const [toDate, setToDate] = useState<number>(0);
  const [entryDate, setEntryDate] = useState<number>(0);
  const [documentDate, setDocumentDate] = useState<number>(0);
  const [proof, setProof] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [listPicture, setListPicture] = useState<FileItem | undefined>(
    undefined
  );
  const [isUploaded, setIsUploaded] = useState<boolean>(false);
  const [pathPDF, setPathPDF] = useState<string>("");
  const [showPDF, setShowPDF] = useState<boolean>(false);

  const getListUnits = async () => {
    const response = await getAllUnits("true");
    setUnits(response.items);
  };

  const getUsersFromHRMByUnitId = async (unitId: string) => {
    const response = await getUsersFromHRMbyId(unitId);
    setUsers(response);
  };

  const handleDeletePicture = async () => {
    if (listPicture && listPicture.path !== "") {
      await deleteFiles(
        listPicture.path.replace("https://api-annual.uef.edu.vn/", "")
        // listPicture[0].path.replace("http://192.168.98.60:8081/", "")
      );
      // Cập nhật lại trạng thái sau khi xóa
      setIsUploaded(false);
      setListPicture({ type: "", path: "", name: "", size: 0 });
      setPathPDF("");
    } else {
      console.log("Không có file nào để xóa.");
    }
  };

  const onDrop = useMemo(
    () => async (acceptedFiles: File[]) => {
      const formData = new FormData();
      formData.append("FunctionName", "qae");
      formData.append("file", acceptedFiles[0]);

      if (listPicture && listPicture.path !== "") {
        await deleteFiles(
          listPicture.path.replace("https://api-annual.uef.edu.vn/", "")
        );
        setPathPDF("");
      }
      const results = await postFiles(formData);
      if (results && results !== undefined) {
        setIsUploaded(true);
        setListPicture(results);
        setPathPDF(results.path);
      }
    },
    [listPicture]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
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
      contents: contents,
      totalStudent: totalStudent,
      standardNumber: standardValues,
      fromDate: fromDate,
      toDate: toDate,
      entryDate: entryDate / 1000,
      documentDate: documentDate,
      attackment: {
        type: listPicture?.type ?? "",
        path: listPicture?.path ?? "",
        name: listPicture?.name ?? "",
        size: listPicture?.size ?? 0,
      },
      proof: proof,
      note: description,
    };
    onSubmit(formData);
  };

  useEffect(() => {
    const resetForm = () => {
      const formattedDate = moment(new Date()).format("DD/MM/YYYY");
      const timestamp = moment(formattedDate, "DD/MM/YYYY").valueOf();
      setEntryDate(timestamp);
      setDefaultUnits([]);
      setDefaultUsers([]);
      setContents("");
      setTotalStudent(0);
      setStandardValues(0);
      setFromDate(0);
      setToDate(0);
      setDocumentDate(0);
      setListPicture(undefined);
      setIsUploaded(false);
      setPathPDF("");
      setProof("");
      setDescription("");
    };
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
        setContents(initialData.contents || "");
        setTotalStudent(initialData.totalStudent || 0);
        setFromDate(initialData.fromDate || 0);
        setToDate(initialData.toDate || 0);
        setEntryDate((initialData.entryDate ?? 0) * 1000);
        setDocumentDate(initialData.documentDate || 0);
        setStandardValues(initialData.standardNumber || 0);
        if (
          initialData.attackment &&
          initialData.attackment !== undefined &&
          initialData.attackment.path !== ""
        ) {
          setListPicture(initialData.attackment);
          setIsUploaded(true);
          setPathPDF(initialData.attackment.path || "");
        } else {
          setListPicture(undefined);
          setIsUploaded(false);
          setPathPDF("");
        }
        setProof(initialData.proof || "");
        setDescription(initialData.note || "");
      } else {
        resetForm();
      }
    };
    getListUnits();
    loadUsers();
    setShowPDF(false);
    handleShowPDF(false);
  }, [initialData, mode, handleShowPDF]);
  return (
    <div
      className={`grid ${showPDF ? "grid-cols-2 gap-4" : "grid-cols-1"} mb-2`}
    >
      <form onSubmit={handleSubmit}>
        <hr className="mt-1 mb-3" />
        <div className="grid grid-cols-5 gap-6 mb-4">
          <div className="flex flex-col gap-1">
            <p className="font-medium text-neutral-600">
              Số văn bản <span className="text-red-500">(*)</span>
            </p>
            <TextArea
              autoSize
              value={proof}
              onChange={(e) => setProof(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-medium text-neutral-600">
              Ngày lập <span className="text-red-500">(*)</span>
            </p>
            <ConfigProvider locale={locale}>
              <DatePicker
                allowClear={false}
                placeholder="dd/mm/yyyy"
                format="DD/MM/YYYY"
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
            <p className="font-medium text-neutral-600">Ngày nhập</p>
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
              value={defaultUnits.length > 0 ? defaultUnits[0].name : undefined}
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
          <p className="font-medium text-neutral-600">Nội dung</p>
          <TextArea
            autoSize
            value={contents}
            onChange={(e) => setContents(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-6 mb-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-1">
              <p className="font-medium text-neutral-600">Số lượng SV</p>
              <InputNumber
                min={0}
                defaultValue={0}
                value={totalStudent}
                onChange={(value) => setTotalStudent(value ?? 0)}
                style={{ width: "100%" }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-medium text-neutral-600">Số tiết chuẩn</p>
              <InputNumber
                min={0}
                defaultValue={1}
                value={standardValues}
                onChange={(value) => setStandardValues(value ?? 0)}
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
            className="w-full min-h-20 h-fit border-2 border-dashed border-neutral-300 cursor-pointer flex justify-center items-center gap-3 rounded-xl"
          >
            <input {...getInputProps()} />
            {!isUploaded ? (
              <>
                <img src="/upload.svg" width={50} loading="lazy" alt="upload" />
                <span className="text-sm">
                  Kéo và thả một tập tin vào đây hoặc nhấp để chọn một tập tin
                </span>
              </>
            ) : (
              <>
                {listPicture && (
                  <>
                    <div className="flex flex-col items-center gap-1 py-2">
                      <div className="grid grid-cols-3 gap-2">
                        <img
                          src={
                            listPicture.type === "image/jpeg" ||
                            listPicture.type === "image/png"
                              ? "https://api-annual.uef.edu.vn/" +
                                listPicture.path
                              : "/file-pdf.svg"
                          }
                          width={50}
                          loading="lazy"
                          alt="file-preview"
                        />
                        <div className="col-span-2 text-center content-center">
                          <span className="text-sm">{listPicture.name}</span>
                          <span className="text-sm flex">
                            ({(listPicture.size / (1024 * 1024)).toFixed(2)} MB
                            -
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
                          disabled={isBlock || displayRole.isUpload === false}
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
                          disabled={isBlock || displayRole.isUpload === false}
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
          <p className="font-medium text-neutral-600">Ghi chú</p>
          <TextArea
            autoSize
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <InfoApproved mode={mode} isPayment={isPayment} />
      </form>
      <InfoPDF
        path={pathPDF}
        isShowPDF={showPDF}
        onSetShowPDF={(value) => {
          setShowPDF(value);
          handleShowPDF(value);
        }}
      />
    </div>
  );
};
export default FormBM04;
