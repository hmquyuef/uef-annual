"use client";

import {
  DetailsItem,
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
import {
  HomeOutlined,
  ProfileOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Collapse,
  Divider,
  Empty,
  PaginationProps,
  Select,
  Table,
  TableColumnsType,
} from "antd";
import { TableRowSelection } from "antd/es/table/interface";
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
  const [selectedRowKeysClassLeaders, setSelectedRowKeysClassLeaders] =
    useState<Key[]>([]);
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
      title: "Mã số CB-GV-NV",
      dataIndex: "userName",
      key: "userName",
      render: (userName: string) => <p>{userName}</p>,
      className: "text-center w-[200px]",
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      render: (fullName: string) => <p>{fullName}</p>,
      className: "text-center w-[200px]",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email: string) => <p>{email}</p>,
      className: "text-center w-[200px]",
    },
    {
      title: "Đơn vị",
      dataIndex: "unitName",
      key: "unitName",
      render: (unitName: string) => <p>{unitName}</p>,
      className: "text-center w-[100px]",
    },
    {
      title: "Tổng số tiết chuẩn được phê duyệt",
      dataIndex: "totalStandarNumber",
      key: "totalStandarNumber",
      className: "text-center w-[15rem]",
      render: (totalStandarNumber: string) => <p>{totalStandarNumber}</p>,
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
      title: "Số tiết chuẩn được phê duyệt",
      dataIndex: "standarNumber",
      key: "standarNumber",
      className: "text-center w-[15rem]",
      render: (standarNumber: string) => <p>{standarNumber}</p>,
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
                    collapsible="header"
                    defaultActiveKey={["1"]}
                    className="mb-4 uppercase"
                    items={[
                      {
                        key: "1",
                        label: `${detailUser.classLeaders.shortName} - ${detailUser.classLeaders.name} (${detailUser.classLeaders.totalItems} sự kiện)`,
                        children: (
                          <>
                            <Table<Item>
                              key={"table-detail-class-leaders"}
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
                    collapsible="header"
                    defaultActiveKey={["1"]}
                    className="mb-4 uppercase"
                    items={[
                      {
                        key: "2",
                        label: `${detailUser.assistants.shortName} - ${detailUser.assistants.name} (${detailUser.assistants.totalItems} sự kiện)`,
                        children: (
                          <>
                            <Table<Item>
                              key={"table-detail-assistants"}
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
                    collapsible="header"
                    defaultActiveKey={["1"]}
                    className="mb-4 uppercase"
                    items={[
                      {
                        key: "3",
                        label: `${detailUser.qAs.shortName} - ${detailUser.qAs.name} (${detailUser.qAs.totalItems} sự kiện)`,
                        children: (
                          <>
                            <Table<Item>
                              key={"table-detail-qae"}
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
                    collapsible="header"
                    defaultActiveKey={["1"]}
                    className="mb-4 uppercase"
                    items={[
                      {
                        key: "5",
                        label: `${detailUser.activities.shortName} - ${detailUser.activities.name} (${detailUser.activities.totalItems} sự kiện)`,
                        children: (
                          <>
                            <Table<Item>
                              key={"table-detail-activities"}
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
        {/* {!detailUser && (
          <>
            <Table<ClassLeaderItem>
              key={"table-activity-bm01"}
              className="custom-table-header shadow-md rounded-md"
              bordered
              rowKey={(item) => item.id}
              rowHoverable
              size="small"
              pagination={{
                total: data.length,
                showTotal: showTotal,
                showSizeChanger: true,
                position: ["bottomRight"],
                defaultPageSize: 15,
                pageSizeOptions: ["15", "25", "50", "100"],
              }}
              rowSelection={rowSelection}
              columns={columns}
              dataSource={data}
              locale={{ emptyText: <Empty description="No Data"></Empty> }}
            />
          </>
        )} */}
      </div>
    </div>
  );
};
export default SearchMembers;
