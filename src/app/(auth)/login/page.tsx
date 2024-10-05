"use client";

import { GoogleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { signIn } from "next-auth/react";

const Login = () => {
  const handleLogin = async () => {
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="w-full h-screen min-w-[400px] bg-gray-100 flex justify-center items-center">
      <div className="w-1/4 min-w-[400px] bg-white rounded-xl shadow-lg mb-16 flex flex-col items-center py-10">
        <img src="/logoUEF.svg" width={250} alt="login" />
        <div className="flex flex-col gap-3 my-3">
          <hr className="mt-2"/>
          <div className="py-4">
            <p className="text-neutral-500 text-[14px]">
            Dùng tài khoản <span className="text-red-600 font-semibold">Email UEF</span> để đăng nhập vào hệ thống.
            </p>
          </div>
          <hr className="mb-2"/>
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
