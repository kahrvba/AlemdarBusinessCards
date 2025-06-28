"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { User, Phone, FileText, ImageIcon, Plus, Search, Grid3X3, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import Image from "next/image"
import { FlipCard } from "@/components/FlipCard"

interface BusinessCard {
  id: string
  first_name: string
  last_name: string
  phone_number: string
  note?: string
  front_image_url?: string
  back_image_url?: string
  created_at: string
  updated_at: string
}

export default function BusinessCardManager() {
  const [currentView, setCurrentView] = useState<"upload" | "list">("upload")
  const [cards, setCards] = useState<BusinessCard[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    note: "",
    front_image_url: "",
    back_image_url: "",
  })
  const [frontImageFile, setFrontImageFile] = useState<File | null>(null)
  const [backImageFile, setBackImageFile] = useState<File | null>(null)
  const [frontImagePreview, setFrontImagePreview] = useState<string | null>(null)
  const [backImagePreview, setBackImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploadingFront, setIsUploadingFront] = useState(false)
  const [isUploadingBack, setIsUploadingBack] = useState(false)
  const [saveStatus, setSaveStatus] = useState<null | "success" | "error">(null)
  const [saveMessage, setSaveMessage] = useState("")

  // Fetch cards from the API on mount
  useEffect(() => {
    fetchCards()
  }, [])

  const fetchCards = async () => {
    try {
      const res = await fetch("/api/cards")
      const data = await res.json()
      setCards(data)
    } catch {
      setCards([])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFrontImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFrontImageFile(file)
      setIsUploadingFront(true)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setFrontImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      
      // Upload to Vercel Blob
      try {
        const formData = new FormData()
        formData.append('file', file)
        
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })
        
        if (!res.ok) throw new Error('Upload failed')
        
        const data = await res.json()
        setFormData(prev => ({ ...prev, front_image_url: data.url }))
      } catch (error) {
        console.error('Upload error:', error)
        alert('Failed to upload front image')
      } finally {
        setIsUploadingFront(false)
      }
    }
  }

  const handleBackImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setBackImageFile(file)
      setIsUploadingBack(true)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setBackImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      
      // Upload to Vercel Blob
      try {
        const formData = new FormData()
        formData.append('file', file)
        
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })
        
        if (!res.ok) throw new Error('Upload failed')
        
        const data = await res.json()
        setFormData(prev => ({ ...prev, back_image_url: data.url }))
      } catch (error) {
        console.error('Upload error:', error)
        alert('Failed to upload back image')
      } finally {
        setIsUploadingBack(false)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSaveStatus(null)
    setSaveMessage("")
    try {
      const res = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error("Failed to save card")
      setFormData({
        first_name: "",
        last_name: "",
        phone_number: "",
        note: "",
        front_image_url: "",
        back_image_url: "",
      })
      setFrontImageFile(null)
      setBackImageFile(null)
      setFrontImagePreview(null)
      setBackImagePreview(null)
      await fetchCards()
      setIsSubmitting(false)
      setSaveStatus("success")
      setSaveMessage("Business card saved successfully!")
    } catch {
      setIsSubmitting(false)
      setSaveStatus("error")
      setSaveMessage("Failed to save business card. Please try again.")
    }
  }

  const filteredCards = cards.filter((card) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      card.first_name.toLowerCase().includes(searchLower) ||
      card.last_name.toLowerCase().includes(searchLower) ||
      card.phone_number.includes(searchTerm) ||
      (card.note || "").toLowerCase().includes(searchLower)
    )
  })

  if (currentView === "list") {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Business Cards</h1>
              <p className="mt-2 text-lg text-gray-600">Manage your saved contacts</p>
            </div>
            <Button onClick={() => setCurrentView("upload")} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Card
            </Button>
          </div>

          {/* Search Bar */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search by name, phone, or notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Cards Grid */}
          {filteredCards.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Grid3X3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? "No cards found" : "No business cards yet"}
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm ? "Try adjusting your search terms" : "Start by adding your first business card"}
                </p>
                {!searchTerm && <Button onClick={() => setCurrentView("upload")}>Add Your First Card</Button>}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCards.map((card) => (
                <FlipCard key={card.id} card={card} />
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Upload form view
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-end mb-8">
          <Button variant="outline" onClick={() => setCurrentView("list")} className="flex items-center gap-2">
            <Grid3X3 className="h-4 w-4" />
            View All Cards ({cards.length})
          </Button>
        </div>

        <div className="space-y-8">
          {/* Form Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Contact Information
              </CardTitle>
              <CardDescription>Enter the contact details from the business card</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Saving/loading indicator and status message */}
              {isSubmitting && (
                <div className="flex items-center gap-2 mb-4 text-blue-700 text-lg font-bold">
                  <Loader2 className="animate-spin h-6 w-6" /> Saving card, please wait...
                </div>
              )}
              {saveStatus === "success" && (
                <div className="flex items-center gap-2 mb-4 text-green-700 bg-green-100 border border-green-300 rounded-lg p-3 text-lg font-bold">
                  <CheckCircle2 className="h-6 w-6" /> {saveMessage}
                </div>
              )}
              {saveStatus === "error" && (
                <div className="flex items-center gap-2 mb-4 text-red-700 bg-red-100 border border-red-300 rounded-lg p-3 text-lg font-bold">
                  <XCircle className="h-6 w-6" /> {saveMessage}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4" aria-disabled={isSubmitting}>
                {/* Horizontal Layout - First Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">Full Name</Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      type="text"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">firm name</Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      type="text"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      placeholder="Enter firm name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone_number" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone_number"
                      name="phone_number"
                      type="tel"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                </div>

                {/* Horizontal Layout - Second Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="note" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Story
                    </Label>
                    <Textarea
                      id="note"
                      name="note"
                      value={formData.note}
                      onChange={handleInputChange}
                      placeholder="Add any notes or story about this contact..."
                      className="min-h-[80px] resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Images</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-gray-400 transition-colors">
                        <input
                          id="frontImage"
                          type="file"
                          accept="image/*"
                          onChange={handleFrontImageChange}
                          className="hidden"
                          disabled={isUploadingFront}
                        />
                        <label htmlFor="frontImage" className={`cursor-pointer flex flex-col items-center gap-1 ${isUploadingFront ? 'opacity-50' : ''}`}>
                          {isUploadingFront ? (
                            <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
                          ) : (
                            <ImageIcon className="h-6 w-6 text-gray-400" />
                          )}
                          <span className="text-xs text-gray-600">
                            {isUploadingFront ? 'Uploading...' : frontImageFile ? frontImageFile.name : 'Front'}
                          </span>
                        </label>
                      </div>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-gray-400 transition-colors">
                        <input
                          id="backImage"
                          type="file"
                          accept="image/*"
                          onChange={handleBackImageChange}
                          className="hidden"
                          disabled={isUploadingBack}
                        />
                        <label htmlFor="backImage" className={`cursor-pointer flex flex-col items-center gap-1 ${isUploadingBack ? 'opacity-50' : ''}`}>
                          {isUploadingBack ? (
                            <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
                          ) : (
                            <ImageIcon className="h-6 w-6 text-gray-400" />
                          )}
                          <span className="text-xs text-gray-600">
                            {isUploadingBack ? 'Uploading...' : backImageFile ? backImageFile.name : 'Back'}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="flex items-center gap-2"><Loader2 className="animate-spin h-5 w-5" /> Saving...</span>
                  ) : "Save Business Card"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Preview Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Preview
              </CardTitle>
              <CardDescription>Preview of the uploaded business card and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Image Previews */}
              <div className="space-y-4">
                {frontImagePreview && (
                  <div className="space-y-2">
                    <Label>Front Side</Label>
                    <div className="border rounded-lg overflow-hidden">
                      <Image
                        src={frontImagePreview}
                        alt="Business card front preview"
                        width={400}
                        height={250}
                        className="w-full h-auto object-contain"
                        unoptimized
                      />
                    </div>
                  </div>
                )}
                {backImagePreview && (
                  <div className="space-y-2">
                    <Label>Back Side</Label>
                    <div className="border rounded-lg overflow-hidden">
                      <Image
                        src={backImagePreview}
                        alt="Business card back preview"
                        width={400}
                        height={250}
                        className="w-full h-auto object-contain"
                        unoptimized
                      />
                    </div>
                  </div>
                )}
                {!frontImagePreview && !backImagePreview && (
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                    <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No images uploaded yet</p>
                  </div>
                )}
              </div>

              {/* Contact Preview */}
              <div className="space-y-4">
                <Label>Contact Summary</Label>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">
                      {formData.first_name || formData.last_name
                        ? `${formData.first_name} ${formData.last_name}`.trim()
                        : "No name entered"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{formData.phone_number || "No phone number"}</span>
                  </div>
                  {formData.note && (
                    <div className="flex items-start gap-2">
                      <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
                      <span className="text-sm text-gray-600">{formData.note}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
