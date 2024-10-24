import type { Metadata } from "next";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import SessionWrapper from "@/components/SessionWrapper";

export const metadata: Metadata = {
  title: "Phần mềm quản lý tiết chuẩn - UEF",
  description: "Standard Plan Management Software",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionWrapper>
      <html lang="en">
        <body>
          <AntdRegistry>{children}</AntdRegistry>
        </body>
      </html>
    </SessionWrapper>
  );
}
