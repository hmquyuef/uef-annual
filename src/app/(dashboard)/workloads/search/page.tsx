"use client";

import {
  getListUnitsFromHrm,
  UnitHRMItem,
} from "@/services/units/unitsServices";
import {
  getUsersFromHRMbyId,
  UsersFromHRMResponse,
} from "@/services/users/usersServices";
import {
  HomeOutlined,
  ProfileOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Button, Collapse, GetProps, Input, Select } from "antd";
import { Key, useEffect, useState } from "react";
const { Search } = Input;
type SearchProps = GetProps<typeof Input.Search>;
const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
  console.log(info?.source, value);

const SearchMembers = () => {
  const [selectedKey, setSelectedKey] = useState<Key | null>(null);
  const [unitsHRM, setUnitsHRM] = useState<UnitHRMItem[]>([]);
  const [usersHRM, setUsersHRM] = useState<UsersFromHRMResponse | undefined>(
    undefined
  );
  const getListUnisHRM = async () => {
    const response = await getListUnitsFromHrm();
    setUnitsHRM(response.model);
  };
  const getUsersHRMByUnitId = async (unitId: string) => {
    const response = await getUsersFromHRMbyId(unitId);
    setUsersHRM(response);
  };

  useEffect(() => {
    getListUnisHRM();
  }, []);

  return (
    <div>
      <div className="mb-3">
        <Breadcrumb
          items={[
            {
              href: "",
              title: (
                <>
                  <HomeOutlined />
                  <span>Trang chủ</span>
                </>
              ),
            },
            {
              title: (
                <>
                  <ProfileOutlined />
                  <span>Tra cứu thông tin nhân sự</span>
                </>
              ),
            },
          ]}
        />
      </div>
      <div className="grid grid-cols-4 gap-6 mb-4">
        <div className="w-full flex flex-col gap-2">
          <p className="font-medium text-neutral-600">Đơn vị</p>
          <Select
            showSearch
            size="large"
            placeholder="Chọn đơn vị"
            optionFilterProp="label"
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            options={unitsHRM.map((unit) => ({
              value: unit.id,
              label: unit.name,
            }))}
            onChange={(value) => {
              getUsersHRMByUnitId(value);
            }}
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <p className="font-medium text-neutral-600">Mã CB-GV-NV</p>
          <Select
            showSearch
            size="large"
            placeholder="Tìm kiếm CB-GV-NV"
            optionFilterProp="label"
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            options={usersHRM?.items?.map((user) => ({
              value: user.id,
              label: `${user.fullName} - ${user.userName}`,
            }))}
            value={selectedKey}
            onChange={(value) => {
              setSelectedKey(value);
            }}
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <p className="font-medium text-neutral-600">Năm học</p>
          <Select
            showSearch
            size="large"
            optionFilterProp="label"
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            options={[
              {
                value: "2023",
                label: "2023-2024",
              },
              {
                value: "2024",
                label: "2024-2025",
              },
            ]}
            value={selectedKey || "2023"}
            onChange={(value) => {
              setSelectedKey(value);
            }}
          />
        </div>
        <div className="flex items-end">
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={() => {}}
            size="large"
            iconPosition="start"
          >
            Tìm kiếm
          </Button>
        </div>
      </div>
      <div>
        <div className="mb-4">
          <p>Thông tin các hoạt động có tiết chuẩn</p>
        </div>
        <div className="mb-4">
          <p>Chi tiết danh sách các hoạt động</p>
        </div>
      </div>
    </div>
  );
};
export default SearchMembers;
