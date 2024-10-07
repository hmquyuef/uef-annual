"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { Fragment, useEffect } from "react";

interface LoginLayoutProps {
  children: React.ReactNode;
}

export default function LoginLayout({ children }: LoginLayoutProps) {
  const { data: session } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session) {
      router.push("/workloads");
    }
  }, [session, router]);
  return <Fragment>{children}</Fragment>;
}
