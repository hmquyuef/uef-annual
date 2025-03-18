"use client";

import {
  deleteTrainingContents,
  getAllTrainingContents,
  postTrainingContents,
  putTrainingContents,
} from "@/services/trainingLevels/contentsServices";
import { RootState } from "@/store";
import Messages from "@/utility/Messages";
import { convertTimestampToDate, getRandomKey } from "@/utility/Utilities";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, TableColumnsType } from "antd";
import { FC, Key, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CustomModal from "../CustomModal";
import CustomNotification from "../CustomNotification";
import FormBM07Contents from "../forms/activity/formBM07Contents";
import TemplateForms from "../forms/workloads/TemplateForms";

interface DrawerForBM07Props {
  yearId: string;
}

const DrawerForBM07: FC<DrawerForBM07Props> = (props) => {
  const app = useSelector((state: RootState) => state.app);
  const { yearId } = props;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"addContent" | "editContent">("addContent");
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [selectedItem, setSelectedItem] = useState<Partial<any> | undefined>(
    undefined
  );
  const [keyCustom, setKeyCustom] = useState("");
  const [formNotification, setFormNotification] = useState<{
    message: string;
    description: string;
    status: "success" | "error" | "info" | "warning";
    isOpen: boolean;
  }>({
    message: "",
    description: "",
    status: "success",
    isOpen: false,
  });

  const columns: TableColumnsType<any> = [
    {
      title: <div className="py-3">NỘI DUNG</div>,
      dataIndex: "name",
      key: "name",
      className: "max-w-10",
      render: (name: string, record: any) => {
        return (
          <span
            className="text-blue-500 font-semibold cursor-pointer"
            onClick={() => {
              handleEdit(record);
            }}
          >
            {name}
          </span>
        );
      },
    },
    {
      title: "THỜI GIAN",
      dataIndex: "startDate",
      key: "startDate",
      render: (startDate: number, record: any) => {
        const endDate = record.endDate;
        if (startDate !== 0) {
          if (endDate !== 0 && endDate !== startDate) {
            return (
              <>
                {convertTimestampToDate(startDate)} đến{" "}
                {convertTimestampToDate(endDate)}
              </>
            );
          }
          return <>{convertTimestampToDate(startDate)}</>;
        }
      },
      className: "text-center max-w-3",
    },
    {
      title: "ĐỊA ĐIỂM",
      dataIndex: "location",
      key: "location",
      className: "text-center max-w-5",
      render: (location: string) => <>{location}</>,
    },
    {
      title: "VIẾT TẮT",
      dataIndex: "abbreviation",
      key: "abbreviation",
      render: (abbreviation: string) => <>{abbreviation}</>,
      className: "text-center max-w-2",
    },
    {
      title: (
        <div>
          SỐ LƯỢNG <br /> THAM GIA
        </div>
      ),
      dataIndex: "totalEmployees",
      key: "totalEmployees",
      render: (totalEmployees: number) => <>{totalEmployees}</>,
      className: "text-center w-[100px]",
    },
  ];

  const getListTrainingContents = async () => {
    const response = await getAllTrainingContents(yearId);
    setData(response.items);
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setMode("editContent");
    setIsOpen(true);
  };

  const handleSubmit = async (formData: Partial<any>) => {
    try {
      if (mode === "editContent" && selectedItem) {
        const response = await putTrainingContents(
          formData.id as string,
          formData
        );
        if (response) {
          setFormNotification((prev) => ({
            ...prev,
            description: Messages.UPDATE_TRAINING_CONTENTS,
          }));
        }
      } else {
        const response = await postTrainingContents(formData);
        if (response) {
          setFormNotification((prev) => ({
            ...prev,
            description: Messages.ADD_TRAINING_CONTENTS,
          }));
        }
      }
      setFormNotification((prev) => ({
        ...prev,
        isOpen: true,
        status: "success",
        message: "Thông báo",
      }));
    } catch (error) {
      setFormNotification((prev) => ({
        ...prev,
        isOpen: true,
        status: "error",
        message: "Thông báo",
        description: Messages.ERROR,
      }));
    } finally {
      await getListTrainingContents();
      setIsOpen(false);
      setSelectedItem(undefined);
      setMode("addContent");
    }
  };

  const handleDelete = useCallback(async () => {
    try {
      const selectedKeysArray = Array.from(selectedRowKeys) as string[];
      if (selectedKeysArray.length > 0) {
        await deleteTrainingContents(selectedKeysArray);
        setFormNotification((prev) => ({
          ...prev,
          isOpen: true,
          status: "success",
          message: "Thông báo",
          description: `Đã xóa thành công ${selectedKeysArray.length} dòng thông tin!`,
        }));
        await getListTrainingContents();
        setSelectedRowKeys([]);
      }
    } catch (error) {
      console.error("Error deleting selected items:", error);
    }
  }, [selectedRowKeys]);

  useEffect(() => {
    getListTrainingContents();
  }, []);

  useEffect(() => {
    if (formNotification.isOpen) {
      const timeoutId = setTimeout(() => {
        setFormNotification((prev) => ({ ...prev, isOpen: false }));
      }, 200);
      return () => clearTimeout(timeoutId);
    }
  }, [formNotification.isOpen]);

  return (
    <div>
      <div className="w-full flex justify-end gap-5 mb-5">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setIsOpen(true);
            setMode("addContent");
          }}
          iconPosition="start"
        >
          Thêm hoạt động
        </Button>
        <Button
          color="red"
          variant="solid"
          disabled={selectedRowKeys.length === 0}
          onClick={handleDelete}
          icon={<DeleteOutlined />}
        >
          Xóa{" "}
          {selectedRowKeys.length !== 0 ? `(${selectedRowKeys.length})` : ""}
        </Button>
      </div>
      <CustomNotification {...formNotification} />
      <CustomModal
        key={keyCustom}
        isOpen={isOpen}
        width="800px"
        title={
          mode === "editContent"
            ? Messages.TITLE_UPDATE_TRAINING_CONTENTS
            : Messages.TITLE_ADD_TRAINING_CONTENTS
        }
        role={app || undefined}
        onOk={() => {
          const formElement = document.querySelector("form");
          formElement?.dispatchEvent(
            new Event("submit", { cancelable: true, bubbles: true })
          );
          setKeyCustom(getRandomKey());
          setIsOpen(false);
        }}
        onCancel={() => {
          setKeyCustom(getRandomKey());
          setIsOpen(false);
        }}
        bodyContent={
          <FormBM07Contents
            onSubmit={handleSubmit}
            mode={mode}
            initialData={selectedItem}
          />
        }
      />
      <TemplateForms
        loading={loading}
        data={data}
        hideEntryDate={true}
        title={columns}
        onEdit={handleEdit}
        onSelectionChange={(selectedRowKeys) =>
          setSelectedRowKeys(selectedRowKeys)
        }
      />
    </div>
  );
};
export default DrawerForBM07;
