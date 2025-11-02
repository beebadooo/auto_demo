"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface ServicePackage {
  id: string
  name: string
  description: string
  price: number
  duration: string
  includes: string[]
}

export default function ServicePackagesPage() {
  const [packages, setPackages] = useState<ServicePackage[]>([
    {
      id: "1",
      name: "Basic Service",
      description: "Essential maintenance service package",
      price: 2999,
      duration: "3-4 hours",
      includes: ["Oil Change", "Filter Replacement", "Basic Inspection"]
    },
    {
      id: "2",
      name: "Comprehensive Service",
      description: "Complete vehicle health check and service",
      price: 5999,
      duration: "6-8 hours",
      includes: ["Full Inspection", "Fluid Top-up", "Brake Check", "Wheel Alignment"]
    }
  ]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Service Packages</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New Package
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {packages.map((pkg) => (
          <Card key={pkg.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{pkg.name}</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">{pkg.description}</p>
                <div className="flex justify-between">
                  <span className="text-lg font-bold">₹{pkg.price}</span>
                  <span className="text-sm text-muted-foreground">{pkg.duration}</span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-2">Includes:</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {pkg.includes.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}