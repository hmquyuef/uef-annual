import { ReactNode } from "react";
import { Modal, ModalProps } from "antd";

interface CustomModalProps extends ModalProps {
    children: ReactNode;
}

const CustomModal = ({ children, ...props }: CustomModalProps) => {
    return (
        <Modal {...props}>
            {children}
        </Modal>
    );
}
export default CustomModal;