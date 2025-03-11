"use client";

import Colors from "@/utility/Colors";
import { GoogleOutlined } from "@ant-design/icons";
import { Button, Divider } from "antd";
import { signIn } from "next-auth/react";

const Login = () => {
  const handleLogin = async () => {
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <section
      className="flex flex-col justify-center h-svh min-w-[425px]"
      style={{ backgroundColor: Colors.BACKGROUND }}
    >
      <div className="flex justify-center mt-[-150px] mb-6">
        <img src="/logoUEF.svg" width={300} alt="login" />
      </div>
      <div className="flex flex-col items-center">
        <form className="bg-white p-8 rounded-lg shadow-xl shadow-blue-100 min-w-[425px]">
          <div className="flex flex-col mb-4">
            <p className="font-semibold text-[24px] text-neutral-600 mb-1">
              Đăng nhập
            </p>
            <span className="text-[14px] text-neutral-500">
              Chào mừng đã quay trở lại!
            </span>
          </div>
          <Divider plain>
            <span className="text-neutral-400">Đăng nhập hệ thống</span>
          </Divider>
          <Button
            color="primary"
            variant="filled"
            size="large"
            icon={<GoogleOutlined />}
            onClick={handleLogin}
            className="w-full"
          >
            Sử dụng tài khoản
            <span className="text-rose-500 font-medium">email UEF</span>
          </Button>
        </form>
      </div>
    </section>
  );
};

export default Login;
