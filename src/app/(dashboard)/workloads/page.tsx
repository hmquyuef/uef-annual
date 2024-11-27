"use client";

import LineChart from "@/components/charts/LineChart";
import CustomModal from "@/components/CustomModal";
import CustomNotification from "@/components/CustomNotification";
import FormWorkloadType from "@/components/forms/workloads/formWorkloadType";
import NotFound from "@/components/NotFound";
import { getRoleByName, RoleItem } from "@/services/roles/rolesServices";
import {
  AddUpdateWorkloadType,
  getWorkloadTypes,
  putUpdateWorkloadType,
  WorkloadTypeItem,
} from "@/services/workloads/typesServices";
import PageTitles from "@/utility/Constraints";
import { convertTimestampToDayMonth } from "@/utility/Utilities";
import {
  CheckOutlined,
  EditOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  PieChartOutlined,
  ProfileOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Card,
  Select,
  Spin,
  Statistic,
  StatisticProps,
  Tooltip
} from "antd";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import CountUp from "react-countup";

const Workloads = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [types, setTypes] = useState<WorkloadTypeItem[]>([]);
  const [isOpened, setIsOpened] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [isAccess, setIsAccess] = useState(true);
  const [title, setTitle] = useState("");
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [message, setMessage] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
  const [selectedItem, setSelectedItem] = useState<
    Partial<WorkloadTypeItem> | undefined
  >(undefined);
  const [role, setRole] = useState<RoleItem>();
  const [dataCategories, setDataCategories] = useState<string[]>([]);
  const [startIndex, setStartIndex] = useState<number>(0);
  const [endIndex, setEndIndex] = useState<number>(0);
  const [defaultValues, setDefaultValues] = useState<string>("7");
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);

  const getListWorkloadTypes = async () => {
    const response = await getWorkloadTypes(startTime, endTime);
    setTypes(response.items);
    response.items.forEach((item) => {
      setDataCategories(
        item.infoChart.categories.map((i) => convertTimestampToDayMonth(i))
      );
    });
  };

  const formatter: StatisticProps["formatter"] = (value) => (
    <CountUp end={value as number} duration={3} separator="," />
  );

  const handleEllipsis = async (type: WorkloadTypeItem) => {
    setMode("edit");
    setIsAccess(true);
    setSelectedItem(type);
    setTitle(`Chỉnh sửa ${type.name}`);
    setIsOpened(true);
    await getListWorkloadTypes();
  };

  const actions = (type: WorkloadTypeItem): React.ReactNode[] => [
    <div
      key="report"
      onClick={() => {
        if (userName && type.emails?.includes(userName)) {
          router.push("/workloads/" + type.href.toLowerCase());
        } else {
          setIsAccess(false);
          setIsOpened(true);
          setTitle("");
        }
      }}
      className="flex justify-center gap-1 text-blue-500"
    >
      <PieChartOutlined />
      <Statistic
        value={type.totalItems}
        formatter={formatter}
        suffix="sự kiện"
        valueStyle={{ fontSize: "14px", color: "rgb(59 130 246)" }}
      />
    </div>,
    <div
      key="report-approved"
      className="flex justify-center gap-1 text-green-500"
    >
      <SafetyOutlined />
      <Statistic
        value={type.totalApprovedItems}
        formatter={formatter}
        suffix="đã duyệt"
        valueStyle={{ fontSize: "14px", color: "rgb(34 197 94)" }}
      />
    </div>,
    role && role.name === "admin" ? (
      <>
        <div
          key="edit"
          onClick={() => handleEllipsis(type)}
          className="flex justify-center gap-1"
        >
          <EditOutlined />
          <span>Chỉnh sửa</span>
        </div>
      </>
    ) : (
      <>
        <div
          onClick={() => {
            if (userName && type.emails?.includes(userName)) {
              router.push("/workloads/" + type.href.toLowerCase());
            } else {
              setIsAccess(false);
              setIsOpened(true);
              setTitle("");
            }
          }}
          className="flex justify-center gap-1"
        >
          <InfoCircleOutlined />
          <span>xem chi tiết</span>
        </div>
      </>
    ),
  ];
  const handleSubmit = async (formData: Partial<AddUpdateWorkloadType>) => {
    try {
      if (mode === "edit" && selectedItem) {
        const response = await putUpdateWorkloadType(
          formData.id as string,
          formData
        );
        if (response) {
          setNotificationOpen(true);
          setStatus("success");
          setMessage("Thông báo");
          setDescription("Cập nhật biểu mẫu thành công!");
        }
      }
      setIsOpened(false);
      setSelectedItem(undefined);
    } catch (error) {
      setNotificationOpen(true);
      setStatus("error");
      setMessage("Thông báo");
      setDescription("Đã có lỗi xảy ra!");
    }
  };

  const getDisplayRole = async (name: string) => {
    const response = await getRoleByName(name);
    setRole(response.items[0]);
  };

  const handleChange = (value: string) => {
    setDefaultValues(value);
  };

  const updatedDataCategories = useMemo(async () => {
    const formatType = Number(defaultValues) >= 7 ? "days" : "months";
    const now = moment(new Date()).format("DD/MM/YYYY");
    const unixNow = moment(now, "DD/MM/YYYY").unix();
    const timeEnd = moment()
      .subtract(Number(defaultValues), formatType)
      .format("DD/MM/YYYY");
    const unixEnd = moment(timeEnd, "DD/MM/YYYY").unix();
    setStartTime(unixEnd);
    setEndTime(unixNow);
  }, [defaultValues]);

  // useEffect(() => {
  //   setLoading(true);
  //   const fetchData = async () => {
  //     updatedDataCategories;
  //     await getListWorkloadTypes();
  //   };
  //   fetchData();
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 500);
  // }, [updatedDataCategories]);

  useEffect(() => {
    const dateIndices = dataCategories.reduce<Record<string, number>>(
      (acc, date, index) => {
        acc[date] = index;
        return acc;
      },
      {}
    );
    const formatType = Number(defaultValues) >= 7 ? "days" : "months";
    const now = moment(new Date()).format("DD/MM");
    const end = moment()
      .subtract(Number(defaultValues), formatType)
      .format("DD/MM");
    setStartIndex(dateIndices[end]);
    setEndIndex(dateIndices[now]);
  }, [defaultValues, dataCategories]);

  useEffect(() => {
    setLoading(true);
    document.title = PageTitles.BM;
    const token = Cookies.get("s_t");
    if (token) {
      const decodedRole = jwtDecode<{
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
      }>(token);
      const role =
        decodedRole[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];
      getDisplayRole(role as string);
      const decodedToken = jwtDecode(token);
      if (decodedToken.sub) {
        setUserName(decodedToken.sub);
      }
    }
    const fetchData = async () => {
      updatedDataCategories;
      await getListWorkloadTypes();
    };
    fetchData();
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [updatedDataCategories]);

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
                  <span>Danh sách biểu mẫu</span>
                </>
              ),
            },
          ]}
        />
      </div>
      <div className="mb-4">
        <span>Thống kê biểu đồ trong </span>
        <Select
          defaultValue={defaultValues}
          style={{ width: 120 }}
          onChange={handleChange}
          options={[
            { value: "7", label: "7 ngày" },
            { value: "14", label: "14 ngày" },
            { value: "1", label: "1 tháng" },
            { value: "3", label: "3 tháng" },
            { value: "6", label: "6 tháng" },
          ]}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {types &&
          types.map((type) => (
            <Card
              key={type.id}
              actions={actions(type)}
              size="small"
              className="hover:shadow-lg transition-transform duration-300 hover:-translate-y-2"
            >
              <div
                onClick={() => {
                  if (userName && type.emails?.includes(userName)) {
                    router.push("/workloads/" + type.href);
                  } else {
                    setIsAccess(false);
                    setIsOpened(true);
                    setTitle("");
                  }
                }}
                className="cursor-pointer"
              >
                <Card.Meta
                  title={
                    <div className="flex justify-between items-center gap-2">
                      <p>{type.shortName}</p>
                      {userName && type.emails?.includes(userName) ? (
                        <>
                          <Tooltip
                            placement="top"
                            title={"Đã được cấp quyền"}
                            arrow={true}
                          >
                            <Button
                              size="small"
                              variant="outlined"
                              shape="circle"
                              style={{
                                backgroundColor: "#52c41a",
                                borderColor: "#52c41a",
                                color: "#fff",
                              }}
                              icon={<CheckOutlined />}
                            ></Button>
                          </Tooltip>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  }
                  className="h-fit"
                  description={
                    <div>
                      <div>
                        <p className="whitespace-wrap text-ellipsis">
                          {type.name}
                        </p>
                        <p>Thuộc nhóm: {type.groupName}</p>
                      </div>
                      <div className="mb-[-40px]">
                        <span>Biểu đồ thêm mới dữ liệu</span>
                        {loading ? (
                          <>
                            <Spin tip="Đang tải dữ liệu...">
                              {<div className="p-[80px]" />}
                            </Spin>
                          </>
                        ) : (
                          <>
                            <div className="mt-[-15px]">
                              <LineChart
                                start={startIndex}
                                end={endIndex}
                                categories={dataCategories}
                                seriesData={type?.infoChart?.series}
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  }
                />
              </div>
            </Card>
          ))}
      </div>
      <CustomNotification
        message={message}
        description={description}
        status={status}
        isOpen={notificationOpen}
      />
      <CustomModal
        isOpen={isOpened}
        title={title}
        width="900px"
        role={role || undefined}
        onOk={() => {
          const formElement = document.querySelector("form");
          formElement?.dispatchEvent(
            new Event("submit", { cancelable: true, bubbles: true })
          );
        }}
        onCancel={() => {
          setNotificationOpen(false);
          setIsOpened(false);
          setMode("add");
        }}
        bodyContent={
          isAccess ? (
            <>
              <FormWorkloadType
                onSubmit={handleSubmit}
                initialData={selectedItem as Partial<AddUpdateWorkloadType>}
                mode={mode}
              />
            </>
          ) : (
            <>
              <NotFound />
            </>
          )
        }
      />
    </div>
  );
};

export default Workloads;
