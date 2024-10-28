import {
  AuditOutlined,
  HistoryOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Breadcrumb } from "antd";

const LogsActivities = () => {
  return (
    <div>
      <section className="mb-3">
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
              href: "",
              title: (
                <>
                  <HistoryOutlined />
                  <span>Lịch sử</span>
                </>
              ),
            },
            {
              title: (
                <>
                  <AuditOutlined />
                  <span>Lịch sử hoạt động</span>
                </>
              ),
            },
          ]}
        />
      </section>
      <section>Lịch sử hoạt động</section>
    </div>
  );
};
export default LogsActivities;
