"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { RtoIntegration } from "@/components/service/rto-integration"
import { 
    BarChart3, 
    Calendar, 
    ClipboardCheck, 
    PieChart, 
    Shield, 
    Package, 
    Settings 
} from "lucide-react"

export default function RtoPage() {
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
    ]

    return (
        <DashboardLayout
            title="RTO Integration"
            role="Service Provider"
            navItems={navItems}
        >
            <div className="p-6">
                <h1 className="text-3xl font-bold mb-6">RTO Integration</h1>
                <RtoIntegration />
            </div>
        </DashboardLayout>
    )
}