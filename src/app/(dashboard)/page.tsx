"use client";

import MultiLineChart from "@/components/charts/MultiLineChart";
import FaculitiesForms from "@/components/dashboard/FaculitiesForms";
import PercentForms from "@/components/dashboard/PercentForms";
import TopCBForms from "@/components/dashboard/TopCBForms";
import TotalFormCard from "@/components/dashboard/TotalFormCard";
import { getAllLogActivities } from "@/services/history/logActivityServices";
import {
  getAllReports,
  getAllReportsWithTypeTime,
} from "@/services/reports/reportsServices";
import { getAllSchoolYears } from "@/services/schoolYears/schoolYearsServices";
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
import { useEffect, useState } from "react";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [defaultYears, setDefaultYears] = useState<any>();
  const [selectedKey, setSelectedKey] = useState<any>();
  const [dataReports, setDataReports] = useState<any>();
  const [dataMultiLine, setDataMultiLine] = useState<any>();
  const [dataHistory, setDataHistory] = useState<any>();
  const [valueMultiLine, setValueMultiLine] = useState("Tháng");

  const getDefaultYears = async () => {
    const response = await getAllSchoolYears();
    setDefaultYears(response.items);
    const yearId = response.items.filter((x: any) => x.isDefault)[0] as any;
    setSelectedKey(yearId);
    Promise.all([
      getReports(yearId.id),
      getMultiLieChart(yearId.id, valueMultiLine),
      getHistory(yearId.id),
    ]);
  };

  const getReports = async (id: string) => {
    const response = await getAllReports(id);
    setDataReports(response);
  };

  const getMultiLieChart = async (id: string, type: string) => {
    let temp = type === "Tháng" ? "month" : type === "Quý" ? "quarter" : "year";
    const response = await getAllReportsWithTypeTime(id, temp);
    setDataMultiLine(response);
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

  const handleChangeYear = (value: any) => {
    setLoading(true);
    const temp = defaultYears.filter((x: any) => x.id === value)[0] as any;
    setSelectedKey(temp);
    Promise.all([
      getReports(temp.id),
      getMultiLieChart(temp.id, valueMultiLine),
      getHistory(temp.id),
    ]);
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timeoutId);
  };

  useEffect(() => {
    document.title = PageTitles.HOME;
    getDefaultYears();
  }, [valueMultiLine]);

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
                      options={["Thêm mới", "Cập nhật", "Phê duyệt"]}
                    />
                    <Segmented
                      options={["Tháng", "Quý"]}
                      value={valueMultiLine}
                      onChange={setValueMultiLine}
                    />
                  </div>
                </div>
                <hr />
                <div className="h-full px-3 py-2 flex items-center justify-center">
                  {dataMultiLine && (
                    <>
                      <div className="my-[-20px] w-full">
                        <MultiLineChart
                          categories={dataMultiLine.categories}
                          seriesData={dataMultiLine.data}
                        />
                      </div>
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
            <FaculitiesForms />
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
                    <Timeline
                      items={dataHistory}
                      className="h-fit mt-3 mb-[-100px]"
                    />
                  </>
                ) : (
                  <div className="flex items-center">
                    <Empty description="Không có dữ liệu..."></Empty>
                  </div>
                )}
              </div>
            </div>
            <TopCBForms />
          </section>
        </>
      )}
    </section>
  );
};
export default Home;
