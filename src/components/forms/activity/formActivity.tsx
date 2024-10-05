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
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
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
import { FormEvent, Key, useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

interface FormActivityProps {
  onSubmit: (formData: Partial<AddUpdateActivityItem>) => void;
  initialData?: Partial<AddUpdateActivityItem>;
  mode: "add" | "edit";
  numberActivity?: number;
}

const FormActivity: React.FC<FormActivityProps> = ({
  onSubmit,
  initialData,
  mode,
  numberActivity,
}) => {
  const selectedWorkloadType = "b46ee628-bfe3-4d27-a10b-9d0c47145613";
  const { TextArea } = Input;
  const [stt, setStt] = useState<number>(0);
  const [documentNumber, setDocumentNumber] = useState<string>("");
  const [name, setName] = useState("");
  const [deterNumber, setDeterNumber] = useState("");
  const [deterFromDate, setDeterFromDate] = useState<number | 0>(0);
  const [deterEntryDate, setDeterEntryDate] = useState<number | 0>(0);
  const [description, setDescription] = useState("");
  const [moTa, setMoTa] = useState("");
  const [filteredUsersFromHRM, setFilteredUsersFromHRM] =
    useState<UsersFromHRMResponse | null>(null);
  const [filteredUnitsHRM, setFilteredUnitsHRM] = useState<UnitHRMItem[]>([]);
  const [tableUsers, setTableUsers] = useState<ActivityInput[]>([]);
  const [selectedKey, setSelectedKey] = useState<Key | null>(null);
  const [standardValues, setStandardValues] = useState<number | 0>(0);
  const [listPicture, setListPicture] = useState<FileItem[]>([]);
  const [isUploaded, setIsUploaded] = useState<boolean>(false);

  const getAllUnitsFromHRM = async () => {
    const response = await getListUnitsFromHrm();
    setFilteredUnitsHRM(response.model);
  };

  const getAllUsersFromHRM = async (id: string) => {
    const response = await getUsersFromHRMbyId(id);
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
      title: "Mã số CB-GV-NV",
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
      className: "w-36 text-center",
    },
    {
      title: "SỐ TIẾT CHUẨN",
      dataIndex: "standardNumber",
      key: "standardNumber",
      render: (standardNumber: number) => <p>{standardNumber}</p>,
      className: "w-32 text-center",
    },
    {
      title: "SỰ KIỆN",
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
      className: "w-16",
    },
    {
      title: "GHI CHÚ",
      dataIndex: "description",
      key: "description",
      render: (description: string) => <p>{description}</p>,
      className: "w-30",
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
    }
    const results = await postFiles(formData);
    // console.log("results :>> ", results);
    if (results.length > 0) {
      setIsUploaded(true);
      setListPicture(results);
    }
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData: Partial<AddUpdateActivityItem> = {
      id: initialData?.id || "",
      stt: stt,
      name: name,
      workloadTypeId: selectedWorkloadType,
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
        setStt(initialData.stt || 0);
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
        setDocumentNumber(initialData.documentNumber || "");
      } else {
        setStt(Number(numberActivity) + 1);
        setName("");
        setDeterNumber("");
        setDeterEntryDate(0);
        setDeterFromDate(0);
        setTableUsers([]);
        setListPicture([]);
        setIsUploaded(false);
        setDescription("");
        setDocumentNumber("");
      }
    };
    loadUsers();
  }, [initialData, mode, numberActivity]);

  return (
    <form onSubmit={handleSubmit}>
      <hr className="mt-1 mb-3" />
      <div className="grid grid-cols-6 gap-5 mb-4">
        <div className="w-full flex flex-col gap-1">
          <p className="font-medium text-neutral-600">STT</p>
          <InputNumber
            min={0}
            defaultValue={1}
            value={stt}
            onChange={(value) => setStt(value ?? 0)}
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-span-4 flex flex-col gap-1">
          <p className="font-medium text-neutral-600">
            Số Tờ trình/Kế hoạch/Quyết định{" "}
            <span className="text-red-500">(*)</span>
          </p>
          <Input
            value={deterNumber}
            onChange={(e) => setDeterNumber(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-medium text-neutral-600">Ngày ký</p>
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
            onChange={(value) => {
              getAllUsersFromHRM(value);
            }}
          />
        </div>
        <div className="col-span-3 flex flex-col gap-1">
          <p className="font-medium text-neutral-600">Tìm mã CB-GV-NV</p>
          <Select
            showSearch
            optionFilterProp="label"
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
            }}
          />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-6 mb-4">
        <div className="flex flex-col gap-1">
          <p className="font-medium text-neutral-600">Ngày nhập</p>
          <DatePicker
            placeholder="dd/mm/yyyy"
            format={"DD/MM/YYYY"}
            value={deterEntryDate ? moment(deterEntryDate) : null}
            onChange={(date) => {
              if (date) {
                const timestamp = date.valueOf();
                setDeterEntryDate(timestamp);
              } else {
                setDeterEntryDate(0);
              }
            }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-medium text-neutral-600">Số VBHC</p>
          <Input
            value={documentNumber}
            onChange={(e) => setDocumentNumber(e.target.value)}
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
        <div className="flex flex-col justify-end">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            iconPosition="start"
            onClick={() => onAddUsers(selectedKey, standardValues)}
          >
            Thêm nhân viên
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 ">
        <div></div>
        <div className="flex flex-col gap-1 mb-4">
          <p className="font-medium text-neutral-600">
            Thêm ghi chú cho CB-GV-NV
          </p>
          <TextArea
            autoSize
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>
      {tableUsers && tableUsers.length > 0 && (
        <>
          <div className="flex flex-col gap-1 mb-4">
            <span>Danh sách nhân sự tham gia</span>
            <Table<ActivityInput>
              bordered
              rowKey={(item) => item.id}
              rowHoverable
              pagination={false}
              size="small"
              columns={columns}
              dataSource={tableUsers}
              className="custom-table-header shadow-md rounded-md"
            />
          </div>
        </>
      )}
      <div className="flex flex-col gap-1 mb-4">
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
  );
};
export default FormActivity;
