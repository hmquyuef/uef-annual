import { RoleItem } from "@/services/roles/rolesServices";
import { Button, Modal, ModalProps } from "antd";

interface CustomModalProps extends ModalProps {
  title: string;
  bodyContent: React.ReactNode;
  width?: string;
  isOpen: boolean;
  onOk: () => void;
  onCancel: () => void;
  role?: RoleItem | undefined;
  onApprove?: () => void;
  onReject?: () => void;
  isBlock?: boolean;
}

const CustomModal: React.FC<CustomModalProps> = ({
  title,
  bodyContent,
  width,
  isOpen,
  onOk,
  onCancel,
  role,
  onApprove,
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
          {role?.displayRole?.isReject && !isBlock && (
            <>
              <Button
                color="danger"
                variant="solid"
                onClick={() => {
                  onReject && onReject();
                }}
              >
                Từ chối
              </Button>
            </>
          )}
          {role?.displayRole?.isApprove && !isBlock && (
            <>
              <Button
                type="primary"
                onClick={() => {
                  onApprove && onApprove();
                }}
              >
                Phê duyệt
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
