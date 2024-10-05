"use client";

import TopHeaders from "@/components/TopHeader";
import { getListRolesByEmail, UserRole } from "@/services/users/usersServices";
import {
  AppstoreOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Image, Menu, MenuProps } from "antd";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
interface DashboardLayoutProps {
  children: React.ReactNode;
}
interface LevelKeysProps {
  key?: string;
  children?: LevelKeysProps[];
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  type MenuItem = Required<MenuProps>["items"][number];

  const [isOpened, setIsOpened] = useState(true);
  const [stateOpenKeys, setStateOpenKeys] = useState(["2", "21"]);
  const [itemsMenu, setItemsMenu] = useState<MenuItem[]>([]);
  const getLevelKeys = (items1: LevelKeysProps[]) => {
    const key: Record<string, number> = {};
    const func = (items2: LevelKeysProps[], level = 1) => {
      items2.forEach((item) => {
        if (item.key) {
          key[item.key] = level;
        }
        if (item.children) {
          func(item.children, level + 1);
        }
      });
    };
    func(items1);
    return key;
  };

  const onOpenChange: MenuProps["onOpenChange"] = (openKeys) => {
    const currentOpenKey = openKeys.find(
      (key) => stateOpenKeys.indexOf(key) === -1
    );
    // open
    if (currentOpenKey !== undefined) {
      const repeatIndex = openKeys
        .filter((key) => key !== currentOpenKey)
        .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);
      setStateOpenKeys(
        openKeys
          .filter((_, index) => index !== repeatIndex)
          .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey])
      );
    } else {
      setStateOpenKeys(openKeys);
    }
  };

  const levelKeys = getLevelKeys(itemsMenu as LevelKeysProps[]);

  const fetchRoles = async (mail: string) => {
    const response = await getListRolesByEmail(mail);
    if (response.items.length > 0) {
      response.items.map((item: UserRole) => {
        const roles = item.roles.map((role) => role.name);
        const tempMenu: MenuItem[] = [];
        if (roles.includes("user")) {
          tempMenu.push({
            key: "2",
            icon: <AppstoreOutlined />,
            label: "Khối lượng công tác",
            children: [
              {
                key: "21",
                label: <Link href="/workloads">Biểu mẫu</Link>,
              },
            ],
          });
        }
        if (roles.includes("manager")) {
          tempMenu.push({
            key: "2",
            icon: <AppstoreOutlined />,
            label: "Khối lượng công tác",
            children: [
              {
                key: "20",
                label: <Link href="/workloads/search">Tra cứu CBGVNV</Link>,
              },
              {
                key: "21",
                label: <Link href="/workloads">Biểu mẫu</Link>,
              },
            ],
          });
        }
        if (roles.includes("admin")) {
          tempMenu.push(
            {
              key: "2",
              icon: <AppstoreOutlined />,
              label: "Khối lượng công tác",
              children: [
                {
                  key: "20",
                  label: <Link href="/workloads/search">Tra cứu CBGVNV</Link>,
                },
                {
                  key: "21",
                  label: <Link href="/workloads">Biểu mẫu</Link>,
                },
                {
                  key: "22",
                  label: <Link href="/workloads/types">Loại biểu mẫu</Link>,
                },
                {
                  key: "23",
                  label: <Link href="/workloads/groups">Nhóm biểu mẫu</Link>,
                },
              ],
            },
            {
              key: "3",
              icon: <SettingOutlined />,
              label: "Cài đặt",
              children: [
                { key: "31", label: "Ứng dụng" },
                { key: "32", label: "Vai trò" },
                { key: "33", label: "Phân quyền" },
              ],
            }
          );
        }
        setItemsMenu(tempMenu);
      });
    }
    const currentPath = window.location.pathname;
    router.push(currentPath);
  };
  useEffect(() => {
    if (session) {
      const email = session.user?.email;
      if (email) {
        fetchRoles(email);
      }
    }
  }, [session, router]);

  return (
    <React.Fragment>
      <div className="flex h-screen bg-gray-50">
        <div className="h-full fixed top-0 left-0 z-30">
          <aside
            className={`flex flex-col transition-all duration-300 ${
              isOpened ? "w-60" : "w-16"
            }`}
          >
            <header className="h-16 flex items-center justify-center bg-white">
              <Image width={150} src="/logoUEF.svg" />
            </header>
            <hr />
            <article>
              <Menu
                style={{
                  width: "100%",
                  height: "calc(100svh - 104px)",
                }}
                defaultSelectedKeys={["21"]}
                openKeys={stateOpenKeys}
                onOpenChange={onOpenChange}
                mode={"inline"}
                theme={"dark"}
                inlineCollapsed={!isOpened}
                items={itemsMenu}
              />
            </article>
            <footer className="w-full">
              <button
                onClick={() => setIsOpened(!isOpened)}
                className="w-full p-2 bg-red-500 text-white"
              >
                {isOpened ? <ArrowLeftOutlined /> : <ArrowRightOutlined />}
              </button>
            </footer>
          </aside>
        </div>
        <div
          className={`flex-1 transition-all duration-300 ${
            isOpened ? "ml-60" : "ml-16"
          }`}
        >
          {itemsMenu && itemsMenu.length > 0 && (
            <>
              <TopHeaders
                name={session?.user?.name || ""}
                email={session?.user?.email || ""}
              />
              {children}
            </>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}
