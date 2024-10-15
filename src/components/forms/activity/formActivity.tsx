"use client";

import {
  ActivityInput,
  AddUpdateActivityItem,
} from "@/services/forms/formsServices";
import {
  getListUnitsFromHrm,
  UnitHRMItem,
} from "@/services/units/unitsServices";
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
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";
import {
  Button,
  ConfigProvider,
  DatePicker,
  Input,
  InputNumber,
  Select,
  Table,
  TableColumnsType,
  Tooltip,
} from "antd";
import moment from "moment";
import Link from "next/link";
import { FC, FormEvent, Key, useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { pdfjs } from "react-pdf";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import locale from "antd/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");
interface FormActivityProps {
  onSubmit: (formData: Partial<AddUpdateActivityItem>) => void;
  initialData?: Partial<AddUpdateActivityItem>;
  mode: "add" | "edit";
  numberActivity?: number;
}

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

const FormActivity: FC<FormActivityProps> = ({
  onSubmit,
  initialData,
  mode,
  numberActivity,
}) => {
  const { TextArea } = Input;
  const [documentNumber, setDocumentNumber] = useState<string>("");
  const [name, setName] = useState("");
  const [deterNumber, setDeterNumber] = useState("");
  const [deterFromDate, setDeterFromDate] = useState<number | 0>(0);
  const [deterEntryDate, setDeterEntryDate] = useState<number | 0>(0);
  const [description, setDescription] = useState("");
  const [filteredUsersFromHRM, setFilteredUsersFromHRM] =
    useState<UsersFromHRMResponse | null>(null);
  const [filteredUnitsHRM, setFilteredUnitsHRM] = useState<UnitHRMItem[]>([]);
  const [tableUsers, setTableUsers] = useState<ActivityInput[]>([]);
  const [selectedKey, setSelectedKey] = useState<Key | null>(null);
  const [selectedKeyUnit, setSelectedKeyUnit] = useState<Key | null>(null);
  const [standardValues, setStandardValues] = useState<number | 0>(0);
  const [listPicture, setListPicture] = useState<FileItem[]>([]);
  const [isUploaded, setIsUploaded] = useState<boolean>(false);
  const [pathPDF, setPathPDF] = useState<string>("");
  const [numPages, setNumPages] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }
  const getAllUnitsFromHRM = async () => {
    const response = await getListUnitsFromHrm();
    setFilteredUnitsHRM(response.model);
  };

  const getAllUsersFromHRM = async (id: Key) => {
    const response = await getUsersFromHRMbyId(id.toString());
    setFilteredUsersFromHRM(response);
  };

  const onAddUsers = (key: Key | null, standard: number | 0) => {
    const itemUser =
      filteredUsersFromHRM?.items?.find((user) => user.id === key) ?? null;
    if (itemUser) {
      // itemUser.standardNumber = standard;
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
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      render: (_, __, index) => <p>{index + 1}</p>,
      className: "text-center w-[20px]",
    },
    {
      title: "MÃ SỐ CB-GV-NV",
      dataIndex: "userName",
      key: "userName",
      render: (userName: string) => <p>{userName}</p>,
    },
    {
      title: "HỌ VÀ TÊN",
      dataIndex: "fullName",
      key: "fullName",
      render: (fullName: string) => <p>{fullName}</p>,
    },
    {
      title: "ĐƠN VỊ",
      dataIndex: "unitName",
      key: "unitName",
      render: (unitName: string) => <p>{unitName}</p>,
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
          style={{ width: "100%" }}
        />
      ),
      className: "w-32 text-center",
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
      className: "w-30",
    },
    {
      title: "",
      dataIndex: "id",
      key: "id",
      render: (id: string) => {
        return (
          <div>
            <Tooltip placement="right" title="Xóa dữ liệu" arrow={true}>
              <Button color="danger" variant="text">
                <p
                  className="text-center cursor-pointer text-red-500"
                  onClick={() => onRemoveUsers(id)}
                >
                  <CloseCircleOutlined />
                </p>
              </Button>
            </Tooltip>
          </div>
        );
      },
      className: "w-[10px]",
    },
  ];
  const handleDeletePicture = async () => {
    if (listPicture[0].path !== "") {
      await deleteFiles(
        listPicture[0].path.replace("https://api-annual.uef.edu.vn/", "")
        // listPicture[0].path.replace("http://192.168.98.60:8081/", "")
      );
      // Cập nhật lại trạng thái sau khi xóa
      setIsUploaded(false);
      setListPicture([{ type: "", path: "", name: "", size: 0 }]);
      setPathPDF("");
    } else {
      console.log("Không có file nào để xóa.");
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const formData = new FormData();
    formData.append("file", acceptedFiles[0]);
    // console.log("acceptedFiles[0] :>> ", acceptedFiles[0]);
    if (listPicture[0]?.path !== "") {
      await deleteFiles(
        listPicture[0]?.path.replace("https://api-annual.uef.edu.vn/", "")
        // listPicture[0]?.path.replace("http://192.168.98.60:8081/", "")
      );
      setPathPDF("");
    }
    const results = await postFiles(formData);
    // console.log("results :>> ", results);
    if (results.length > 0) {
      setIsUploaded(true);
      setListPicture(results);
      setPathPDF(results[0].path);
    }
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData: Partial<AddUpdateActivityItem> = {
      id: initialData?.id || "",
      name: name,
      determinations: {
        number: deterNumber,
        fromDate: deterFromDate / 1000,
        entryDate: deterEntryDate / 1000,
        file: {
          type: listPicture[0]?.type ?? "",
          path: listPicture[0]?.path ?? "",
          name: listPicture[0]?.name ?? "",
          size: listPicture[0]?.size ?? 0,
        },
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
      documentNumber: documentNumber,
    };
    onSubmit(formData);
  };

  useEffect(() => {
    getAllUnitsFromHRM();
  }, []);

  useEffect(() => {
    const loadUsers = async () => {
      if (mode === "edit" && initialData !== undefined) {
        setName(initialData.name || "");
        setDeterNumber(initialData.determinations?.number || "");
        setDeterEntryDate(
          initialData.determinations?.entryDate
            ? new Date(initialData.determinations.entryDate * 1000).getTime()
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
        if (initialData.determinations?.file !== null) {
          setListPicture(
            initialData.determinations?.file
              ? [initialData.determinations.file]
              : []
          );
          setIsUploaded(true);
        }
        if (initialData.determinations?.file.type === "") setIsUploaded(false);
        setPathPDF(initialData.determinations?.file.path || "");
        setDocumentNumber(initialData.documentNumber || "");
      } else {
        const formattedDate = moment(new Date()).format("DD/MM/YYYY");
        const timestamp = moment(formattedDate, "DD/MM/YYYY").valueOf();
        setDeterEntryDate(timestamp);
        setName("");
        setDeterNumber("");
        setDeterFromDate(0);
        setTableUsers([]);
        setListPicture([]);
        setIsUploaded(false);
        setDescription("");
        setPathPDF("");
        setDocumentNumber("");
      }
    };
    loadUsers();
    setSelectedKey(null);
    setSelectedKeyUnit(null);
  }, [initialData, mode, numberActivity]);

  return (
    <div className="grid grid-cols-2 gap-6 mb-4">
      <form onSubmit={handleSubmit}>
        <hr className="mt-1 mb-3" />
        <div className="grid grid-cols-2 gap-6 mb-4">
          <div className="flex flex-col gap-1">
            <p className="font-medium text-neutral-600">
              Số Tờ trình/Kế hoạch/Quyết định{" "}
              <span className="text-red-500">(*)</span>
            </p>
            <Input
              value={deterNumber}
              onChange={(e) => setDeterNumber(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-1">
              <p className="font-medium text-neutral-600">
                Ngày lập <span className="text-red-500">(*)</span>
              </p>
              <ConfigProvider locale={locale}>
                <DatePicker
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
            <div className="flex flex-col gap-1">
              <p className="font-medium text-neutral-600">Số VBHC</p>
              <Input
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1 mb-4">
          <p className="font-medium text-neutral-600">
            Tên hoạt động đã thực hiện <span className="text-red-500">(*)</span>
          </p>
          <TextArea
            autoSize
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-6 gap-6 mb-4">
          <div className="col-span-3 flex flex-col gap-1">
            <p className="font-medium text-neutral-600">Đơn vị</p>
            <Select
              showSearch
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={filteredUnitsHRM.map((unit) => ({
                value: unit.id,
                label: unit.name,
              }))}
              value={selectedKeyUnit}
              onChange={(value) => {
                setSelectedKeyUnit(value);
                getAllUsersFromHRM(value);
              }}
            />
          </div>
          <div className="col-span-3 flex flex-col gap-1">
            <p className="font-medium text-neutral-600">Tìm mã CB-GV-NV</p>
            <Select
              showSearch
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

        {/* <div className="flex flex-col gap-1 mb-4">
        <p className="font-medium text-neutral-600">Ghi chú</p>
        <TextArea
          autoSize
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div> */}
        {tableUsers && tableUsers.length > 0 && (
          <>
            <div className="flex flex-col gap-1 mb-4">
              <p className="font-medium text-neutral-600">
                Danh sách nhân sự tham gia
              </p>
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
        <div className="flex flex-col gap-1">
          <p className="font-medium text-neutral-600">Minh chứng</p>
          <div
            {...getRootProps()}
            className="w-full min-h-20 h-fit border-2 border-dashed border-neutral-300 cursor-pointer flex justify-center items-center gap-3 rounded-xl"
          >
            <input {...getInputProps()} />
            {!isUploaded ? (
              <>
                <img
                  src="/upload.svg"
                  width={40}
                  height={40}
                  loading="lazy"
                  alt="upload"
                />
                <p className="text-sm">
                  Kéo và thả một tập tin vào đây hoặc nhấp để chọn một tập tin
                </p>
              </>
            ) : (
              <>
                {listPicture &&
                  listPicture.map((item) => (
                    <>
                      <div className="flex flex-col items-center gap-2 py-3">
                        <div className="grid grid-cols-3 gap-2">
                          <img
                            src={
                              item.type === "image/jpeg" ||
                              item.type === "image/png"
                                ? "https://api-annual.uef.edu.vn/" +
                                  listPicture[0].path
                                : "/file-pdf.svg"
                            }
                            width={60}
                            height={60}
                            loading="lazy"
                            alt="file-preview"
                          />
                          <div className="col-span-2 text-center content-center">
                            <p className="text-sm">{listPicture[0].name}</p>
                            <p className="text-sm flex">
                              ({(item.size / (1024 * 1024)).toFixed(2)} MB -
                              <Link
                                href={`${
                                  "https://api-annual.uef.edu.vn/" +
                                  listPicture[0].path
                                }`}
                                target="__blank"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <p className="text-sm ms-1">xem chi tiết</p>
                              </Link>
                              )
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-3 items-center mt-2">
                          <Button
                            danger
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
                            icon={<CloudUploadOutlined />}
                            onClick={() => {
                              const input = document.createElement("input");
                              input.type = "file";
                              input.onchange = (event) => {
                                const files = (event.target as HTMLInputElement)
                                  .files;
                                if (files && files.length > 0) {
                                  onDrop(Array.from(files));
                                }
                              };
                              input.click();
                            }}
                          >
                            Chọn tệp thay thế
                          </Button>
                        </div>
                      </div>
                    </>
                  ))}
              </>
            )}
          </div>
        </div>
      </form>
      <div
        className="flex flex-col overflow-x-auto overflow-y-auto rounded-md shadow-md"
        style={{
          maxHeight: document.querySelector("form")?.clientHeight || "auto",
        }}
      >
        {pathPDF && pathPDF !== "" ? (
          <>
            <Document
              file={`https://api-annual.uef.edu.vn/${pathPDF}`}
              onLoadSuccess={onDocumentLoadSuccess}
              className={"h-fit"}
            >
              {Array.from(new Array(numPages), (_, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  scale={scale}
                />
              ))}
              <div className="absolute top-14 right-11 z-10 flex flex-col justify-end gap-2 p-2">
                <Tooltip title="Phóng to" placement="left">
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<ZoomInOutlined />}
                    onClick={() => setScale((prevScale) => prevScale + 0.1)}
                  />
                </Tooltip>
                <Tooltip title="Thu nhỏ" placement="left">
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<ZoomOutOutlined />}
                    onClick={() =>
                      setScale((prevScale) => Math.max(prevScale - 0.1, 0.1))
                    }
                  />
                </Tooltip>
              </div>
            </Document>
          </>
        ) : (
          <>
            <div
              className="h-full flex flex-col items-center justify-center"
            >
              <img
                src="/review.svg"
                width={"100px"}
                alt="review"
                className="mb-4"
              />
              <p>Không tìm thấy tệp tin phù hợp</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default FormActivity;
