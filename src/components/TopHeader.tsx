"use client";

import {
  IdcardOutlined,
  InfoCircleOutlined,
  LogoutOutlined,
  MailOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Badge, Dropdown } from "antd";
import Cookies from "js-cookie";
import { signOut } from "next-auth/react";
import { useState } from "react";

interface TopHeadersProps {
  name: string;
  email: React.ReactNode;
}

const handleMenuClick: MenuProps["onClick"] = async (e) => {
  if (e.key === "3") {
    ["s_t", "s_r", "m_i", "m_k", "p_s"].forEach((cookie) =>
      Cookies.remove(cookie)
    );
    await signOut({ callbackUrl: "/login" });
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

const itemNotifications: MenuProps["items"] = [
  {
    key: "1",
    label: (
      <>
        <div className="flex flex-col w-64">
          <span>Thông báo đang cập nhật</span>
          <span className="text-xs text-gray-400 mb-1">Đang cập nhật</span>
          <div className="flex justify-end">
            <span className="text-xs text-gray-400">đang cập nhật</span>
          </div>
        </div>
      </>
    ),
    icon: <InfoCircleOutlined />,
  },
];

const TopHeaders: React.FC<TopHeadersProps> = ({ name, email }) => {
  const menuProps: MenuProps = {
    items: createMenuItems(name, email as string),
    onClick: handleMenuClick,
  };
  const notificationsProps: MenuProps = {
    items: itemNotifications,
    onClick: handleMenuClick,
  };
  const [isNotification, setIsNotification] = useState(false);

  return (
    <div className="h-16 sticky top-0 right-0 shadow-md z-10 bg-white">
      <div className="h-full flex justify-end items-center gap-2 pr-5">
        <Badge>
          <Dropdown
            trigger={["click"]}
            menu={notificationsProps}
            placement="bottomRight"
            className="hover:cursor-pointer"
          >
            <img
              src={`/${isNotification ? "bell.svg" : "bell-off.svg"}`}
              alt="bell"
              className={`p-1 hover:rounded-lg hover:shadow-lg ${
                isNotification
                  ? "w-9 h-9 hover:shadow-purple-300 hover:bg-purple-100"
                  : "w-8 h-8 hover:shadow-orange-300 hover:bg-orange-100"
              }`}
            />
          </Dropdown>
        </Badge>
        <Dropdown
          trigger={["click"]}
          menu={menuProps}
          placement="bottomRight"
          className="hover:cursor-pointer"
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
