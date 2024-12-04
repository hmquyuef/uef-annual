"use client";

import { MoreOutlined } from "@ant-design/icons";
import { Button } from "antd";

const FaculitiesForms = () => {
  return (
    <div className="bg-white flex flex-col rounded-lg shadow-lg cursor-pointer">
      <div className="px-4 py-3 flex justify-between items-center">
        <span className="text-neutral-400 font-semibold text-[14px]">
          Thống kê sự kiện theo Khoa
        </span>
        <Button type="text" shape="circle" icon={<MoreOutlined />} />
      </div>
      <hr />
      <div className="h-full p-3 flex justify-center mt-2">
        Biểu đồ thông kê số lượng sự kiện theo Khoa
      </div>
    </div>
  );
};
export default FaculitiesForms;
