import NotPermissionLayout from "@/layout/NotPermissionLayout";
import { Metadata } from "next";
import React from "react";

interface NotPermissionProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "Phân quyền",
  description: "Phân quyền sử dụng hệ thống",
};

export default function NotPermissionsLayout({ children }: NotPermissionProps) {
  return <NotPermissionLayout>{children}</NotPermissionLayout>;
}
