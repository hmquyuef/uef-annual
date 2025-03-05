"use client";

import {
  AddUpdateMenu,
  AddUpdateMenuItem,
} from "@/services/menus/menuServices";
import { CloseCircleOutlined, PlusSquareOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Input,
  InputNumber,
  Table,
  TableColumnsType,
  Tag
} from "antd";
import { FC, FormEvent, useEffect, useState } from "react";

interface FormMenuProps {
  onSubmit: (formData: Partial<AddUpdateMenu>) => void;
  initialData?: Partial<AddUpdateMenu>;
  mode: "add" | "edit";
}

const FormMenu: FC<FormMenuProps> = ({ onSubmit, initialData, mode }) => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [icon, setIcon] = useState("");
  const [isActivedMenu, setIsActivedMenu] = useState(false);
  const [tableMenus, setTableMenus] = useState<AddUpdateMenuItem[]>([]);
  const [tempMenus, setTempMenus] = useState<AddUpdateMenuItem | null>(null);
  const onAddMenu = () => {
    const newMenu: AddUpdateMenuItem = {
      position: tempMenus?.position || "",
      label: tempMenus?.label || "",
      href: tempMenus?.href || "",
      iconChildren: tempMenus?.iconChildren || "",
      isActived: tempMenus?.isActived || false,
    };
    setTableMenus((prev) => [...prev, newMenu]);
    setTempMenus({
      position: "",
      label: "",
      href: "",
      iconChildren: "",
      isActived: false,
    });
  };

  const onRemoveMenu = (index: number) => {
    setTableMenus((prev) => prev.filter((_, i) => i !== index));
  };

  const columns: TableColumnsType<AddUpdateMenuItem> = [
    {
      title: <div className="p-2">STT</div>,
      dataIndex: "stt",
      key: "stt",
      render: (_, __, index) => <>{index + 1}</>,
      className: "text-center w-[20px]",
    },
    {
      title: "VỊ TRÍ",
      dataIndex: "position",
      key: "position",
      render: (position: string, record: AddUpdateMenuItem, index) => (
        <Input
          value={position}
          onChange={(e) =>
            setTableMenus((prev) =>
              prev.map((menu, i) =>
                i === index ? { ...menu, position: e.target.value } : menu
              )
            )
          }
        />
      ),
      className: "w-[80px]",
    },
    {
      title: "CHỨC NĂNG",
      dataIndex: "label",
      key: "label",
      render: (label: string, record: AddUpdateMenuItem, index) => (
        <Input
          value={label}
          onChange={(e) =>
            setTableMenus((prev) =>
              prev.map((menu, i) =>
                i === index ? { ...menu, label: e.target.value } : menu
              )
            )
          }
        />
      ),
      className: "max-w-[10rem]",
    },
    {
      title: "ĐƯỜNG DẪN",
      dataIndex: "href",
      key: "href",
      render: (href: string, record: AddUpdateMenuItem, index) => (
        <Input
          value={href}
          onChange={(e) =>
            setTableMenus((prev) =>
              prev.map((menu, i) =>
                i === index ? { ...menu, href: e.target.value } : menu
              )
            )
          }
        />
      ),
      className: "max-w-[10rem]",
    },
    {
      title: "ICON",
      dataIndex: "iconChildren",
      key: "iconChildren",
      render: (iconChildren: string, record: AddUpdateMenuItem, index) => (
        <Input
          value={iconChildren}
          onChange={(e) =>
            setTableMenus((prev) =>
              prev.map((menu, i) =>
                i === index ? { ...menu, iconChildren: e.target.value } : menu
              )
            )
          }
        />
      ),
      className: "max-w-[10rem]",
    },
    {
      title: "KÍCH HOẠT",
      dataIndex: "isActived",
      key: "isActived",
      render: (isActived: boolean, record: AddUpdateMenuItem, index) => (
        <Checkbox
          checked={isActived}
          onChange={(e) =>
            setTableMenus((prev) =>
              prev.map((menu, i) =>
                i === index ? { ...menu, isActived: e.target.checked } : menu
              )
            )
          }
        />
      ),
      className: "w-[80px] text-center",
    },
    {
      title: "",
      dataIndex: "stt",
      key: "stt",
      render: (_, record, index) => (
        <>
          <Button
            color="danger"
            variant="text"
            onClick={() => onRemoveMenu(index)}
          >
            <CloseCircleOutlined />
          </Button>
        </>
      ),
      className: "w-[10px]",
    },
  ];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData: Partial<AddUpdateMenu> = {
      id: id,
      label: name,
      position: position,
      icon: icon,
      isChildren: tableMenus.length > 0 ? true : false,
      isActived: isActivedMenu,
      children: tableMenus,
    };
    onSubmit(formData);
  };
  useEffect(() => {
    const loadUsers = async () => {
      if (mode === "edit" && initialData !== undefined) {
        setId(initialData.id || "");
        setName(initialData.label || "");
        setPosition(initialData.position || "");
        setIcon(initialData.icon || "");
        setIsActivedMenu(initialData.isActived || false);
        setTableMenus(initialData.children || []);
      } else {
        setId("");
        setName("");
        setPosition("");
        setIcon("");
        setIsActivedMenu(false);
        setTableMenus([]);
      }
    };
    loadUsers();
  }, [initialData, mode]);
  return (
    <form onSubmit={handleSubmit}>
      <hr className="mt-1 mb-2" />
      <div className="grid grid-cols-3 gap-6 mb-4">
        <div className="flex flex-col gap-[2px]">
          <span className="font-medium text-neutral-600">
            Chức năng <span className="text-red-500">(*)</span>
          </span>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="flex flex-col gap-[2px]">
          <span className="font-medium text-neutral-600">Vị trí</span>
          <InputNumber
            value={position}
            onChange={(value) => setPosition(value?.toString() || "")}
            style={{ width: "100%" }}
          />
        </div>
        <div className="flex flex-col gap-[2px]">
          <span className="font-medium text-neutral-600">Biểu tượng</span>
          <Input value={icon} onChange={(e) => setIcon(e.target.value)} />
        </div>
      </div>
      <div className="flex flex-col gap-[2px] mb-2">
        <span className="font-medium text-neutral-600 mb-2">
          Danh sách chức năng con
          <Tag
            icon={<PlusSquareOutlined />}
            color="success"
            className="cursor-pointer"
            onClick={() => onAddMenu()}
          >
            Thêm chức năng
          </Tag>
        </span>
        <Table<AddUpdateMenuItem>
          bordered
          rowKey={(item) => item.position}
          rowHoverable
          rowClassName={() => "editable-row"}
          pagination={false}
          size="small"
          columns={columns}
          dataSource={tableMenus}
          className="custom-table-header shadow-md rounded-md"
        />
      </div>
      <Checkbox
        checked={isActivedMenu}
        onChange={(e) => setIsActivedMenu(e.target.checked)}
      >
        Kích hoạt
      </Checkbox>
    </form>
  );
};

export default FormMenu;
