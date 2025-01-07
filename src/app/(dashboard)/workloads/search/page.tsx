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
import PageTitles from "@/utility/Constraints";
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
  Card,
  Collapse,
  ConfigProvider,
  DatePicker,
  Divider,
  Dropdown,
  Empty,
  MenuProps,
  Select,
  Skeleton,
  Table,
  TableColumnsType,
  Tooltip,
} from "antd";
import Link from "next/link";
import { Key, useEffect, useState } from "react";
import { getAllSchoolYears } from "@/services/schoolYears/schoolYearsServices";
import Messages from "@/utility/Messages";

import dayjs from "dayjs";
import locale from "antd/locale/vi_VN";
import "dayjs/locale/vi";
import Colors from "@/utility/Colors";
dayjs.locale("vi");

const SearchMembers = () => {
  const [loading, setLoading] = useState(false);
  const [selectedKey, setSelectedKey] = useState<Key | null>(null);
  const [usersHRM, setUsersHRM] = useState<UsersFromHRMResponse | undefined>(
    undefined
  );
  const [selectedUserName, setSelectedUserName] = useState("");
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
  const [defaultYears, setDefaultYears] = useState<any>();
  const [selectedKeyYear, setSelectedKeyYear] = useState<any>();
  const [startDate, setStartDate] = useState<number | 0>(0);
  const [minStartDate, setMinStartDate] = useState<number | 0>(0);
  const [endDate, setEndDate] = useState<number | 0>(0);
  const [maxEndDate, setMaxEndDate] = useState<number | 0>(0);

  const getDefaultYears = async () => {
    const { items } = await getAllSchoolYears();
    if (items) {
      setDefaultYears(items);
      const defaultYear = items.find((x: any) => x.isDefault);
      if (defaultYear) {
        const { startDate, endDate } = defaultYear;
        setSelectedKeyYear(defaultYear);
        setStartDate(startDate);
        setMinStartDate(startDate);
        setEndDate(endDate);
        setMaxEndDate(endDate);
      }
    }
  };

  const getUsersHRM = async () => {
    const response = await getUsersFromHRM();
    setUsersHRM(response);
  };

  const handleSearch = async () => {
    setLoading(true);
    const formData: Partial<any> = {
      userName: selectedUserName,
      years: selectedKeyYear.id,
      startDate: startDate,
      endDate: endDate,
    };
    const response = await getDataExportByUserName(formData);
    if (response) {
      setDetailUser(response);
      setDataClassLeaders(response.classLeaders.items);
      setDataAssistants(response.assistants.items);
      setDataQAEs(response.qAs.items);
      setDataAdmissionCounseling(response.admissionCounseling.items);
      setDataActivities(response.activities.items);
    }
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timeoutId);
  };

  const formConfigs = [
    { key: "2-1", label: "BM01 - Chủ nhiệm lớp", formName: "BM01" },
    {
      key: "2-2",
      label: "BM02 - Cố vấn học tập, trợ giảng, phụ đạo",
      formName: "BM02",
    },
    { key: "2-3", label: "BM03 - Tư vấn tuyển sinh", formName: "BM03" },
    {
      key: "2-4",
      label: "BM04 - Tham gia hỏi vấn đáp Tiếng Anh",
      formName: "BM04",
    },
    {
      key: "2-5",
      label: "BM05 - Các hoạt động khác được BGH phê duyệt",
      formName: "BM05",
    },
  ];

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <p onClick={() => detailUser && handleExportAll(detailUser)}>Tất cả</p>
      ),
      icon: <FileProtectOutlined />,
      style: { color: Colors.BLUE },
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: "Biểu mẫu",
      icon: <FilterOutlined />,
      children: formConfigs.map(({ key, label, formName }) => ({
        key,
        label: (
          <p
            onClick={() => {
              const formData: Partial<any> = {
                userName: selectedUserName,
                years: selectedKeyYear.id,
                startDate: startDate,
                endDate: endDate,
              };
              handleExportForBM({ ...formData, ...{ formName } });
            }}
          >
            {label}
          </p>
        ),
      })),
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

  //render table for BM01, BM02, BM03, BM04
  const columns: TableColumnsType<Item> = [
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
      className: "text-center w-[150px]",
    },
    {
      title: "THỜI GIAN HOẠT ĐỘNG",
      dataIndex: "fromDate",
      key: "fromDate",
      render: (fromDate: number, record: Item) => {
        const toDate = record.toDate
          ? convertTimestampToDate(record.toDate)
          : "";
        return (
          <>
            {fromDate ? (
              <div className="flex flex-col">
                <span>{convertTimestampToDate(fromDate)}</span>
                <span>{toDate}</span>
              </div>
            ) : (
              ""
            )}
          </>
        );
      },
      className: "text-center w-[90px]",
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
            <Tooltip
              placement="bottom"
              title={"Thông tin minh chứng"}
              arrow={true}
            >
              <Link
                href={"https://api-annual.uef.edu.vn/" + path}
                target="__blank"
              >
                <p className="text-green-500">
                  <CheckOutlined />
                </p>
              </Link>
            </Tooltip>
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

  //render table for BM05
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
      className: "text-center w-[150px]",
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
            <Tooltip
              placement="bottom"
              title={"Thông tin minh chứng"}
              arrow={true}
            >
              <Link
                href={"https://api-annual.uef.edu.vn/" + path}
                target="__blank"
              >
                <p className="text-green-500">
                  <CheckOutlined />
                </p>
              </Link>
            </Tooltip>
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

  const handleChangeYear = (value: any) => {
    const temp = defaultYears.filter((x: any) => x.id === value)[0] as any;
    setSelectedKeyYear(temp);
    setStartDate(temp.startDate);
    setMinStartDate(temp.startDate);
    setEndDate(temp.endDate);
    setMaxEndDate(temp.endDate);
  };

  useEffect(() => {
    document.title = PageTitles.SEARCH;
    Promise.all([getDefaultYears(), getUsersHRM()]);
  }, []);

  return (
    <section>
      <div className="mb-3">
        <Breadcrumb
          items={[
            {
              href: "",
              title: (
                <>
                  <HomeOutlined />
                  <span>{Messages.BREAD_CRUMB_HOME}</span>
                </>
              ),
            },
            {
              title: (
                <>
                  <ProfileOutlined />
                  <span>{Messages.BREAD_CRUMB_SEARCH}</span>
                </>
              ),
            },
          ]}
        />
      </div>
      <div className="grid grid-cols-10 gap-4 mb-3">
        <div className="col-span-2 flex flex-col justify-center gap-1">
          <span className="text-[14px] text-neutral-500">Tìm kiếm:</span>
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
        <div className="flex flex-col justify-center gap-1">
          <span className="text-[14px] text-neutral-500">Năm học:</span>
          <Select
            showSearch
            optionFilterProp="label"
            filterSort={(optionA, optionB) =>
              (optionA?.title ?? "").localeCompare(optionB?.title ?? "")
            }
            options={defaultYears?.map((year: any) => ({
              value: year.id,
              label: year.title,
            }))}
            //
            value={selectedKeyYear && selectedKeyYear.title}
            onChange={(value) => handleChangeYear(value)}
            className="w-full"
          />
        </div>
        <div className="flex flex-col justify-center gap-1">
          <span className="text-[14px] text-neutral-500">Từ ngày:</span>
          <ConfigProvider locale={locale}>
            <DatePicker
              allowClear={false}
              placeholder="dd/mm/yyyy"
              format="DD/MM/YYYY"
              minDate={dayjs.unix(minStartDate)}
              maxDate={dayjs.unix(maxEndDate)}
              value={startDate ? dayjs.unix(startDate) : null}
              onChange={(date) => {
                if (date) {
                  const timestamp = dayjs(date).unix();
                  setStartDate(timestamp);
                } else {
                  setStartDate(0);
                }
              }}
            />
          </ConfigProvider>
        </div>
        <div className="flex flex-col justify-center gap-1">
          <span className="text-[14px] text-neutral-500">Đến ngày:</span>
          <ConfigProvider locale={locale}>
            <DatePicker
              allowClear={false}
              placeholder="dd/mm/yyyy"
              format="DD/MM/YYYY"
              minDate={dayjs.unix(minStartDate)}
              maxDate={dayjs.unix(maxEndDate)}
              value={endDate ? dayjs.unix(endDate) : null}
              onChange={(date) => {
                if (date) {
                  const timestamp = dayjs(date).unix();
                  setEndDate(timestamp);
                } else {
                  setEndDate(0);
                }
              }}
            />
          </ConfigProvider>
        </div>
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
      <hr className="mb-3" />
      {loading ? (
        <>
          <Card>
            <Skeleton active />
          </Card>
        </>
      ) : (
        <>
          {detailUser ? (
            <>
              <div className="mt-6">
                <Divider
                  orientation="left"
                  className="uppercase"
                  style={{ borderColor: Colors.BLUE, color: Colors.BLUE }}
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
                    emptyText: <Empty description={Messages.NO_DATA}></Empty>,
                  }}
                />
              </div>
              <div className="mt-6">
                <Divider
                  orientation="left"
                  className="uppercase"
                  style={{ borderColor: Colors.BLUE, color: Colors.BLUE }}
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
                              {String(
                                detailUser.classLeaders.name
                              ).toUpperCase()}{" "}
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
                                    <Empty
                                      description={Messages.NO_DATA}
                                    ></Empty>
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
                              -{" "}
                              {String(detailUser.assistants.name).toUpperCase()}{" "}
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
                                    <Empty
                                      description={Messages.NO_DATA}
                                    ></Empty>
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
                                    <Empty
                                      description={Messages.NO_DATA}
                                    ></Empty>
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
                                    <Empty
                                      description={Messages.NO_DATA}
                                    ></Empty>
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
                              -{" "}
                              {String(detailUser.activities.name).toUpperCase()}{" "}
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
                                    <Empty
                                      description={Messages.NO_DATA}
                                    ></Empty>
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
          ) : (
            <>
              <div className="h-[calc(100svh-300px)] flex justify-center items-center">
                <Empty description={Messages.NO_DATA}></Empty>
              </div>
            </>
          )}
        </>
      )}
    </section>
  );
};
export default SearchMembers;
