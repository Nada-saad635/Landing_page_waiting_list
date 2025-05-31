"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2, Download, Search, Filter, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react"

interface WaitlistSignup {
  id: string
  name: string
  email: string
  university: string
  is_uae_email: boolean
  email_domain: string
  created_at: string
  ip_address?: string
  user_agent?: string
  referrer?: string
}

interface Stats {
  total: number
  uaeEmails: number
  today: number
  universities: { [key: string]: number }
  domains: { [key: string]: number }
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [signups, setSignups] = useState<WaitlistSignup[]>([])
  const [filteredSignups, setFilteredSignups] = useState<WaitlistSignup[]>([])
  const [stats, setStats] = useState<Stats>({
    total: 0,
    uaeEmails: 0,
    today: 0,
    universities: {},
    domains: {},
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const { toast } = useToast()
  const router = useRouter()

  // Simple authentication
  const checkPassword = () => {
    // In production, use a more secure authentication method
    if (password === "pasttopass2024") {
      setAuthenticated(true)
      localStorage.setItem("adminAuthenticated", "true")
      toast({
        title: "✅ Authenticated",
        description: "Welcome to the PastToPass admin dashboard",
      })
    } else {
      toast({
        title: "❌ Authentication failed",
        description: "Incorrect password",
        variant: "destructive",
      })
    }
  }

  // Check if already authenticated
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("adminAuthenticated") === "true"
    if (isAuthenticated) {
      setAuthenticated(true)
      fetchData()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/get-signups")
      const data = await response.json()

      if (data.success) {
        setSignups(data.signups)
        setFilteredSignups(data.signups)

        // Calculate stats
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const uaeEmails = data.signups.filter((signup: WaitlistSignup) => signup.is_uae_email).length
        const todaySignups = data.signups.filter((signup: WaitlistSignup) => {
          const signupDate = new Date(signup.created_at)
          return signupDate >= today
        }).length

        // Count universities
        const universities: { [key: string]: number } = {}
        data.signups.forEach((signup: WaitlistSignup) => {
          universities[signup.university] = (universities[signup.university] || 0) + 1
        })

        // Count domains
        const domains: { [key: string]: number } = {}
        data.signups.forEach((signup: WaitlistSignup) => {
          if (signup.email_domain) {
            domains[signup.email_domain] = (domains[signup.email_domain] || 0) + 1
          }
        })

        setStats({
          total: data.signups.length,
          uaeEmails,
          today: todaySignups,
          universities,
          domains,
        })

        toast({
          title: "✅ Data loaded",
          description: `Loaded ${data.signups.length} waitlist signups`,
        })
      } else {
        toast({
          title: "❌ Error",
          description: data.error || "Failed to load data",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to fetch waitlist data",
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    setCurrentPage(1)

    if (!term.trim()) {
      applyFilters(filterType, signups)
      return
    }

    const lowerTerm = term.toLowerCase()
    const filtered = signups.filter(
      (signup) =>
        signup.name.toLowerCase().includes(lowerTerm) ||
        signup.email.toLowerCase().includes(lowerTerm) ||
        signup.university.toLowerCase().includes(lowerTerm),
    )

    applyFilters(filterType, filtered)
  }

  const applyFilters = (filter: string, data = signups) => {
    setFilterType(filter)
    let filtered = [...data]

    if (filter === "uae") {
      filtered = filtered.filter((signup) => signup.is_uae_email)
    } else if (filter === "today") {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      filtered = filtered.filter((signup) => {
        const signupDate = new Date(signup.created_at)
        return signupDate >= today
      })
    }

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (signup) =>
          signup.name.toLowerCase().includes(lowerTerm) ||
          signup.email.toLowerCase().includes(lowerTerm) ||
          signup.university.toLowerCase().includes(lowerTerm),
      )
    }

    setFilteredSignups(filtered)
    setCurrentPage(1)
  }

  const exportToCSV = () => {
    if (filteredSignups.length === 0) {
      toast({
        title: "No data to export",
        description: "Please fetch data first",
        variant: "destructive",
      })
      return
    }

    const headers = ["Name", "Email", "University", "UAE Email", "Email Domain", "Signup Date", "IP Address"]

    const csvContent = [
      headers,
      ...filteredSignups.map((signup) => [
        signup.name,
        signup.email,
        signup.university,
        signup.is_uae_email ? "Yes" : "No",
        signup.email_domain || "N/A",
        new Date(signup.created_at).toLocaleString(),
        signup.ip_address || "N/A",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `pasttopass-waitlist-${new Date().toISOString().split("T")[0]}.csv`
    a.click()

    toast({
      title: "✅ Export successful",
      description: `Exported ${filteredSignups.length} records to CSV`,
    })
  }

  // Pagination
  const totalPages = Math.ceil(filteredSignups.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedSignups = filteredSignups.slice(startIndex, startIndex + itemsPerPage)

  const goToPage = (page: number) => {
    if (page < 1) page = 1
    if (page > totalPages) page = totalPages
    setCurrentPage(page)
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">🔐 PastToPass Admin</CardTitle>
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
            </div>
          </CardContent>
        </Card>
        <Toaster />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📊 PastToPass Admin Dashboard</h1>
            <p className="text-gray-600">Manage your waitlist signups and access all user data</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={fetchData} disabled={loading} variant="outline" size="sm">
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              Refresh
            </Button>
            <Button onClick={exportToCSV} variant="outline" size="sm" disabled={filteredSignups.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button
              onClick={() => {
                localStorage.removeItem("adminAuthenticated")
                setAuthenticated(false)
                router.push("/admin")
              }}
              variant="ghost"
              size="sm"
            >
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Signups</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">UAE University Emails</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.uaeEmails}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Today's Signups</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats.today}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="signups" className="mb-8">
          <TabsList>
            <TabsTrigger value="signups">Waitlist Signups</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="signups">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <CardTitle>Waitlist Signups</CardTitle>
                  <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search by name, email..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                      />
                    </div>
                    <Select value={filterType} onValueChange={(value) => applyFilters(value)}>
                      <SelectTrigger className="w-full md:w-40">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Signups</SelectItem>
                        <SelectItem value="uae">UAE Emails Only</SelectItem>
                        <SelectItem value="today">Today's Signups</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  </div>
                ) : filteredSignups.length > 0 ? (
                  <>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>University</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedSignups.map((signup) => (
                            <TableRow key={signup.id}>
                              <TableCell className="font-medium">{signup.name}</TableCell>
                              <TableCell>{signup.email}</TableCell>
                              <TableCell>{signup.university}</TableCell>
                              <TableCell>
                                {signup.is_uae_email ? (
                                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">UAE Email</Badge>
                                ) : (
                                  <Badge variant="outline">Standard</Badge>
                                )}
                              </TableCell>
                              <TableCell>{new Date(signup.created_at).toLocaleDateString()}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-gray-500">
                        Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredSignups.length)} of{" "}
                        {filteredSignups.length}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => goToPage(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div className="text-sm">
                          Page {currentPage} of {totalPages || 1}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => goToPage(currentPage + 1)}
                          disabled={currentPage === totalPages || totalPages === 0}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 text-gray-500">No signups found matching your criteria</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Universities</CardTitle>
                </CardHeader>
                <CardContent>
                  {Object.entries(stats.universities)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 10)
                    .map(([university, count], index) => (
                      <div key={university} className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <span className="w-6 text-gray-500">{index + 1}.</span>
                          <span className="truncate max-w-[250px]">{university}</span>
                        </div>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Email Domains</CardTitle>
                </CardHeader>
                <CardContent>
                  {Object.entries(stats.domains)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 10)
                    .map(([domain, count], index) => (
                      <div key={domain} className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <span className="w-6 text-gray-500">{index + 1}.</span>
                          <span>{domain || "Unknown"}</span>
                        </div>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </div>
  )
}
