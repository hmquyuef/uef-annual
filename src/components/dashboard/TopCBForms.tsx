import { MoreOutlined } from "@ant-design/icons";
import { Button } from "antd";

const TopCBForms = () => {
  return (
    <div className="bg-white flex flex-col rounded-lg shadow-lg cursor-pointer">
      <div className="px-4 py-3 flex justify-between items-center">
        <span className="text-neutral-400 font-semibold text-[14px]">
          Top các CB-GV-NV có hoạt động nhiều nhất
        </span>
        <Button type="text" shape="circle" icon={<MoreOutlined />} />
      </div>
      <hr />
      <div className="h-full p-3 flex justify-center mt-2">
        Biểu đồ TOP 10 số lượng hoạt động theo CB-GV-NV
      </div>
    </div>
  );
};
export default TopCBForms;
