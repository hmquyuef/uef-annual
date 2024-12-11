"use client";

import { getAllSchoolYears } from "@/services/schoolYears/schoolYearsServices";
import PageTitles from "@/utility/Constraints";
import Messages from "@/utility/Messages";
import {
  CaretRightOutlined,
  CloudDownloadOutlined,
  DownloadOutlined,
  FileProtectOutlined,
  FilterOutlined,
  HomeOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Collapse,
  ConfigProvider,
  DatePicker,
  Divider,
  Empty,
  MenuProps,
  Select,
  Table,
  TableColumnsType,
} from "antd";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

import {
  handleExportAll,
  handleExportForBM,
} from "@/components/forms/exportExcel/ExportAllDetail";
import { LoadingSkeleton } from "@/components/skeletons/LoadingSkeleton";
import {
  DetailUserItem,
  getDataExportByUserName,
  Item,
} from "@/services/exports/exportDetailForUser";
import { convertTimestampToDate } from "@/utility/Utilities";
import locale from "antd/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");

const WorkloadDetails = () => {
  const [loading, setLoading] = useState(false);
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
  const [userName, setUserName] = useState("");
  const [defaultYears, setDefaultYears] = useState<any>();
  const [selectedKeyYear, setSelectedKeyYear] = useState<any>();
  const [startDate, setStartDate] = useState<number | 0>(0);
  const [minStartDate, setMinStartDate] = useState<number | 0>(0);
  const [endDate, setEndDate] = useState<number | 0>(0);
  const [maxEndDate, setMaxEndDate] = useState<number | 0>(0);

  const getDefaultYears = async () => {
    setLoading(true);
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
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timeoutId);
  };

  const handleChangeYear = (value: any) => {
    const temp = defaultYears.filter((x: any) => x.id === value)[0] as any;
    setSelectedKeyYear(temp);
    setStartDate(temp.startDate);
    setMinStartDate(temp.startDate);
    setEndDate(temp.endDate);
    setMaxEndDate(temp.endDate);
  };

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
      className: "text-center w-[100px]",
      render: () => {
        return (
          <>
            <Button
              color="primary"
              variant="link"
              icon={<DownloadOutlined />}
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                detailUser && handleExportAll(detailUser);
              }}
            >
              Tải về tất cả
            </Button>
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
      title: (
        <div>
          SỐ <br /> TIẾT CHUẨN
        </div>
      ),
      dataIndex: "standarNumber",
      key: "standarNumber",
      className: "text-center w-[100px]",
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
      title: (
        <div className="p-1">
          THỜI GIAN <br /> HOẠT ĐỘNG
        </div>
      ),
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
      className: "text-center w-[150px]",
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
      title: (
        <div>
          SỐ <br /> TIẾT CHUẨN
        </div>
      ),
      dataIndex: "standarNumber",
      key: "standarNumber",
      className: "text-center w-[100px]",
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
      title: (
        <div className="p-1">
          THỜI GIAN <br /> HOẠT ĐỘNG
        </div>
      ),
      dataIndex: "fromDate",
      key: "fromDate",
      render: (fromDate: number) =>
        fromDate ? convertTimestampToDate(fromDate) : "",
      className: "text-center w-[150px]",
    },
    {
      title: "GHI CHÚ",
      dataIndex: "note",
      key: "note",
      render: (note: string) => <>{note}</>,
      className: "w-[200px]",
    },
  ];

  const fetchData = async (username: string) => {
    setLoading(true);
    const formData: Partial<any> = {
      userName: username,
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

  const downloadReport = (formName: string) => (
    <Button
      color="primary"
      variant="outlined"
      shape="round"
      icon={<CloudDownloadOutlined />}
      size="small"
      onClick={(e) => {
        e.stopPropagation();
        const formData: Partial<any> = {
          userName: userName,
          years: selectedKeyYear.id,
          startDate: startDate,
          endDate: endDate,
        };
        handleExportForBM({ ...formData, ...{ formName } });
      }}
    >
      Tải về
    </Button>
  );

  useEffect(() => {
    setLoading(true);
    document.title = PageTitles.SUMMARY_ACTIVITIES;
    const token = Cookies.get("s_t");
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.sub) {
        setUserName(decodedToken.sub);
      }
    }
    getDefaultYears();
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    setLoading(true);
    if (selectedKeyYear && startDate && endDate) fetchData(userName);
  }, [selectedKeyYear, startDate, endDate]);

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
                  <span>{Messages.SUMMARY_ACTIVITIES}</span>
                </>
              ),
            },
          ]}
        />
      </div>
      <div className="grid grid-cols-10 gap-4 mb-3">
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
      </div>
      <hr className="mb-3" />
      {loading ? (
        <>
          <LoadingSkeleton />
        </>
      ) : (
        <>
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
                    emptyText: <Empty description={Messages.NO_DATA}></Empty>,
                  }}
                />
              </div>
              <div className="mt-6">
                <Divider
                  orientation="left"
                  className="uppercase"
                  style={{ borderColor: "#1677FF", color: "#1677FF" }}
                >
                  Tổng kết hoạt động
                </Divider>
              </div>
              {dataClassLeaders && dataClassLeaders.length > 0 && (
                <>
                  <div className="mb-4">
                    <Collapse
                      key="collapse-class-leaders"
                      expandIcon={({ isActive }) => (
                        <CaretRightOutlined rotate={isActive ? 90 : 0} />
                      )}
                      collapsible="header"
                      className="mb-4"
                      defaultActiveKey={["1"]}
                      expandIconPosition="start"
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
                                rowKey={(item) => item.activityName}
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
                                        Tổng tiết chuẩn
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
                          extra: downloadReport("bm01"),
                        },
                      ]}
                    />
                  </div>
                </>
              )}
              {dataAssistants && dataAssistants.length > 0 && (
                <>
                  <div className="mb-4">
                    <Collapse
                      key="collapse-class-assistants"
                      expandIcon={({ isActive }) => (
                        <CaretRightOutlined rotate={isActive ? 90 : 0} />
                      )}
                      collapsible="header"
                      defaultActiveKey={["2"]}
                      className="mb-4"
                      expandIconPosition="start"
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
                                rowKey={(item) => item.activityName}
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
                                        Tổng tiết chuẩn
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
                          extra: downloadReport("bm02"),
                        },
                      ]}
                    />
                  </div>
                </>
              )}
              {dataAdmissionCounseling &&
                dataAdmissionCounseling.length > 0 && (
                  <>
                    <div className="mb-4">
                      <Collapse
                        key="collapse-admission-counseling"
                        expandIcon={({ isActive }) => (
                          <CaretRightOutlined rotate={isActive ? 90 : 0} />
                        )}
                        collapsible="header"
                        defaultActiveKey={["3"]}
                        className="mb-4"
                        expandIconPosition="start"
                        items={[
                          {
                            key: "3",
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
                                  rowKey={(item) => item.activityName}
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
                                          Tổng tiết chuẩn
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
                            extra: downloadReport("bm03"),
                          },
                        ]}
                      />
                    </div>
                  </>
                )}
              {dataQAEs && dataQAEs.length > 0 && (
                <>
                  <div className="mb-4">
                    <Collapse
                      key="collapse-QAEs"
                      expandIcon={({ isActive }) => (
                        <CaretRightOutlined rotate={isActive ? 90 : 0} />
                      )}
                      collapsible="header"
                      defaultActiveKey={["4"]}
                      className="mb-4"
                      expandIconPosition="start"
                      items={[
                        {
                          key: "4",
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
                                rowKey={(item) => item.activityName}
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
                                        Tổng tiết chuẩn
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
                          extra: downloadReport("bm04"),
                        },
                      ]}
                    />
                  </div>
                </>
              )}
              {dataActivities && dataActivities.length > 0 && (
                <>
                  <div className="mb-4">
                    <Collapse
                      key="collapse-activities"
                      expandIcon={({ isActive }) => (
                        <CaretRightOutlined rotate={isActive ? 90 : 0} />
                      )}
                      collapsible="header"
                      defaultActiveKey={["5"]}
                      className="mb-4"
                      expandIconPosition="start"
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
                                rowKey={(item) => item.activityName}
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
                                        Tổng tiết chuẩn
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
                          extra: downloadReport("bm05"),
                        },
                      ]}
                    />
                  </div>
                </>
              )}
            </>
          )}
          {detailUser?.totalStandarNumber === 0 && (
            <>
              <Empty
                description={Messages.NO_DATA}
                className="h-64 flex flex-col justify-center"
              ></Empty>
            </>
          )}
        </>
      )}
    </section>
  );
};

export default WorkloadDetails;
