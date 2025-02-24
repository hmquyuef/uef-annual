"use client";

import useWebSocketPing from "@/hook/useWebSocketPing";
import { FC, useEffect, useState } from "react";
import CustomNotification from "./CustomNotification";

interface WebSocketPingProps {
  isOpen: boolean;
}

const WebSocketPing: FC<WebSocketPingProps> = (props) => {
  const { isOpen } = props;
  const { latency, status } = useWebSocketPing(
    "wss://api-annual.uef.edu.vn/ws/connect"
  );
  const [formNotification, setFormNotification] = useState<{
    message: string;
    description: string;
    status: "success" | "error" | "info" | "warning";
    isOpen: boolean;
  }>({
    message: "",
    description: "",
    status: "success",
    isOpen: false,
  });

  useEffect(() => {
    if (status === "disconnected") {
      setFormNotification({
        message: "Kết nối mạng đã bị ngắt",
        description: "Vui lòng kiểm tra lại kết nối mạng",
        status: "error",
        isOpen: true,
      });
    }
    setTimeout(() => {
      setFormNotification((prev) => ({ ...prev, isOpen: false }));
    }, 200);
  }, [status, formNotification.isOpen]);

  return (
    <div
      className={`h-8 border-t-2 border-${
        status === "fast" ? "green" : status === "slow" ? "orange" : "red"
      }-500`}
      style={{ backgroundColor: "#001529" }}
    >
      <div
        className={`flex items-center px-3 py-1 ${
          isOpen ? "justify-between" : " flex-col"
        }`}
      >
        <div className="flex items-center gap-2">
          {status === "fast" ? (
            <img
              src="/wifis/wifi-high.svg"
              alt="wifi-high"
              className="w-5 h-5"
            />
          ) : status === "slow" ? (
            <img
              src="/wifis/wifi-medium.svg"
              alt="wifi-medium"
              className="w-5 h-5"
            />
          ) : (
            <img src="/wifis/wifi-x.svg" alt="wifi-x" className="w-5 h-5" />
          )}
          {isOpen && (
            <>
              {status === "fast" ? (
                <span className="text-green-500">Tốt</span>
              ) : status === "slow" ? (
                <span className="text-orange-500">Trung bình</span>
              ) : (
                <span className="text-red-500">Yếu</span>
              )}
            </>
          )}
        </div>
        {isOpen && (
          <>
            <span
              className={`text-sm text-${
                status === "fast"
                  ? "green"
                  : status === "slow"
                  ? "orange"
                  : "red"
              }-500`}
            >
              {latency ? latency : 0} ms
            </span>
          </>
        )}
      </div>
      <CustomNotification
        message={formNotification.message}
        description={formNotification.description}
        status={formNotification.status}
        isOpen={formNotification.isOpen}
      />
    </div>
  );
};

export default WebSocketPing;
