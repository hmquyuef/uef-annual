import {
  IdcardOutlined,
  LogoutOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Badge, Dropdown } from "antd";
import Cookies from "js-cookie";
import { signOut } from "next-auth/react";

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

// const itemNotifications: MenuProps["items"] = [
//   {
//     key: "1",
//     label: (
//       <>
//         <div className="flex flex-col w-64">
//           <span>Thông báo</span>
//           <span className="text-xs text-gray-400 mb-1">Nội dung thông báo</span>
//           <div className="flex justify-end">
//             <span className="text-xs text-gray-400">2 phút trước</span>
//           </div>
//         </div>
//       </>
//     ),
//     icon: <InfoCircleOutlined />,
//   },
//   {
//     type: "divider",
//   },
//   {
//     key: "2",
//     label: (
//       <>
//         <div className="flex flex-col w-64">
//           <span>Thông báo</span>
//           <span className="text-xs text-gray-400 mb-1">Nội dung thông báo</span>
//           <div className="flex justify-end">
//             <span className="text-xs text-gray-400">2 phút trước</span>
//           </div>
//         </div>
//       </>
//     ),
//     icon: <UserOutlined />,
//   },
//   {
//     type: "divider",
//   },
//   {
//     key: "3",
//     label: (
//       <>
//         <div className="flex flex-col w-64">
//           <span>Thông báo</span>
//           <span className="text-xs text-gray-400 mb-1">Nội dung thông báo</span>
//           <div className="flex justify-end">
//             <span className="text-xs text-gray-400">2 phút trước</span>
//           </div>
//         </div>
//       </>
//     ),
//     icon: <UserOutlined />,
//   },
//   {
//     type: "divider",
//   },
//   {
//     key: "4",
//     label: (
//       <>
//         <div className="flex flex-col w-64">
//           <span>Thông báo</span>
//           <span className="text-xs text-gray-400 mb-1">Nội dung thông báo</span>
//           <div className="flex justify-end">
//             <span className="text-xs text-gray-400">2 phút trước</span>
//           </div>
//         </div>
//       </>
//     ),
//     icon: <UserOutlined />,
//   },
//   {
//     type: "divider",
//   },
// ];

const TopHeaders: React.FC<TopHeadersProps> = ({ name, email }) => {
  const menuProps: MenuProps = {
    items: createMenuItems(name, email as string),
    onClick: handleMenuClick,
  };
  return (
    <div className="h-16 bg-white sticky top-0 right-0 shadow-md z-10">
      <div className="h-full flex justify-end items-center gap-6 pr-6">
        {/* <Badge count={5} >
          <Dropdown
            menu={{ items: itemNotifications }}
            placement="bottomRight"
            className="hover:cursor-pointer"
          >
            <BellOutlined className="text-2xl" style={{ color: "gray" }} />
          </Dropdown>
        </Badge> */}
        <Badge dot={true} status="success" className="custom-dot">
          <Dropdown
            menu={menuProps}
            placement="bottomRight"
            className="hover:cursor-pointer"
          >
            <UserOutlined className="text-2xl" style={{ color: "gray" }} />
          </Dropdown>
        </Badge>
      </div>
    </div>
  );
};

export default TopHeaders;
