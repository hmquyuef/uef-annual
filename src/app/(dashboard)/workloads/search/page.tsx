"use client";

import { handleExportForBMGeneral } from "@/components/forms/exportExcel/ExportAllDetail";
import { LoadingSkeleton } from "@/components/skeletons/LoadingSkeleton";
import {
  DetailUserItem,
  getDataExportByUserName,
} from "@/services/exports/exportDetailForUser";
import { GeneralItems } from "@/services/exports/GeneralItems";
import { OtherItems } from "@/services/exports/OtherItems";
import { Employees, Lecture } from "@/services/exports/RegulationItems";
import { TrainingItems } from "@/services/exports/TrainingItems";
import { getAllSchoolYears } from "@/services/schoolYears/schoolYearsServices";
import PageTitles from "@/utility/Constraints";
import Messages from "@/utility/Messages";
import { convertTimestampToDate } from "@/utility/Utilities";
import {
  CaretRightOutlined,
  CheckOutlined,
  CloseOutlined,
  CloudDownloadOutlined,
  HomeOutlined,
  ProfileOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Breadcrumb,
  Button,
  Collapse,
  Empty,
  Modal,
  Select,
  Table,
  TableColumnsType,
} from "antd";
import { Key, useEffect, useState } from "react";

import {
  getUsersFromHRM,
  UsersFromHRMResponse,
} from "@/services/users/usersServices";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import Link from "next/link";
dayjs.locale("vi");

