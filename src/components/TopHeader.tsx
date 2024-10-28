import {
  InfoCircleOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Avatar, Dropdown } from "antd";
import { signOut } from "next-auth/react";

interface TopHeadersProps {
  name: string;
  email: React.ReactNode;
}

const handleMenuClick: MenuProps["onClick"] = async (e) => {
  if (e.key === "3") {
    sessionStorage.removeItem("s_t");
    sessionStorage.removeItem("s_r");
    await signOut({ callbackUrl: "/login" });
  }
};

const items: MenuProps["items"] = [
  {
    key: "1",
    label: "Tài khoản",
    icon: <InfoCircleOutlined />,
  },
  {
    key: "2",
    label: "Thông tin cá nhân",
    icon: <UserOutlined />,
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
  items,
  onClick: handleMenuClick,
};

const TopHeaders: React.FC<TopHeadersProps> = ({ name, email }) => {
  return (
    <div className="h-16 bg-white sticky top-0 right-0 shadow-md z-10">
      <div className="h-full flex justify-end items-center gap-6 px-6">
        <Dropdown menu={menuProps} className="hover:cursor-pointer">
          <a onClick={(e) => e.preventDefault()}>
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-end">
                <span className="text-sm">{name}</span>
                <span className="text-[11px]">{email}</span>
              </div>
              <Avatar icon={<UserOutlined />} />
            </div>
          </a>
        </Dropdown>
      </div>
    </div>
  );
};

export default TopHeaders;
