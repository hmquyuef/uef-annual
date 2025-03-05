"use client";

import BarChart from "@/components/charts/BarChart";
import DonutChart from "@/components/charts/DonutChart";
import MultiLineChart from "@/components/charts/MultiLineChart";
import PercentForms from "@/components/dashboard/PercentForms";
import TotalFormCard from "@/components/dashboard/TotalFormCard";
import { LoadingSpin } from "@/components/skeletons/LoadingSpin";
import { getAllLogActivities } from "@/services/history/logActivityServices";
import {
  getAllReports,
  getDataFaculties,
  getDataFacultiesById,
  getReportMultiMonths,
  getReportMultiYears,
} from "@/services/reports/reportsServices";
import { getAllSchoolYears } from "@/services/schoolYears/schoolYearsServices";
import { getAllUnits, UnitItem } from "@/services/units/unitsServices";
import PageTitles from "@/utility/Constraints";
import { convertTimestampToFullDateTime } from "@/utility/Utilities";
import { HomeOutlined, LineChartOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  Empty,
  Segmented,
  Select,
  Statistic,
  StatisticProps,
  Table,
  Tabs,
  TabsProps,
  Timeline,
} from "antd";
import { Key, useEffect, useState } from "react";
import CountUp from "react-countup";

const Home = () => {
  const listUnions = ["bm13", "bm15"];
  const listTrainings = ["bm07"];
  const listGenerals = ["bm08", "bm09", "bm10", "bm11", "bm12"];
  const listOthers = ["bm01", "bm02", "bm03", "bm04", "bm05", "bm14"];

  const [loading, setLoading] = useState(false);
  const [defaultYears, setDefaultYears] = useState<any>();
  const [selectedKey, setSelectedKey] = useState<any>();
  const [dataReports, setDataReports] = useState<any>();
  const [dataMultiLineMonths, setDataMultiLineMonths] = useState<any>();
  const [dataMultiLineYears, setDataMultiLineYears] = useState<any>();
  const [typeChart, setTypeChart] = useState<string>("month");
  const [dataHistory, setDataHistory] = useState<any>();
  const [dataFaculties, setDataFaculties] = useState<any>();
  const [dataFacultyById, setDataFacultyById] = useState<any>();
  const [units, setUnits] = useState<UnitItem[]>([]);
  const [selectedKeyUnit, setSelectedKeyUnit] = useState<Key | null>(null);
  const formatter: StatisticProps["formatter"] = (value) => (
    <CountUp end={value as number} duration={3} separator="," />
  );

  const onChange = (key: string) => {
    console.log(key);
  };

  const columns = [
    {
      title: <div className="py-2">STT</div>,
      dataIndex: "stt",
      key: "stt",
      render: (_: any, __: any, index: number) => {
        return <>{index + 1}</>;
      },
      className: "text-center w-[40px]",
    },
    {
      title: "VIẾT TẮT",
      dataIndex: "shortName",
      key: "shortName",
      className: "text-center w-[100px]",
      render: (shortName: string) => <>{shortName.toLocaleUpperCase()}</>,
    },
    {
      title: "BIỂU MẪU",
      dataIndex: "formName",
      key: "formName",
      className: "max-w-1/2",
      render: (formName: string) => <>{formName}</>,
    },
    {
      title: "NHÓM",
      dataIndex: "groupName",
      key: "groupName",
      className: "text-center w-[200px]",
      render: (groupName: string) => <>{groupName}</>,
    },
    {
      title: "SỐ HOẠT ĐỘNG",
      dataIndex: "totalItems",
      key: "totalItems",
      className: "text-center w-[150px]",
      render: (totalItems: string) => <>{totalItems}</>,
    },
  ];

  const generateTab = (key: string, label: string, filterList: string[]) => ({
    key,
    label,
    children: (
      <Table
        size="small"
        pagination={false}
        bordered
        dataSource={dataReports?.items.filter((x: any) =>
          filterList.includes(x.shortName)
        )}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell
              colSpan={4}
              index={0}
              className="text-center font-semibold text-base bg-blue-50"
            >
              Tổng số hoạt động
            </Table.Summary.Cell>
            <Table.Summary.Cell
              index={5}
              className="text-center font-semibold text-base bg-blue-50"
            >
              {dataReports?.items
                .filter((x: any) => filterList.includes(x.shortName))
                .reduce((acc: number, cur: any) => acc + cur.totalItems, 0)}
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
        columns={columns}
        className="custom-table-header"
      />
    ),
  });

  const items: TabsProps["items"] = [
    generateTab("1", "Nội quy lao động", listUnions),
    generateTab("2", "Bồi dưỡng trình độ", listTrainings),
    generateTab("3", "Công tác chung", listGenerals),
    generateTab("4", "Công tác khác", listOthers),
  ];

  const getListUnits = async () => {
    const response = await getAllUnits("true");
    const temp = response.items.sort((a, b) => a.name.localeCompare(b.name));
    setUnits(temp);
    setSelectedKeyUnit(temp[0].id);
  };

  const getDefaultYears = async () => {
    setLoading(true);
    const [responseSchoolYear, responseUnits] = await Promise.all([
      getAllSchoolYears(),
      getAllUnits("true"),
    ]);
    setDefaultYears(responseSchoolYear.items);
    const yearId = responseSchoolYear.items.filter(
      (x: any) => x.isDefault
    )[0] as any;
    setSelectedKey(yearId);
    const tempUnits = responseUnits.items.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    Promise.all([
      getReports(yearId.id),
      getMultiLineMonths(yearId.id),
      getHistory(yearId.id),
      getFacultiesChart(yearId.id),
      getFacultiesChartById(yearId.id, tempUnits[0].id),
    ]);
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timeoutId);
  };

  const getReports = async (id: string) => {
    const response = await getAllReports(id);
    setDataReports(response);
  };

  const getMultiLineMonths = async (id: string) => {
    const response = await getReportMultiMonths(id);
    setDataMultiLineMonths(response);
    setTypeChart("month");
  };

  const getMultiLineYears = async () => {
    const response = await getReportMultiYears();
    setDataMultiLineYears(response);
    setTypeChart("year");
  };

  const getHistory = async (id: string) => {
    const response = await getAllLogActivities(id);
    setDataHistory(
      response &&
        response.items
          .filter((x) => x.method !== "GET")
          .slice(0, 7)
          .map((item) => {
            const message = item.method === "GET" ? "đã xem" : "đã";
            return {
              color:
                item.method === "GET"
                  ? "blue"
                  : item.method === "POST"
                  ? "green"
                  : item.method === "PUT"
                  ? "orange"
                  : "red",
              children: (
                <div className="border-b">
                  <p className="text-sm">
                    <span className="font-semibold text-blue-500">
                      {item.username}
                    </span>{" "}
                    {message}{" "}
                    <span
                      className={`font-semibold text-${
                        item.method === "GET"
                          ? "blue"
                          : item.method === "POST"
                          ? "green"
                          : item.method === "PUT"
                          ? "orange"
                          : "red"
                      }-500`}
                    >
                      {item.functionName}
                    </span>
                  </p>
                  <p className="text-[12px] text-neutral-400 text-end">
                    {convertTimestampToFullDateTime(item.creationTime)}
                  </p>
                </div>
              ),
            };
          })
    );
  };

  const getFacultiesChart = async (yearId: string) => {
    const response = await getDataFaculties(yearId);
    setDataFaculties(response);
  };

  const getFacultiesChartById = async (yearId: string, id: string) => {
    const response = await getDataFacultiesById(yearId, id);
    setDataFacultyById(response);
  };

  const handleChangeYear = (value: any) => {
    setLoading(true);
    const temp = defaultYears.filter((x: any) => x.id === value)[0] as any;
    setSelectedKey(temp);
    Promise.all([
      getReports(temp.id),
      getMultiLineMonths(temp.id),
      getHistory(temp.id),
      getFacultiesChart(temp.id),
      getFacultiesChartById(temp.id, units[0].id),
    ]);
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timeoutId);
  };

  const handleChangeMultiLineType = async (value: string) => {
    if (value === "Tháng") {
      getMultiLineMonths(selectedKey.id);
    } else {
      getMultiLineYears();
    }
  };

  useEffect(() => {
    document.title = PageTitles.HOME;
    Promise.all([getDefaultYears(), getListUnits()]);
  }, []);

  return (
    <section className="px-2">
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
                  <LineChartOutlined />
                  <span>Bảng điều khiển</span>
                </>
              ),
            },
          ]}
        />
      </div>
      <div className="grid grid-cols-6 gap-5 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-medium text-neutral-500">
            Năm học:
          </span>
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
            value={selectedKey && selectedKey.title}
            onChange={(value) => handleChangeYear(value)}
            className="w-fit"
          />
        </div>
      </div>
      <hr className="mb-3" />
      {loading ? (
        <>
          <LoadingSpin isLoadingSpin={loading} />
        </>
      ) : (
        <>
          <section className="grid grid-cols-3 gap-6 my-6">
            <div className="bg-white flex flex-col justify-between rounded-lg shadow-lg">
              <div className="px-4 py-3 h-14 border-b">
                <span className="text-neutral-400 align-middle">Tổng quan</span>
              </div>
              <div
                className="flex flex-col justify-center items-center"
                style={{ height: "calc(100% - 56px)" }}
              >
                <div className="flex flex-col items-center mb-6">
                  {dataReports && (
                    <>
                      <Statistic
                        value={dataReports.totalItems}
                        formatter={formatter}
                        valueStyle={{ fontSize: "72px", color: "black" }}
                      />
                    </>
                  )}
                  <span className="text-neutral-400 text-sm">
                    Tổng số hoạt động
                  </span>
                </div>
                {dataReports && (
                  <>
                    <TotalFormCard data={dataReports.items} />
                  </>
                )}
              </div>
            </div>
            <div className="col-span-2 h-[550px] bg-white rounded-lg shadow-lg cursor-pointer">
              <div className="px-4 py-3 h-14 flex justify-between items-center">
                <span className="text-neutral-400 align-middle">
                  Thống kê các hoạt động theo thời gian
                </span>
                <div className="flex gap-4">
                  <Segmented
                    options={["Tháng", "Năm"]}
                    onChange={(value) => handleChangeMultiLineType(value)}
                  />
                </div>
              </div>
              <hr />
              <div className="h-fit px-4 py-5 flex items-center justify-center">
                {typeChart === "month" ? (
                  <>
                    {dataMultiLineMonths && (
                      <>
                        <div className="w-full">
                          <MultiLineChart
                            categories={dataMultiLineMonths.categories}
                            seriesData={dataMultiLineMonths.data}
                          />
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {dataMultiLineYears && (
                      <>
                        <div className="w-full">
                          <MultiLineChart
                            categories={dataMultiLineYears.categories}
                            seriesData={dataMultiLineYears.data}
                          />
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </section>
          <section className="grid grid-cols-3 gap-6 mb-6">
            <div className="col-span-2 bg-white flex flex-col rounded-lg shadow-lg cursor-pointer">
              <div className="px-4 py-3 h-14 flex justify-between items-center">
                <span className="text-neutral-400 align-middle">
                  Thông tin các biểu mẫu
                </span>
              </div>
              <hr />
              {dataReports && (
                <>
                  <div className="h-full px-6 py-2">
                    <Tabs
                      defaultActiveKey="1"
                      items={items}
                      onChange={onChange}
                      indicator={{
                        size: (origin: any) => origin - 20,
                        align: "center",
                      }}
                      className="h-full"
                    />
                  </div>
                </>
              )}
            </div>
            <div className="bg-white flex flex-col rounded-lg shadow-lg cursor-pointer">
              <div className="px-4 py-3 h-14 flex justify-between items-center">
                <span className="text-neutral-400 align-middle">
                  Tỉ lệ phê duyệt
                </span>
              </div>
              <hr />
              <div className="h-full px-6 py-4 flex flex-col gap-4">
                {dataReports &&
                  dataReports.items
                    .filter((form: any) => listOthers.includes(form.shortName))
                    .map((form: any, index: number) => {
                      return (
                        <PercentForms
                          key={`percent-form-${index}`}
                          data={form}
                          color={index}
                        />
                      );
                    })}
              </div>
            </div>
          </section>
          <section className="grid grid-cols-3 gap-6 mb-6">
            <div className="bg-white flex flex-col rounded-lg shadow-lg cursor-pointer">
              <div className="px-4 py-3 h-14 flex justify-between items-center">
                <span className="text-neutral-400 align-middle">
                  Thống kê hoạt động theo đơn vị
                </span>
              </div>
              <hr />
              <div className="h-full p-3 flex justify-center mt-2">
                {dataFaculties && (
                  <>
                    <div className="my-[-20px] w-full">
                      <BarChart
                        categories={dataFaculties.categories ?? []}
                        seriesData={dataFaculties.data ?? []}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="bg-white flex flex-col rounded-lg shadow-lg cursor-pointer">
              <div className="px-4 py-3 h-14 flex justify-between items-center">
                <span className="text-neutral-400 align-middle">
                  Tổng hợp hoạt động theo
                </span>
                <Select
                  showSearch
                  placeholder=" "
                  optionFilterProp="label"
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  options={units.map((unit: UnitItem, index) => ({
                    value: unit.id,
                    label: unit.name,
                    key: `${unit.idHrm}-${index}`,
                  }))}
                  value={selectedKeyUnit}
                  onChange={(value) => {
                    setSelectedKeyUnit(value);
                    getFacultiesChartById(selectedKey.id, value as string);
                  }}
                  className="w-3/5"
                />
              </div>
              <hr />
              <div className="h-full p-3 flex justify-center mt-2">
                {dataFacultyById && (
                  <DonutChart
                    categories={dataFacultyById.categories}
                    seriesData={dataFacultyById.data}
                  />
                )}
              </div>
            </div>
            <div className="bg-white flex flex-col rounded-lg shadow-lg cursor-pointer">
              <div className="px-4 py-3 h-14 flex justify-between items-center">
                <span className="text-neutral-400 align-middle">
                  Các hoạt động gần đây
                </span>
              </div>
              <hr />
              <div className="px-3 pt-8 flex justify-center">
                {dataHistory ? (
                  <>
                    <Timeline items={dataHistory} className="h-fit w-11/12" />
                  </>
                ) : (
                  <div className="flex items-center">
                    <Empty description="Không có dữ liệu..."></Empty>
                  </div>
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </section>
  );
};
export default Home;
