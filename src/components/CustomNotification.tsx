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
    api.open({
      message,
      description,
      icon:
        status === "success" ? (
          <CheckCircleOutlined style={{ color: "#10de2a" }} />
        ) : status === "error" ? (
          <CloseCircleOutlined style={{ color: "#e51b1b" }} />
        ) : status === "info" ? (
          <InfoCircleOutlined style={{ color: "#00e5ff" }} />
        ) : (
          <InfoCircleOutlined style={{ color: "#FBA41B" }} />
        ),
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
