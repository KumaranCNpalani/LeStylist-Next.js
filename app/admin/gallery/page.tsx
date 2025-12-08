"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Upload, Plus, Image as ImageIcon, Edit, X } from "lucide-react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ClientImage {
    id: number
    title: string
    image_url: string
    category: string
    description?: string
}

const CATEGORIES = [
    { value: 'general', label: 'General' },
    { value: 'awards', label: 'Awards' },
    { value: 'shop', label: 'Shop Photos' },
    { value: 'client', label: 'Client Photos' },
    { value: 'hair', label: 'Hair' },
    { value: 'makeup', label: 'Makeup' },
    { value: 'skin', label: 'Skin' },
]

export default function GalleryPage() {
    const [images, setImages] = useState<ClientImage[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Upload state
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadFiles, setUploadFiles] = useState<File[]>([])
    const [uploadCategory, setUploadCategory] = useState('general')
    const [uploadDescription, setUploadDescription] = useState('')

    // Edit state
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [editingImage, setEditingImage] = useState<ClientImage | null>(null)
    const [isUpdating, setIsUpdating] = useState(false)
    const [editFormData, setEditFormData] = useState({
        title: '',
        category: '',
        description: '',
        is_featured: false,
        display_order: 0
    })

    useEffect(() => {
        loadGallery()
    }, [])

    const loadGallery = async () => {
        try {
            const token = localStorage.getItem('admin_token')
            const response = await fetch('/api/admin/gallery', {
                headers: { 'Authorization': `Bearer ${token}` }
            })

            if (response.ok) {
                const data = await response.json()
                setImages(data.images || [])
            }
        } catch (error) {
            console.error('Load gallery error:', error)
            toast.error("Failed to load gallery")
        } finally {
            setIsLoading(false)
        }
    }

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setUploadFiles(Array.from(event.target.files))
            setIsUploadDialogOpen(true)
        }
    }

    const handleUploadSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (uploadFiles.length === 0) return

        setIsUploading(true)
        const token = localStorage.getItem('admin_token')
        let successCount = 0

        for (const file of uploadFiles) {
            if (file.type.startsWith('image/')) {
                try {
                    const formData = new FormData()
                    formData.append('image', file)
                    formData.append('title', file.name.split('.')[0])
                    formData.append('category', uploadCategory)
                    formData.append('description', uploadDescription)

                    const response = await fetch('/api/admin/gallery', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                        body: formData
                    })

                    if (response.ok) {
                        successCount++
                    } else {
                        const error = await response.json()
                        toast.error(error.error || `Failed to upload ${file.name}`)
                    }
                } catch (error) {
                    console.error('Upload error:', error)
                    toast.error(`Failed to upload ${file.name}`)
                }
            }
        }

        if (successCount > 0) {
            toast.success(`${successCount} images uploaded successfully`)
            await loadGallery()
            setIsUploadDialogOpen(false)
            setUploadFiles([])
            setUploadDescription('')
            setUploadCategory('general')
        }

        setIsUploading(false)
    }

    const handleEditImage = (image: ClientImage) => {
        setEditingImage(image)
        setEditFormData({
            title: image.title,
            category: image.category || 'general',
            description: image.description || '',
            is_featured: false,
            display_order: 0
        })
        setIsEditDialogOpen(true)
    }

    const handleUpdateImage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingImage) return

        setIsUpdating(true)

        try {
            const token = localStorage.getItem('admin_token')
            const formData = new FormData()

            formData.append('id', editingImage.id.toString())
            Object.entries(editFormData).forEach(([key, value]) => {
                formData.append(key, value.toString())
            })

            const response = await fetch('/api/admin/gallery', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            })

            if (response.ok) {
                toast.success("Image updated successfully")
                setIsEditDialogOpen(false)
                setEditingImage(null)
                await loadGallery()
            } else {
                const error = await response.json()
                toast.error(error.error || 'Failed to update image')
            }
        } catch (error) {
            console.error('Update image error:', error)
            toast.error('Failed to update image')
        } finally {
            setIsUpdating(false)
        }
    }

    const handleDeleteImage = async (id: number) => {
        if (!confirm("Are you sure you want to delete this image?")) return

        try {
            const token = localStorage.getItem('admin_token')
            const response = await fetch(`/api/admin/gallery?id=${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.ok) {
                toast.success("Image deleted successfully")
                await loadGallery()
            } else {
                const error = await response.json()
                toast.error(error.error || 'Failed to delete image')
            }
        } catch (error) {
            console.error('Delete image error:', error)
            toast.error('Failed to delete image')
        }
    }

    if (isLoading) {
        return <div>Loading gallery...</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Gallery</h2>
                    <p className="text-muted-foreground">Manage customer photos, awards, and shop images.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={() => document.getElementById('image-upload')?.click()}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Images
                    </Button>
                    <Input
                        type="file"
                        id="image-upload"
                        className="hidden"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                    />
                </div>
            </div>

            {/* Upload Dialog */}
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Upload Images</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUploadSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Selected Files ({uploadFiles.length})</Label>
                            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border rounded-md">
                                {uploadFiles.map((file, idx) => (
                                    <div key={idx} className="text-xs bg-secondary px-2 py-1 rounded-md flex items-center">
                                        <span className="truncate max-w-[150px]">{file.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="upload_category">Category</Label>
                            <Select
                                value={uploadCategory}
                                onValueChange={setUploadCategory}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CATEGORIES.map(cat => (
                                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="upload_description">Description (Optional)</Label>
                            <Textarea
                                id="upload_description"
                                placeholder="Add a description for these images..."
                                value={uploadDescription}
                                onChange={(e) => setUploadDescription(e.target.value)}
                                rows={3}
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsUploadDialogOpen(false)}
                                disabled={isUploading}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isUploading}>
                                {isUploading ? 'Uploading...' : 'Upload'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Image Details</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdateImage} className="space-y-4">
                        <div>
                            <Label htmlFor="edit_title">Title</Label>
                            <Input
                                id="edit_title"
                                value={editFormData.title}
                                onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit_category">Category</Label>
                            <Select
                                value={editFormData.category}
                                onValueChange={(val) => setEditFormData({ ...editFormData, category: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CATEGORIES.map(cat => (
                                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="edit_description">Description</Label>
                            <Textarea
                                id="edit_description"
                                value={editFormData.description}
                                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                                rows={3}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="edit_display_order">Display Order</Label>
                                <Input
                                    id="edit_display_order"
                                    type="number"
                                    value={editFormData.display_order}
                                    onChange={(e) => setEditFormData({ ...editFormData, display_order: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                            <div className="flex items-center space-x-2 pt-8">
                                <input
                                    type="checkbox"
                                    id="edit_featured"
                                    checked={editFormData.is_featured}
                                    onChange={(e) => setEditFormData({ ...editFormData, is_featured: e.target.checked })}
                                />
                                <Label htmlFor="edit_featured">Featured</Label>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsEditDialogOpen(false)}
                                disabled={isUpdating}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isUpdating}>
                                {isUpdating ? 'Updating...' : 'Update'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {images.map((image) => (
                    <Card key={image.id} className="overflow-hidden group h-full flex flex-col">
                        <div className="relative aspect-[4/3] bg-gray-100">
                            <img
                                src={image.image_url}
                                alt={image.title}
                                className="object-contain w-full h-full transition-transform group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    onClick={() => handleEditImage(image)}
                                >
                                    <Edit className="h-5 w-5" />
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => handleDeleteImage(image.id)}
                                >
                                    <Trash2 className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                        <CardContent className="p-4 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-medium truncate flex-1" title={image.title}>{image.title}</h3>
                                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full capitalize ml-2">
                                    {image.category}
                                </span>
                            </div>
                            {image.description && (
                                <p className="text-sm text-muted-foreground line-clamp-2 mt-auto" title={image.description}>
                                    {image.description}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                ))}
                {images.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p>No images found. Upload some photos to get started.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
