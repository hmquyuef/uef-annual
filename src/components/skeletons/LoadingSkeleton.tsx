import { Card, Skeleton } from "antd";

export const LoadingSkeleton: React.FC = () => (
  <>
    <div className="flex flex-col gap-4">
      <Card>
        <Skeleton active paragraph={{ rows: 3 }} />
      </Card>
      <Card>
        <Skeleton active paragraph={{ rows: 3 }} />
      </Card>
      <Card>
        <Skeleton active paragraph={{ rows: 3 }} />
      </Card>
    </div>
  </>
);
