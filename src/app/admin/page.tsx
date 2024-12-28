import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { db } from "@/lib/prisma";
import { formatCurrency, formatNumber } from "@/lib/formatters";

async function getSalesData() {
    const data = await db.order.aggregate({
        _sum: { pricePaidInCents: true },
        _count: true,
    });

    return {
        amount: (data._sum.pricePaidInCents || 0) / 100,
        numberOfSales: data._count,
    };
}

const AdminDashboard = async () => {
    const salesData = await getSalesData();
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <DashboardCard
                    title="Sales"
                    subtitle={formatNumber(salesData.numberOfSales) + " Orders"}
                    body={formatCurrency(salesData.amount)}
                />
            </div>
        </>
    );
};

export default AdminDashboard;

type DashboardCardProps = {
    title: string;
    subtitle: string;
    body: string;
};

function DashboardCard({ title, subtitle, body }: DashboardCardProps) {
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{subtitle}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>{body}</p>
                </CardContent>
            </Card>
        </>
    );
}
