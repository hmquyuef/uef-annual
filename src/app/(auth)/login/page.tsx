"use client";

import { postInfoToGetToken } from "@/services/auth/authServices";
import { GoogleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const Login = () => {
  const { data: session } = useSession();
  const router = useRouter();
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
 
  const handleLogin = async () => {
    const result = await signIn("google");
    if (result?.error) {
      console.error("Login failed:", result.error);
    } else {
      if (session && session.user?.email) {
        await getToken(session.user.email);
      }
      router.push("/");
    }
  };

  return (
    <div className="w-full h-screen min-w-[400px] bg-gray-100 flex justify-center items-center">
      <div className="w-1/4 min-w-[400px] bg-white rounded-xl shadow-lg mb-16 flex flex-col items-center py-10">
        <img src="/logoUEF.svg" width={250} alt="login" />
        <div className="flex flex-col gap-3 my-3">
          <hr className="mt-2" />
          <div className="py-4">
            <p className="text-neutral-500 text-[14px]">
              Dùng tài khoản{" "}
              <span className="text-red-600 font-semibold">Email UEF</span> để
              đăng nhập vào hệ thống.
            </p>
          </div>
          <hr className="mb-2" />
          <div className="text-center mt-3">
            <Button
              type="primary"
              size="large"
              icon={<GoogleOutlined />}
              onClick={handleLogin}
            >
              Đăng nhập với Email UEF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
