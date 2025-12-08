"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, DollarSign, Clock, Image as ImageIcon } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

interface Category {
  id: number
  name: string
  slug: string
  type: string
}

interface Service {
  id: number
  category_id: number
  category_name: string
  category_type: string
  name: string
  description?: string
  price: number
  price_type: string
  duration_minutes?: number
  is_featured: boolean
  is_active: boolean
  display_order: number
  image_url?: string
  created_at: string
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [query, setQuery] = useState("")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    category_id: 0,
    name: '',
    description: '',
    price: 0,
    price_type: 'fixed',
    duration_minutes: 0,
    is_featured: false,
    is_active: true,
    display_order: 0
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const token = localStorage.getItem('admin_token')

      // Load Categories
      const catRes = await fetch('/api/admin/service-categories', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (catRes.ok) {
        const catData = await catRes.json()
        setCategories(catData.categories || [])
      }

      // Load Services
      const servRes = await fetch('/api/admin/services', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (servRes.ok) {
        const servData = await servRes.json()
        setServices(servData.services || [])
      }
    } catch (error) {
      console.error('Load data error:', error)
      toast.error("Failed to load data")
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      category_id: 0,
      name: '',
      description: '',
      price: 0,
      price_type: 'fixed',
      duration_minutes: 0,
      is_featured: false,
      is_active: true,
      display_order: 0
    })
    setEditingService(null)
    setSelectedImage(null)
    setImagePreview(null)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (formData.category_id === 0) {
      toast.error("Please select a category")
      setIsSubmitting(false)
      return
    }

    try {
      const token = localStorage.getItem('admin_token')
      const url = '/api/admin/services'
      const method = editingService ? 'PUT' : 'POST'

      const data = new FormData()
      if (editingService) {
        data.append('id', editingService.id.toString())
      }
      data.append('category_id', formData.category_id.toString())
      data.append('name', formData.name)
      data.append('description', formData.description)
      data.append('price', formData.price.toString())
      data.append('price_type', formData.price_type)
      data.append('duration_minutes', formData.duration_minutes.toString())
      data.append('is_featured', formData.is_featured.toString())
      data.append('is_active', formData.is_active.toString())
      data.append('display_order', formData.display_order.toString())

      if (selectedImage) {
        data.append('image', selectedImage)
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      })

      if (response.ok) {
        toast.success(editingService ? "Service updated successfully" : "Service created successfully")
        setIsDialogOpen(false)
        resetForm()
        // Reload only services
        const servRes = await fetch('/api/admin/services', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (servRes.ok) {
          const servData = await servRes.json()
          setServices(servData.services || [])
        }
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to save service')
      }
    } catch (error) {
      console.error('Submit error:', error)
      toast.error('Failed to save service')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setFormData({
      category_id: service.category_id,
      name: service.name,
      description: service.description || '',
      price: service.price,
      price_type: service.price_type || 'fixed',
      duration_minutes: service.duration_minutes || 0,
      is_featured: service.is_featured,
      is_active: service.is_active,
      display_order: service.display_order
    })
    setImagePreview(service.image_url || null)
    setSelectedImage(null)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this service?")) return

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/admin/services?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        toast.success("Service deleted successfully")
        setServices(services.filter(s => s.id !== id))
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to delete service')
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete service')
    }
  }

  const filteredServices = activeTab === "all"
    ? services
    : services.filter(service => service.category_type === activeTab)

  const displayedServices = filteredServices.filter((service) => {
    if (!query) return true
    const q = query.toLowerCase()
    return (
      service.name.toLowerCase().includes(q) ||
      (service.category_name || '').toLowerCase().includes(q)
    )
  })

  const getCategoryColor = (type: string) => {
    switch (type) {
      case 'women': return 'bg-pink-100 text-pink-800'
      case 'men': return 'bg-blue-100 text-blue-800'
      case 'makeup': return 'bg-purple-100 text-purple-800'
      case 'hydrafacial': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return <div>Loading services...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Services Management</h2>
          <p className="text-muted-foreground">Manage salon services and pricing.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingService ? 'Edit Service' : 'Add New Service'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category_id.toString()}
                    onValueChange={(value) => {
                      setFormData({
                        ...formData,
                        category_id: parseInt(value)
                      })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name} ({cat.type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="service_name">Service Name *</Label>
                <Input
                  id="service_name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price_type">Price Type</Label>
                  <Select
                    value={formData.price_type}
                    onValueChange={(value) => setFormData({ ...formData, price_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed Price</SelectItem>
                      <SelectItem value="starts_from">Starts From</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="duration">Duration (mins)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="image">Service Image</Label>
                <div className="flex items-center gap-4 mt-2">
                  <div className="relative w-20 h-20 border rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                  />
                  <Label htmlFor="is_featured">Featured</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : (editingService ? 'Update' : 'Create')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="women">Women</TabsTrigger>
          <TabsTrigger value="men">Men</TabsTrigger>
          <TabsTrigger value="makeup">Makeup</TabsTrigger>
          <TabsTrigger value="hydrafacial">Hydrafacial</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <div className="flex items-center justify-between">
            <Input
              placeholder="Search services by name or category..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="max-w-lg"
            />
            <div className="text-sm text-muted-foreground">Results: {displayedServices.length}</div>
          </div>

          <div className="overflow-x-auto bg-transparent rounded-md">
            <table className="w-full table-auto">
              <thead>
                <tr className="text-left text-sm text-muted-foreground">
                  <th className="px-4 py-3">Image</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Duration</th>
                  <th className="px-4 py-3">Active</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedServices.map((service) => (
                  <tr key={service.id} className="border-t">
                    <td className="px-4 py-3 align-middle">
                      <div className="relative w-10 h-10 rounded overflow-hidden bg-gray-100">
                        {service.image_url ? (
                          <Image
                            src={service.image_url}
                            alt={service.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <ImageIcon className="h-4 w-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-middle font-medium">{service.name}</td>
                    <td className="px-4 py-3 align-middle">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${getCategoryColor(service.category_type)}`}>
                        {service.category_name}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-middle">{service.price_type === 'starts_from' ? 'From ' : ''}₹{service.price}</td>
                    <td className="px-4 py-3 align-middle">{service.duration_minutes ? `${service.duration_minutes} min` : '-'}</td>
                    <td className="px-4 py-3 align-middle">{service.is_active ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-3 align-middle">
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(service)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(service.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {displayedServices.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">No services found in this category.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
