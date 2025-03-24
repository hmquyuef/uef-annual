"use client";

import useNotifications from "@/hook/useNofitications";
import { deleteToken } from "@/services/auth/authServices";
import {
  deleteNotifications,
  getAllNotifications,
  putNotification,
} from "@/services/notifications/notificationsServices";
import { resetAppData } from "@/store/slices/appSlice";
import { getUserInfoFromToken } from "@/utility/Auth";
import { convertTimestampToFullDateTime } from "@/utility/Utilities";
import {
  CheckCircleOutlined,
  CloseOutlined,
  DeleteOutlined,
  IdcardOutlined,
  LogoutOutlined,
  MailOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Badge, Dropdown } from "antd";
import Cookies from "js-cookie";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const TopHeaders = () => {
  const dispatch = useDispatch();
  const { username, fullname, email } = getUserInfoFromToken();
  const { isNews } = useNotifications(
    `${process.env.NEXT_PUBLIC_SOCKET_URL}/ws?userName=${username}`
  );
  const [dataNews, setDataNews] = useState<any[]>([]);

  const getListNotifications = async () => {
    const response = await getAllNotifications(username as string);
    setDataNews([...response.items]);
  };

  const handleMenuClick: MenuProps["onClick"] = async (e) => {
    if (e.key === "3") {
      const token = Cookies.get("s_t");
      if (token) {
        try {
          await deleteToken(token);
        } finally {
          ["s_t", "s_r", "m_i", "m_k", "p_s"].forEach((cookie) =>
            Cookies.remove(cookie)
          );
          if (typeof window !== "undefined") window.localStorage.clear();
          dispatch(resetAppData());
          await signOut({ callbackUrl: "/login" });
        }
      }
    }
  };

  const createMenuItems = (name: string, email: string): MenuProps["items"] => [
    {
      key: "1",
      label: (
        <div>
          <span className="text-[12px] text-neutral-500 mb-1">
            Thông tin cá nhân
          </span>
          <div className="bg-neutral-200/50 rounded-md px-3 py-1">
            <span className="text-[12px] text-neutral-600">
              <IdcardOutlined className="me-1" />{" "}
              <span className="font-medium">{name}</span>
            </span>
            <br />
            <span className="text-[12px] text-neutral-600">
              <MailOutlined className="me-1" />{" "}
              <span className="font-medium">{email}</span>
            </span>
          </div>
        </div>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "3",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];

  const menuProps: MenuProps = {
    items: createMenuItems(fullname as string, email as string),
    onClick: handleMenuClick,
  };

  const handleMarkAsRead = async (id?: string) => {
    const ids = id
      ? [id]
      : (dataNews.filter((x) => !x.isRead).map((x) => x.id) as string[]);
    await putNotification(ids);
    getListNotifications();
  };

  const handleDeleteNotification = async (id?: string) => {
    const ids = id
      ? [id]
      : (dataNews.filter((x) => x.isRead).map((x) => x.id) as string[]);
    await deleteNotifications(ids);
    await getListNotifications();
  };

  useEffect(() => {
    getListNotifications();
  }, [isNews]);

  return (
    <div className="h-16 sticky top-0 right-0 shadow-md z-10 bg-white select-none">
      <div className="h-full flex justify-end items-center gap-2 pr-5">
        <Badge
          dot={dataNews.some((x) => !x.isRead)}
          offset={dataNews.length > 0 ? [-12, 9] : undefined}
        >
          <Dropdown
            trigger={["click"]}
            placement="bottomRight"
            className="hover:cursor-pointer"
            dropdownRender={() => {
              const numberRead = dataNews.filter((x) => !x.isRead).length;
              const numberDelete = dataNews.filter((x) => x.isRead).length;
              return dataNews.length > 0 ? (
                <>
                  <div className="flex flex-col w-80 max-h-96 bg-white shadow-lg shadow-blue-200 rounded-md select-none">
                    <div className="px-3 py-2 h-10 bg-gradient-to-bl from-blue-200 to-blue-600 text-white rounded-t-lg border-b border-gray-200">
                      <span className="text-base font-medium">Thông báo</span>
                    </div>
                    <div className="flex-1 w-full h-fit overflow-y-auto">
                      <div className="flex flex-col bg-gray-100">
                        {dataNews.map((item) => (
                          <div
                            key={item.id}
                            className="flex flex-col bg-white px-3 py-2 hover:bg-blue-50 border-b border-blue-400"
                          >
                            <div className="flex justify-between items-center">
                              <span
                                className={`text-[15px] ${
                                  item.isRead
                                    ? "text-neutral-500"
                                    : "text-blue-600  font-semibold"
                                } `}
                              >
                                {item.title}
                              </span>
                              <span
                                className="text-[11px] text-blue-500 hover:cursor-pointer hover:text-red-500"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteNotification(item.id);
                                }}
                              >
                                <CloseOutlined />
                              </span>
                            </div>
                            <span
                              className={`text-[13px] ${
                                item.isRead
                                  ? "text-neutral-400"
                                  : "text-neutral-600"
                              }`}
                            >
                              {item.massages}
                            </span>
                            <div
                              className={`flex ${
                                item.isRead ? "justify-end" : "justify-between "
                              } items-center text-xs text-gray-400 mt-1`}
                            >
                              {!item.isRead && (
                                <span
                                  onClick={() => handleMarkAsRead(item.id)}
                                  className="hover:cursor-pointer hover:text-blue-500"
                                >
                                  Đánh dấu đã xem
                                </span>
                              )}
                              <span>
                                {convertTimestampToFullDateTime(
                                  item.creationTime
                                )}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div
                      className={`flex ${
                        numberRead === 0 ? "justify-end" : "justify-between"
                      } items-center px-3 py-2 h-10`}
                    >
                      <div
                        className="flex justify-center gap-2 text-blue-500 hover:cursor-pointer "
                        hidden={numberRead === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead();
                        }}
                      >
                        <CheckCircleOutlined />
                        <span>
                          Đánh dấu tất cả
                          {numberRead > 0 ? ` (${numberRead})` : ""}
                        </span>
                      </div>
                      <div
                        className="flex justify-center gap-2 text-red-500 hover:cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNotification();
                        }}
                      >
                        <DeleteOutlined />
                        <span>
                          Xóa tất cả
                          {numberDelete && numberDelete > 0
                            ? ` (${numberDelete})`
                            : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-80 h-fit py-7 flex flex-col items-center bg-white shadow-xl rounded-lg select-none">
                    <img
                      src="/no-notifications.png"
                      className="w-40"
                      alt="not notification"
                    />
                    <span className="text-neutral-400">
                      Không có thông báo!
                    </span>
                  </div>
                </>
              );
            }}
          >
            <img
              src={`/${dataNews.length > 0 ? "bell.svg" : "bell-off.svg"}`}
              alt="bell"
              className={`p-[6px] hover:rounded-lg hover:shadow-lg ${
                dataNews.length > 0
                  ? "w-9 h-9 hover:shadow-blue-300 hover:bg-blue-100"
                  : "w-9 h-9 hover:shadow-orange-300 hover:bg-orange-100"
              }`}
            />
          </Dropdown>
        </Badge>
        <Dropdown
          trigger={["click"]}
          menu={menuProps}
          placement="bottomRight"
          className="hover:cursor-pointer"
          dropdownRender={(menu) => (
            <div className="bg-red-300 rounded-md shadow-md">{menu}</div>
          )}
        >
          <a onClick={(e) => e.preventDefault()}>
            <img
              src="/users/user.svg"
              alt="user"
              className="w-9 h-9 p-1 hover:bg-blue-100 hover:rounded-lg hover:shadow-lg hover:shadow-blue-300"
            />
          </a>
        </Dropdown>
      </div>
    </div>
  );
};

export default TopHeaders;
