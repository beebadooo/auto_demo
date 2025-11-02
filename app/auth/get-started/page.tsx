"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

const roles = [
  {
    id: "customer",
    title: "Customer",
    description: "View your car history, insurance, and service records in one place",
    icon: "🚗",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "manufacturer",
    title: "Manufacturer",
    description: "Register vehicles and track factory quality checks",
    icon: "🏭",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "dealer",
    title: "Dealer/Distributor",
    description: "Manage inventory and proof-of-condition records",
    icon: "🏪",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "insurance",
    title: "Insurance Company",
    description: "Access verified claims and driving behavior data",
    icon: "📋",
    color: "from-orange-500 to-red-500",
  },
  {
    id: "service",
    title: "Service Provider",
    description: "Record maintenance and service history",
    icon: "🔧",
    color: "from-indigo-500 to-blue-500",
  },
  {
    id: "rto",
    title: "RTO/Government",
    description: "Verify ownership and manage compliance",
    icon: "🏛️",
    color: "from-slate-500 to-gray-500",
  },
]

export default function GetStartedPage() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId)
    router.push(`/auth/login?role=${roleId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-lg font-bold">⛓️</span>
              </div>
              <h1 className="text-2xl font-bold text-foreground">AutoTrack</h1>
            </div>
          </Link>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
            <Button variant="outline" size="sm">
              Connect Wallet
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">Choose Your Role</h2>
          <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
            Select your role to access the blockchain-powered car lifecycle platform tailored for your needs.
          </p>
        </div>

        {/* Role Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {roles.map((role) => (
            <Card
              key={role.id}
              className="border-border/40 bg-card/50 backdrop-blur hover:border-primary/50 transition-all cursor-pointer group"
              onClick={() => handleRoleSelect(role.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className={`text-5xl`}>{role.icon}</div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <CardTitle className="text-foreground">{role.title}</CardTitle>
                <CardDescription className="text-muted-foreground">{role.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-primary hover:bg-primary/90">Get Started</Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Section */}
        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-foreground">Why AutoTrack?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "Transparent", desc: "Tamper-proof blockchain records" },
                { title: "Unified", desc: "All car tasks in one platform" },
                { title: "Secure", desc: "Blockchain wallet authentication" },
                { title: "Fast", desc: "Real-time damage & service tracking" },
                { title: "Verified", desc: "No fake service or accident records" },
                { title: "Fair", desc: "Insurance claims based on real data" },
              ].map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-white font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
