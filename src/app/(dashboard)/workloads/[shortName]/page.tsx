"use client";
import DynamicComponent from "@/components/DynamicComponent";
import {
  getWorkloadTypesByShortName,
  WorkloadTypeItem,
} from "@/services/workloads/typesServices";
import { HomeOutlined, ProfileOutlined } from "@ant-design/icons";
import { Breadcrumb } from "antd";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const WorkloadPage = () => {
  const { shortName } = useParams();
  const [item, setItem] = useState<WorkloadTypeItem[]>([]);
  const getWorkloadType = async () => {
    const response = await getWorkloadTypesByShortName(shortName.toString());
    setItem(response.items);
  };
  useEffect(() => {
    getWorkloadType();
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
              href: "/workloads",
              title: (
                <>
                  <ProfileOutlined />
                  <span>Danh sách biểu mẫu</span>
                </>
              ),
            },
            {
              title: (
                <>
                  <ProfileOutlined />
                  <span>{item && item.length > 0 && item[0].name}</span>
                </>
              ),
            },
          ]}
        />
      </div>
      {shortName && shortName.length > 0 ? (
        <DynamicComponent
          params={{ shortName: shortName.toString() }}
        />
      ) : null}
    </div>
  );
};

export default WorkloadPage;
