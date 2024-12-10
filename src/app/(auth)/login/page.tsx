"use client";

import {
  GoogleOutlined,
  LockOutlined,
  LoginOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Checkbox, Divider, Input } from "antd";
import { signIn } from "next-auth/react";
import { useState } from "react";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [remember, setRemember] = useState(false);
  // const { data: session } = useSession();
  // const router = useRouter();
  // const getToken = async (email: string) => {
  //   const formData = new FormData();
  //   formData.append("username", "");
  //   formData.append("password", "");
  //   formData.append("email", email);
  //   formData.append("provider", "Google");

  //   const response = await postInfoToGetToken(formData);
  //   if (response && response !== undefined) {
  //     const expires = new Date(response.expiresAt * 1000);
  //     const expiresRefresh = new Date(response.expiresAt * 1000);
  //     expiresRefresh.setDate(expiresRefresh.getDate() + 7);
  //     Cookies.set("s_t", response.accessToken, { expires: expires });
  //     Cookies.set("s_r", response.refreshToken, {
  //       expires: expiresRefresh,
  //     });
  //   }
  // };

  const handleLogin = async () => {
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    // <div className="w-full h-screen min-w-[400px] bg-gray-100 flex justify-center items-center">
    //   <div className="w-1/4 min-w-[400px] bg-white rounded-xl shadow-lg mb-16 flex flex-col items-center py-10">
    //     <img src="/logoUEF.svg" width={250} alt="login" />
    //     <div className="flex flex-col gap-3 my-3">
    //       <hr className="mt-2" />
    //       <div className="py-4">
    //         <p className="text-neutral-500 text-[14px]">
    //           Dùng tài khoản{" "}
    //           <span className="text-red-600 font-semibold">Email UEF</span> để
    //           đăng nhập vào hệ thống.
    //         </p>
    //       </div>
    //       <hr className="mb-2" />
    //       <div className="text-center mt-3">
    //         <Button
    //           type="primary"
    //           size="large"
    //           icon={<GoogleOutlined />}
    //           onClick={handleLogin}
    //         >
    //           Đăng nhập với Email UEF
    //         </Button>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <section className="flex flex-col justify-center bg-[#fcfaf6] h-svh min-w-[425px]">
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
          <Divider plain>
            <span className="text-neutral-400">hoặc</span>
          </Divider>
          <div className="flex flex-col gap-1 mb-4">
            <span className="font-medium text-[14px] text-neutral-600">
              Mã số CB-GV-NV
            </span>
            <Input
              size="large"
              addonBefore={<UserOutlined />}
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1 mb-4">
            <span className="font-medium text-[14px] text-neutral-600">
              Mật khẩu
            </span>
            <Input.Password
              size="large"
              addonBefore={<LockOutlined />}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex justify-between items-center mb-4">
            <Checkbox
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            >
              Ghi nhớ đăng nhập
            </Checkbox>
            <Button color="primary" variant="link">
              Quên mật khẩu?
            </Button>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<LoginOutlined />}
            iconPosition="end"
            onClick={(e) => {
              e.preventDefault();
              let temp = `tai khoan: ${userName}, mat khau: ${password}, ghi nho: ${remember}`;
              alert(temp);
            }}
            className="w-full"
          >
            Đăng nhập
          </Button>
        </form>
      </div>
    </section>
  );
};

export default Login;
