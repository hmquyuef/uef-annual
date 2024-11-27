"use client";

import ColumnChart from "@/components/charts/ColumnChart";
import RadialBarChart from "@/components/charts/RadialBarChart";
import PercentForms from "@/components/dashboard/PercentForms";
import PageTitles from "@/utility/Constraints";
import { FastBackwardOutlined, MoreOutlined } from "@ant-design/icons";
import { Button, Dropdown, Empty, MenuProps, Segmented, Timeline } from "antd";
import { useEffect, useState } from "react";

const Home = () => {
  const [options, setOptions] = useState(["Tháng", "Quý", "Năm"]);
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "Theo tuần",
    },
    {
      key: "2",
      label: "Theo tháng",
    },
    {
      key: "3",
      label: "Theo năm",
    },
  ];

  useEffect(() => {
    document.title = PageTitles.HOME;
  }, []);

  return (
    <div>
      <div className="mb-4">Trang chủ</div>
      <div className="grid grid-cols-5 gap-4 mb-4">
        <div className="cursor-pointer transition-transform duration-300 hover:-translate-y-2">
          <div className="flex justify-center">
            <div className="w-2/3 bg-[#fcfaf6] shadow-sm shadow-blue-100 hover:shadow-blue-200 rounded-lg h-5" />
          </div>
          <div className="bg-blue-50 rounded-lg h-32 shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300 mt-[-8px] p-4">
            <div className="grid grid-rows-3 h-full">
              <div className="row-span-2 flex justify-between items-start mt-1">
                <div className="w-full flex flex-col">
                  <span className="text-blue-400 font-semibold text-[14px]">
                    Biểu mẫu 01
                  </span>
                  <div className="px-4">
                    <span className="font-bold font-serif text-blue-500 text-4xl">
                      3,485
                    </span>
                    <span className="text-blue-400 text-[13px] ms-2">
                      sự kiện
                    </span>
                  </div>
                </div>
                <FastBackwardOutlined className="p-3 bg-blue-100 text-blue-600 text-2xl rounded-lg" />
              </div>
              <div className="flex justify-between items-end">
                <span className="text-[13px] text-blue-400">Tỷ lệ: 20%</span>
                <span className="text-[13px] text-blue-400 hover:text-blue-500 hover:underline">
                  Xem chi tiết
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="cursor-pointer transition-transform duration-300 hover:-translate-y-2">
          <div className="flex justify-center">
            <div className="w-2/3 bg-[#fcfaf6] shadow-sm shadow-green-100 hover:shadow-green-200 rounded-lg h-5" />
          </div>
          <div className="bg-green-50 rounded-lg h-32 shadow-md shadow-green-200 hover:shadow-lg hover:shadow-green-300 mt-[-8px] p-4">
            <div className="grid grid-rows-3 h-full">
              <div className="row-span-2 flex justify-between items-start mt-1">
                <div className="w-full flex flex-col">
                  <span className="text-green-400 font-semibold text-[14px]">
                    Biểu mẫu 02
                  </span>
                  <div className="px-4">
                    <span className="font-bold font-serif text-green-500 text-4xl">
                      851
                    </span>
                    <span className="text-green-400 text-[13px] ms-2">
                      sự kiện
                    </span>
                  </div>
                </div>
                <FastBackwardOutlined className="p-3 bg-green-100 text-green-600 text-2xl rounded-lg" />
              </div>
              <div className="flex justify-between items-end">
                <span className="text-[13px] text-green-400">Tỷ lệ: 20%</span>
                <span className="text-[13px] text-green-400 hover:text-green-500 hover:underline">
                  Xem chi tiết
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="cursor-pointer transition-transform duration-300 hover:-translate-y-2">
          <div className="flex justify-center">
            <div className="w-2/3 bg-[#fcfaf6] shadow-sm shadow-orange-100 hover:shadow-orange-200 rounded-lg h-5" />
          </div>
          <div className="bg-orange-50 rounded-lg h-32 shadow-md shadow-orange-200 hover:shadow-lg hover:shadow-orange-300 mt-[-8px] p-4">
            <div className="grid grid-rows-3 h-full">
              <div className="row-span-2 flex justify-between items-start mt-1">
                <div className="w-full flex flex-col">
                  <span className="text-orange-400 font-semibold text-[14px]">
                    Biểu mẫu 03
                  </span>
                  <div className="px-4">
                    <span className="font-bold font-serif text-orange-500 text-4xl">
                      1,524
                    </span>
                    <span className="text-orange-400 text-[13px] ms-2">
                      sự kiện
                    </span>
                  </div>
                </div>
                <FastBackwardOutlined className="p-3 bg-orange-100 text-orange-600 text-2xl rounded-lg" />
              </div>
              <div className="flex justify-between items-end">
                <span className="text-[13px] text-orange-400">Tỷ lệ: 20%</span>
                <span className="text-[13px] text-orange-400 hover:text-orange-500 hover:underline">
                  Xem chi tiết
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="cursor-pointer transition-transform duration-300 hover:-translate-y-2">
          <div className="flex justify-center">
            <div className="w-2/3 bg-[#fcfaf6] shadow-sm shadow-red-100 hover:shadow-red-200 rounded-lg h-5" />
          </div>
          <div className="bg-red-50 rounded-lg h-32 shadow-md shadow-red-200 hover:shadow-lg hover:shadow-red-300 mt-[-8px] p-4">
            <div className="grid grid-rows-3 h-full">
              <div className="row-span-2 flex justify-between items-start mt-1">
                <div className="w-full flex flex-col">
                  <span className="text-red-400 font-semibold text-[14px]">
                    Biểu mẫu 04
                  </span>
                  <div className="px-4">
                    <span className="font-bold font-serif text-red-500 text-4xl">
                      1,678
                    </span>
                    <span className="text-red-400 text-[13px] ms-2">
                      sự kiện
                    </span>
                  </div>
                </div>
                <FastBackwardOutlined className="p-3 bg-red-100 text-orange-600 text-2xl rounded-lg" />
              </div>
              <div className="flex justify-between items-end">
                <span className="text-[13px] text-red-400">Tỷ lệ: 20%</span>
                <span className="text-[13px] text-red-400 hover:text-red-500 hover:underline">
                  Xem chi tiết
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="cursor-pointer transition-transform duration-300 hover:-translate-y-2">
          <div className="flex justify-center">
            <div className="w-2/3 bg-[#fcfaf6] shadow-sm shadow-violet-100 hover:shadow-violet-200 rounded-lg h-5" />
          </div>
          <div className="bg-violet-50 rounded-lg h-32 shadow-md shadow-violet-200 hover:shadow-lg hover:shadow-violet-300 mt-[-8px] p-4">
            <div className="grid grid-rows-3 h-full">
              <div className="row-span-2 flex justify-between items-start mt-1">
                <div className="w-full flex flex-col">
                  <span className="text-violet-400 font-semibold text-[14px]">
                    Biểu mẫu 05
                  </span>
                  <div className="px-4">
                    <span className="font-bold font-serif text-violet-500 text-4xl">
                      598
                    </span>
                    <span className="text-violet-400 text-[13px] ms-2">
                      sự kiện
                    </span>
                  </div>
                </div>
                <FastBackwardOutlined className="p-3 bg-violet-100 text-violet-600 text-2xl rounded-lg" />
              </div>
              <div className="flex justify-between items-end">
                <span className="text-[13px] text-violet-400">Tỷ lệ: 20%</span>
                <span className="text-[13px] text-violet-400 hover:text-violet-500 hover:underline">
                  Xem chi tiết
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="grid grid-cols-5 gap-4 h-[400px] mb-4">
          <div className="bg-white flex flex-col rounded-lg shadow-lg cursor-pointer">
            <div className="px-4 py-3 flex justify-between items-center">
              <span className="text-neutral-500 font-medium text-[16px]">
                Các hoạt động gần đây
              </span>
              <Button type="text" shape="circle" icon={<MoreOutlined />} />
            </div>
            <hr />
            <div className="h-full p-3 flex justify-center">
              <Timeline
                items={[
                  {
                    children: "Create a services site 2015-09-01",
                  },
                  {
                    children: "Solve initial network problems 2015-09-01",
                  },
                  {
                    children: "Technical testing 2015-09-01",
                  },
                  {
                    children: "Network problems being solved 2015-09-01",
                  },
                  {
                    children: "Network problems being solved 2015-09-01",
                  },
                  {
                    children: "Network problems being solved 2015-09-01",
                  },
                ]}
                className="h-fit mt-3 mb-[-100px]"
              />
              {/* <Empty description="Không có dữ liệu..." />
               */}
            </div>
          </div>
          <div className="bg-white col-span-3 flex flex-col rounded-lg shadow-lg cursor-pointer">
            <div className="px-4 py-3 flex justify-between items-center">
              <span className="text-neutral-500 font-medium text-[16px]">
                Tầng suất sử dụng
              </span>
              <Segmented options={options} />
            </div>
            <hr />
            <div className="h-full px-3 py-2 flex items-center justify-center">
              <ColumnChart />
              {/* <Empty description="Không có dữ liệu..." /> */}
            </div>
          </div>
          <div className="bg-white flex flex-col rounded-lg shadow-lg cursor-pointer">
            <div className="px-4 py-3 flex justify-between items-center">
              <span className="text-neutral-500 font-medium text-[16px]">
                Tỷ lệ phê duyệt
              </span>
              <Button type="text" shape="circle" icon={<MoreOutlined />} />
            </div>
            <hr />
            <div className="h-full px-3 py-2 flex flex-col items-center justify-center gap-6">
              <PercentForms
                name="Biểu mẫu 01"
                countItems={253}
                total={3485}
                color="blue"
              />
              <PercentForms
                name="Biểu mẫu 02"
                countItems={0}
                total={851}
                color="green"
              />
              <PercentForms
                name="Biểu mẫu 03"
                countItems={950}
                total={1524}
                color="orange"
              />
              <PercentForms
                name="Biểu mẫu 04"
                countItems={1058}
                total={1678}
                color="red"
              />
              <PercentForms
                name="Biểu mẫu 05"
                countItems={350}
                total={598}
                color="violet"
              />
              {/* <Empty description="Không có dữ liệu..." /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
