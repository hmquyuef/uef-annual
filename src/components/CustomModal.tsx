import { Button, Modal, ModalProps } from "antd";

interface CustomModalProps extends ModalProps {
  title: string;
  bodyContent: React.ReactNode;
  width?: string;
  isOpen: boolean;
  isOk: boolean;
  onOk: () => void;
  onCancel: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({
  title,
  bodyContent,
  width,
  isOpen,
  isOk,
  onOk,
  onCancel,
}) => {
  return (
    <Modal
      open={isOpen}
      title={title}
      style={{ top: 10 }}
      onOk={onOk}
      onCancel={onCancel}
      okText="Xác nhận"
      cancelText="Quay lại"
      width={width ? width : "800px"}
      footer={(_, { OkBtn, CancelBtn }) => (
      // console.log("isOk", isOk),
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
