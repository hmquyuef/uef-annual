import SessionWrapper from "@/components/SessionWrapper";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body>
        <SessionWrapper>
          <AntdRegistry>{children}</AntdRegistry>
        </SessionWrapper>
      </body>
    </html>
  );
}
