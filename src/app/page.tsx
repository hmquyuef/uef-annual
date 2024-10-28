"use client";
import { postInfoToGetToken } from "@/services/auth/authServices";
import Providers from "@/utility/Providers";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Home = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const getToken = async (email: string) => {
    if (email !== undefined) {
      const formData = new FormData();
      formData.append("userName", "");
      formData.append("password", "");
      formData.append("email", email);
      formData.append("provider", Providers.GOOGLE);
      const response = await postInfoToGetToken(formData);
      if (response.accessToken) {
        sessionStorage.setItem("s_t", response.accessToken);
        sessionStorage.setItem("s_r", response.refreshToken);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (session) {
        const email = session.user?.email;
        if (email !== undefined) {
          await getToken(email as string);
          if (sessionStorage.getItem("s_t")) {
            router.push("/workloads");
          } else {
            router.push("/login");
          }
        }
      } else {
        router.push("/login");
      }
    };

    fetchData();
  }, [session, router]);

  return null;
};
export default Home;
