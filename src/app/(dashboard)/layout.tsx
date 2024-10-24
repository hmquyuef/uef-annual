// dashboard-server-layout.tsx (Server Component)

import DashboardLayout from "../../layout/DashboardLayout";


export const metadata = {
    title: 'Dashboard - UEF',
    description: 'Dashboard - Standard Plan Management Software',
};

export default function DashboardServerLayout({ children }: { children: React.ReactNode }) {
    return <DashboardLayout><div className="px-4 py-3">{children}</div></DashboardLayout>;
}
