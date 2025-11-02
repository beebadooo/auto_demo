"use client"

import { DashboardLayout } from "@/components/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { 
    BarChart3, 
    Calendar, 
    ClipboardCheck, 
    FileClock, 
    PieChart, 
    Shield, 
    Package, 
    Settings 
} from "lucide-react";
import { StatsGrid } from "@/components/service/stats-grid";
import { AppointmentsList } from "@/components/service/appointments-list";
import { ServiceRecords } from "@/components/service/service-records";
import { RtoIntegration } from "@/components/service/rto-integration";
import { ServiceAnalytics } from "@/components/service/service-analytics";

export default function ServiceDashboardPage() {
    const navItems = [
        {
            label: "Overview",
            href: "/dashboard/service",
            icon: BarChart3
        },
        {
            label: "Appointments",
            href: "/dashboard/service/appointments",
            icon: Calendar
        },
        {
            label: "Service Records",
            href: "/dashboard/service/records",
            icon: ClipboardCheck
        },
        {
            label: "RTO Integration",
            href: "/dashboard/service/rto",
            icon: Shield
        },
        {
            label: "Analytics",
            href: "/dashboard/service/analytics",
            icon: PieChart
        },
        {
            label: "Packages",
            href: "/dashboard/service/packages",
            icon: Package
        },
        {
            label: "Settings",
            href: "/dashboard/service/settings",
            icon: Settings
        }
    ];

    return (
        <DashboardLayout
            title="Service Center Dashboard"
            role="Service Provider"
            navItems={navItems}
        >
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <StatsGrid />

                <Tabs defaultValue="appointments" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="appointments">Appointments</TabsTrigger>
                        <TabsTrigger value="records">Service Records</TabsTrigger>
                        <TabsTrigger value="rto">RTO Integration</TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    </TabsList>

                    <TabsContent value="appointments" className="space-y-4">
                        <AppointmentsList />
                    </TabsContent>

                    <TabsContent value="records" className="space-y-4">
                        <ServiceRecords />
                    </TabsContent>

                    <TabsContent value="rto" className="space-y-4">
                        <RtoIntegration />
                    </TabsContent>

                    <TabsContent value="analytics" className="space-y-4">
                        <ServiceAnalytics />
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
}