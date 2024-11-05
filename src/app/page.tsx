"use client";
import { postInfoToGetToken } from "@/services/auth/authServices";
import Providers from "@/utility/Providers";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";

const Home = () => {
  const { data: session } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    const fetchData = async () => {
      if (session) {
        router.push("/workloads");
      } else {
        router.push("/login");
      }
    };

    fetchData();
  }, [session, router]);

  return null;
};
export default Home;
