"use client";

import CustomModal from "@/components/CustomModal";
import CustomNotification from "@/components/CustomNotification";
import FormWorkloadType from "@/components/forms/workloads/formWorkloadType";
import NotFound from "@/components/NotFound";
import { getListRolesByEmail } from "@/services/users/usersServices";
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
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CountUp from "react-countup";

const Workloads = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [emailUser, setEmailUser] = useState("");
  const [types, setTypes] = useState<WorkloadTypeItem[]>([]);
  const [isOpened, setIsOpened] = useState(false);
  const [isOk, setIsOk] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [isAccess, setIsAccess] = useState(true);
  const [title, setTitle] = useState("");
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [message, setMessage] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
  const [userRole, setUserRole] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<
    Partial<WorkloadTypeItem> | undefined
  >(undefined);
  const getListWorkloadTypes = async () => {
    const response = await getWorkloadTypes();
    setTypes(response.items);
  };

  const formatter: StatisticProps["formatter"] = (value) => (
    <CountUp end={value as number} duration={5} separator="," />
  );

  const handleEllipsis = async (type: WorkloadTypeItem) => {
    setIsOk(true);
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
        if (type.emails?.includes(emailUser)) {
          router.push("/workloads/" + type.href.toLowerCase());
        } else {
          setIsAccess(false);
          setIsOpened(true);
          setTitle("");
          setIsOk(false);
        }
      }}
      className="flex justify-center gap-1"
    >
      <PieChartOutlined />
      <Statistic
        value={type.totalItems}
        formatter={formatter}
        suffix="sự kiện"
        valueStyle={{ fontSize: "14px" }}
      />
      {/* {type.totalItems} sự kiện</span> */}
    </div>,
    userRole && userRole.includes("admin") ? (
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
            if (type.emails?.includes(emailUser)) {
              router.push("/workloads/" + type.href.toLowerCase());
            } else {
              setIsAccess(false);
              setIsOpened(true);
              setTitle("");
              setIsOk(false);
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
    console.log("formData :>> ", formData);
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

  useEffect(() => {
    setLoading(true);
    if (session) {
      const getRolesUser = async () => {
        const email = session.user?.email || "";
        const response = await getListRolesByEmail(email);
        const roles = response.items.map((item) =>
          item.roles.map((role) => role.name)
        );
        setUserRole(roles[0]);
        setEmailUser(email);
      };
      document.title = PageTitles.BM;
      getRolesUser();
      getListWorkloadTypes();
    }
    setLoading(false);
  }, [session]);

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
                      if (
                        type.emails?.includes(
                          emailUser.replace("@uef.edu.vn", "")
                        )
                      ) {
                        router.push("/workloads/" + type.href);
                      } else {
                        setIsAccess(false);
                        setIsOpened(true);
                        setTitle("");
                        setIsOk(false);
                      }
                    }}
                    className="cursor-pointer"
                  >
                    <Card.Meta
                      title={
                        <div className="flex justify-between items-center gap-2">
                          <p>{type.shortName}</p>
                          {type.emails?.includes(
                            emailUser.replace("@uef.edu.vn", "")
                          ) ? (
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
        isOk={isOk}
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
