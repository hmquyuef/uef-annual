"use client";

import { getDataExportByUserName } from "@/services/exports/exportDetailForUser";
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
import { Breadcrumb, Button, GetProps, Input, Select } from "antd";
import { Key, useEffect, useState } from "react";
const { Search } = Input;
type SearchProps = GetProps<typeof Input.Search>;

const SearchMembers = () => {
  const [selectedKey, setSelectedKey] = useState<Key | null>(null);
  const [unitsHRM, setUnitsHRM] = useState<UnitHRMItem[]>([]);
  const [usersHRM, setUsersHRM] = useState<UsersFromHRMResponse | undefined>(
    undefined
  );
  const [selectedUnitKey, setSelectedUnitKey] = useState<Key | null>(null);
  const [selectedUserName, setSelectedUserName] = useState("");
  const [year, setYear] = useState("2024");
  const getListUnisHRM = async () => {
    const response = await getListUnitsFromHrm();
    setUnitsHRM(response.model);
  };
  const getUsersHRMByUnitId = async (unitId: string) => {
    const response = await getUsersFromHRMbyId(unitId);
    setUsersHRM(response);
  };

  const handleSearch = async () => {
    console.log("selectedUnitKey :>> ", selectedUnitKey);
    console.log("selectedUserName :>> ", selectedUserName);
    console.log("year :>> ", year);
    const response = await getDataExportByUserName(
      selectedUnitKey as string,
      selectedUserName,
      year
    );
    if (response) {
      console.log("response :>> ", response);
    }
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
          <p className="font-medium text-neutral-600 text-sm">Đơn vị</p>
          <Select
            showSearch
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
              setSelectedUnitKey(value);
              getUsersHRMByUnitId(value);
            }}
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <p className="font-medium text-neutral-600 text-sm">Mã CB-GV-NV</p>
          <Select
            showSearch
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
              const temp = usersHRM?.items?.find((item) => item.id === value);
              setSelectedUserName(temp?.userName ?? "");
            }}
          />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <p className="font-medium text-neutral-600 text-sm">Năm học</p>
            <Select
              showSearch
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={[
                {
                  value: "2024",
                  label: "2024-2025",
                },
              ]}
              value={year || "2024"}
              onChange={(value) => {
                setYear(value);
              }}
            />
          </div>
          <div className="flex items-end">
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleSearch}
              iconPosition="start"
            >
              Tìm kiếm
            </Button>
          </div>
        </div>
      </div>
      <div>
        <div className="mb-4">
          <p>Thông tin các hoạt động có tiết chuẩn</p>
        </div>
      </div>
    </div>
  );
};
export default SearchMembers;
