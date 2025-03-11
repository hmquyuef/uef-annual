import { RoleItem } from "@/services/roles/rolesServices";
import { Button, Modal, ModalProps } from "antd";

interface CustomModalProps extends ModalProps {
  title: string;
  bodyContent: React.ReactNode;
  width?: string;
  confirmType?: number;
  isOpen: boolean;
  onOk: () => void;
  onCancel: () => void;
  role?: RoleItem | undefined;
  onApprove?: () => void;
  onConfirm?: () => void;
  onApprovedConfirm?: () => void;
  onReject?: () => void;
  isBlock?: boolean;
}

const CustomModal: React.FC<CustomModalProps> = ({
  title,
  bodyContent,
  width,
  confirmType,
  isOpen,
  onOk,
  onCancel,
  role,
  onApprove,
  onConfirm,
  onApprovedConfirm,
  onReject,
  isBlock,
}) => {
  return (
    <Modal
      open={isOpen}
      title={title}
      style={{ top: 20 }}
      onOk={onOk}
      onCancel={onCancel}
      okText="Xác nhận"
      cancelText="Quay lại"
      width={width ? width : "900px"}
      height={width ? "80vh" : "auto"}
      footer={(_, { OkBtn, CancelBtn }) => (
        <>
          <CancelBtn />
          {role?.displayRole?.isReject &&
            !isBlock &&
            (confirmType ?? 0) === 0 && (
              <>
                <Button
                  color="red"
                  variant="solid"
                  onClick={() => {
                    onReject && onReject();
                  }}
                >
                  Từ chối
                </Button>
              </>
            )}
          {role?.displayRole?.isApprove &&
            !isBlock &&
            (confirmType ?? 0) === 0 &&
            role?.name !== "finance-manager" && (
              <>
                <Button
                  color="purple"
                  variant="solid"
                  onClick={() => {
                    onApprove && onApprove();
                  }}
                >
                  Kiểm duyệt
                </Button>
              </>
            )}
          {role?.displayRole?.isApprove &&
            !isBlock &&
            (confirmType ?? 0) >= 1 &&
            (role?.name === "finance-manager" || role?.name === "admin") && (
              <>
                <Button
                  type="primary"
                  onClick={() => {
                    onConfirm && onConfirm();
                  }}
                >
                  Xác nhận
                </Button>
              </>
            )}
          {role?.displayRole?.isApprove &&
            !isBlock &&
            (role?.name === "finance-manager" || role?.name === "admin") && (
              <>
                <Button
                  type="primary"
                  onClick={() => {
                    onApprovedConfirm && onApprovedConfirm();
                  }}
                >
                  Kiểm duyệt & Xác nhận
                </Button>
              </>
            )}
          {role?.displayRole?.isConfirm && !isBlock && (
            <>
              <OkBtn />
            </>
          )}
        </>
      )}
    >
      <div className="overflow-y-auto">{bodyContent}</div>
    </Modal>
  );
};

export default CustomModal;
