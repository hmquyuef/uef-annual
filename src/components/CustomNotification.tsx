"use client";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { notification } from "antd";
import { FC, useEffect } from "react";

interface NotificationProps {
  message: string;
  description: string;
  isOpen: boolean;
  status?: "success" | "error" | "info" | "warning";
}

const CustomNotification: FC<NotificationProps> = ({
  message,
  description,
  isOpen,
  status,
}) => {
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    if (isOpen) {
      openNotification();
    }
  }, [isOpen, status]);

  const openNotification = () => {
    const colors = {
      success: {
        bg: "#d4edda",
        text: "green",
        sub: "#05bd30",
        border: "green",
        shadow: "rgba(21, 252, 52, 0.4)",
      },
      error: {
        bg: "#f8d7da",
        text: "red",
        sub: "#fa505e",
        border: "red",
        shadow: "rgba(229, 27, 27, 0.4)",
      },
      info: {
        bg: "#d1ecf1",
        text: "sky",
        sub: "#25b4f7",
        border: "#0ea5e9",
        shadow: "rgba(0, 229, 255, 0.4)",
      },
      warning: {
        bg: "#fff3cd",
        text: "orange",
        sub: "#fdde76",
        border: "orange",
        shadow: "rgba(251, 164, 27, 0.4)",
      },
    };

    const currentColor = colors[status ?? "info"];

    api.open({
      message: (
        <span className={`font-medium text-${currentColor.text}-500`}>
          {message}
        </span>
      ),
      description: (
        <span style={{ color: currentColor.sub }}>{description}</span>
      ),
      icon:
        status === "success" ? (
          <CheckCircleOutlined style={{ color: "green" }} />
        ) : status === "error" ? (
          <CloseCircleOutlined style={{ color: "red" }} />
        ) : status === "info" ? (
          <InfoCircleOutlined style={{ color: "#0ea5e9" }} />
        ) : (
          <SmileOutlined style={{ color: "orange" }} />
        ),
      style: {
        backgroundColor: currentColor.bg,
        borderLeft: `4px solid ${currentColor.border}`,
        borderRadius: "8px",
        boxShadow: `0 4px 8px ${currentColor.shadow}`,
      },
    });
  };

  return <>{contextHolder}</>;
};

export default CustomNotification;
