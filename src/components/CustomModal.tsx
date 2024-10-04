import { Button, Modal, ModalProps } from "antd";

interface CustomModalProps extends ModalProps {
  title: string;
  bodyContent: React.ReactNode;
  isOpen: boolean;
  isOk: boolean;
  onOk: () => void;
  onCancel: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({
  title,
  bodyContent,
  isOpen,
  isOk,
  onOk,
  onCancel,
}) => {
  return (
    <Modal
      open={isOpen}
      title={title}
      onOk={onOk}
      onCancel={onCancel}
      okText="Xác nhận"
      cancelText="Quay lại"
      width={900}
      footer={(_, { OkBtn, CancelBtn }) => (
        console.log("isOk", isOk),
        (
          <>
            <CancelBtn />
            {isOk && <OkBtn />}
          </>
        )
      )}
    >
      {bodyContent}
    </Modal>
  );
};

export default CustomModal;
