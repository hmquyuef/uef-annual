"use client";

import { DeleteOutlined, FileDoneOutlined, HomeOutlined, PlusOutlined, ProfileOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, DatePicker, Empty, GetProps, Input, InputNumber, InputNumberProps, Modal, PaginationProps, Select, Table, TableColumnsType, TableProps } from "antd";
import React, { Key, useCallback } from 'react';
import { useDropzone } from "react-dropzone";
type SearchProps = GetProps<typeof Input.Search>;

interface DataType {
    key: React.Key;
    name: string;
    age: number;
    address: string;
}
const columns: TableColumnsType<DataType> = [
    {
        title: 'Name',
        dataIndex: 'name',
        render: (text: string) => <a>{text}</a>,
    },
    {
        title: 'Age',
        dataIndex: 'age',
    },
    {
        title: 'Address',
        dataIndex: 'address',
    },
];

const data: DataType[] = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
    },
    {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sydney No. 1 Lake Park',
    },
    {
        key: '4',
        name: 'Disabled User',
        age: 99,
        address: 'Sydney No. 1 Lake Park',
    },
];

const { Search, TextArea } = Input;
const onSearch: SearchProps['onSearch'] = (value, _e, info) => console.log(info?.source, value);
const rowSelection: TableProps<DataType>['rowSelection'] = {
    onChange: (selectedRowKeys: Key[]) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`);
    },
    getCheckboxProps: (record: DataType) => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
    }),
};
const showTotal: PaginationProps['showTotal'] = (total) => `Total ${total} items`;
const onChange: InputNumberProps['onChange'] = (value) => {
    console.log('changed', value);
};
const { confirm } = Modal;

const CustomModal = () => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Do something with the files
    }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })
    const showPromiseConfirm = () => {
        confirm({
            title: 'Thêm mới hoạt động',
            width: 900,
            content: (
                <div>
                    <div className="grid grid-cols-6 gap-6 mb-4">
                        <div className="w-full flex flex-col gap-2">
                            <span>STT</span>
                            <InputNumber min={0} defaultValue={1} onChange={onChange} className="w-full" />
                        </div>
                        <div className="col-span-5 flex flex-col gap-2">
                            <span>Loại biểu mẫu</span>
                            <Select
                                showSearch
                                className="w-full"
                                placeholder="Search to Select"
                                optionFilterProp="label"
                                filterSort={(optionA, optionB) =>
                                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                }
                                options={[
                                    {
                                        value: '1',
                                        label: 'Not Identified',
                                    },
                                    {
                                        value: '2',
                                        label: 'Closed',
                                    },
                                    {
                                        value: '3',
                                        label: 'Communicated',
                                    },
                                    {
                                        value: '4',
                                        label: 'Identified',
                                    },
                                    {
                                        value: '5',
                                        label: 'Resolved',
                                    },
                                    {
                                        value: '6',
                                        label: 'Cancelled',
                                    },
                                ]}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-6 gap-6 mb-4">
                        <div className="col-span-4 flex flex-col gap-2">
                            <span>Số Tờ trình/Kế hoạch</span>
                            <Input />
                        </div>
                        <div className="col-span-2 flex flex-col gap-2">
                            <span>Ngày ký</span>
                            <DatePicker placeholder="dd/mm/yyyy" format={'DD/MM/YYYY'} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 mb-4">
                        <span>Tên hoạt động đã thực hiện</span>
                        <TextArea  autoSize />
                    </div>
                    <div className="grid grid-cols-6 gap-6 mb-4">
                        <div className="col-span-3 flex flex-col gap-2">
                            <span>Đơn vị</span>
                            <Select
                                showSearch
                                className="w-full"
                                placeholder="Search to Select"
                                optionFilterProp="label"
                                filterSort={(optionA, optionB) =>
                                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                }
                                options={[
                                    {
                                        value: '1',
                                        label: 'Not Identified',
                                    },
                                    {
                                        value: '2',
                                        label: 'Closed',
                                    },
                                    {
                                        value: '3',
                                        label: 'Communicated',
                                    },
                                    {
                                        value: '4',
                                        label: 'Identified',
                                    },
                                    {
                                        value: '5',
                                        label: 'Resolved',
                                    },
                                    {
                                        value: '6',
                                        label: 'Cancelled',
                                    },
                                ]}
                            />
                        </div>
                        <div className="col-span-3 flex flex-col gap-2">
                            <span>Tìm mã CB-GV-NV</span>
                            <Select
                                showSearch
                                className="w-full"
                                placeholder="Search to Select"
                                optionFilterProp="label"
                                filterSort={(optionA, optionB) =>
                                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                }
                                options={[
                                    {
                                        value: '1',
                                        label: 'Not Identified',
                                    },
                                    {
                                        value: '2',
                                        label: 'Closed',
                                    },
                                    {
                                        value: '3',
                                        label: 'Communicated',
                                    },
                                    {
                                        value: '4',
                                        label: 'Identified',
                                    },
                                    {
                                        value: '5',
                                        label: 'Resolved',
                                    },
                                    {
                                        value: '6',
                                        label: 'Cancelled',
                                    },
                                ]}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-6 gap-6 mb-4">
                        <div className="flex flex-col gap-2">
                            <span>Số tiết chuẩn</span>
                            <InputNumber min={0} defaultValue={1} onChange={onChange} />
                        </div>
                        <div className="col-span-2 flex flex-col gap-2">
                            <span>Ngày nhập</span>
                            <DatePicker placeholder="dd/mm/yyyy" format={'DD/MM/YYYY'} />
                        </div>
                        <div className="col-span-2 flex flex-col gap-2">
                            <span>Số VBHC</span>
                            <Input />
                        </div>
                        <div className="flex flex-col justify-end">
                            <Button type="primary" icon={<PlusOutlined />} iconPosition="start">
                                Thêm NV
                            </Button>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 mb-4">
                        <span>Danh sách nhân sự tham gia</span>
                        <Table<DataType>
                            bordered
                            rowHoverable
                            pagination={false}
                            size="small"
                            columns={columns}
                            dataSource={data}
                            locale={{ emptyText: <Empty description="No Data"></Empty> }}
                        />
                    </div>
                    <div className="flex flex-col gap-2 mb-4">
                        <span>Minh chứng</span>
                        <div {...getRootProps()} className="w-full min-h-20 h-fit border-2 border-dashed border-neutral-300 cursor-pointer flex justify-center items-center gap-3 rounded-xl">
                            <input {...getInputProps()} />
                            {
                                isDragActive ?
                                    (<>
                                        <p className="text-sm">
                                            Kéo và thả một tập tin vào đây hoặc nhấp để chọn một tập tin
                                        </p></>) :
                                    <p>Drag 'n' drop some files here, or click to select files</p>
                            }
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 mb-4">
                        <span>Ghi chú</span>
                        <TextArea autoSize />
                    </div>
                </div>
            ),
            onOk() {
                return new Promise((resolve, reject) => {
                    setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel() { },
        });
    };

    return (
        <Button type="primary" icon={<PlusOutlined />} onClick={showPromiseConfirm} size='large' iconPosition="start">
            Thêm mới
        </Button>
    );
};
const WorkloadGroups = () => {
    return (
        <section>
            <div className='mb-3'>
                <Breadcrumb
                    items={[
                        {
                            href: '',
                            title: (<>
                                <HomeOutlined />
                                <span>Trang chủ</span></>
                            ),
                        },
                        {
                            href: '',
                            title: (
                                <>
                                    <ProfileOutlined />
                                    <span>Quản lý hoạt động</span>
                                </>
                            ),
                        },
                        {
                            title: (
                                <>
                                    <FileDoneOutlined />
                                    <span>Quản lý nhóm hoạt động</span>
                                </>
                            ),
                        },
                    ]}
                />
            </div>
            <div className='grid grid-cols-4 mb-4'>
                <Search placeholder="input search text" onSearch={onSearch} size="large" enterButton />
                <div className='col-span-3'>
                    <div className='flex justify-end gap-4'>
                        <CustomModal />
                        <Button type="dashed" danger icon={<DeleteOutlined />} size='large' iconPosition="start">
                            Xóa
                        </Button>
                    </div>
                </div>
            </div>
            <Table<DataType>
                bordered
                rowHoverable
                pagination={{ total: 50, showTotal: showTotal, showSizeChanger: true, position: ['bottomRight'] }}
                rowSelection={{ type: 'checkbox', ...rowSelection }}
                columns={columns}
                dataSource={data}
                locale={{ emptyText: <Empty description="No Data"></Empty> }}
            />
        </section>
    );
}
export default WorkloadGroups;