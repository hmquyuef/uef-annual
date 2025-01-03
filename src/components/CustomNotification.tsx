"use client";
import Colors from "@/utility/Colors";
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
          <CheckCircleOutlined style={{ color: Colors.GREEN }} />
        ) : status === "error" ? (
          <CloseCircleOutlined style={{ color: Colors.RED }} />
        ) : status === "info" ? (
          <InfoCircleOutlined style={{ color: "#00e5ff" }} />
        ) : (
          <SmileOutlined style={{ color: Colors.ORANGE }} />
        ),
      style: {
        backgroundColor,
        borderLeft: `4px solid ${
          status === "success"
            ? Colors.GREEN
            : status === "error"
            ? Colors.RED
            : status === "info"
            ? "#00e5ff"
            : Colors.ORANGE
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
