"use client";

import TopHeaders from "@/components/TopHeader";
import WebSocketPing from "@/components/WebSocketPing";
import {
  postInfoToGetToken,
  putTokenByRefresh,
} from "@/services/auth/authServices";
import { getAllPermissionsForMenuByUserName } from "@/services/permissions/permissionForMenu";
import { getUserNameByEmail } from "@/services/users/usersServices";
import Colors from "@/utility/Colors";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { FloatButton, Image, Menu, MenuProps, Tooltip } from "antd";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
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
  const { data: session } = useSession();
  const router = useRouter();
  type MenuItem = Required<MenuProps>["items"][number];
  const [isOpened, setIsOpened] = useState(true);
  const [stateOpenKeys, setStateOpenKeys] = useState(["1", "12"]);
  const [itemsMenu, setItemsMenu] = useState<MenuItem[]>([]);
  const getLevelKeys = (items1: LevelKeysProps[]) => {
    const key: Record<string, number> = {};
    const func = (items2: LevelKeysProps[], level = 1) => {
      items2.forEach((item) => {
        if (item && item.key) {
          key[item.key] = level;
        }
        if (item && item.children) {
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
  const handleClick = (e: any) => {
    Cookies.set("m_k", e.key);
    Cookies.set(
      "m_i",
      JSON.stringify([e.keyPath[1], e.keyPath[0], e.domEvent.target.href])
    );
  };
  const getMenuByUserName = async (email: string) => {
    const response = await getUserNameByEmail(email);
    if (!response) return router.push("/not-permission");
    const listmenus = await getAllPermissionsForMenuByUserName(
      response.userName
    );
    if (listmenus.items.length === 0) return router.push("/not-permission");
    const tempMenu: any[] = listmenus.items[0].permissions.map((item) => {
      const tempChildren: MenuItem[] | null = item.isChildren
        ? item.children
            ?.filter((child) => child.isActived)
            .map((child) => ({
              key: child.position,
              label: <Link href={child.href}>{child.label}</Link>,
            }))
        : null;
      const IconComponent = item.icon
        ? require(`@ant-design/icons`)[item.icon]
        : null;
      if (tempChildren && tempChildren.length > 0) {
        return {
          key: item.position,
          icon: IconComponent ? <IconComponent /> : null,
          label: item.label,
          children: tempChildren,
        };
      }
    });
    const token = Cookies.get("s_t") as string;
    const decodedRole = jwtDecode<{
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
    }>(token);
    const role =
      decodedRole[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ];
    if (role === "admin" || role === "user" || role === "manager") {
      setItemsMenu([
        {
          key: "0",
          icon: <HomeOutlined />,
          label: <Link href={"/"}>Trang chủ</Link>,
        },
        ...tempMenu,
      ]);
    } else {
      setItemsMenu(tempMenu);
    }
  };

  const getToken = async (email: string) => {
    const formData = new FormData();
    formData.append("username", "");
    formData.append("password", "");
    formData.append("email", email);
    formData.append("provider", "Google");

    const response = await postInfoToGetToken(formData);
    if (response && response !== undefined) {
      const expires = new Date(response.expiresAt * 1000);
      const expiresRefresh = new Date(response.expiresAt * 1000);
      expiresRefresh.setDate(expiresRefresh.getDate() + 7);
      Cookies.set("s_t", response.accessToken, { expires: expires });
      Cookies.set("s_r", response.refreshToken, {
        expires: expiresRefresh,
      });
    }
  };

  const getTokenWithRefreshToken = async (refresh: string, email: string) => {
    const response = await putTokenByRefresh(refresh);
    if (response) {
      const expires = new Date(response.expiresAt * 1000);
      Cookies.set("s_t", response.accessToken, { expires: expires });
    } else {
      Cookies.remove("s_t");
      Cookies.remove("s_r");
      await getToken(email);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (session === undefined || session === null) {
        router.push("/login");
        return;
      }

      const email = session.user?.email;
      if (email) {
        const token = Cookies.get("s_t");
        const refreshToken = Cookies.get("s_r");
        if (!token && !refreshToken) {
          await getToken(email);
        }
        if (!token && refreshToken) {
          await getTokenWithRefreshToken(refreshToken, email);
        }
        await getMenuByUserName(email);
      }
    };

    const loadMenuFromCookies = () => {
      const menuOpen = Cookies.get("m_i");
      if (menuOpen) {
        const openKeys = JSON.parse(menuOpen);
        setStateOpenKeys([openKeys[0], openKeys[1]]);
        router.push(openKeys[2]);
      }
    };

    fetchData();
    loadMenuFromCookies();
  }, [session, router]);

  return (
    <React.Fragment>
      <div
        className="flex min-h-screen"
        style={{ backgroundColor: Colors.BACKGROUND }}
      >
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
                  height: "calc(100svh - 136px)",
                }}
                defaultSelectedKeys={[Cookies.get("m_k") || "12"]}
                openKeys={stateOpenKeys}
                onOpenChange={onOpenChange}
                onClick={handleClick}
                mode={"inline"}
                theme={"dark"}
                inlineCollapsed={!isOpened}
                items={itemsMenu}
              />
            </article>
            <footer className="w-full">
              <WebSocketPing isOpen={isOpened} />
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
              <footer className="bg-white h-10 max-h-10 px-3 py-2 border-t-2 border-gray-100 text-center align-middle">
                <Tooltip title="Về đầu trang">
                  <FloatButton.BackTop />
                </Tooltip>
                <span className="text-sm text-neutral-600">
                  Bản quyền © {new Date().getFullYear()} thuộc{" "}
                  <span className="text-red-500 font-semibold">UEF</span> -
                  Thiết kế và phát triển bới{" "}
                  <span className="font-semibold">TT.QLCNTT</span>
                </span>
              </footer>
            </>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}
