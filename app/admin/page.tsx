"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface EmailDetail {
  email: string
  university?: string
  isUAEEmail?: string
  joinedAt?: string
}

export default function AdminPage() {
  const [loading, setLoading] = useState(false)
  const [emails, setEmails] = useState<string[]>([])
  const [emailDetails, setEmailDetails] = useState<EmailDetail[]>([])
  const [password, setPassword] = useState("")
  const [authenticated, setAuthenticated] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check if authenticated
    const isAuthenticated = localStorage.getItem("adminAuthenticated") === "true"

    // Redirect to dashboard if authenticated, otherwise stay on this page
    // which will render the login form
    if (isAuthenticated) {
      router.push("/admin/dashboard")
    }
  }, [router])

  // Simple authentication
  const checkPassword = () => {
    if (password === "essaytest2024") {
      setAuthenticated(true)
      localStorage.setItem("adminAuthenticated", "true")
      toast({
        title: "✅ Authenticated",
        description: "Welcome to the EssayTest admin dashboard",
      })
      router.push("/admin/dashboard")
    } else {
      toast({
        title: "❌ Authentication failed",
        description: "Incorrect password",
        variant: "destructive",
      })
    }
  }

  // Test Redis connection
  const testRedisConnection = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/test-redis")
      const data = await response.json()

      if (data.success) {
        toast({
          title: "✅ Redis connection successful",
          description: `Connected to ${data.url}`,
        })
      } else {
        toast({
          title: "❌ Redis connection failed",
          description: data.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to test Redis connection",
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  // Fetch waitlist emails
  const fetchWaitlistEmails = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/get-emails")
      const data = await response.json()

      if (data.success) {
        setEmails(data.emails)
        setEmailDetails(data.emailDetails || [])
        toast({
          title: "✅ Success",
          description: `Retrieved ${data.emails.length} emails from waitlist`,
        })
      } else {
        toast({
          title: "❌ Error",
          description: data.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to fetch waitlist emails",
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  // Export to CSV
  const exportToCSV = () => {
    if (emailDetails.length === 0) {
      toast({
        title: "No data to export",
        description: "Please fetch emails first",
        variant: "destructive",
      })
      return
    }

    const csvContent = [
      ["Email", "University", "UAE Email", "Joined At"],
      ...emailDetails.map((detail) => [
        detail.email,
        detail.university || "N/A",
        detail.isUAEEmail === "true" ? "Yes" : "No",
        detail.joinedAt ? new Date(detail.joinedAt).toLocaleString() : "N/A",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `essaytest-waitlist-${new Date().toISOString().split("T")[0]}.csv`
    a.click()

    toast({
      title: "✅ Export successful",
      description: "CSV file downloaded",
    })
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">🔐 EssayTest Admin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Admin Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  onKeyPress={(e) => e.key === "Enter" && checkPassword()}
                />
              </div>
              <Button className="w-full" onClick={checkPassword}>
                🚀 Login to Dashboard
              </Button>
              <p className="text-xs text-gray-500 text-center">Hint: Password is essaytest2024</p>
            </div>
          </CardContent>
        </Card>
        <Toaster />
      </div>
    )
  }

  const uaeEmails = emailDetails.filter((detail) => detail.isUAEEmail === "true").length
  const recentSignups = emailDetails.filter((detail) => {
    if (!detail.joinedAt) return false
    const joinedDate = new Date(detail.joinedAt)
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    return joinedDate > yesterday
  }).length

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📊 EssayTest Admin Dashboard</h1>
            <p className="text-gray-600">Manage your waitlist signups and monitor Redis connection</p>
          </div>
          <div className="space-x-4">
            <Button onClick={testRedisConnection} disabled={loading} variant="outline">
              🔧 Test Redis
            </Button>
            <Button onClick={fetchWaitlistEmails} disabled={loading}>
              {loading ? "⏳ Loading..." : "📧 Fetch Emails"}
            </Button>
            <Button onClick={exportToCSV} variant="outline" disabled={emailDetails.length === 0}>
              📥 Export CSV
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">📈 Total Signups</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{emails.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">🇦🇪 UAE University Emails</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{uaeEmails}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">🕐 Recent Signups (24h)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{recentSignups}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>📋 Waitlist Signups</CardTitle>
          </CardHeader>
          <CardContent>
            {emailDetails.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">University</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">UAE Email</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Joined At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {emailDetails.map((detail, index) => (
                      <tr key={detail.email || index} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">{detail.email}</td>
                        <td className="border border-gray-300 px-4 py-2">{detail.university || "N/A"}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              detail.isUAEEmail === "true" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {detail.isUAEEmail === "true" ? "🇦🇪 Yes" : "No"}
                          </span>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {detail.joinedAt ? new Date(detail.joinedAt).toLocaleString() : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                📭 No emails found. Click "Fetch Emails" to load data from Redis.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  )
}