const SearchMembers = () => {
  const [loading, setLoading] = useState(false);
  const [detailUser, setDetailUser] = useState<DetailUserItem | undefined>(
    undefined
  );
  const [selectedKey, setSelectedKey] = useState<Key | null>(null);
  const [usersHRM, setUsersHRM] = useState<UsersFromHRMResponse | undefined>(
    undefined
  );
  const [selectedUserName, setSelectedUserName] = useState("");
  const [groupOthers, setGroupOther] = useState<OtherItems[]>([]);
  const [groupGenerals, setGroupGenerals] = useState<GeneralItems[]>([]);
  const [groupTraining, setGroupTraining] = useState<TrainingItems | null>(
    null
  );
  const [employees, setEmployees] = useState<Employees | null>(null);
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [userName, setUserName] = useState("");
  const [defaultYears, setDefaultYears] = useState<any>();
  const [selectedKeyYear, setSelectedKeyYear] = useState<any>();
  const [showModal, setShowModal] = useState(false);

  const getUsersHRM = async () => {
    const response = await getUsersFromHRM();
    setUsersHRM(response);
  };

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

  const handleSearch = async () => {
    setLoading(true);
    if (!selectedUserName) {
      return;
    }
    const formData: Partial<any> = {
      userName: selectedUserName,
      years: selectedKeyYear.id,
    };
    const response = await getDataExportByUserName(formData);
    if (response) {
      setDetailUser(response);
      setGroupOther(response.items.other);
      setGroupGenerals(response.items.general);
      setEmployees(response.items.regulation.employees);
      setLecture(response.items.regulation.lecture);
      setGroupTraining(response.items.training);
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
            <span className="text-center text-[13px]">
              {record.determinations.documentDate !== 0
                ? convertTimestampToDate(record.determinations.documentDate)
                : ""}
            </span>
          </div>
        );
      },
      className: "text-center w-[150px]",
    },
    {
      title: <div className="py-1">THỜI GIA HOẠT ĐỘNG</div>,
      dataIndex: "eventTime",
      key: "eventTime",
      className: "text-center w-[140px]",
      children: [
        {
          title: <div className="py-1">TỪ NGÀY</div>,
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
                  </div>
                ) : (
                  ""
                )}
              </>
            );
          },
          className: "text-center w-[100px]",
        },
        {
          title: <div className="py-1">ĐẾN NGÀY</div>,
          dataIndex: "fromDate",
          key: "fromDate",
          render: (_, record: any) => {
            return (
              <>
                {record.determinations.toDate !==
                record.determinations.fromDate ? (
                  <div className="flex flex-col">
                    <span>
                      {convertTimestampToDate(record.determinations.toDate)}
                    </span>
                  </div>
                ) : (
                  ""
                )}
              </>
            );
          },
          className: "text-center w-[100px]",
        },
      ],
    },
    {
      title: (
        <div className="p-1">
          TÀI LIỆU <br /> ĐÍNH KÈM
        </div>
      ),
      dataIndex: "attackment",
      key: "attackment",
      className: "text-center w-[80px]",
      render: (_, item: any) => {
        const path = item.determinations.files[0]?.path;
        return path !== "" && path !== undefined ? (
          <>
            <Link
              href={"https://api-annual.uef.edu.vn/" + path}
              target="__blank"
            >
              <span className="text-green-500">
                <CheckOutlined />
              </span>
            </Link>
          </>
        ) : (
          <>
            <span className="text-red-400">
              <CloseOutlined />
            </span>
          </>
        );
      },
    },
    {
      title: "GHI CHÚ",
      dataIndex: "note",
      key: "note",
      render: (note: string) => <>{note}</>,
      className: "w-[150px]",
    },
  ];

  useEffect(() => {
    setLoading(true);
    document.title = PageTitles.SEARCH;
    const s_username = localStorage.getItem("s_username");
    setUserName(s_username ?? "");
    Promise.all([getDefaultYears(), getUsersHRM()]);
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (selectedKeyYear) handleSearch();
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
                  <span>{Messages.BREAD_CRUMB_SEARCH}</span>
                </>
              ),
            },
          ]}
        />
      </div>
      <div className="grid grid-cols-10 gap-4 mb-3 border-b border-neutral-200 pb-3">
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
              key: user.id,
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
      {loading ? (
        <>
          <LoadingSkeleton />
        </>
      ) : (
        <>
          {detailUser ? (
            <>
              <div className="grid grid-cols-4 gap-6">
                <div
                  className="rounded-lg shadow-lg"
                  style={{
                    backgroundImage: 'url("/wave-bottom.svg")',
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "bottom",
                  }}
                >
                  <div
                    className="py-2 rounded-t-lg text-center font-semibold"
                    style={{ backgroundColor: "#3b82f6" }}
                  >
                    <span className="uppercase text-[14px] text-white tracking-wide">
                      Thông Tin Nhân Sự
                    </span>
                  </div>
                  <div className="flex flex-col py-1">
                    <span className=" text-center text-xl text-neutral-600 font-medium">
                      {detailUser.fullName}
                    </span>
                    <span className="text-center text-sm text-neutral-400">
                      {detailUser.userName}
                    </span>
                  </div>
                  <hr className="mb-2 mx-4 bg-blue-500 h-[2px]" />
                  <div className="flex px-4 pb-5 gap-5">
                    <div className="flex justify-center items-center mb-7">
                      <div className="w-fit h-fit">
                        <Avatar size={60} icon={<UserOutlined />} />
                      </div>
                    </div>
                    <div className="flex-1 flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <img src="/email.svg" width={18} alt="email" />
                        <span className="text-center text-sm text-neutral-500 font-medium">
                          {detailUser.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <img src="/map.svg" width={18} alt="localtion" />
                        <span className="text-center text-sm text-neutral-500 font-medium">
                          {detailUser.unitName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <img src="/flame.svg" width={18} alt="total events" />
                        <span className="text-center text-sm text-neutral-500 font-medium">
                          {detailUser.totalEvents} (sự kiện tham gia)
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <img
                          src="/diploma.svg"
                          width={18}
                          alt="total standar"
                        />
                        <span className="text-center text-sm text-neutral-500 font-medium">
                          {detailUser.items.other.reduce(
                            (acc: number, x: any) => acc + x.totalStandarNumber,
                            0
                          )}
                          (số tiết chuẩn)
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        <Button
                          color="primary"
                          variant="filled"
                          icon={<CloudDownloadOutlined />}
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            const formData: Partial<any> = {
                              userName: userName,
                              years: selectedKeyYear.id,
                            };
                            // handleExportForBMAll(formData);
                            setShowModal(true);
                          }}
                        >
                          Tải các biểu mẫu
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-6 mt-6">
                <Table<Employees>
                  key={"table-detail-employees-regulations"}
                  className="custom-table-header shadow-md rounded-md"
                  bordered
                  rowKey={() => "employees"}
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
                    emptyText: <Empty description={Messages.NO_DATA}></Empty>,
                  }}
                />
                <Table<Lecture>
                  key={"table-detail-lecture-regulations"}
                  className="custom-table-header shadow-md rounded-md"
                  bordered
                  rowKey={() => "lecture"}
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
                    emptyText: <Empty description={Messages.NO_DATA}></Empty>,
                  }}
                />
              </div>
              <div className="mt-6 flex flex-col gap-6">
                <Collapse
                  key="collapse-group-generals"
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
                                <Table<any>
                                  key={`table-group-generals-${index}`}
                                  className="custom-table-header shadow-md rounded-md mb-4"
                                  bordered
                                  rowKey={() => "generals" + index}
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
                                        onClick={async (e) => {
                                          e.stopPropagation();
                                          const formData: Partial<any> = {
                                            userName: userName,
                                            years: selectedKeyYear.id,
                                            formName: group.shortName,
                                          };
                                          const result =
                                            await handleExportForBMGeneral(
                                              formData
                                            );
                                          console.log(result);
                                        }}
                                      >
                                        Tải về {group.shortName}
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
                              );
                            })}
                        </>
                      ),
                    },
                  ]}
                />
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
                                <Table<any>
                                  key={`table-group-others-${index}`}
                                  className="custom-table-header shadow-md rounded-md mb-4"
                                  bordered
                                  rowKey={(item) => item.name + index}
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
                                            formName: group.shortName,
                                          };
                                          // handleExportForBMOther(formData);
                                        }}
                                      >
                                        Tải về {group.shortName}
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
                              );
                            })}
                        </>
                      ),
                    },
                  ]}
                />
              </div>
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
      {showModal && (
        <>
          <Modal
            open={showModal}
            closable={false}
            onOk={() => {
              setShowModal(false);
            }}
            title="Tính năng đang cập nhật"
            width={500}
            cancelButtonProps={{ style: { display: "none" } }}
          >
            <span>Đang cập nhật...</span>
          </Modal>
        </>
      )}
    </section>
  );
};
export default SearchMembers;
