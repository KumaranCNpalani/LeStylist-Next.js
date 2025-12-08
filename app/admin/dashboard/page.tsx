"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Settings,
  Tag,
  Image as ImageIcon,
} from "lucide-react"

interface AdminUser {
  id: number
  username: string
  email: string
  full_name: string
  role: string
}

export default function AdminDashboard() {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    services: 0,
    offers: 0,
    images: 0
  })
  const router = useRouter()

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem("admin_token")
    const userData = localStorage.getItem("admin_user")

    if (!token || !userData) {
      console.log("No token or user data found, redirecting to login")
      router.push("/admin/login")
      return
    }

    try {
      const user = JSON.parse(userData)
      setUser(user)
      loadStats()
    } catch (error) {
      console.error("Error parsing user data:", error)
      router.push("/admin/login")
      return
    }

    setIsLoading(false)
  }, [router])

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('admin_token')

      const [servicesRes, offersRes, galleryRes] = await Promise.all([
        fetch('/api/admin/services', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/admin/offers', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/admin/gallery', { headers: { 'Authorization': `Bearer ${token}` } })
      ])

      const servicesData = await servicesRes.json()
      const offersData = await offersRes.json()
      const galleryData = await galleryRes.json()

      setStats({
        services: servicesData.services?.length || 0,
        offers: offersData.offers?.length || 0,
        images: galleryData.images?.length || 0
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back, {user.full_name}. Here's an overview of your website content.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.services}</div>
            <p className="text-xs text-muted-foreground">Active services listed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Offers</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.offers}</div>
            <p className="text-xs text-muted-foreground">Special offers running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gallery Images</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.images}</div>
            <p className="text-xs text-muted-foreground">Customer photos uploaded</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 px-4">
              <div className="text-sm text-muted-foreground">
                Use the sidebar to manage your content.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
