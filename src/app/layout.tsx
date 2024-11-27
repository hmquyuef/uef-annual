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
    <SessionWrapper>
      <html lang="en">
        <body>
          <AntdRegistry>
            {children}
            {/* <DashboardLayout>
              <div className="px-4 py-3">{children}</div>
            </DashboardLayout> */}
          </AntdRegistry>
        </body>
      </html>
    </SessionWrapper>
  );
}
