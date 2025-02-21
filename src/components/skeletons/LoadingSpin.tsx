import { LoadingOutlined } from "@ant-design/icons";
import { Modal, Spin } from "antd";

interface LoadingSpinProps {
  isLoadingSpin: boolean;
}

export const LoadingSpin: React.FC<LoadingSpinProps> = (props) => {
  const { isLoadingSpin } = props;
  return (
    <>
      <Modal open={isLoadingSpin} closable={false} width={300} footer={null}>
        <div className="flex flex-col justify-center items-center">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 60 }} spin />} />
          <span className="mt-2">Đang xử lý dữ liệu...</span>
        </div>
      </Modal>
    </>
  );
};
