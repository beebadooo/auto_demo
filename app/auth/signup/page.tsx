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
  customer: { title: "Customer Sign Up", icon: "🚗", color: "from-blue-500 to-cyan-500" },
  manufacturer: { title: "Manufacturer Sign Up", icon: "🏭", color: "from-purple-500 to-pink-500" },
  dealer: { title: "Dealer Sign Up", icon: "🏪", color: "from-green-500 to-emerald-500" },
  insurance: { title: "Insurance Company Sign Up", icon: "📋", color: "from-orange-500 to-red-500" },
  service: { title: "Service Provider Sign Up", icon: "🔧", color: "from-indigo-500 to-blue-500" },
  rto: { title: "RTO/Government Sign Up", icon: "🏛️", color: "from-slate-500 to-gray-500" },
}

export default function SignUpPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = (searchParams.get("role") as keyof typeof roleConfig) || "customer"

  const [formData, setFormData] = useState({
    walletAddress: "",
    email: "",
    confirmEmail: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const config = roleConfig[role]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      // Validation
      if (!formData.walletAddress.trim()) {
        setError("Please enter your wallet address")
        setLoading(false)
        return
      }

      if (!formData.email.trim()) {
        setError("Please enter your email address")
        setLoading(false)
        return
      }

      if (formData.email !== formData.confirmEmail) {
        setError("Email addresses do not match")
        setLoading(false)
        return
      }

      if (!formData.walletAddress.startsWith("0x") || formData.walletAddress.length !== 42) {
        setError("Invalid wallet address format")
        setLoading(false)
        return
      }

      // API call
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: formData.walletAddress,
          role,
          email: formData.email,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Sign up failed")
        setLoading(false)
        return
      }

      // Store token and user data
      localStorage.setItem("authToken", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      localStorage.setItem("userRole", data.user.role)

      // Also set cookie for middleware validation
      document.cookie = `authToken=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}`

      setSuccess("Account created successfully! Redirecting...")
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
            <p className="text-muted-foreground mt-2">Create your account to get started</p>
          </div>

          {/* Sign Up Card */}
          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-foreground">Create Account</CardTitle>
              <CardDescription>Sign up with your wallet address</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp} className="space-y-6">
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

                {/* Wallet Address */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">Wallet Address</label>
                  <Input
                    type="text"
                    name="walletAddress"
                    placeholder="0x..."
                    value={formData.walletAddress}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="bg-input border-border text-foreground placeholder-muted-foreground"
                  />
                  <p className="text-xs text-muted-foreground">Your Ethereum/Polygon wallet address</p>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">Email Address</label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="bg-input border-border text-foreground placeholder-muted-foreground"
                  />
                </div>

                {/* Confirm Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">Confirm Email</label>
                  <Input
                    type="email"
                    name="confirmEmail"
                    placeholder="Confirm your email"
                    value={formData.confirmEmail}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="bg-input border-border text-foreground placeholder-muted-foreground"
                  />
                </div>

                {/* Submit Button */}
                <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>

                {/* Login Link */}
                <div className="text-center pt-4 border-t border-border/40">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href={`/auth/login?role=${role}`} className="text-primary hover:underline font-medium">
                      Sign In
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Terms & Privacy */}
          <div className="text-center mt-6">
            <p className="text-xs text-muted-foreground">
              By signing up, you agree to our{" "}
              <Link href="#" className="text-primary hover:underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
