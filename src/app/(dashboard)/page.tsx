"use client";

import BarChart from "@/components/charts/BarChart";
import DonutChart from "@/components/charts/DonutChart";
import MultiLineChart from "@/components/charts/MultiLineChart";
import PercentForms from "@/components/dashboard/PercentForms";
import TopHumanChart from "@/components/dashboard/TopHumanChart";
import TotalFormCard from "@/components/dashboard/TotalFormCard";
import { getAllLogActivities } from "@/services/history/logActivityServices";
import {
  getAllReports,
  getDataFaculties,
  getDataFacultiesById,
  getDataHuman,
  getReportMultiMonths,
  getReportMultiYears,
} from "@/services/reports/reportsServices";
import { getAllSchoolYears } from "@/services/schoolYears/schoolYearsServices";
import { getAllUnits, UnitItem } from "@/services/units/unitsServices";
import PageTitles from "@/utility/Constraints";
import { convertTimestampToFullDateTime } from "@/utility/Utilities";
import {
  HomeOutlined,
  LineChartOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Empty,
  Segmented,
  Select,
  Spin,
  Timeline,
} from "antd";
import { Key, useEffect, useState } from "react";

const Home = () => {
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
  const [dataHuman, setDataHuman] = useState<any>();
  const [units, setUnits] = useState<UnitItem[]>([]);
  const [selectedKeyUnit, setSelectedKeyUnit] = useState<Key | null>(null);

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
    const yearId = responseSchoolYear.items.filter((x: any) => x.isDefault)[0] as any;
    setSelectedKey(yearId);
    const tempUnits = responseUnits.items.sort((a, b) => a.name.localeCompare(b.name));
    Promise.all([
      getReports(yearId.id),
      getMultiLineMonths(yearId.id),
      getHistory(yearId.id),
      getFacultiesChart(yearId.id),
      getHumanChart(yearId.id),
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
          .slice(0, 5)
          .map((item) => {
            const message =
              item.method === "GET"
                ? "đã xem"
                : item.method === "POST"
                ? "đã tạo"
                : item.method === "PUT"
                ? "đã cập nhật"
                : "đã xóa";
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
                <div className="mb-[-16px]">
                  <p className="text-[13px]">
                    <span className="font-semibold text-blue-500">
                      {item.username}
                    </span>{" "}
                    {message}{" "}
                    <span className="font-semibold text-blue-500">
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

  const getHumanChart = async (yearId: string) => {
    const response = await getDataHuman(yearId);
    setDataHuman(response.items);
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
      getHumanChart(temp.id),
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
    <section>
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
            //
            value={selectedKey && selectedKey.title}
            onChange={(value) => handleChangeYear(value)}
            className="w-fit"
          />
        </div>
      </div>
      <hr className="mb-3" />
      {loading ? (
        <>
          <Spin tip="Đang tải dữ liệu...">{<div className="p-[80px]" />}</Spin>
        </>
      ) : (
        <>
          {dataReports && (
            <>
              <div className="grid grid-cols-5 gap-4 mb-4">
                <TotalFormCard data={dataReports.form_BM01} color="blue" />
                <TotalFormCard data={dataReports.form_BM02} color="green" />
                <TotalFormCard data={dataReports.form_BM03} color="orange" />
                <TotalFormCard data={dataReports.form_BM04} color="red" />
                <TotalFormCard data={dataReports.form_BM05} color="violet" />
              </div>
            </>
          )}
          <section className="mb-4">
            <div className="grid grid-cols-5 gap-4">
              <div className="bg-white flex flex-col rounded-lg shadow-lg cursor-pointer">
                <div className="px-4 py-3 flex justify-between items-center">
                  <span className="text-neutral-400 font-semibold text-[14px]">
                    Các hoạt động gần đây
                  </span>
                  <Button type="text" shape="circle" icon={<MoreOutlined />} />
                </div>
                <hr />
                <div className="h-full p-3 flex justify-center mt-2">
                  {dataHistory && dataHistory.length > 0 ? (
                    <>
                      <Timeline items={dataHistory} className="h-fit mt-3" />
                    </>
                  ) : (
                    <div className="flex items-center">
                      <Empty description="Không có dữ liệu..."></Empty>
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-white col-span-3 flex flex-col rounded-lg shadow-lg cursor-pointer">
                <div className="px-4 py-3 flex justify-between items-center">
                  <span className="text-neutral-400 font-semibold text-[14px]">
                    Tầng suất sử dụng
                  </span>
                  <div className="flex gap-4">
                    <Segmented
                      options={["Tháng", "Năm"]}
                      onChange={(value) => handleChangeMultiLineType(value)}
                    />
                  </div>
                </div>
                <hr />
                <div className="h-full px-3 py-2 flex items-center justify-center">
                  {typeChart === "month" ? (
                    <>
                      {dataMultiLineMonths && (
                        <>
                          <div className="my-[-20px] w-full">
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
                          <div className="my-[-20px] w-full">
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
              <div className="bg-white flex flex-col rounded-lg shadow-lg cursor-pointer">
                <div className="px-4 py-3 flex justify-between items-center">
                  <span className="text-neutral-400 font-semibold text-[14px]">
                    Tỉ lệ phê duyệt
                  </span>
                  <Button type="text" shape="circle" icon={<MoreOutlined />} />
                </div>
                <hr />
                {dataReports && (
                  <>
                    <div className="h-full px-3 flex flex-col items-center justify-center gap-[18px]">
                      <PercentForms data={dataReports.form_BM01} color="blue" />
                      <PercentForms
                        data={dataReports.form_BM02}
                        color="green"
                      />
                      <PercentForms
                        data={dataReports.form_BM03}
                        color="orange"
                      />
                      <PercentForms data={dataReports.form_BM04} color="red" />
                      <PercentForms
                        data={dataReports.form_BM05}
                        color="violet"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>
          <section className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-white flex flex-col rounded-lg shadow-lg cursor-pointer">
              <div className="px-4 py-3 flex justify-between items-center">
                <span className="text-neutral-400 font-semibold text-[14px]">
                  Thống kê sự kiện theo Khoa
                </span>
                <Button type="text" shape="circle" icon={<MoreOutlined />} />
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
              <div className="px-4 py-3 flex justify-between items-center">
                <span className="text-neutral-400 font-semibold text-[14px]">
                  Các hoạt động gần đây
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
            {dataHuman && <TopHumanChart data={dataHuman} />}
          </section>
        </>
      )}
    </section>
  );
};
export default Home;
