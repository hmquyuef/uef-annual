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
  getListUnitsFromHrm,
  UnitHRMItem,
} from "@/services/units/unitsServices";
import {
  getUsersFromHRMbyId,
  UsersFromHRMResponse,
} from "@/services/users/usersServices";
import { convertTimestampToDate } from "@/utility/Utilities";
import {
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

const SearchMembers = () => {
  const [selectedKey, setSelectedKey] = useState<Key | null>(null);
  const [unitsHRM, setUnitsHRM] = useState<UnitHRMItem[]>([]);
  const [usersHRM, setUsersHRM] = useState<UsersFromHRMResponse | undefined>(
    undefined
  );
  const [selectedUnitKey, setSelectedUnitKey] = useState<Key | null>(null);
  const [selectedUserName, setSelectedUserName] = useState("");
  const [year, setYear] = useState("2024");
  const [detailUser, setDetailUser] = useState<DetailUserItem | undefined>(
    undefined
  );
  const [dataClassLeaders, setDataClassLeaders] = useState<Item[]>([]);
  const [dataAssistants, setDataAssistants] = useState<Item[]>([]);
  const [dataQAEs, setDataQAEs] = useState<Item[]>([]);
  const [dataActivities, setDataActivities] = useState<Item[]>([]);
  const getListUnisHRM = async () => {
    const response = await getListUnitsFromHrm();
    setUnitsHRM(response.model);
  };
  const getUsersHRMByUnitId = async (unitId: string) => {
    const response = await getUsersFromHRMbyId(unitId);
    setUsersHRM(response);
  };

  const handleSearch = async () => {
    const response = await getDataExportByUserName(
      selectedUnitKey as string,
      selectedUserName,
      year
    );
    if (response) {
      console.log("response :>> ", response);
      setDetailUser(response);
      setDataClassLeaders(response.classLeaders.items);
      setDataAssistants(response.assistants.items);
      setDataQAEs(response.qAs.items);
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
                handleExportForBM(
                  selectedUnitKey as string,
                  selectedUserName,
                  year,
                  "BM01"
                )
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
                handleExportForBM(
                  selectedUnitKey as string,
                  selectedUserName,
                  year,
                  "BM02"
                )
              }
            >
              BM02 - Cố vấn học tập, trợ giảng, phụ đạo
            </p>
          ),
        },
        {
          key: "2-4",
          label: (
            <p
              onClick={() =>
                handleExportForBM(
                  selectedUnitKey as string,
                  selectedUserName,
                  year,
                  "BM04"
                )
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
                handleExportForBM(
                  selectedUnitKey as string,
                  selectedUserName,
                  year,
                  "BM05"
                )
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
      title: "STT",
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
      title: "TỔNG SỐ TIẾT CHUẨN",
      dataIndex: "totalStandarNumber",
      key: "totalStandarNumber",
      className: "text-center w-[15rem]",
      render: (totalStandarNumber: string) => <p>{totalStandarNumber}</p>,
    },
    {
      title: "",
      dataIndex: "actions",
      key: "actions",
      className: "text-center w-[15px]",
      render: (record: DetailUserItem) => {
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
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      render: (_, __, index) => <p>{index + 1}</p>,
      className: "text-center w-[50px]",
    },
    {
      title: "Các hoạt động đã thực hiện",
      dataIndex: "activityName",
      key: "activityName",
      render: (activityName: string) => <p>{activityName}</p>,
      className: "w-[4/5]",
    },
    {
      title: "Số tiết chuẩn",
      dataIndex: "standarNumber",
      key: "standarNumber",
      className: "text-center w-[15rem]",
      render: (standarNumber: string) => <p>{standarNumber}</p>,
    },
    {
      title: "THỜI GIAN THAM DỰ",
      dataIndex: "attendances",
      key: "attendances",
      render: (attendances: number) =>
        attendances ? convertTimestampToDate(attendances) : "",
      className: "text-center w-[150px]",
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      render: (note: string) => <p>{note}</p>,
      className: "text-center w-[150px]",
    },
  ];

  useEffect(() => {
    getListUnisHRM();
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
          <p className="font-medium text-neutral-600 text-sm">Đơn vị</p>
          <Select
            showSearch
            placeholder="Chọn đơn vị"
            optionFilterProp="label"
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            options={unitsHRM.map((unit) => ({
              value: unit.id,
              label: unit.name,
            }))}
            onChange={(value) => {
              setSelectedUnitKey(value);
              getUsersHRMByUnitId(value);
            }}
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <p className="font-medium text-neutral-600 text-sm">Mã CB-GV-NV</p>
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
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <p className="font-medium text-neutral-600 text-sm">Năm học</p>
            <Select
              showSearch
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={[
                {
                  value: "2024",
                  label: "2024-2025",
                },
              ]}
              value={year || "2024"}
              onChange={(value) => {
                setYear(value);
              }}
            />
          </div>
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
                    defaultActiveKey={["1"]}
                    className="mb-4 uppercase"
                    expandIconPosition="end"
                    items={[
                      {
                        key: "1",
                        label: `${detailUser.classLeaders.shortName} - ${detailUser.classLeaders.name} (${detailUser.classLeaders.totalItems} sự kiện)`,
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
                                      Tổng số tiết chuẩn
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
                    className="mb-4 uppercase"
                    expandIconPosition="end"
                    items={[
                      {
                        key: "2",
                        label: `${detailUser.assistants.shortName} - ${detailUser.assistants.name} (${detailUser.assistants.totalItems} sự kiện)`,
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
                                      Tổng số tiết chuẩn
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
            {detailUser.qAs && (
              <>
                <div className="mb-4">
                  <Collapse
                    key={Math.random().toString(36).substr(2, 9)}
                    collapsible="header"
                    defaultActiveKey={["1"]}
                    className="mb-4 uppercase"
                    expandIconPosition="end"
                    items={[
                      {
                        key: "3",
                        label: `${detailUser.qAs.shortName} - ${detailUser.qAs.name} (${detailUser.qAs.totalItems} sự kiện)`,
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
                                      Tổng số tiết chuẩn
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
                    className="mb-4 uppercase"
                    expandIconPosition="end"
                    items={[
                      {
                        key: "5",
                        label: `${detailUser.activities.shortName} - ${detailUser.activities.name} (${detailUser.activities.totalItems} sự kiện)`,
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
                                      Tổng số tiết chuẩn
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
