import { BellOutlined, MoonOutlined, UserOutlined } from "@ant-design/icons"
import { Avatar, Badge } from "antd"

const TopHeaders = () => {
    return (
        <div className="h-16 bg-white sticky top-0 shadow-md">
            <div className="h-full flex justify-end items-center gap-6 px-6">
                <Avatar icon={<MoonOutlined />} />
                <Badge count={1}>
                    <Avatar icon={<BellOutlined />} />
                </Badge>
                <Avatar icon={<UserOutlined />} />
            </div>
        </div>
    )
}

export default TopHeaders