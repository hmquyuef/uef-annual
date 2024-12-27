"use client";

import CustomNotification from "@/components/CustomNotification";
import {
  FileInfoItem,
  FileInfoResponse,
  getFilesInfo,
} from "@/services/files/filesServices";
import { deleteMultiFiles } from "@/services/uploads/uploadsServices";
import Messages from "@/utility/Messages";
import { formatSize } from "@/utility/Utilities";
import {
  CaretDownOutlined,
  DeleteOutlined,
  FileDoneOutlined,
  FolderOutlined,
  HomeOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Button, Input, Tree, TreeDataNode, TreeProps } from "antd";
import { useCallback, useEffect, useState } from "react";
import PDFViewer from "@/components/files/PDFViewer";

const FilesManager = () => {
  const { Search } = Input;
  const [treeData, setTreeData] = useState<TreeDataNode[]>([]);
  const [files, setFiles] = useState<FileInfoResponse | undefined>(undefined);
  const [freeUp, setFreeUp] = useState<string>("");
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [deletePaths, setDeletePaths] = useState<string[]>([]);
  const [path, setPath] = useState<string>("");
  const [showPDF, setShowPDF] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [highlightCount, setHighlightCount] = useState<number>(0);
  const [message, setMessage] = useState("");
  const [description, setDescription] = useState("");
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [status, setStatus] = useState<
    "success" | "error" | "info" | "warning"
  >("success");

  const onSelect: TreeProps["onSelect"] = (selectedKeys, info) => {
    const parentNodes = selectedKeys.flatMap((key) =>
      findParentKeys(key.toString(), treeData)
    );
    const parentPath = Array.from(new Set(parentNodes))
      .reverse()
      .map((item) => {
        const arr = item.split("-");
        return arr[0];
      })
      .join("/");
    const updatedSelectedKeys = selectedKeys.map((key) => {
      const arr = key.toString().split("-");
      const combinedKey = arr.slice(0, 4).join("-");
      return `${parentPath}/${combinedKey}`;
    });
    setPath(updatedSelectedKeys[0]);
    setShowPDF(info.selected);
  };

  const findParentKeys = (key: string, nodes: TreeDataNode[]): string[] => {
    const parentKeys: string[] = [];

    const traverse = (node: TreeDataNode, parentKey: string | null) => {
      if (node.key === key) {
        if (parentKey) {
          parentKeys.push(parentKey);
        }
        return true;
      }
      if (node.children) {
        for (const child of node.children) {
          if (traverse(child, node.key.toString())) {
            if (parentKey) {
              parentKeys.push(parentKey);
            }
            return true;
          }
        }
      }
      return false;
    };

    nodes.forEach((node) => traverse(node, null));
    return parentKeys;
  };

  const onCheck: TreeProps["onCheck"] = (checkedKeys) => {
    console.log("checkedKeys :>> ", checkedKeys);
    const keysArray = Array.isArray(checkedKeys)
      ? checkedKeys
      : checkedKeys.checked;
    const checkedNodes = keysArray
      .map((key) => {
        const findNode = (nodes: TreeDataNode[]): TreeDataNode | undefined => {
          for (const node of nodes) {
            if (node.key === key) {
              return node;
            }
            if (node.children) {
              const found = findNode(node.children);
              if (found) {
                return found;
              }
            }
          }
          return undefined;
        };
        return findNode(treeData);
      })
      .filter((node): node is TreeDataNode => node !== undefined);

    const parentNodes = checkedNodes.flatMap((node) =>
      findParentKeys(node.key.toString(), treeData)
    );
    const parentPath = Array.from(new Set(parentNodes))
      .reverse()
      .map((item) => {
        const arr = item.split("-");
        return arr[0];
      })
      .join("/");

    const totalSize = checkedNodes.reduce((acc, node) => {
      const arr = node.key.toString().split("-");
      const size = arr.length >= 4 ? parseFloat(arr[arr.length - 1]) : 0;
      return acc + size;
    }, 0);

    const updatedCheckedKeys = keysArray.map((key) => {
      const arr = key.toString().split("-");
      const combinedKey = arr.slice(0, 4).join("-");
      return `${parentPath}/${combinedKey}`;
    });
    setDeletePaths(updatedCheckedKeys);
    setFreeUp(formatSize(totalSize));
  };

  const highlightText = (text: string, keyword: string) => {
    if (!keyword) return text;
    const regex = new RegExp(`(${keyword})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-orange-400 text-white font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const countHighlightedNodes = (
    nodes: TreeDataNode[],
    keyword: string
  ): number => {
    let count = 0;

    const traverse = (node: TreeDataNode) => {
      if (
        typeof node.key === "string" &&
        node.key.toLowerCase().includes(keyword.toLowerCase())
      ) {
        count += 1;
      }
      if (node.children) {
        node.children.forEach(traverse);
      }
    };

    nodes.forEach(traverse);
    return count;
  };

  const mapToTreeData = (items: FileInfoItem[]): TreeDataNode[] => {
    return items.map((item, index) => {
      const children = item.contents ? mapToTreeData(item.contents) : undefined;
      const highlightedTitle =
        typeof item.name === "string"
          ? highlightText(item.name, searchKeyword)
          : item.name;
      return {
        title: (
          <div className="grid grid-cols-12 gap-1 w-full">
            {item.type === "file" ? (
              <>
                <span className="col-span-10 truncate text-neutral-500">
                  <FileDoneOutlined className="mr-2" />
                  {highlightedTitle}
                </span>
                <span className="col-span-2 text-neutral-400 text-end mr-1">
                  {formatSize(item.size)}
                </span>
              </>
            ) : (
              <>
                <span className="col-span-8 font-medium text-neutral-600 truncate">
                  <FolderOutlined className="mr-2" />
                  {highlightedTitle}
                </span>
                <div className="col-span-4 flex justify-between items-center">
                  <span className=" text-neutral-500 text-sm">
                    {children?.length} items
                  </span>
                  <span className="font-medium text-neutral-600 text-end mr-1">
                    {formatSize(item.size)}
                  </span>
                </div>
              </>
            )}
          </div>
        ),
        key: `${item.name}-${index}-${item.size}`,
        children,
      };
    });
  };

  const getFilesInfomation = async () => {
    const response = await getFilesInfo();
    setTreeData(mapToTreeData(response.contents));
    setFiles(response);
  };

  const handleDelete = useCallback(async () => {
    await deleteMultiFiles(deletePaths);
    setDescription(`Đã giải phóng ${freeUp} dung lượng!`);
    setNotificationOpen(true);
    setStatus("success");
    setMessage("Thông báo");
    await getFilesInfomation();
    setFreeUp("");
  }, [deletePaths]);

  const findExpandedKeys = (
    nodes: TreeDataNode[],
    keyword: string
  ): string[] => {
    const keys: Set<string> = new Set();

    const traverse = (node: TreeDataNode, parentKeys: string[]) => {
      const match =
        typeof node.key === "string" &&
        node.key.toLowerCase().includes(keyword.toLowerCase());
      if (match) {
        parentKeys.forEach((key) => keys.add(key));
        keys.add(node.key.toString());
      }
      if (node.children) {
        node.children.forEach((child) =>
          traverse(child, [...parentKeys, node.key.toString()])
        );
      }
    };

    nodes.forEach((node) => traverse(node, []));
    return Array.from(keys);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);
    if (keyword) {
      const keys = findExpandedKeys(treeData, keyword);
      setExpandedKeys(keys);
      const count = countHighlightedNodes(treeData, keyword);
      setHighlightCount(count);
    } else {
      setExpandedKeys([]);
      setHighlightCount(0);
    }
  };

  useEffect(() => {
    getFilesInfomation();
  }, [handleSearch]);

  return (
    <section>
      <div className="mb-3">
        <Breadcrumb
          items={[
            {
              href: "",
              title: (
                <>
                  <HomeOutlined />
                  <span>{Messages.BREAD_CRUMB_HOME}</span>
                </>
              ),
            },
            {
              href: "",
              title: (
                <>
                  <FileDoneOutlined />
                  <span>{Messages.BREAD_CRUMB_DOCUMENT}</span>
                </>
              ),
            },
            {
              title: (
                <>
                  <ProfileOutlined />
                  <span>{Messages.BREAD_CRUMB_DOCUMENT_MANAGER}</span>
                </>
              ),
            },
          ]}
        />
      </div>
      <CustomNotification
        message={message}
        description={description}
        status={status}
        isOpen={isNotificationOpen}
      />
      <div className="border rounded-lg bg-white px-2 py-2">
        <div className="grid grid-cols-2 h-[calc(100vh-145px)]">
          <div
            className={`px-2 mt-1 ${
              highlightCount > 0
                ? "h-[calc(100vh-280px)]"
                : "h-[calc(100vh-250px)]"
            }`}
          >
            <div className="grid grid-cols-4 gap-3 mb-3">
              <span className="flex justify-center items-center text-[13px] text-neutral-400 place-items-center">
                Tổng cộng:
                <span className="ml-1 font-medium text-neutral-600">
                  {formatSize(files?.totalDriveSize)} - 100%
                </span>
              </span>
              <span className="flex justify-center items-center text-[13px] text-neutral-400">
                Còn lại:
                <span className="ml-1 font-medium text-neutral-600">
                  {formatSize(files?.freeSpace)} -{" "}
                  {(
                    ((files?.freeSpace ?? 0) / (files?.totalDriveSize ?? 1)) *
                    100
                  ).toFixed(1)}
                  %
                </span>
              </span>
              <span className="flex justify-center items-center text-[13px] text-neutral-400">
                Sử dụng:
                <span className=" ml-1 font-medium text-neutral-600">
                  {formatSize(files?.size)} -{" "}
                  {(
                    ((files?.size ?? 0) / (files?.totalDriveSize ?? 1)) *
                    100
                  ).toFixed(1)}
                  %
                </span>
              </span>
              <div className="flex justify-end items-end mr-1">
                <Button
                  type="dashed"
                  disabled={freeUp === ""}
                  danger
                  onClick={handleDelete}
                  icon={<DeleteOutlined />}
                >
                  Giải phóng {freeUp}
                </Button>
              </div>
            </div>
            <hr className="mb-3" />
            <div className="flex flex-col w-1/3 mb-3">
              <Search
                allowClear
                placeholder=" "
                onChange={handleSearch}
                enterButton
              />
              {highlightCount > 0 && (
                <>
                  <span className="mt-1 text-neutral-400 text-sm">
                    Tìm thấy{" "}
                    <span className="font-semibold text-neutral-600">
                      {highlightCount}
                    </span>{" "}
                    văn bản!
                  </span>
                </>
              )}
            </div>
            <div className="h-full w-full overflow-auto">
              <Tree
                showLine
                checkable
                switcherIcon={<CaretDownOutlined />}
                expandedKeys={expandedKeys}
                onExpand={(keys) => setExpandedKeys(keys as string[])}
                onSelect={onSelect}
                onCheck={onCheck}
                treeData={treeData}
              />
            </div>
          </div>
          {/* <div className="border-l border-neutral-200"> */}
          <div>
            {path && path ? (
              <>
                <div className="flex justify-center items-center h-full bg-red-200">
                  {/* <PDFViewer fileUrl={path} /> */}
                  SHOW PDF HERE
                </div>
              </>
            ) : (
              <>
                <div className="h-full flex flex-col justify-center items-center">
                  <div className="flex flex-col justify-center items-center px-8 py-8 bg-neutral-50 border border-dashed rounded-lg">
                    <span className="font-medium text-lg text-neutral-500">
                      Không tìm thấy tệp tin phù hợp!
                    </span>
                    <span className="text-sm text-neutral-400">
                      Chọn tệp có phần mở rộng <strong>.pdf</strong> để xem nội
                      dung chi tiết
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
export default FilesManager;
