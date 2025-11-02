"use client"

import { Card } from "@/components/ui/card";
import { QualityMetrics } from "@/components/manufacturer/quality-metrics";
import { QualityChecksList } from "@/components/manufacturer/quality-checks-list";
import { QualityDefectLog } from "@/components/manufacturer/quality-defect-log";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Plus, Factory, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"

export default function QualityChecksPage() {
    const navItems = [
        { label: "Dashboard", href: "/dashboard/manufacturer", icon: Factory },
        { label: "Register Vehicle", href: "/dashboard/manufacturer/register", icon: Plus },
        { label: "Quality Checks", href: "/dashboard/manufacturer/quality", icon: CheckCircle2 },
        { label: "Recalls", href: "/dashboard/manufacturer/recalls", icon: AlertCircle },
    ];

    return (
        <DashboardLayout
            title="Quality Control"
            role="Manufacturer"
            navItems={navItems}
        >
            <div className="space-y-6 p-6">
                <h1 className="text-3xl font-bold">Quality Control Dashboard</h1>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="p-4">
                        <h2 className="text-xl font-semibold mb-4">Quality Metrics</h2>
                        <QualityMetrics />
                    </Card>

                    <Card className="p-4">
                        <h2 className="text-xl font-semibold mb-4">Recent Quality Checks</h2>
                        <QualityChecksList />
                    </Card>

                    <Card className="p-4">
                        <h2 className="text-xl font-semibold mb-4">Defect Log</h2>
                        <QualityDefectLog />
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}