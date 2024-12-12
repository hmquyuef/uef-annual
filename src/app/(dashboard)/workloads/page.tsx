"use client";

import LineChart from "@/components/charts/LineChart";
import CustomModal from "@/components/CustomModal";
import CustomNotification from "@/components/CustomNotification";
import FormWorkloadType from "@/components/forms/workloads/formWorkloadType";
import NotFound from "@/components/NotFound";
import { getRoleByName, RoleItem } from "@/services/roles/rolesServices";
import { getAllSchoolYears } from "@/services/schoolYears/schoolYearsServices";
import {
  getWorkloadGroups,
  WorkloadGroupItem,
} from "@/services/workloads/groupsServices";
import {
  AddUpdateWorkloadType,
  getWorkloadTypes,
  putUpdateWorkloadType,
  WorkloadTypeItem,
} from "@/services/workloads/typesServices";
import PageTitles from "@/utility/Constraints";
import Messages from "@/utility/Messages";
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
  Divider,
  Select,
  Spin,
  Statistic,
  StatisticProps,
  Tooltip,
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
  const [defaultYears, setDefaultYears] = useState<any>();
  const [selectedKey, setSelectedKey] = useState<any>();
  const [userName, setUserName] = useState<string | null>(null);
  const [types, setTypes] = useState<WorkloadTypeItem[]>([]);
  const [groups, setGroups] = useState<WorkloadGroupItem[]>([]);
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

  const getDefaultYears = async () => {
    setLoading(true);
    const response = await getAllSchoolYears();
    setDefaultYears(response.items);
    const yearId = response.items.filter((x: any) => x.isDefault)[0] as any;
    setSelectedKey(yearId);
    await Promise.all([
      getListWorkloadTypes(yearId.id),
      getListWorkloadGroups(),
    ]);
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timeoutId);
  };

  const getListWorkloadTypes = async (yearId: string) => {
    const response = await getWorkloadTypes(yearId);
    setTypes(response.items);
  };

  const getListWorkloadGroups = async () => {
    const response = await getWorkloadGroups();
    setGroups(response.items);
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
    await getListWorkloadTypes(selectedKey);
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
      setDescription(Messages.ERROR);
    }
  };

  const handleChangeYear = async (value: any) => {
    setLoading(true);
    const temp = defaultYears.filter((x: any) => x.id === value)[0] as any;
    setSelectedKey(temp);
    await Promise.all([getListWorkloadTypes(temp.id), getListWorkloadGroups()]);
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timeoutId);
  };

  const getDisplayRole = async (name: string) => {
    const response = await getRoleByName(name);
    setRole(response.items[0]);
  };

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
    getDefaultYears();
    setTimeout(() => {
      setLoading(false);
    }, 500);
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
                  <span>{Messages.BREAD_CRUMB_HOME}</span>
                </>
              ),
            },
            {
              href: "",
              title: (
                <>
                  <HomeOutlined />
                  <span>{Messages.BREAD_CRUMB_WORKLOAD}</span>
                </>
              ),
            },
            {
              title: (
                <>
                  <ProfileOutlined />
                  <span>{Messages.BREAD_CRUMB_WORKLOAD_TYPES}</span>
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
      {groups &&
        groups.map((group) => (
          <>
            <div className="mb-4">
              <Divider
                orientation="left"
                className="uppercase"
                style={{ borderColor: "#1677FF", color: "#1677FF" }}
              >
                {group.name}
              </Divider>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 px-2">
                {types &&
                  types
                    .filter((x) => x.workloadGroupId === group.id)
                    .map((type) => (
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
                              <div className="min-h-16">
                                <p className="whitespace-wrap text-ellipsis">
                                  Biểu mẫu:{" "}
                                  <span className="font-medium text-neutral-600">
                                    {type.name}
                                  </span>
                                </p>
                                <p>
                                  Thuộc nhóm:{" "}
                                  <span className="font-medium text-neutral-600">
                                    {type.groupName}
                                  </span>
                                </p>
                              </div>
                            }
                          />
                        </div>
                      </Card>
                    ))}
              </div>
            </div>
          </>
        ))}
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
