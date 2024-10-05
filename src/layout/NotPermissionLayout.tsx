"use client";

import React from "react";

interface NotPermissionProps {
  children: React.ReactNode;
}

export default function NotPermission({ children }: NotPermissionProps) {
  return <React.Fragment>{children}</React.Fragment>;
}
