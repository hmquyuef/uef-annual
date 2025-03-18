"use client";

import SessionWrapper from "@/components/SessionWrapper";
import { store } from "@/store";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Provider } from "react-redux";
import "./globals.css";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <SessionWrapper>
            <AntdRegistry>{children}</AntdRegistry>
          </SessionWrapper>
        </Provider>
      </body>
    </html>
  );
}
