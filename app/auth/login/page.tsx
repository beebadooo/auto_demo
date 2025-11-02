"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"

const roleConfig = {
  customer: { title: "Customer Login", icon: "🚗", color: "from-blue-500 to-cyan-500" },
  manufacturer: { title: "Manufacturer Login", icon: "🏭", color: "from-purple-500 to-pink-500" },
  dealer: { title: "Dealer Login", icon: "🏪", color: "from-green-500 to-emerald-500" },
  insurance: { title: "Insurance Company Login", icon: "📋", color: "from-orange-500 to-red-500" },
  service: { title: "Service Provider Login", icon: "🔧", color: "from-indigo-500 to-blue-500" },
  rto: { title: "RTO/Government Login", icon: "🏛️", color: "from-slate-500 to-gray-500" },
}

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = (searchParams.get("role") as keyof typeof roleConfig) || "customer"

  const [walletAddress, setWalletAddress] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const config = roleConfig[role]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      if (!walletAddress.trim()) {
        setError("Please enter your wallet address")
        setLoading(false)
        return
      }

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Login failed")
        setLoading(false)
        return
      }

      // Store token and user data
      localStorage.setItem("authToken", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      localStorage.setItem("userRole", data.user.role)

      // Also set cookie for middleware validation
      document.cookie = `authToken=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}`

      setSuccess("Login successful! Redirecting...")
      setTimeout(() => {
        router.push(`/dashboard/${role}`)
      }, 1500)
    } catch (err) {
      setError("An error occurred. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-lg font-bold">⛓️</span>
              </div>
              <h1 className="text-2xl font-bold text-foreground">AutoTrack</h1>
            </div>
          </Link>
          <Button variant="outline" size="sm" asChild>
            <Link href="/auth/get-started">Back</Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md">
          {/* Role Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{config.icon}</div>
            <h2 className="text-3xl font-bold text-foreground">{config.title}</h2>
            <p className="text-muted-foreground mt-2">Sign in to access your dashboard</p>
          </div>

          {/* Login Card */}
          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-foreground">Connect Your Wallet</CardTitle>
              <CardDescription>Enter your wallet address to login</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Error Alert */}
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Success Alert */}
                {success && (
                  <Alert className="bg-green-500/10 border-green-500/20">
                    <AlertCircle className="h-4 w-4 text-green-500" />
                    <AlertDescription className="text-green-500">{success}</AlertDescription>
                  </Alert>
                )}

                {/* Wallet Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">Wallet Address</label>
                  <Input
                    type="text"
                    placeholder="0x..."
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    disabled={loading}
                    className="bg-input border-border text-foreground placeholder-muted-foreground"
                  />
                  <p className="text-xs text-muted-foreground">
                    Your Ethereum/Polygon wallet address (e.g., MetaMask, WalletConnect)
                  </p>
                </div>

                {/* Submit Button */}
                <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                {/* Sign Up Link */}
                <div className="text-center pt-4 border-t border-border/40">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link href={`/auth/signup?role=${role}`} className="text-primary hover:underline font-medium">
                      Sign Up
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* MetaMask Prompt */}
          <Card className="border-border/40 bg-card/50 backdrop-blur mt-6">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-4">
                Don't have MetaMask or WalletConnect? Install them to create a wallet address.
              </p>
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <a href="https://metamask.io" target="_blank" rel="noopener noreferrer">
                  Download MetaMask
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
