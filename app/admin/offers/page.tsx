"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Image as ImageIcon, Calendar } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import { format } from "date-fns"

interface Offer {
    id: number
    title: string
    description: string
    offer_type: string
    discount_value?: number
    valid_from?: string
    valid_until?: string
    is_active: boolean
    display_order: number
    image_url?: string
    created_at: string
}

export default function OffersPage() {
    const [offers, setOffers] = useState<Offer[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingOffer, setEditingOffer] = useState<Offer | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        offer_type: 'percentage',
        discount_value: 0,
        valid_from: '',
        valid_until: '',
        is_active: true,
        display_order: 0
    })

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const token = localStorage.getItem('admin_token')
            const response = await fetch('/api/admin/offers', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (response.ok) {
                const data = await response.json()
                setOffers(data.offers || [])
            }
        } catch (error) {
            console.error('Load data error:', error)
            toast.error("Failed to load offers")
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            offer_type: 'percentage',
            discount_value: 0,
            valid_from: '',
            valid_until: '',
            is_active: true,
            display_order: 0
        })
        setEditingOffer(null)
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

        try {
            const token = localStorage.getItem('admin_token')
            const url = '/api/admin/offers'
            const method = editingOffer ? 'PUT' : 'POST'

            const data = new FormData()
            if (editingOffer) {
                data.append('id', editingOffer.id.toString())
            }
            data.append('title', formData.title)
            data.append('description', formData.description)
            data.append('offer_type', formData.offer_type)
            if (formData.discount_value) data.append('discount_value', formData.discount_value.toString())
            if (formData.valid_from) data.append('valid_from', formData.valid_from)
            if (formData.valid_until) data.append('valid_until', formData.valid_until)
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
                toast.success(editingOffer ? "Offer updated successfully" : "Offer created successfully")
                setIsDialogOpen(false)
                resetForm()
                loadData()
            } else {
                const error = await response.json()
                toast.error(error.error || 'Failed to save offer')
            }
        } catch (error) {
            console.error('Submit error:', error)
            toast.error('Failed to save offer')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleEdit = (offer: Offer) => {
        setEditingOffer(offer)
        setFormData({
            title: offer.title,
            description: offer.description,
            offer_type: offer.offer_type,
            discount_value: offer.discount_value || 0,
            valid_from: offer.valid_from ? new Date(offer.valid_from).toISOString().split('T')[0] : '',
            valid_until: offer.valid_until ? new Date(offer.valid_until).toISOString().split('T')[0] : '',
            is_active: offer.is_active,
            display_order: offer.display_order
        })
        setImagePreview(offer.image_url || null)
        setSelectedImage(null)
        setIsDialogOpen(true)
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this offer?")) return

        try {
            const token = localStorage.getItem('admin_token')
            const response = await fetch(`/api/admin/offers?id=${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.ok) {
                toast.success("Offer deleted successfully")
                setOffers(offers.filter(o => o.id !== id))
            } else {
                const error = await response.json()
                toast.error(error.error || 'Failed to delete offer')
            }
        } catch (error) {
            console.error('Delete error:', error)
            toast.error('Failed to delete offer')
        }
    }

    const getOfferTypeLabel = (type: string) => {
        switch (type) {
            case 'percentage': return 'Percentage Discount'
            case 'fixed_amount': return 'Fixed Amount'
            case 'festival': return 'Festival Offer'
            case 'seasonal': return 'Seasonal Offer'
            default: return type
        }
    }

    if (isLoading) {
        return <div>Loading offers...</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Offers & Promotions</h2>
                    <p className="text-muted-foreground">Manage special offers and discounts.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Offer
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>
                                {editingOffer ? 'Edit Offer' : 'Add New Offer'}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="title">Offer Title *</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="description">Description *</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="offer_type">Offer Type</Label>
                                    <Select
                                        value={formData.offer_type}
                                        onValueChange={(value) => setFormData({ ...formData, offer_type: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="percentage">Percentage Discount</SelectItem>
                                            <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                                            <SelectItem value="festival">Festival Offer</SelectItem>
                                            <SelectItem value="seasonal">Seasonal Offer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="discount_value">Discount Value</Label>
                                    <Input
                                        id="discount_value"
                                        type="number"
                                        value={formData.discount_value}
                                        onChange={(e) => setFormData({ ...formData, discount_value: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="valid_from">Valid From</Label>
                                    <Input
                                        id="valid_from"
                                        type="date"
                                        value={formData.valid_from}
                                        onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="valid_until">Valid Until</Label>
                                    <Input
                                        id="valid_until"
                                        type="date"
                                        value={formData.valid_until}
                                        onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="image">Offer Image</Label>
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

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="is_active"
                                    checked={formData.is_active}
                                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                                />
                                <Label htmlFor="is_active">Active</Label>
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
                                    {isSubmitting ? 'Saving...' : (editingOffer ? 'Update' : 'Create')}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="overflow-x-auto bg-transparent rounded-md border">
                <table className="w-full table-auto">
                    <thead>
                        <tr className="text-left text-sm text-muted-foreground bg-gray-50">
                            <th className="px-4 py-3">Image</th>
                            <th className="px-4 py-3">Title</th>
                            <th className="px-4 py-3">Type</th>
                            <th className="px-4 py-3">Validity</th>
                            <th className="px-4 py-3">Active</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {offers.map((offer) => (
                            <tr key={offer.id} className="border-t">
                                <td className="px-4 py-3 align-middle">
                                    <div className="relative w-12 h-12 rounded overflow-hidden bg-gray-100">
                                        {offer.image_url ? (
                                            <Image
                                                src={offer.image_url}
                                                alt={offer.title}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <ImageIcon className="h-5 w-5 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-3 align-middle font-medium">
                                    <div>{offer.title}</div>
                                    <div className="text-xs text-muted-foreground truncate max-w-[200px]">{offer.description}</div>
                                </td>
                                <td className="px-4 py-3 align-middle">
                                    <span className="inline-block px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                        {getOfferTypeLabel(offer.offer_type)}
                                    </span>
                                    {offer.discount_value && (
                                        <div className="text-xs mt-1 font-medium">
                                            {offer.offer_type === 'percentage' ? `${offer.discount_value}% OFF` : `₹${offer.discount_value} OFF`}
                                        </div>
                                    )}
                                </td>
                                <td className="px-4 py-3 align-middle text-sm">
                                    {offer.valid_from && <div>From: {format(new Date(offer.valid_from), 'MMM d, yyyy')}</div>}
                                    {offer.valid_until && <div>Until: {format(new Date(offer.valid_until), 'MMM d, yyyy')}</div>}
                                    {!offer.valid_from && !offer.valid_until && <span className="text-muted-foreground">Always valid</span>}
                                </td>
                                <td className="px-4 py-3 align-middle">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${offer.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {offer.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-4 py-3 align-middle">
                                    <div className="flex items-center space-x-2">
                                        <Button variant="outline" size="sm" onClick={() => handleEdit(offer)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="destructive" size="sm" onClick={() => handleDelete(offer.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {offers.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">No offers found. Create one to get started.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
