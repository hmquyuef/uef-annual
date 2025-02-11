"use client";

import { getAllSchoolYears } from "@/services/schoolYears/schoolYearsServices";
import PageTitles from "@/utility/Constraints";
import Messages from "@/utility/Messages";
import {
  CaretRightOutlined,
  CloudDownloadOutlined,
  DownloadOutlined,
  HomeOutlined,
  MailOutlined,
  ProfileOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Breadcrumb,
  Button,
  Collapse,
  Descriptions,
  Divider,
  Empty,
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
import dayjs from "dayjs";
import "dayjs/locale/vi";
import Colors from "@/utility/Colors";
import { OtherItems } from "@/services/exports/OtherItems";
import { GeneralItems } from "@/services/exports/GeneralItems";
import {
  Employees,
  Lecture,
  RegulationItems,
} from "@/services/exports/RegulationItems";
import { TrainingItems } from "@/services/exports/TrainingItems";
dayjs.locale("vi");

const WorkloadDetails = () => {
  const [loading, setLoading] = useState(false);
  const [detailUser, setDetailUser] = useState<DetailUserItem | undefined>(
    undefined
  );
  const [groupOthers, setGroupOther] = useState<OtherItems[]>([]);
  const [groupGenerals, setGroupGenerals] = useState<GeneralItems[]>([]);
  const [groupRegulations, setGroupRegulations] =
    useState<RegulationItems | null>(null);
  const [groupTraining, setGroupTraining] = useState<TrainingItems | null>(
    null
  );
  const [employees, setEmployees] = useState<Employees | null>(null);
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [userName, setUserName] = useState("");
  const [defaultYears, setDefaultYears] = useState<any>();
  const [selectedKeyYear, setSelectedKeyYear] = useState<any>();

  const getDefaultYears = async () => {
    setLoading(true);
    const { items } = await getAllSchoolYears();
    if (items) {
      setDefaultYears(items);
      const defaultYear = items.find((x: any) => x.isDefault);
      if (defaultYear) {
        setSelectedKeyYear(defaultYear);
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
  };

  //render table InfoUser
  const columnsInfoUser: TableColumnsType<DetailUserItem> = [
    {
      title: <div className="py-1">Mã SỐ CB-GV-NV</div>,
      dataIndex: "userName",
      key: "userName",
      render: (userName: string) => <strong>{userName}</strong>,
      className: "text-center w-[200px]",
    },
    {
      title: "HỌ VÀ TÊN",
      dataIndex: "fullName",
      key: "fullName",
      render: (fullName: string) => <strong>{fullName}</strong>,
      className: "text-center w-[200px]",
    },
    {
      title: "EMAIL",
      dataIndex: "email",
      key: "email",
      render: (email: string) => <strong>{email}</strong>,
      className: "text-center w-[200px]",
    },
    {
      title: "ĐƠN VỊ",
      dataIndex: "unitName",
      key: "unitName",
      render: (unitName: string) => <strong>{unitName}</strong>,
      className: "text-center w-[100px]",
    },
    {
      title: "TỔNG SỐ SỰ KIỆN",
      dataIndex: "totalEvents",
      key: "totalEvents",
      className: "text-center w-[8rem]",
      render: (totalEvents: number) => <strong>{totalEvents}</strong>,
    },
    {
      title: "TỔNG SỐ TIẾT CHUẨN",
      dataIndex: "totalStandarNumber",
      key: "totalStandarNumber",
      className: "text-center w-[8rem]",
      render: (_, item: any) => {
        const totalStarndarNumber = item.items.other.reduce(
          (acc: number, x: any) => acc + x.totalStandarNumber,
          0
        );
        return (
          <>
            <strong>{totalStarndarNumber}</strong>
          </>
        );
      },
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

  const columnsEmployees: TableColumnsType<Employees> = [
    {
      title: <div className="py-1">CHẤM CÔNG</div>,
      dataIndex: "attendance",
      key: "attendance",
      className: "text-center w-[70px]",
      children: [
        {
          title: <div className="py-1">THEO NGÀY</div>,
          dataIndex: "days",
          key: "days",
          render: (_, item: Employees) => {
            return <>{item.detail.attendanceDays}</>;
          },
          className: "text-center w-[70px]",
        },
        {
          title: <div className="py-1">THEO GIỜ</div>,
          dataIndex: "hours",
          key: "hours",
          render: (_, item: Employees) => <>{item.detail.attendanceHours}</>,
          className: "text-center w-[70px]",
        },
      ],
    },
    {
      title: <div className="py-1">SỐ BUỔI</div>,
      dataIndex: "late",
      key: "late",
      className: "text-center w-[70px]",
      children: [
        {
          title: <div className="py-1">ĐI TRỄ</div>,
          dataIndex: "lateArrivals",
          key: "lateArrivals",
          render: (_, item: Employees) => {
            return <>{item.detail.lateArrivals}</>;
          },
          className: "text-center w-[70px]",
        },
        {
          title: <div className="py-1">VỀ SỚM</div>,
          dataIndex: "earlyDepartures",
          key: "earlyDepartures",
          render: (_, item: Employees) => <>{item.detail.earlyDepartures}</>,
          className: "text-center w-[70px]",
        },
      ],
    },
    {
      title: <div className="py-1">SỐ NGÀY NGHỈ</div>,
      dataIndex: "leaved",
      key: "leaved",
      className: "text-center w-[70px]",
      children: [
        {
          title: <div className="py-1">KHÔNG PHÉP</div>,
          dataIndex: "unexcusedAbsences",
          key: "unexcusedAbsences",
          render: (_, item: Employees) => <>{item.detail.unexcusedAbsences}</>,
          className: "text-center w-[70px]",
        },
        {
          title: <div className="py-1">CÓ PHÉP</div>,
          dataIndex: "leaveDays",
          key: "leaveDays",
          render: (_, item: Employees) => <>{item.detail.leaveDays}</>,
          className: "text-center w-[70px]",
        },
        {
          title: <div className="py-1">HẬU SẢN</div>,
          dataIndex: "maternityLeaveDays",
          key: "maternityLeaveDays",
          render: (_, item: Employees) => <>{item.detail.maternityLeaveDays}</>,
          className: "text-center w-[70px]",
        },
        {
          title: <div className="py-1">KHÔNG LƯƠNG</div>,
          dataIndex: "unpaidLeaveDays",
          key: "unpaidLeaveDays",
          render: (_, item: Employees) => <>{item.detail.unpaidLeaveDays}</>,
          className: "text-center w-[80px]",
        },
      ],
    },
    {
      title: "CÔNG TÁC",
      dataIndex: "businessTripDays",
      key: "businessTripDays",
      render: (_, item: Employees) => <>{item.detail.businessTripDays}</>,
      className: "text-center w-[70px]",
    },
    {
      title: (
        <div>
          KHÔNG BẤM <br /> VÂN TAY
        </div>
      ),
      dataIndex: "missedFingerprint",
      key: "missedFingerprint",
      render: (_, item: Employees) => <>{item.detail.missedFingerprint}</>,
      className: "text-center w-[70px]",
    },
  ];

  const columnsLecture: TableColumnsType<Lecture> = [
    {
      title: <div className="py-1">SỐ LẦN NGHỈ CÓ BÁO</div>,
      dataIndex: "notifiedAbsences",
      key: "notifiedAbsences",
      render: (_, item: Lecture) => <>{item.detail.notifiedAbsences ?? 0}</>,
      className: "text-center w-[80px]",
    },
    {
      title: <div className="py-1">SỐ LẦN NGHỈ KHÔNG BÁO</div>,
      dataIndex: "unnotifiedAbsences",
      key: "unnotifiedAbsences",
      render: (_, item: Lecture) => <>{item.detail.unnotifiedAbsences ?? 0}</>,
      className: "text-center w-[80px]",
    },
    {
      title: <div className="py-1">SỐ LẦN ĐI TRỄ/VỀ SỚM</div>,
      dataIndex: "lateEarly",
      key: "lateEarly",
      render: (_, item: Lecture) => <>{item.detail.lateEarly ?? 0}</>,
      className: "text-center w-[80px]",
    },
  ];

  const columns = (isGeneral: boolean): TableColumnsType<any> => [
    {
      title: <div className="px-2 py-3">STT</div>,
      dataIndex: "stt",
      key: "stt",
      render: (_, __, index) => <>{index + 1}</>,
      className: "text-center w-[50px]",
    },
    {
      title: "TÊN HOẠT ĐỘNG",
      dataIndex: "name",
      key: "name",
      render: (_, item: any) => {
        const name = item.name ?? item.contents;
        return (
          <>
            <span className="text-blue-500 font-semibold">{name}</span>
          </>
        );
      },
      className: "w-[4/5]",
    },
    ...(isGeneral
      ? []
      : [
          {
            title: (
              <div>
                SỐ <br /> TIẾT CHUẨN
              </div>
            ),
            dataIndex: "standarNumber",
            key: "standarNumber",
            className: "text-center w-[100px]",
            render: (standarNumber: string) => <span>{standarNumber}</span>,
          },
        ]),
    {
      title: (
        <div>
          SỐ VĂN BẢN <br /> NGÀY LẬP
        </div>
      ),
      dataIndex: "proof",
      key: "proof",
      render: (_, record: any) => {
        return (
          <div className="flex flex-col">
            <span className="font-medium">
              {record.determinations.documentNumber}
            </span>
            <span className="text-[13px]">
              {convertTimestampToDate(record.determinations.documentDate)}
            </span>
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
      render: (_, record: any) => {
        return (
          <>
            {record.determinations.fromDate ? (
              <div className="flex flex-col">
                <span>
                  {convertTimestampToDate(record.determinations.fromDate)}
                </span>
                {record.determinations.toDate !==
                record.determinations.fromDate ? (
                  <>
                    <span>
                      {convertTimestampToDate(record.determinations.toDate)}
                    </span>
                  </>
                ) : null}
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

  const fetchData = async (username: string) => {
    setLoading(true);
    const formData: Partial<any> = {
      userName: username,
      years: selectedKeyYear.id,
    };
    const response = await getDataExportByUserName(formData);
    if (response) {
      setDetailUser(response);
      setGroupOther(response.items.other);
      setGroupGenerals(response.items.general);
      setGroupRegulations(response.items.regulation);
      setEmployees(response.items.regulation.employees);
      setLecture(response.items.regulation.lecture);
      setGroupTraining(response.items.training);
    }
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timeoutId);
  };

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
    if (selectedKeyYear) fetchData(userName);
  }, [selectedKeyYear]);

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
              {/* <div>
                <Divider
                  orientation="left"
                  className="uppercase"
                  style={{ borderColor: Colors.BLUE, color: Colors.BLUE }}
                >
                  Thông tin nhân sự
                </Divider>
                <div className="my-6">
                  <Table<DetailUserItem>
                    key={"table-detail-info-user"}
                    className="custom-table-header shadow-md rounded-md"
                    bordered
                    rowKey={(item) => item.userName}
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
              </div>
              <div>
                <Divider
                  orientation="left"
                  className="uppercase"
                  style={{ borderColor: Colors.BLUE, color: Colors.BLUE }}
                >
                  Nội quy lao động
                </Divider>
                <Table<Employees>
                  key={"table-detail-employees-regulations"}
                  className="custom-table-header shadow-md rounded-md"
                  bordered
                  // rowKey={(item) => item.userName}
                  rowHoverable
                  size="small"
                  pagination={false}
                  columns={columnsRegulation}
                  dataSource={employees ? [employees] : []}
                  locale={{
                    emptyText: <Empty description={Messages.NO_DATA}></Empty>,
                  }}
                />
              </div> */}
              <div>
                {/* <Divider
                  orientation="left"
                  className="uppercase"
                  style={{ borderColor: Colors.BLUE, color: Colors.BLUE }}
                >
                  Thông tin nhân sự
                </Divider> */}

                <div className="grid grid-cols-4 gap-6">
                  <div
                    className="rounded-lg shadow-lg"
                    style={{
                      backgroundImage: 'url("/wave.svg")',
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "bottom",
                    }}
                  >
                    <div
                      className="py-2 rounded-t-lg text-center font-semibold"
                      style={{ backgroundColor: "#0099ff" }}
                    >
                      <span className="uppercase text-white tracking-wide">
                        Thông Tin Nhân Sự
                      </span>
                    </div>
                    <div className="flex px-3 pt-4 pb-8 gap-4">
                      <div className="flex justify-center items-center">
                        <div className="w-fit h-fit">
                          <Avatar size={80} icon={<UserOutlined />} />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col">
                          <span className=" text-center text-lg text-neutral-600 font-medium">
                            {detailUser.fullName}
                          </span>
                          <span className="text-center text-sm text-neutral-400">
                            {detailUser.userName}
                          </span>
                          <hr className="mt-3 mb-1" />
                          <div className="flex flex-col">
                            <div className="flex items-center gap-3">
                              <span className="text-center text-sm text-neutral-400 font-medium">
                                <MailOutlined />
                              </span>
                              <span className="text-center text-sm text-neutral-400 font-medium">
                                {detailUser.email}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-center text-sm text-neutral-400 font-medium">
                                <MailOutlined />
                              </span>
                              <span className="text-center text-sm text-neutral-400 font-medium">
                                {detailUser.unitName}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-center text-sm text-neutral-400 font-medium">
                                <MailOutlined />
                              </span>
                              <span className="text-center text-sm text-neutral-400 font-medium">
                                {detailUser.totalEvents} (sự kiện tham gia)
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-center text-sm text-neutral-400 font-medium">
                                <MailOutlined />
                              </span>
                              <span className="text-center text-sm text-neutral-400 font-medium">
                                {detailUser.items.other.reduce(
                                  (acc: number, x: any) =>
                                    acc + x.totalStandarNumber,
                                  0
                                )}{" "}
                                (số tiết chuẩn)
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <div className="flex flex-col gap-1 pb-3">
                      <div className="grid grid-cols-2 gap-3 px-3">
                        <span className="text-neutral-400">
                          Mã số CB-GV-NV:
                        </span>
                        <span className="text-end text-neutral-600 font-medium">
                          {detailUser.userName}
                        </span>
                      </div>
                      <hr />
                      <div className="grid grid-cols-2 gap-3 px-3">
                        <span className="text-neutral-400">Họ và Tên:</span>
                        <span className="text-end text-neutral-600 font-medium">
                          {detailUser.fullName}
                        </span>
                      </div>
                      <hr />
                      <div className="grid grid-cols-2 gap-3  px-3">
                        <span className="text-neutral-400">Địa chỉ email:</span>
                        <span className="text-end text-neutral-600 font-medium">
                          {detailUser.email}
                        </span>
                      </div>
                      <hr />
                      <div className="grid grid-cols-2 gap-3 px-3">
                        <span className="text-neutral-400">Đơn vị:</span>
                        <span className="text-end text-neutral-600 font-medium">
                          {detailUser.unitName}
                        </span>
                      </div>
                      <hr />
                      <div className="grid grid-cols-2  gap-3 px-3">
                        <span className="text-neutral-400">
                          Tổng số sự kiện:
                        </span>
                        <span className="text-end text-neutral-600 font-medium">
                          {detailUser.totalEvents}
                        </span>
                      </div>
                      <hr />
                      <div className="grid grid-cols-2 gap-3 px-3">
                        <span className="text-neutral-400">
                          Tổng số tiết chuẩn:
                        </span>
                        <span className="text-end text-neutral-600 font-medium">
                          {detailUser.items.other.reduce(
                            (acc: number, x: any) => acc + x.totalStandarNumber,
                            0
                          )}
                        </span>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
              <div>
                <Divider
                  orientation="left"
                  className="uppercase"
                  style={{ borderColor: Colors.BLUE, color: Colors.BLUE }}
                >
                  Nội quy lao động
                </Divider>
                <Collapse
                  key="collapse-group-others"
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
                        <strong className="uppercase">
                          thông tin nội quy lao động
                        </strong>
                      ),
                      children: (
                        <>
                          <Table<Employees>
                            key={"table-detail-employees-regulations"}
                            className="custom-table-header shadow-md rounded-md mb-6"
                            bordered
                            // rowKey={(item) => item.userName}
                            rowHoverable
                            title={() => (
                              <strong className="uppercase">
                                Nội quy lao động - dành cho cán bộ, nhân viên
                              </strong>
                            )}
                            size="small"
                            pagination={false}
                            columns={columnsEmployees}
                            dataSource={employees ? [employees] : []}
                            locale={{
                              emptyText: (
                                <Empty description={Messages.NO_DATA}></Empty>
                              ),
                            }}
                          />
                          <Table<Lecture>
                            key={"table-detail-employees-regulations"}
                            className="custom-table-header shadow-md rounded-md"
                            bordered
                            // rowKey={(item) => item.userName}
                            rowHoverable
                            title={() => (
                              <strong className="uppercase">
                                Nội quy giảng dạy - dành cho Giảng viên
                              </strong>
                            )}
                            size="small"
                            pagination={false}
                            columns={columnsLecture}
                            dataSource={lecture ? [lecture] : []}
                            locale={{
                              emptyText: (
                                <Empty description={Messages.NO_DATA}></Empty>
                              ),
                            }}
                          />
                        </>
                      ),
                    },
                  ]}
                />
              </div>
              <div>
                <Divider
                  orientation="left"
                  className="uppercase"
                  style={{ borderColor: Colors.BLUE, color: Colors.BLUE }}
                >
                  Tổng kết hoạt động
                </Divider>
                <div className="mb-4">
                  <Collapse
                    key="collapse-group-others"
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
                          <strong className="uppercase">
                            Nhóm biểu mẫu công tác chung
                          </strong>
                        ),
                        children: (
                          <>
                            {groupGenerals &&
                              groupGenerals.map((group, index) => {
                                return (
                                  <>
                                    <Table<any>
                                      key={`table-group-generals-${index}`}
                                      className="custom-table-header shadow-md rounded-md mb-4"
                                      bordered
                                      rowKey={(item) => item.name}
                                      rowHoverable
                                      size="small"
                                      title={() => (
                                        <div className="flex justify-between items-center">
                                          <strong>
                                            {group.shortName} - {group.name}
                                          </strong>
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
                                              };
                                              handleExportForBM({
                                                ...formData,
                                                ...{
                                                  formName: group.shortName,
                                                },
                                              });
                                            }}
                                          >
                                            Tải về
                                          </Button>
                                        </div>
                                      )}
                                      // footer={() => "Footer"}
                                      pagination={false}
                                      columns={columns(true)}
                                      dataSource={group.items}
                                      locale={{
                                        emptyText: (
                                          <Empty
                                            description={Messages.NO_DATA}
                                          ></Empty>
                                        ),
                                      }}
                                    />
                                  </>
                                );
                              })}
                          </>
                        ),
                      },
                    ]}
                  />
                </div>
                <div className="mb-4">
                  <Collapse
                    key="collapse-group-others"
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
                          <strong className="uppercase">
                            Nhóm biểu mẫu công tác khác
                          </strong>
                        ),
                        children: (
                          <>
                            {groupOthers &&
                              groupOthers.map((group, index) => {
                                return (
                                  <>
                                    <Table<any>
                                      key={`table-group-others-${index}`}
                                      className="custom-table-header shadow-md rounded-md mb-4"
                                      bordered
                                      rowKey={(item) => item.name}
                                      rowHoverable
                                      size="small"
                                      title={() => (
                                        <div className="flex justify-between items-center">
                                          <strong>
                                            {group.shortName} - {group.name}
                                          </strong>
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
                                              };
                                              handleExportForBM({
                                                ...formData,
                                                ...{
                                                  formName: group.shortName,
                                                },
                                              });
                                            }}
                                          >
                                            Tải về
                                          </Button>
                                        </div>
                                      )}
                                      // footer={() => "Footer"}
                                      pagination={false}
                                      summary={() => {
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
                                              {group.totalStandarNumber}
                                            </Table.Summary.Cell>
                                          </Table.Summary.Row>
                                        );
                                      }}
                                      columns={columns(false)}
                                      dataSource={group.items}
                                      locale={{
                                        emptyText: (
                                          <Empty
                                            description={Messages.NO_DATA}
                                          ></Empty>
                                        ),
                                      }}
                                    />
                                  </>
                                );
                              })}
                          </>
                        ),
                      },
                    ]}
                  />
                </div>
              </div>
            </>
          )}
          {/* {detailUser?.totalStandarNumber === 0 && (
            <>
              <Empty
                description={Messages.NO_DATA}
                className="h-64 flex flex-col justify-center"
              ></Empty>
            </>
          )} */}
        </>
      )}
    </section>
  );
};

export default WorkloadDetails;
