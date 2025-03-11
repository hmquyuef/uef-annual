"use client";

import { PaymentApprovedItem } from "@/services/forms/PaymentApprovedItem";
import {
  convertTimestampToDate,
  convertTimestampToFullDateTime,
} from "@/utility/Utilities";
import { Spin, Steps } from "antd";
import { FC, useEffect, useState } from "react";

interface InfoApprovedProps {
  mode: string;
  payments?: PaymentApprovedItem[];
  createdTime: number;
}

const InfoApproved: FC<InfoApprovedProps> = ({
  mode,
  payments,
  createdTime,
}) => {
  const [itemapproved, setItemApproved] = useState<any>(null);
  const [approvedTime, setApprovedTime] = useState<number>(0);
  const [confirmType, setConfirmType] = useState<number>(0);
  const [itemConfirm, setItemConfirm] = useState<any>(null);
  const [confirmedTime, setConfirmedTime] = useState<number>(0);
  const items = [
    {
      title: <span className="text-blue-500">Khởi tạo</span>,
      description: (
        <div>
          <span className="text-[12px] text-blue-400">
            {convertTimestampToDate(createdTime)}
          </span>
        </div>
      ),
    },
    {
      title: <span className="text-blue-500">Kiểm duyệt</span>,
      description: (
        <>
          {approvedTime !== 0 ? (
            <div className="flex flex-col gap-1">
              <span
                className={
                  itemapproved && itemapproved.isRejected
                    ? "text-red-500"
                    : "text-green-500"
                }
              >
                {itemapproved && itemapproved.isRejected
                  ? "Từ chối"
                  : "Chấp nhận"}
              </span>
              <span
                className={`text-[12px]
                  ${
                    itemapproved && itemapproved.isRejected
                      ? "text-red-500"
                      : "text-green-500"
                  }
                `}
              >
                {convertTimestampToFullDateTime(approvedTime)}
              </span>
            </div>
          ) : (
            <>
              <span className="text-[12px] text-blue-400">
                <Spin size="small" /> Đang kiểm duyệt
              </span>
            </>
          )}
        </>
      ),
    },
    {
      title: <span className="text-blue-500">Xác nhận</span>,
      description: (
        <>
          {confirmedTime !== 0 ? (
            <div className="flex flex-col gap-1">
              <span
                className={
                  itemConfirm && itemConfirm.isRejected
                    ? "text-red-500"
                    : "text-green-500"
                }
              >
                {itemConfirm && itemConfirm.isRejected
                  ? "Từ chối"
                  : "Chấp nhận"}
              </span>
              <span
                className={`text-[12px] ${
                  itemConfirm && itemConfirm.isRejected
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {convertTimestampToFullDateTime(confirmedTime)}
              </span>
            </div>
          ) : (
            <>
              {approvedTime !== 0 && (
                <>
                  <span className="text-[12px] text-blue-400">
                    <Spin size="small" /> Đợi xác nhận
                  </span>
                </>
              )}
            </>
          )}
        </>
      ),
    },
  ];

  useEffect(() => {
    if (!payments || payments.length === 0) {
      setConfirmType(1);
      setApprovedTime(0);
      setConfirmedTime(0);
      return;
    }

    let maxConfirmType = 2;
    let approvedTime = 0;
    let confirmedTime = 0;

    for (const payment of payments) {
      if (payment.confirmationType > maxConfirmType) {
        maxConfirmType = payment.confirmationType;
      }

      if (payment.confirmationType === 1) {
        approvedTime = payment.confirmationTime;
        setItemApproved(payment);
      } else if (payment.confirmationType === 2) {
        confirmedTime = payment.confirmationTime;
        setItemConfirm(payment);
      } else if (payment.confirmationType === 3) {
        approvedTime = confirmedTime = payment.confirmationTime;
        setItemApproved(payment);
        setItemConfirm(payment);
      }
    }

    setConfirmType(maxConfirmType);
    setApprovedTime(approvedTime);
    setConfirmedTime(confirmedTime);
  }, [payments]);

  return (
    <div className="select-none">
      {mode === "edit" && (
        <>
          <div className="flex flex-col gap-1 mt-1">
            <span className="font-medium text-neutral-600">
              Trạng thái phê duyệt thanh toán
            </span>
            <div>
              <Steps
                current={confirmType}
                status={confirmedTime !== 0 ? "finish" : "process"}
                percent={50}
                labelPlacement="vertical"
                items={items}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default InfoApproved;
