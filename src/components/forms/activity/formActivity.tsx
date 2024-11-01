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
  CloseOutlined,
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
  Tag,
  Tooltip,
} from "antd";
import moment from "moment";
import { FC, FormEvent, Key, useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import locale from "antd/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");
interface FormActivityProps {
  onSubmit: (formData: Partial<AddUpdateActivityItem>) => void;
  handleShowPDF: (isVisible: boolean) => void;
  initialData?: Partial<AddUpdateActivityItem>;
  mode: "add" | "edit";
  numberActivity?: number;
}

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

const FormActivity: FC<FormActivityProps> = ({
  onSubmit,
  handleShowPDF,
  initialData,
  mode,
  numberActivity,
}) => {
  const { TextArea } = Input;
  const [documentNumber, setDocumentNumber] = useState<string>("");
  const [name, setName] = useState("");
  const [deterNumber, setDeterNumber] = useState("");
  const [deterFromDate, setDeterFromDate] = useState<number | 0>(0);
  const [deterEventDate, setDeterEventDate] = useState<number | 0>(0);
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
  const [scale, setScale] = useState<number>(1.0);
  const [showPDF, setShowPDF] = useState<boolean>(false);

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
                color="danger"
                variant="text"
                onClick={() => onRemoveUsers(id)}
              >
                {/* <span
                  className="text-center cursor-pointer text-red-500"
                  onClick={() => onRemoveUsers(id)}
                >
                </span> */}
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
        eventDate: deterEventDate / 1000,
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
    handleShowPDF(showPDF);
  }, [showPDF]);

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
        setDeterEventDate(
          initialData.determinations?.eventDate
            ? new Date(initialData.determinations.eventDate * 1000).getTime()
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
        setDeterEventDate(0);
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
    setShowPDF(false);
  }, [initialData, mode, numberActivity]);

  return (
    <div
      className={`grid ${showPDF ? "grid-cols-2 gap-4" : "grid-cols-1"} mb-2`}
    >
      <form onSubmit={handleSubmit}>
        <hr className="mt-1 mb-2" />
        <div className={`grid grid-cols-5 mb-2 ${showPDF ? "gap-3" : "gap-6"}`}>
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
            <span className="font-medium text-neutral-600">Ngày hoạt động</span>
            <ConfigProvider locale={locale}>
              <DatePicker
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
            <span className="font-medium text-neutral-600">Số lưu văn bản</span>
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
                value={deterEntryDate ? moment(deterEntryDate) : null}
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
          <div className="col-span-3 flex flex-col gap-[2px]">
            <span className="font-medium text-neutral-600">
              Tìm mã CB-GV-NV
            </span>
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
        <div className="flex flex-col gap-[2px]">
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
                {listPicture &&
                  listPicture.map((item) => (
                    <>
                      <div className="flex flex-col items-center gap-1 py-2">
                        <div className="grid grid-cols-3 gap-2">
                          <img
                            src={
                              item.type === "image/jpeg" ||
                              item.type === "image/png"
                                ? "https://api-annual.uef.edu.vn/" +
                                  listPicture[0].path
                                : "/file-pdf.svg"
                            }
                            width={50}
                            loading="lazy"
                            alt="file-preview"
                          />
                          <div className="col-span-2 text-center content-center">
                            <span className="text-sm">
                              {listPicture[0].name}
                            </span>
                            <span className="text-sm flex">
                              ({(item.size / (1024 * 1024)).toFixed(2)} MB -
                              <span
                                className="text-sm ms-1 cursor-pointer text-blue-500 hover:text-blue-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowPDF(!showPDF);
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
      {showPDF === true && (
        <div>
          <hr className="mt-1 mb-2" />
          {pathPDF && pathPDF !== "" && (
            <>
              <div className="grid grid-cols-2 mb-[3px]">
                <span className="font-medium text-neutral-600">
                  Chế độ xem chi tiết
                </span>
                <div className="flex justify-end items-center">
                  <Tag
                    icon={<ZoomInOutlined />}
                    color="processing"
                    className="cursor-pointer"
                    onClick={() => setScale((prevScale) => prevScale + 0.1)}
                  >
                    Phóng to
                  </Tag>
                  <Tag
                    icon={<ZoomOutOutlined />}
                    color="processing"
                    className="cursor-pointer"
                    onClick={() =>
                      setScale((prevScale) => Math.max(prevScale - 0.1, 0.1))
                    }
                  >
                    Thu nhỏ
                  </Tag>
                  <Tag
                    icon={<CloseOutlined />}
                    color="error"
                    className="cursor-pointer"
                    onClick={() => setShowPDF(!showPDF)}
                  >
                    Đóng
                  </Tag>
                </div>
              </div>
              <div
                className="flex flex-col overflow-x-auto overflow-y-auto rounded-md shadow-md"
                style={{
                  maxHeight: "78vh",
                }}
                // style={{
                //   maxHeight: `${
                //     (document.querySelector("form")?.getBoundingClientRect()
                //       .height ?? 0) >
                //     0.72 * window.innerHeight
                //       ? "80vh"
                //       : "72vh"
                //   }`,
                // }}
              >
                <Document
                  file={`https://api-annual.uef.edu.vn/${pathPDF}`}
                  onLoadSuccess={onDocumentLoadSuccess}
                  loading={
                    <div className="flex justify-center items-center h-full">
                      <span>Đang tải...</span>
                    </div>
                  }
                  error={
                    <div
                      className="flex flex-col items-center justify-center"
                      style={{
                        maxHeight: `calc(100vh - ${
                          document
                            .querySelector("form")
                            ?.getBoundingClientRect().top
                        }px - 42px)`,
                      }}
                    >
                      <img
                        src="/review.svg"
                        width={"100px"}
                        alt="review"
                        className="mb-4"
                      />
                      <span>Không tìm thấy tệp tin phù hợp</span>
                    </div>
                  }
                >
                  {Array.from(new Array(numPages), (_, index) => (
                    <Page
                      key={`page_${index + 1}`}
                      pageNumber={index + 1}
                      scale={scale}
                    />
                  ))}
                </Document>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
export default FormActivity;
