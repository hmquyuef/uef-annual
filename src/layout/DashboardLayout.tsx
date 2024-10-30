"use client";

import TopHeaders from "@/components/TopHeader";
import { postInfoToGetToken } from "@/services/auth/authServices";
import { getAllPermissionsForMenuByUserName } from "@/services/permissions/permissionForMenu";
import { getUserNameByEmail } from "@/services/users/usersServices";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { Alert, Image, Menu, MenuProps } from "antd";
import Cookies from "js-cookie";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
interface DashboardLayoutProps {
  children: React.ReactNode;
}
interface LevelKeysProps {
  key?: string;
  children?: LevelKeysProps[];
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [isSlowConnection, setIsSlowConnection] = useState(false);
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
    const tempMenu: MenuItem[] = listmenus.items[0].permissions.map((item) => {
      const tempChildren: MenuItem[] = item.children.map((child) => ({
        key: child.position,
        label: <Link href={child.href}>{child.label}</Link>,
      }));
      const IconComponent = item.icon
        ? require(`@ant-design/icons`)[item.icon]
        : null;
      return {
        key: item.position,
        icon: IconComponent ? <IconComponent /> : null,
        label: item.label,
        children: tempChildren,
      };
    });
    setItemsMenu(tempMenu);
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

  useEffect(() => {
    const fetchData = async () => {
      if (session === undefined || session === null) {
        router.push("/login");
        return;
      }

      const email = session.user?.email;
      if (email) {
        getToken(email);
        getMenuByUserName(email);
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

  useEffect(() => {
    const connection =
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection;

    const checkConnectionSpeed = () => {
      if (connection) {
        const { effectiveType } = connection;
        setIsSlowConnection(["2g", "slow-2g", "3g"].includes(effectiveType));
      }
    };

    const handleNetworkChange = () => {
      setIsOnline(navigator.onLine);
      checkConnectionSpeed();
    };

    handleNetworkChange(); // Kiểm tra ngay khi component mount

    window.addEventListener("online", handleNetworkChange);
    window.addEventListener("offline", handleNetworkChange);
    connection?.addEventListener("change", checkConnectionSpeed);

    return () => {
      window.removeEventListener("online", handleNetworkChange);
      window.removeEventListener("offline", handleNetworkChange);
      connection?.removeEventListener("change", checkConnectionSpeed);
    };
  }, []);

  return (
    <React.Fragment>
      <div className="flex h-screen bg-[#fcfaf6]">
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
              {!isOnline && (
                <div className="mx-4 pt-4">
                  <Alert
                    banner
                    message={
                      <Marquee pauseOnHover gradient={false}>
                        Kết nối mạng hiện tại của bạn không khả dụng. Vui lòng
                        kiểm tra lại.
                      </Marquee>
                    }
                    type="error"
                    showIcon
                  />
                </div>
              )}
              {isSlowConnection && isOnline && (
                <div className="mx-4 pt-4">
                  <Alert
                    banner
                    message={
                      <Marquee pauseOnHover gradient={false}>
                        Tốc độ mạng của bạn hiện tại đang rất chậm. Điều này có
                        thể ảnh hưởng đến trải nghiệm của bạn.
                      </Marquee>
                    }
                    type="warning"
                    showIcon
                  />
                </div>
              )}
              {children}
            </>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}
