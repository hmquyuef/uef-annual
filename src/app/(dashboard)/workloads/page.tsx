"use client";

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
  Skeleton,
  Statistic,
  StatisticProps,
  Tooltip,
} from "antd";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  const getListWorkloadTypes = async () => {
    const response = await getWorkloadTypes();
    setTypes(response.items);
  };

  const formatter: StatisticProps["formatter"] = (value) => (
    <CountUp end={value as number} duration={5} separator="," />
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

  useEffect(() => {
    setLoading(true);
    // if (session) {
    //   const getRolesUser = async () => {
    //     const email = session.user?.email || "";
    //     const response = await getListRolesByEmail(email);
    //     const roles = response.items.map((item) =>
    //       item.roles.map((role) => role.name)
    //     );
    //     setUserRole(roles[0]);
    //     setEmailUser(email);
    //   };
    //   document.title = PageTitles.BM;
    //   getRolesUser();
    //   getListWorkloadTypes();
    // }
    document.title = PageTitles.BM;
    getListWorkloadTypes();
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
    setLoading(false);
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {loading ? (
          <>
            {Array.from({ length: 8 }).map((_, index) => (
              <Card key={index}>
                <Skeleton active />
              </Card>
            ))}
          </>
        ) : (
          <>
            {types &&
              types.map((type) => (
                <Card
                  key={type.id}
                  actions={actions(type)}
                  size="small"
                  className="hover:shadow-lg hover:rounded-lg"
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
                      className="max-h-20"
                      description={
                        <>
                          <p className="text-nowrap">{type.name}</p>
                          <p>Thuộc nhóm: {type.groupName}</p>
                        </>
                      }
                    />
                  </div>
                </Card>
              ))}
          </>
        )}
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
