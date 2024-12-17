"use client";

import { PaymentApprovedItem } from "@/services/forms/PaymentApprovedItem";
import { convertTimestampToFullDateTime } from "@/utility/Utilities";
import { CloseOutlined, SafetyOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { FC } from "react";

interface InfoApprovedProps {
  mode: string;
  isPayment?: PaymentApprovedItem;
}

const InfoApproved: FC<InfoApprovedProps> = ({ mode, isPayment }) => {
  return (
    <div>
      {mode === "edit" && (
        <>
          <div className="flex flex-col gap-[2px]">
            <span className="font-medium text-neutral-600">
              Trạng thái phê duyệt thanh toán
            </span>
            <div>
              {isPayment ? (
                <>
                  {isPayment.isRejected ? (
                    <>
                      <div>
                        <span className="text-red-500">
                          <CloseOutlined className="me-1" /> Từ chối
                        </span>
                        {" - "}P.TC đã từ chối vào lúc{" "}
                        <strong>
                          {convertTimestampToFullDateTime(
                            isPayment.approvedTime
                          )}
                        </strong>
                      </div>
                      <div>- Lý do: {isPayment.reason}</div>
                    </>
                  ) : (
                    <>
                      <div>
                        <span className="text-green-500">
                          <SafetyOutlined className="me-1" /> Đã duyệt
                        </span>
                        {" - "}P.TC đã phê duyệt vào lúc{" "}
                        <strong>
                          {convertTimestampToFullDateTime(
                            isPayment.approvedTime
                          )}
                        </strong>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <>
                  <div>
                    <span className="text-sky-500">
                      <Spin size="small" className="mx-1" /> Chờ duyệt
                    </span>{" "}
                    {" - "} Đợi phê duyệt từ P.TC
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default InfoApproved;
