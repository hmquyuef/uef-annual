"use client";

import { putListMembersLaborUnion } from "@/services/generalWorks/laborUnionServices";
import { MembersInfomations } from "@/services/generalWorks/membersInfomation";
import { getUsersFromHRM, UsersFromHRM } from "@/services/users/usersServices";
import { SaveOutlined } from "@ant-design/icons";
import {
  Button,
  GetProp,
  Table,
  TableColumnsType,
  TableProps,
  Tooltip,
  Transfer,
  TransferProps,
} from "antd";
import { FC, Key, useEffect, useState } from "react";
import CustomNotification from "../CustomNotification";
import PDFViewer from "../files/PDFViewer";

type TransferItem = GetProp<TransferProps, "dataSource">[number];
type TableRowSelection<T extends object> = TableProps<T>["rowSelection"];

interface FormBM08DrawerProps {
  formId: string;
  members: MembersInfomations[];
  path: string;
  onMembersChange?: (members: MembersInfomations[]) => void;
}

interface DataType<UsersFromHRM> {
  key: string;
  userName: string;
  fullName: string;
  unitName: string;
}

interface TableTransferProps extends TransferProps<TransferItem> {
  dataSource: DataType<UsersFromHRM>[];
  leftColumns: TableColumnsType<DataType<UsersFromHRM>>;
  rightColumns: TableColumnsType<DataType<UsersFromHRM>>;
}

const TableTransfer: React.FC<TableTransferProps> = (props) => {
  const { leftColumns, rightColumns, ...restProps } = props;
  return (
    <Transfer
      style={{ width: "100%" }}
      {...restProps}
      locale={{
        itemUnit: "nhân sự",
        itemsUnit: "nhân sự",
        searchPlaceholder: "Tìm kiếm nhân sự",
      }}
    >
      {({
        direction,
        filteredItems,
        onItemSelect,
        onItemSelectAll,
        selectedKeys: listSelectedKeys,
        disabled: listDisabled,
      }) => {
        const columns = direction === "left" ? leftColumns : rightColumns;
        const rowSelection: TableRowSelection<TransferItem> = {
          getCheckboxProps: () => ({ disabled: listDisabled }),
          onChange(selectedRowKeys) {
            onItemSelectAll(selectedRowKeys, "replace");
          },
          selectedRowKeys: listSelectedKeys,
        };

        return (
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={filteredItems}
            pagination={{
              defaultPageSize: 15,
              pageSizeOptions: ["15"],
            }}
            size="small"
            style={{ pointerEvents: listDisabled ? "none" : undefined }}
            onRow={({ key, disabled: itemDisabled }) => ({
              onClick: () => {
                if (itemDisabled || listDisabled) {
                  return;
                }
                onItemSelect(key, !listSelectedKeys.includes(key));
              },
            })}
          />
        );
      }}
    </Transfer>
  );
};

const filterOption = (input: string, item: DataType<UsersFromHRM>) =>
  item.userName?.toLocaleLowerCase().includes(input.toLocaleLowerCase()) ||
  item.fullName?.toLocaleLowerCase().includes(input.toLocaleLowerCase()) ||
  item.unitName?.toLocaleLowerCase().includes(input.toLocaleLowerCase());

