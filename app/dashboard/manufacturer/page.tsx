"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Plus, Factory, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react"
import { useAuth } from "@/components/auth-context"

export default function ManufacturerDashboard() {
  const { token: contextToken, user } = useAuth()
  const [recent, setRecent] = useState<Array<any>>([])
  const [loadingRecent, setLoadingRecent] = useState(false)
  const [recentError, setRecentError] = useState<string | null>(null)

  useEffect(() => {
    async function loadRecent() {
      setLoadingRecent(true)
      setRecentError(null)
      try {
        const token = contextToken || localStorage.getItem("authToken") || ""
        const headers: Record<string, string> = { "Content-Type": "application/json" }
        if (token) headers["Authorization"] = `Bearer ${token}`

        const resp = await fetch("/api/vehicles/owner", { headers })
        const data = await resp.json()
        if (!resp.ok) {
          setRecentError(data.error || "Failed to load recent registrations")
          setRecent([])
        } else {
          setRecent(data.vehicles || [])
        }
      } catch (err) {
        console.error("Failed to fetch recent registrations:", err)
        setRecentError("Failed to load recent registrations")
      } finally {
        setLoadingRecent(false)
      }
    }

    loadRecent()
    // Listen for client-side registration events to update recent list optimistically
    function onVehicleRegistered(e: any) {
      try {
        const vehicle = e?.detail
        if (!vehicle) return
        setRecent((prev) => {
          // avoid duplicates by VIN or id
          const exists = prev.find((v) => v.id === vehicle.id || v.vin === vehicle.vin)
          if (exists) return prev
          // prepend and limit to 10 items
          return [vehicle, ...prev].slice(0, 10)
        })
      } catch (err) {
        console.warn("onVehicleRegistered handler error", err)
      }
    }

    window.addEventListener("vehicle:registered", onVehicleRegistered as EventListener)
    return () => {
      window.removeEventListener("vehicle:registered", onVehicleRegistered as EventListener)
    }
  }, [contextToken])
  const navItems = [
    { label: "Dashboard", href: "/dashboard/manufacturer", icon: Factory },
    { label: "Register Vehicle", href: "/dashboard/manufacturer/register", icon: Plus },
    { label: "Quality Checks", href: "/dashboard/manufacturer/quality", icon: CheckCircle2 },
    { label: "Recalls", href: "/dashboard/manufacturer/recalls", icon: AlertCircle },
  ]

  return (
    <DashboardLayout title="Manufacturer Portal" role="Manufacturer" navItems={navItems}>
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Vehicles Registered", value: "1,234", icon: Factory },
            { label: "Quality Checks", value: "98%", icon: CheckCircle2 },
            { label: "Active Recalls", value: "3", icon: AlertCircle },
            { label: "This Month", value: "156", icon: TrendingUp },
          ].map((stat, i) => {
            const Icon = stat.icon
            return (
              <Card key={i} className="border-border/40 bg-card/50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    </div>
                    <Icon className="w-8 h-8 text-primary opacity-50" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Register New Vehicle */}
        <Card className="border-border/40 bg-card/50">
          <CardHeader>
            <CardTitle className="text-foreground">Register New Vehicle</CardTitle>
            <CardDescription>Create digital identity for a new vehicle</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">VIN</label>
                  <input
                    type="text"
                    placeholder="Vehicle Identification Number"
                    className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Make</label>
                  <input
                    type="text"
                    placeholder="e.g., Tesla"
                    className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Model</label>
                  <input
                    type="text"
                    placeholder="e.g., Model 3"
                    className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Year</label>
                  <input
                    type="number"
                    placeholder="2025"
                    className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground"
                  />
                </div>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90">Register Vehicle on Blockchain</Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Registrations */}
        <Card className="border-border/40 bg-card/50">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {loadingRecent ? (
                <p className="text-sm text-muted-foreground">Loading recent registrations...</p>
              ) : recentError ? (
                <p className="text-sm text-destructive">{recentError}</p>
              ) : recent.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent registrations found.</p>
              ) : (
                recent.map((vehicle, i) => (
                  <div key={vehicle.id || i} className="border border-border/40 rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </p>
                      <p className="text-sm text-muted-foreground">VIN: {vehicle.vin}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{new Date(vehicle.createdAt).toLocaleDateString()}</span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
