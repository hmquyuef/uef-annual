"use client";

import {
  handleExportAll,
  handleExportForBM,
} from "@/components/forms/exportExcel/ExportAllDetail";
import {
  DetailUserItem,
  getDataExportByUserName,
  Item,
} from "@/services/exports/exportDetailForUser";
import {
  getUsersFromHRM,
  UsersFromHRMResponse,
} from "@/services/users/usersServices";
import { convertTimestampToDate } from "@/utility/Utilities";
import {
  CheckOutlined,
  CloseOutlined,
  DownloadOutlined,
  FileProtectOutlined,
  FilterOutlined,
  HomeOutlined,
  ProfileOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Collapse,
  ConfigProvider,
  DatePicker,
  Divider,
  Dropdown,
  Empty,
  MenuProps,
  Select,
  Table,
  TableColumnsType,
  Tooltip,
} from "antd";
import { Key, useEffect, useState } from "react";
import PageTitles from "@/utility/Constraints";
import locale from "antd/locale/vi_VN";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import Link from "next/link";
dayjs.extend(utc);
dayjs.extend(timezone);

const { RangePicker } = DatePicker;
const SearchMembers = () => {
  const [selectedKey, setSelectedKey] = useState<Key | null>(null);
  const [usersHRM, setUsersHRM] = useState<UsersFromHRMResponse | undefined>(
    undefined
  );
  const [selectedUserName, setSelectedUserName] = useState("");
  const [year, setYear] = useState("2024");
  const [detailUser, setDetailUser] = useState<DetailUserItem | undefined>(
    undefined
  );
  const [dataClassLeaders, setDataClassLeaders] = useState<Item[]>([]);
  const [dataAssistants, setDataAssistants] = useState<Item[]>([]);
  const [dataQAEs, setDataQAEs] = useState<Item[]>([]);
  const [dataAdmissionCounseling, setDataAdmissionCounseling] = useState<
    Item[]
  >([]);
  const [dataActivities, setDataActivities] = useState<Item[]>([]);
  const [startDate, setStartDate] = useState<number | null>(null);
  const [endDate, setEndDate] = useState<number | null>(null);
  const getUsersHRM = async () => {
    const response = await getUsersFromHRM();
    setUsersHRM(response);
  };

  const handleSearch = async () => {
    const response = await getDataExportByUserName(
      selectedUserName,
      startDate,
      endDate
    );
    if (response) {
      setDetailUser(response);
      setDataClassLeaders(response.classLeaders.items);
      setDataAssistants(response.assistants.items);
      setDataQAEs(response.qAs.items);
      setDataAdmissionCounseling(response.admissionCounseling.items);
      setDataActivities(response.activities.items);
    }
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <p onClick={() => detailUser && handleExportAll(detailUser)}>Tất cả</p>
      ),
      icon: <FileProtectOutlined />,
      style: { color: "#1890ff" },
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: "Biểu mẫu",
      icon: <FilterOutlined />,
      children: [
        {
          key: "2-1",
          label: (
            <p
              onClick={() =>
                handleExportForBM(selectedUserName, startDate, endDate, "BM01")
              }
            >
              BM01 - Chủ nhiệm lớp
            </p>
          ),
        },
        {
          key: "2-2",
          label: (
            <p
              onClick={() =>
                handleExportForBM(selectedUserName, startDate, endDate, "BM02")
              }
            >
              BM02 - Cố vấn học tập, trợ giảng, phụ đạo
            </p>
          ),
        },
        {
          key: "2-3",
          label: (
            <p
              onClick={() =>
                handleExportForBM(selectedUserName, startDate, endDate, "BM03")
              }
            >
              BM03 - Tư vấn tuyển sinh
            </p>
          ),
        },
        {
          key: "2-4",
          label: (
            <p
              onClick={() =>
                handleExportForBM(selectedUserName, startDate, endDate, "BM04")
              }
            >
              BM04 - Tham gia hỏi vấn đáp Tiếng Anh
            </p>
          ),
        },
        {
          key: "2-5",
          label: (
            <p
              onClick={() =>
                handleExportForBM(selectedUserName, startDate, endDate, "BM05")
              }
            >
              BM05 - Các hoạt động khác được BGH phê duyệt
            </p>
          ),
        },
      ],
    },
  ];
  //render table InfoUser
  const columnsInfoUser: TableColumnsType<DetailUserItem> = [
    {
      title: <div className="p-2">STT</div>,
      dataIndex: "stt",
      key: "stt",
      render: (_, __, index) => <p>{index + 1}</p>,
      className: "text-center w-[50px]",
    },
    {
      title: "Mã SỐ CB-GV-NV",
      dataIndex: "userName",
      key: "userName",
      render: (userName: string) => <p>{userName}</p>,
      className: "text-center w-[200px]",
    },
    {
      title: "HỌ VÀ TÊN",
      dataIndex: "fullName",
      key: "fullName",
      render: (fullName: string) => <p>{fullName}</p>,
      className: "text-center w-[200px]",
    },
    {
      title: "EMAIL",
      dataIndex: "email",
      key: "email",
      render: (email: string) => <p>{email}</p>,
      className: "text-center w-[200px]",
    },
    {
      title: "ĐƠN VỊ",
      dataIndex: "unitName",
      key: "unitName",
      render: (unitName: string) => <p>{unitName}</p>,
      className: "text-center w-[100px]",
    },
    {
      title: "TỔNG SỐ SỰ KIỆN",
      dataIndex: "totalEvents",
      key: "totalEvents",
      className: "text-center w-[8rem]",
      render: (totalEvents: string, record: DetailUserItem) => {
        const total =
          record.classLeaders.totalItems +
          record.assistants.totalItems +
          record.qAs.totalItems +
          record.admissionCounseling.totalItems +
          record.activities.totalItems;
        return <strong>{total}</strong>;
      },
    },
    {
      title: "TỔNG SỐ TIẾT CHUẨN",
      dataIndex: "totalStandarNumber",
      key: "totalStandarNumber",
      className: "text-center w-[8rem]",
      render: (totalStandarNumber: string) => (
        <strong>{totalStandarNumber}</strong>
      ),
    },
    {
      title: "",
      dataIndex: "actions",
      key: "actions",
      className: "text-center w-[30px]",
      render: () => {
        return (
          <>
            <Tooltip
              placement="topRight"
              title={"Tải xuống dữ liệu"}
              arrow={true}
            >
              <Dropdown menu={{ items }} trigger={["click"]}>
                <a onClick={(e) => e.preventDefault()}>
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<DownloadOutlined />}
                    size={"small"}
                  />
                </a>
              </Dropdown>
            </Tooltip>
          </>
        );
      },
    },
  ];

  //render table Classleaders
  const columns: TableColumnsType<Item> = [
    {
      title: <div className="px-2 py-3">STT</div>,
      dataIndex: "stt",
      key: "stt",
      render: (_, __, index) => <p>{index + 1}</p>,
      className: "text-center w-[50px]",
    },
    {
      title: "TÊN HOẠT ĐỘNG",
      dataIndex: "activityName",
      key: "activityName",
      render: (activityName: string) => <p>{activityName}</p>,
      className: "w-[4/5]",
    },
    {
      title: "SỐ TIẾT CHUẨN",
      dataIndex: "standarNumber",
      key: "standarNumber",
      className: "text-center w-[100px]",
      render: (standarNumber: string) => <p>{standarNumber}</p>,
    },
    {
      title: "SỐ VĂN BẢN, NGÀY LẬP",
      dataIndex: "proof",
      key: "proof",
      render: (proof: string, record: Item) => {
        const fromDate = record.fromDate
          ? convertTimestampToDate(record.fromDate)
          : "";
        return (
          <div className="flex flex-col">
            <span className="font-medium">{proof}</span>
            <span className="text-[13px]">{fromDate}</span>
          </div>
        );
      },
      className: "text-center w-[100px]",
    },
    {
      title: "THỜI GIAN HOẠT ĐỘNG",
      dataIndex: "attendances",
      key: "attendances",
      render: (attendances: number) =>
        attendances ? convertTimestampToDate(attendances) : "",
      className: "text-center w-[80px]",
    },
    {
      title: "GHI CHÚ",
      dataIndex: "note",
      key: "note",
      render: (note: string) => <p>{note}</p>,
      className: "w-[200px]",
    },
  ];

  const columnsBM05: TableColumnsType<Item> = [
    {
      title: <div className="px-2 py-3">STT</div>,
      dataIndex: "stt",
      key: "stt",
      render: (_, __, index) => <>{index + 1}</>,
      className: "text-center w-[50px]",
    },
    {
      title: "TÊN HOẠT ĐỘNG",
      dataIndex: "activityName",
      key: "activityName",
      render: (activityName: string) => (
        <span className="text-blue-500 font-semibold">{activityName}</span>
      ),
      className: "w-[4/5]",
    },
    {
      title: "SỐ TIẾT CHUẨN",
      dataIndex: "standarNumber",
      key: "standarNumber",
      className: "text-center w-[70px]",
      render: (standarNumber: string) => <>{standarNumber}</>,
    },
    {
      title: (
        <div>
          SỐ VĂN BẢN <br /> NGÀY LẬP
        </div>
      ),
      dataIndex: "proof",
      key: "proof",
      render: (proof: string, record: Item) => {
        const documentDate = record.documentDate
          ? convertTimestampToDate(record.documentDate)
          : "";
        return (
          <div className="flex flex-col">
            <span className="font-medium">{proof}</span>
            <span className="text-[13px]">{documentDate}</span>
          </div>
        );
      },
      className: "text-center w-[160px]",
    },
    {
      title: "THỜI GIAN HOẠT ĐỘNG",
      dataIndex: "fromDate",
      key: "fromDate",
      render: (fromDate: number) =>
        fromDate ? convertTimestampToDate(fromDate) : "",
      className: "text-center w-[80px]",
    },
    {
      title: (
        <div className="p-1">
          TÀI LIỆU <br /> ĐÍNH KÈM
        </div>
      ),
      dataIndex: ["file", "path"],
      key: "path",
      className: "text-center w-[80px]",
      render: (path: string) => {
        return path !== "" && path !== undefined ? (
          <>
            <Link
              href={"https://api-annual.uef.edu.vn/" + path}
              target="__blank"
            >
              <p className="text-green-500">
                <CheckOutlined />
              </p>
            </Link>
          </>
        ) : (
          <>
            <p className="text-red-400">
              <CloseOutlined />
            </p>
          </>
        );
      },
    },
    {
      title: "GHI CHÚ",
      dataIndex: "note",
      key: "note",
      render: (note: string) => <>{note}</>,
      className: "w-[200px]",
    },
  ];

  useEffect(() => {
    document.title = PageTitles.SEARCH;
    getUsersHRM();
  }, []);

  return (
    <div>
      <div className="mb-3">
        <Breadcrumb
          items={[
            {
              href: "",
              title: (
                <>
                  <HomeOutlined />
                  <span>Trang chủ</span>
                </>
              ),
            },
            {
              title: (
                <>
                  <ProfileOutlined />
                  <span>Tra cứu thông tin nhân sự</span>
                </>
              ),
            },
          ]}
        />
      </div>
      <div className="grid grid-cols-4 gap-6 mb-4">
        <div className="w-full flex flex-col gap-2">
          {/* <p className="font-medium text-neutral-500 text-sm">MÃ SỐ CB-GV-NV</p> */}
          <Select
            showSearch
            placeholder="Tìm kiếm CB-GV-NV"
            optionFilterProp="label"
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            options={usersHRM?.items?.map((user) => ({
              value: user.id,
              label: `${user.fullName} - ${user.userName}`,
            }))}
            value={selectedKey}
            onChange={(value) => {
              const temp = usersHRM?.items?.find((item) => item.id === value);
              setSelectedUserName(temp?.userName ?? "");
              setSelectedKey(value);
            }}
          />
        </div>
        <ConfigProvider locale={locale}>
          <RangePicker
            placeholder={["Từ ngày", "Đến ngày"]}
            format={"DD/MM/YYYY"}
            defaultValue={[
              dayjs(`01/09/${dayjs().year()}`, "DD/MM/YYYY"),
              dayjs(`31/08/${dayjs().year() + 1}`, "DD/MM/YYYY"),
            ]}
            onChange={(dates, dateStrings) => {
              const [startDate, endDate] = dateStrings;
              const startTimestamp = startDate
                ? new Date(startDate.split("/").reverse().join("-")).valueOf() /
                  1000
                : null;
              const endTimestamp = endDate
                ? new Date(endDate.split("/").reverse().join("-")).valueOf() /
                  1000
                : null;
              setStartDate(startTimestamp);
              setEndDate(endTimestamp);
            }}
          />
        </ConfigProvider>
        <div className="grid grid-cols-3 gap-6">
          <div className="flex items-end">
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleSearch}
              iconPosition="start"
            >
              Tìm kiếm
            </Button>
          </div>
        </div>
      </div>
      <div>
        {detailUser && (
          <>
            <div className="mt-6">
              <Divider
                orientation="left"
                className="uppercase"
                style={{ borderColor: "#1677FF", color: "#1677FF" }}
              >
                Thông tin nhân sự
              </Divider>
            </div>
            <div className="my-6">
              <Table<DetailUserItem>
                key={"table-detail-info-user"}
                className="custom-table-header shadow-md rounded-md"
                bordered
                rowKey={(item) => item.id}
                rowHoverable
                size="small"
                pagination={false}
                columns={columnsInfoUser}
                dataSource={[detailUser]}
                locale={{
                  emptyText: <Empty description="No Data"></Empty>,
                }}
              />
            </div>
            <div className="mt-6">
              <Divider
                orientation="left"
                className="uppercase"
                style={{ borderColor: "#1677FF", color: "#1677FF" }}
              >
                Danh sách các hoạt động
              </Divider>
            </div>
            {detailUser.classLeaders && (
              <>
                <div className="mb-4">
                  <Collapse
                    key={Math.random().toString(36).substr(2, 9)}
                    collapsible="header"
                    className="mb-4"
                    expandIconPosition="end"
                    items={[
                      {
                        key: "1",
                        label: (
                          <strong>
                            {String(
                              detailUser.classLeaders.shortName
                            ).toUpperCase()}{" "}
                            -{" "}
                            {String(detailUser.classLeaders.name).toUpperCase()}{" "}
                            ({detailUser.classLeaders.totalItems} SỰ KIỆN)
                          </strong>
                        ),
                        children: (
                          <>
                            <Table<Item>
                              key={"table-for-classLeaders"}
                              className="custom-table-header shadow-md rounded-md"
                              bordered
                              rowKey={Math.random().toString(36).substr(2, 9)}
                              rowHoverable
                              size="small"
                              pagination={false}
                              summary={(items) => {
                                let total = 0;
                                items.forEach((item) => {
                                  total += Number(item.standarNumber);
                                });
                                return (
                                  <Table.Summary.Row>
                                    <Table.Summary.Cell
                                      colSpan={2}
                                      index={0}
                                      className="text-end font-semibold"
                                    >
                                      TỔNG SỐ TIẾT CHUẨN
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell
                                      index={2}
                                      className="text-center font-semibold"
                                    >
                                      {total}
                                    </Table.Summary.Cell>
                                  </Table.Summary.Row>
                                );
                              }}
                              columns={columns}
                              dataSource={dataClassLeaders}
                              locale={{
                                emptyText: (
                                  <Empty description="No Data"></Empty>
                                ),
                              }}
                            />
                          </>
                        ),
                      },
                    ]}
                  />
                </div>
              </>
            )}
            {detailUser.assistants && (
              <>
                <div className="mb-4">
                  <Collapse
                    key={Math.random().toString(36).substr(2, 9)}
                    collapsible="header"
                    defaultActiveKey={["1"]}
                    className="mb-4"
                    expandIconPosition="end"
                    items={[
                      {
                        key: "2",
                        label: (
                          <strong>
                            {String(
                              detailUser.assistants.shortName
                            ).toUpperCase()}{" "}
                            - {String(detailUser.assistants.name).toUpperCase()}{" "}
                            ({detailUser.assistants.totalItems} SỰ KIỆN)
                          </strong>
                        ),
                        children: (
                          <>
                            <Table<Item>
                              key={"table-for-assistants"}
                              className="custom-table-header shadow-md rounded-md mb-4"
                              bordered
                              rowKey={Math.random().toString(36).substr(2, 9)}
                              rowHoverable
                              size="small"
                              pagination={false}
                              summary={(items) => {
                                let total = 0;
                                items.forEach((item) => {
                                  total += Number(item.standarNumber);
                                });
                                return (
                                  <Table.Summary.Row>
                                    <Table.Summary.Cell
                                      colSpan={2}
                                      index={0}
                                      className="text-end font-semibold"
                                    >
                                      TỔNG SỐ TIẾT CHUẨN
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell
                                      index={2}
                                      className="text-center font-semibold"
                                    >
                                      {total}
                                    </Table.Summary.Cell>
                                  </Table.Summary.Row>
                                );
                              }}
                              columns={columns}
                              dataSource={dataAssistants}
                              locale={{
                                emptyText: (
                                  <Empty description="No Data"></Empty>
                                ),
                              }}
                            />
                          </>
                        ),
                      },
                    ]}
                  />
                </div>
              </>
            )}
            {detailUser.admissionCounseling && (
              <>
                <div className="mb-4">
                  <Collapse
                    key={Math.random().toString(36).substr(2, 9)}
                    collapsible="header"
                    defaultActiveKey={["1"]}
                    className="mb-4"
                    expandIconPosition="end"
                    items={[
                      {
                        key: "2",
                        label: (
                          <strong>
                            {String(
                              detailUser.admissionCounseling.shortName
                            ).toUpperCase()}{" "}
                            -{" "}
                            {String(
                              detailUser.admissionCounseling.name
                            ).toUpperCase()}{" "}
                            ({detailUser.admissionCounseling.totalItems} SỰ
                            KIỆN)
                          </strong>
                        ),
                        children: (
                          <>
                            <Table<Item>
                              key={"table-for-assistants"}
                              className="custom-table-header shadow-md rounded-md mb-4"
                              bordered
                              rowKey={Math.random().toString(36).substr(2, 9)}
                              rowHoverable
                              size="small"
                              pagination={false}
                              summary={(items) => {
                                let total = 0;
                                items.forEach((item) => {
                                  total += Number(item.standarNumber);
                                });
                                return (
                                  <Table.Summary.Row>
                                    <Table.Summary.Cell
                                      colSpan={2}
                                      index={0}
                                      className="text-end font-semibold"
                                    >
                                      TỔNG SỐ TIẾT CHUẨN
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell
                                      index={2}
                                      className="text-center font-semibold"
                                    >
                                      {total}
                                    </Table.Summary.Cell>
                                  </Table.Summary.Row>
                                );
                              }}
                              columns={columns}
                              dataSource={dataAdmissionCounseling}
                              locale={{
                                emptyText: (
                                  <Empty description="No Data"></Empty>
                                ),
                              }}
                            />
                          </>
                        ),
                      },
                    ]}
                  />
                </div>
              </>
            )}
            {detailUser.qAs && (
              <>
                <div className="mb-4">
                  <Collapse
                    key={Math.random().toString(36).substr(2, 9)}
                    collapsible="header"
                    defaultActiveKey={["1"]}
                    className="mb-4"
                    expandIconPosition="end"
                    items={[
                      {
                        key: "3",
                        label: (
                          <strong>
                            {String(detailUser.qAs.shortName).toUpperCase()} -{" "}
                            {String(detailUser.qAs.name).toUpperCase()} (
                            {detailUser.qAs.totalItems} SỰ KIỆN)
                          </strong>
                        ),
                        children: (
                          <>
                            <Table<Item>
                              key={"table-for-QAES"}
                              className="custom-table-header shadow-md rounded-md mb-4"
                              bordered
                              rowKey={Math.random().toString(36).substr(2, 9)}
                              rowHoverable
                              size="small"
                              pagination={false}
                              summary={(items) => {
                                let total = 0;
                                items.forEach((item) => {
                                  total += Number(item.standarNumber);
                                });
                                return (
                                  <Table.Summary.Row>
                                    <Table.Summary.Cell
                                      colSpan={2}
                                      index={0}
                                      className="text-end font-semibold"
                                    >
                                      TỔNG SỐ TIẾT CHUẨN
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell
                                      index={2}
                                      className="text-center font-semibold"
                                    >
                                      {total}
                                    </Table.Summary.Cell>
                                  </Table.Summary.Row>
                                );
                              }}
                              columns={columns}
                              dataSource={dataQAEs}
                              locale={{
                                emptyText: (
                                  <Empty description="No Data"></Empty>
                                ),
                              }}
                            />
                          </>
                        ),
                      },
                    ]}
                  />
                </div>
              </>
            )}
            {detailUser.activities && (
              <>
                <div className="mb-4">
                  <Collapse
                    key={Math.random().toString(36).substr(2, 9)}
                    collapsible="header"
                    defaultActiveKey={["1"]}
                    className="mb-4"
                    expandIconPosition="end"
                    items={[
                      {
                        key: "5",
                        label: (
                          <strong>
                            {String(
                              detailUser.activities.shortName
                            ).toUpperCase()}{" "}
                            - {String(detailUser.activities.name).toUpperCase()}{" "}
                            ({detailUser.activities.totalItems} SỰ KIỆN)
                          </strong>
                        ),
                        children: (
                          <>
                            <Table<Item>
                              key={"table-for-activities"}
                              className="custom-table-header shadow-md rounded-md mb-4"
                              bordered
                              rowKey={Math.random().toString(36).substr(2, 9)}
                              rowHoverable
                              size="small"
                              pagination={false}
                              summary={(items) => {
                                let total = 0;
                                items.forEach((item) => {
                                  total += Number(item.standarNumber);
                                });
                                return (
                                  <Table.Summary.Row>
                                    <Table.Summary.Cell
                                      colSpan={2}
                                      index={0}
                                      className="text-end font-semibold"
                                    >
                                      TỔNG SỐ TIẾT CHUẨN
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell
                                      index={2}
                                      className="text-center font-semibold"
                                    >
                                      {total}
                                    </Table.Summary.Cell>
                                  </Table.Summary.Row>
                                );
                              }}
                              columns={columnsBM05}
                              dataSource={dataActivities}
                              locale={{
                                emptyText: (
                                  <Empty description="No Data"></Empty>
                                ),
                              }}
                            />
                          </>
                        ),
                      },
                    ]}
                  />
                </div>
              </>
            )}
          </>
        )}
        {!detailUser && (
          <>
            <div className="h-[calc(100svh-300px)] flex justify-center items-center">
              <Empty description="Chưa có dữ liệu thông tin nhân sự"></Empty>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default SearchMembers;
