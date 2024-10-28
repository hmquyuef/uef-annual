"use client";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { notification } from "antd";
import { useEffect } from "react";

interface NotificationProps {
  message: string;
  description: string;
  isOpen: boolean;
  status?: "success" | "error" | "info" | "warning";
}

const CustomNotification: React.FC<NotificationProps> = ({
  message,
  description,
  isOpen,
  status,
}) => {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = () => {
    let backgroundColor;
    switch (status) {
      case "success":
        backgroundColor = "#d4edda";
        break;
      case "error":
        backgroundColor = "#f8d7da";
        break;
      case "info":
        backgroundColor = "#d1ecf1";
        break;
      case "warning":
        backgroundColor = "#fff3cd";
        break;
      default:
        backgroundColor = "#ffffff";
    }

    api.open({
      message: <span className="font-medium">{message}</span>,
      description,
      icon:
        status === "success" ? (
          <CheckCircleOutlined style={{ color: "#10de2a" }} />
        ) : status === "error" ? (
          <CloseCircleOutlined style={{ color: "#e51b1b" }} />
        ) : status === "info" ? (
          <InfoCircleOutlined style={{ color: "#00e5ff" }} />
        ) : (
          <SmileOutlined style={{ color: "#FBA41B" }} />
        ),
      style: {
        backgroundColor,
        borderLeft: `4px solid ${
          status === "success"
            ? "#10de2a"
            : status === "error"
            ? "#e51b1b"
            : status === "info"
            ? "#00e5ff"
            : "#FBA41B"
        }`,
        borderRadius: "8px",
        boxShadow: `0 4px 8px ${
          status === "success"
            ? "rgba(16, 222, 42, 0.4)"
            : status === "error"
            ? "rgba(229, 27, 27, 0.4)"
            : status === "info"
            ? "rgba(0, 229, 255, 0.4)"
            : "rgba(251, 164, 27, 0.4)"
        }`,
      },
    });
  };

  useEffect(() => {
    if (isOpen) {
      openNotification();
    }
  }, [isOpen]);

  return <>{contextHolder}</>;
};

export default CustomNotification;
