import { convertTimestampToFullDateTime } from "@/utility/Utilities";
import {
  CloseOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Menu, MenuProps } from "antd";

interface NotificationMenuProps {
  data: {
    id: string;
    title: string;
    massages: string;
    isRead: boolean;
    creationTime: number;
  }[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationMenu: React.FC<NotificationMenuProps> = ({
  data,
  onMarkAsRead,
  onDelete,
}) => {
  const items: MenuProps["items"] = data.map((item) => ({
    key: item.id,
    label: (
      <div
        className="flex flex-col w-64 cursor-pointer"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
      >
        <div className="flex justify-between items-center">
          <span
            className={`text-sm ${
              item.isRead ? "text-gray-600" : "font-semibold"
            }`}
          >
            {item.title}
          </span>
          <span
            className="text-red-500 hover:text-red-700"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onDelete(item.id);
            }}
          >
            <span className="text-[11px]">
              <CloseOutlined />
            </span>
          </span>
        </div>
        <span
          className={`text-xs ${
            item.isRead ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {item.massages}
        </span>
        <div className="flex justify-between items-center text-xs text-gray-400 mt-1">
          <span onClick={() => onMarkAsRead(item.id)}>Đánh dấu đã xem</span>
          <span>{convertTimestampToFullDateTime(item.creationTime)}</span>
        </div>
      </div>
    ),
    icon: <InfoCircleOutlined />,
  }));

  return <Menu items={items} />;
};

export default NotificationMenu;
