import {
    CarryOutOutlined,
    HistoryOutlined,
    HomeOutlined
} from "@ant-design/icons";
import { Breadcrumb } from "antd";
  
  const LogsLogins = () => {
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
                    <CarryOutOutlined />
                    <span>Lịch sử đăng nhập</span>
                  </>
                ),
              },
            ]}
          />
        </section>
        <section>Lịch sử đăng nhập</section>
      </div>
    );
  };
  export default LogsLogins;
  