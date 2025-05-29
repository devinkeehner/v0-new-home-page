"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Users,
  TrendingUp,
  MapPin,
  Calendar,
  Download,
  Search,
  RefreshCw,
  Mail,
  Phone,
  MessageSquare,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface PetitionSignature {
  id: number
  first_name: string
  last_name: string
  email: string
  mobile?: string
  zip_code: string
  town: string
  impact_description?: string
  created_at: string
}

interface Analytics {
  totalSignatures: number
  todaySignatures: number
  weekSignatures: number
  topTowns: Array<{ town: string; count: number }>
  topZipCodes: Array<{ zip_code: string; count: number }>
  dailySignatures: Array<{ date: string; count: number }>
  hourlyDistribution: Array<{ hour: number; count: number }>
}

export default function AdminPanel() {
  const [signatures, setSignatures] = useState<PetitionSignature[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(25)

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [authError, setAuthError] = useState("")

  // Simple password authentication
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault()
    // Use a simple password check - in production, use proper authentication
    if (password === "CTHouseGOP2025!") {
      setIsAuthenticated(true)
      setAuthError("")
      fetchData()
    } else {
      setAuthError("Invalid password")
    }
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch signatures
      const signaturesResponse = await fetch("/api/admin/petition-signatures")
      if (!signaturesResponse.ok) {
        throw new Error("Failed to fetch signatures")
      }
      const signaturesData = await signaturesResponse.json()
      setSignatures(signaturesData.signatures || [])

      // Fetch analytics
      const analyticsResponse = await fetch("/api/admin/petition-analytics")
      if (!analyticsResponse.ok) {
        throw new Error("Failed to fetch analytics")
      }
      const analyticsData = await analyticsResponse.json()
      setAnalytics(analyticsData)
    } catch (err) {
      console.error("Error fetching data:", err)
      setError(err instanceof Error ? err.message : "Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchData()
      // Set up auto-refresh every 30 seconds
      const interval = setInterval(fetchData, 30000)
      return () => clearInterval(interval)
    }
  }, [isAuthenticated])

  // Filter signatures based on search term
  const filteredSignatures = signatures.filter(
    (signature) =>
      `${signature.first_name} ${signature.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      signature.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      signature.town.toLowerCase().includes(searchTerm.toLowerCase()) ||
      signature.zip_code.includes(searchTerm),
  )

  // Pagination
  const totalPages = Math.ceil(filteredSignatures.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedSignatures = filteredSignatures.slice(startIndex, startIndex + itemsPerPage)

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      "First Name",
      "Last Name",
      "Email",
      "Mobile",
      "Zip Code",
      "Town",
      "Impact Description",
      "Date Signed",
    ]
    const csvContent = [
      headers.join(","),
      ...signatures.map((sig) =>
        [
          `"${sig.first_name}"`,
          `"${sig.last_name}"`,
          `"${sig.email}"`,
          `"${sig.mobile || ""}"`,
          `"${sig.zip_code}"`,
          `"${sig.town}"`,
          `"${(sig.impact_description || "").replace(/"/g, '""')}"`,
          `"${new Date(sig.created_at).toLocaleString()}"`,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `petition-signatures-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Authentication form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Admin Access</CardTitle>
            <CardDescription className="text-center">Enter password to access the petition admin panel</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              <Input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {authError && (
                <Alert variant="destructive">
                  <AlertDescription>{authError}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full">
                Access Admin Panel
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading admin data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>
            {error}
            <Button onClick={fetchData} className="mt-2 w-full">
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-primary-navy">Trust Act Petition Admin</h1>
              <p className="text-gray-600">Monitor petition signatures and analytics</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={fetchData} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={exportToCSV} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>

        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Signatures</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalSignatures.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.todaySignatures}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Week</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.weekSignatures}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg/Day (7d)</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.round(analytics.weekSignatures / 7)}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="signatures" className="space-y-6">
          <TabsList>
            <TabsTrigger value="signatures">Signatures</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="geography">Geography</TabsTrigger>
          </TabsList>

          {/* Signatures Tab */}
          <TabsContent value="signatures">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Petition Signatures</CardTitle>
                    <CardDescription>
                      {filteredSignatures.length} of {signatures.length} signatures
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search signatures..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Impact Description</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedSignatures.map((signature) => (
                        <TableRow key={signature.id}>
                          <TableCell>
                            <div className="font-medium">
                              {signature.first_name} {signature.last_name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center text-sm">
                                <Mail className="h-3 w-3 mr-1" />
                                {signature.email}
                              </div>
                              {signature.mobile && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <Phone className="h-3 w-3 mr-1" />
                                  {signature.mobile}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {signature.town}, {signature.zip_code}
                            </div>
                          </TableCell>
                          <TableCell>
                            {signature.impact_description ? (
                              <div className="max-w-xs">
                                <div className="flex items-center text-sm">
                                  <MessageSquare className="h-3 w-3 mr-1" />
                                  <span className="truncate">
                                    {signature.impact_description.substring(0, 50)}
                                    {signature.impact_description.length > 50 ? "..." : ""}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400">No description</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {formatDistanceToNow(new Date(signature.created_at), { addSuffix: true })}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Signatures Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Daily Signatures (Last 7 Days)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analytics?.dailySignatures && analytics.dailySignatures.length > 0 ? (
                    <div className="space-y-2">
                      {analytics.dailySignatures.map((day, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm">{day.date}</span>
                          <div className="flex items-center">
                            <div
                              className="bg-primary-navy h-4 mr-2"
                              style={{
                                width: `${Math.max(4, (day.count / Math.max(...analytics.dailySignatures.map((d) => d.count))) * 100)}px`,
                              }}
                            ></div>
                            <span className="text-sm font-medium">{day.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No daily data available</p>
                  )}
                </CardContent>
              </Card>

              {/* Hourly Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="h-5 w-5 mr-2" />
                    Hourly Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analytics?.hourlyDistribution && analytics.hourlyDistribution.length > 0 ? (
                    <div className="grid grid-cols-6 gap-2">
                      {analytics.hourlyDistribution.map((hour, index) => (
                        <div key={index} className="text-center">
                          <div className="text-xs text-gray-600">{hour.hour}:00</div>
                          <div
                            className="bg-secondary-red mx-auto mt-1"
                            style={{
                              height: `${Math.max(4, (hour.count / Math.max(...analytics.hourlyDistribution.map((h) => h.count))) * 40)}px`,
                              width: "8px",
                            }}
                          ></div>
                          <div className="text-xs font-medium mt-1">{hour.count}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No hourly data available</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Geography Tab */}
          <TabsContent value="geography">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Towns */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Towns</CardTitle>
                  <CardDescription>Most signatures by town</CardDescription>
                </CardHeader>
                <CardContent>
                  {analytics?.topTowns && analytics.topTowns.length > 0 ? (
                    <div className="space-y-2">
                      {analytics.topTowns.slice(0, 10).map((town, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="font-medium">{town.town}</span>
                          <Badge variant="secondary">{town.count}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No town data available</p>
                  )}
                </CardContent>
              </Card>

              {/* Top Zip Codes */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Zip Codes</CardTitle>
                  <CardDescription>Most signatures by zip code</CardDescription>
                </CardHeader>
                <CardContent>
                  {analytics?.topZipCodes && analytics.topZipCodes.length > 0 ? (
                    <div className="space-y-2">
                      {analytics.topZipCodes.slice(0, 10).map((zip, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="font-medium">{zip.zip_code}</span>
                          <Badge variant="secondary">{zip.count}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No zip code data available</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