const DrawerInfomation: FC<FormBM08DrawerProps> = ({
  formId,
  members,
  path,
  onMembersChange,
}) => {
  const [targetKeys, setTargetKeys] = useState<Key[]>([]);
  const [users, setUsers] = useState<UsersFromHRM[]>([]);
  const [pathPDF, setPathPDF] = useState<string>("");
  const [newMembers, setNewMembers] = useState<MembersInfomations[]>([]);
  const [message, setMessage] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
  const [isNotificationOpen, setNotificationOpen] = useState(false);

  const getUsersHRM = async () => {
    const response = await getUsersFromHRM();
    setUsers(response.items);
    const tempTargetKeys: Key[] = [];
    response.items.forEach((item) => {
      const member = members.find(
        (member) => member.userName === item.userName
      );
      if (member) {
        tempTargetKeys.push(member.userName);
      }
    });
    setTargetKeys(tempTargetKeys);
  };

  const columns: TableColumnsType<DataType<UsersFromHRM>> = [
    {
      dataIndex: "userName",
      title: "MÃ SỐ CB-GV-NV",
      render: (userName: string) => (
        <span className="font-medium text-blue-500 text-[13px]">
          {userName}
        </span>
      ),
    },
    {
      dataIndex: "fullName",
      title: "HỌ VÀ TÊN",
      render: (fullname: string) => (
        <span className="font-medium text-blue-500 text-[13px]">
          {fullname}
        </span>
      ),
    },
    {
      dataIndex: "unitName",
      title: "ĐƠN VỊ",
      render: (unitName: string) => (
        <span className="text-[13px]">{unitName}</span>
      ),
    },
  ];

  const onChange: TableTransferProps["onChange"] = (nextTargetKeys) => {
    setTargetKeys(nextTargetKeys);
    console.log("nextTargetKeys :>> ", nextTargetKeys);
    const tempMembers: MembersInfomations[] = [];
    nextTargetKeys.forEach((key) => {
      const user = users.find((user) => user.userName === key);
      if (user) {
        tempMembers.push({
          userName: user.userName,
          fullName: user.fullName,
          unitName: user.unitName,
        });
      }
    });
    setNewMembers(tempMembers);
    if (onMembersChange) {
      onMembersChange(tempMembers);
    }
    setNotificationOpen(false);
  };

  const handleSave = async () => {
    const formData: Partial<any> = {
      members: newMembers,
    };
    const response = await putListMembersLaborUnion(formId, formData);
    if (response) {
      setDescription("Cập nhật thông tin thành công");
      setNotificationOpen(true);
      setStatus("success");
      setMessage("Thông báo");
    }
  };

  useEffect(() => {
    getUsersHRM();
    setPathPDF(path);
  }, [path]);

  return (
    <div className="grid grid-cols-3 gap-6">
      {users && (
        <div className="col-span-2 max-h-fit">
          <Tooltip title="Cập nhật thông tin" placement="topLeft">
            <Button
              type="primary"
              icon={<SaveOutlined />}
              className="mb-4"
              onClick={(e) => {
                e.preventDefault();
                handleSave();
              }}
            >
              Cập nhật
            </Button>
          </Tooltip>
          <TableTransfer
            dataSource={users
              .sort((a, b) => a.unitName.localeCompare(b.unitName))
              .map((user) => ({
                key: user.userName,
                userName: user.userName,
                fullName: user.fullName,
                unitName: user.unitName,
              }))}
            targetKeys={targetKeys}
            showSearch
            showSelectAll={false}
            onChange={onChange}
            filterOption={filterOption}
            leftColumns={columns}
            rightColumns={columns}
          />
        </div>
      )}
      <div>
        {pathPDF ? (
          <>
            <PDFViewer pathPDF={pathPDF} />
          </>
        ) : (
          <>
            <div className="h-full flex flex-col justify-center items-center border-l border-neutral-200">
              <div className="flex flex-col justify-center items-center px-8 py-8 bg-neutral-50 border border-dashed rounded-lg">
                <span className="font-medium text-lg text-neutral-500">
                  Không tìm thấy tệp tin phù hợp!
                </span>
                <span className="text-sm text-neutral-400">
                  Chọn tệp có phần mở rộng <strong>.pdf</strong> để xem nội dung
                  chi tiết
                </span>
              </div>
            </div>
          </>
        )}
      </div>
      <CustomNotification
        message={message}
        description={description}
        status={status}
        isOpen={isNotificationOpen}
      />
    </div>
  );
};

export default DrawerInfomation;
