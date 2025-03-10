"use client";

import CustomModal from "@/components/CustomModal";
import CustomNotification from "@/components/CustomNotification";
import FormWorkloadType from "@/components/forms/workloads/formWorkloadType";
import NotFound from "@/components/NotFound";
import { LoadingSkeleton } from "@/components/skeletons/LoadingSkeleton";
import { getRoleByName, RoleItem } from "@/services/roles/rolesServices";
import { getAllSchoolYears } from "@/services/schoolYears/schoolYearsServices";
import {
  getWorkloadGroups,
  WorkloadGroupItem,
} from "@/services/workloads/groupsServices";
import {
  AddUpdateWorkloadType,
  getWorkloadTypes,
  postAddWorkloadType,
  putUpdateWorkloadType,
  WorkloadTypeItem,
} from "@/services/workloads/typesServices";
import PageTitles from "@/utility/Constraints";
import Messages from "@/utility/Messages";
import {
  EditOutlined,
  HomeOutlined,
  PieChartOutlined,
  PlusOutlined,
  ProfileOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Card,
  Divider,
  Empty,
  Input,
  Select,
  Statistic,
  StatisticProps,
} from "antd";
import { SearchProps } from "antd/es/input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import Colors from "../../../utility/Colors";

const Workloads = () => {
  const { Search } = Input;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [defaultYears, setDefaultYears] = useState<any>();
  const [selectedKey, setSelectedKey] = useState<any>();
  const [selectedKeyGroup, setSelectedKeyGroup] = useState<any>();
  const [userName, setUserName] = useState<string | null>(null);
  const [tempTypes, setTempTypes] = useState<WorkloadTypeItem[]>([]);
  const [types, setTypes] = useState<WorkloadTypeItem[]>([]);
  const [groups, setGroups] = useState<WorkloadGroupItem[]>([]);
  const [tempGroups, setTempGroups] = useState<WorkloadGroupItem[]>([]);
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
    const yearId = response.items.filter((x: any) => x.isDefault)[0] as any;
    setDefaultYears(response.items);
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
    setTempTypes(response.items);
    setNotificationOpen(false);
  };

  const getListWorkloadGroups = async () => {
    const response = await getWorkloadGroups();
    setGroups(response.items);
    setTempGroups(response.items);
  };

  const formatter: StatisticProps["formatter"] = (value) => (
    <CountUp end={value as number} duration={3} separator="," />
  );

  const onSearch: SearchProps["onSearch"] = (value) => {
    if (value === "") setTempTypes(types || []);

    const filteredData = types.filter((item) => {
      const matchesName =
        item.name.toLowerCase().includes(value.toLowerCase()) ||
        item.shortName.toLowerCase().includes(value.toLowerCase()) ||
        item.groupName.toLowerCase().includes(value.toLowerCase());
      return matchesName;
    });
    setTempTypes(filteredData || []);
  };

  const handleEllipsis = async (type: WorkloadTypeItem) => {
    setMode("edit");
    setIsAccess(true);
    setSelectedItem(type);
    setTitle(`Chỉnh sửa ${type.name}`);
    setIsOpened(true);
  };

  const actions = (type: WorkloadTypeItem): React.ReactNode[] => {
    const actionItems: React.ReactNode[] = [
      <div key="report" className="flex justify-center gap-1 text-blue-500">
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
    ];
    if (role && role.name === "admin") {
      actionItems.push(
        <div
          key="edit"
          onClick={() => handleEllipsis(type)}
          className="flex justify-center gap-1"
        >
          <EditOutlined />
          <span>Chỉnh sửa</span>
        </div>
      );
    }

    return actionItems;
  };
  const handleSubmit = async (formData: Partial<AddUpdateWorkloadType>) => {
    try {
      if (mode === "edit" && selectedItem) {
        const response = await putUpdateWorkloadType(
          formData.id as string,
          formData
        );
        if (response) {
          setDescription("Cập nhật biểu mẫu thành công!");
        }
      } else {
        const response = await postAddWorkloadType(formData);
        if (response) {
          setDescription("Khởi tạo biểu mẫu thành công!");
        }
      }
      setNotificationOpen(true);
      setStatus("success");
      setMessage("Thông báo");
      setIsOpened(false);
      setSelectedItem(undefined);
      await getListWorkloadTypes(selectedKey.id);
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

  const handleChangeGroup = async (value: any) => {
    setLoading(true);
    if (value === undefined) {
      const timeoutId = setTimeout(() => {
        setLoading(false);
        setTempGroups(groups);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
    const temp = groups.filter((x) => x.id === value);
    setTempGroups(temp);
    setSelectedKeyGroup(temp);
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timeoutId);
  };

  const getDisplayRole = async () => {
    const userName = localStorage.getItem("s_username");
    setUserName(userName as string);
    const response = await getRoleByName(userName as string);
    setRole(response.items[0]);
  };

  useEffect(() => {
    setLoading(true);
    document.title = PageTitles.BM;
    getDisplayRole();
    getDefaultYears();
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-9 gap-5 border-b border-neutral-300 pb-3">
        <div className="xl:col-span-2 flex flex-col justify-center gap-1">
          <span className="text-sm text-neutral-500">Tìm kiếm:</span>
          <Search placeholder=" " onSearch={onSearch} enterButton />
        </div>
        <div className="xl:col-span-2 flex flex-col justify-center gap-1">
          <span className="text-sm text-neutral-500">Nhóm:</span>
          <Select
            allowClear
            placeholder="Tất cả nhóm"
            optionFilterProp="label"
            options={groups?.map((group: any) => ({
              value: group.id,
              label: group.name,
            }))}
            value={selectedKeyGroup && selectedKeyGroup.name}
            onChange={(value) => handleChangeGroup(value)}
          />
        </div>
        <div className="flex flex-col justify-center gap-1">
          <span className="text-sm text-neutral-500">Năm học:</span>
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
            className="w-full"
          />
        </div>
      </div>
      {loading ? (
        <>
          <LoadingSkeleton />
        </>
      ) : (
        <>
          {(() => {
            const filteredGroups = tempGroups?.filter((group) =>
              tempTypes?.some(
                (type) =>
                  type.workloadGroupId === group.id &&
                  userName &&
                  type.emails?.includes(userName)
              )
            );
            if (!filteredGroups?.length) {
              return (
                <div className="h-[calc(100svh-300px)] flex justify-center items-center">
                  <Empty description={Messages.NO_DATA} />
                </div>
              );
            }
            return filteredGroups.map((group) => (
              <div className="h-fit pb-4" key={group.id}>
                <Divider
                  orientation="left"
                  className="uppercase"
                  style={{ borderColor: Colors.BLUE, color: Colors.BLUE }}
                >
                  {group.name}
                </Divider>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2">
                  {tempTypes
                    ?.filter((type) => type.workloadGroupId === group.id)
                    .map((type) =>
                      (userName && type.emails?.includes(userName)) ||
                      role?.name === "admin" ? (
                        <Card
                          key={type.id}
                          actions={actions(type)}
                          size="small"
                          className="shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:shadow-blue-200"
                        >
                          <div
                            onClick={() => {
                              if (userName && type.emails?.includes(userName)) {
                                router.push("/workloads/" + type.href);
                              } else {
                                setMode("edit");
                                setIsAccess(false);
                                setIsOpened(true);
                                setTitle("");
                              }
                            }}
                            className="cursor-pointer"
                          >
                            <div className="flex justify-between items-center gap-2 mb-2">
                              <span className="text-base font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                                {type.shortName}
                              </span>
                              {userName &&
                                type.emails?.includes(userName) &&
                                role?.name === "admin" && (
                                  <>
                                    <div className="flex items-center gap-1 text-green-500">
                                      <img src="/ticker.svg" width={24} />
                                    </div>
                                  </>
                                )}
                            </div>
                            <div className="min-h-10">
                              <div>
                                <span className="text-neutral-400">
                                  Biểu mẫu:{" "}
                                </span>
                                <span className="font-medium text-neutral-600 whitespace-wrap text-ellipsis">
                                  {type.name}
                                </span>
                              </div>
                              <div>
                                <span className="text-neutral-400">
                                  Cấp quyền:{" "}
                                </span>
                                <span className="font-medium text-neutral-600 whitespace-wrap text-ellipsis">
                                  {type.emails.split(",").length}
                                </span>
                                <span className="text-neutral-400">
                                  {" "}
                                  cán bộ
                                </span>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ) : null
                    )}
                  {role?.name === "admin" && (
                    <Button
                      key={`${group.id}-add-button`}
                      color="primary"
                      variant="filled"
                      icon={<PlusOutlined />}
                      onClick={() => {
                        setMode("add");
                        setTitle(`Thêm mới biểu mẫu thuộc nhóm ${group.name}`);
                        setSelectedKeyGroup(group.id);
                        setIsOpened(true);
                      }}
                      className="w-fit"
                    >
                      Thêm mới
                    </Button>
                  )}
                </div>
              </div>
            ));
          })()}
        </>
      )}
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
          mode === "add" ? (
            <FormWorkloadType
              onSubmit={handleSubmit}
              initialData={{}}
              workloadGroupId={selectedKeyGroup}
              mode={mode}
            />
          ) : isAccess ? (
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
    </section>
  );
};

export default Workloads;
