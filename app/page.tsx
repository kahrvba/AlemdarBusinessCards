"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, User, Phone, FileText, ImageIcon, Plus, Search, Grid3X3 } from "lucide-react"
import Image from "next/image"

interface BusinessCard {
  id: string
  firstName: string
  lastName: string
  phoneNumber: string
  note: string
  imageUrl: string | null
  createdAt: string
}

export default function BusinessCardManager() {
  const [currentView, setCurrentView] = useState<"upload" | "list">("upload")
  const [cards, setCards] = useState<BusinessCard[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    note: "",
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load cards from localStorage on component mount
  useEffect(() => {
    const savedCards = localStorage.getItem("businessCards")
    if (savedCards) {
      setCards(JSON.parse(savedCards))
    }
  }, [])

  // Save cards to localStorage whenever cards change
  useEffect(() => {
    localStorage.setItem("businessCards", JSON.stringify(cards))
  }, [cards])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Create new business card
    const newCard: BusinessCard = {
      id: Date.now().toString(),
      ...formData,
      imageUrl: imagePreview,
      createdAt: new Date().toISOString(),
    }

    setCards((prev) => [newCard, ...prev])

    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      phoneNumber: "",
      note: "",
    })
    setImageFile(null)
    setImagePreview(null)
    setIsSubmitting(false)

    alert("Business card saved successfully!")
  }

  const filteredCards = cards.filter((card) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      card.firstName.toLowerCase().includes(searchLower) ||
      card.lastName.toLowerCase().includes(searchLower) ||
      card.phoneNumber.includes(searchTerm) ||
      card.note.toLowerCase().includes(searchLower)
    )
  })

  const deleteCard = (id: string) => {
    setCards((prev) => prev.filter((card) => card.id !== id))
  }

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
                <Card key={card.id} className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {card.firstName} {card.lastName}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <Phone className="h-3 w-3" />
                          {card.phoneNumber}
                        </CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteCard(card.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {card.imageUrl && (
                      <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={card.imageUrl || "/placeholder.svg"}
                          alt={`${card.firstName} ${card.lastName} business card`}
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}
                    {card.note && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <FileText className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-600 line-clamp-3">{card.note}</p>
                        </div>
                      </div>
                    )}
                    <div className="text-xs text-gray-400">Added {new Date(card.createdAt).toLocaleDateString()}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Upload form view (existing code)
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Business Card Manager</h1>
            <p className="mt-2 text-lg text-gray-600">Upload and manage your business card contacts</p>
          </div>
          <Button variant="outline" onClick={() => setCurrentView("list")} className="flex items-center gap-2">
            <Grid3X3 className="h-4 w-4" />
            View All Cards ({cards.length})
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter first name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter last name"
                      required
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    required
                  />
                </div>

                {/* Note */}
                <div className="space-y-2">
                  <Label htmlFor="note" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Notes
                  </Label>
                  <Textarea
                    id="note"
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    placeholder="Add any notes or story about this contact..."
                    className="min-h-[100px] resize-none"
                  />
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <Label htmlFor="businessCard" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Business Card Image
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <input
                      id="businessCard"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="businessCard" className="cursor-pointer flex flex-col items-center gap-2">
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {imageFile ? imageFile.name : "Click to upload business card image"}
                      </span>
                      <span className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</span>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Business Card"}
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
              {/* Image Preview */}
              {imagePreview ? (
                <div className="space-y-2">
                  <Label>Business Card Image</Label>
                  <div className="border rounded-lg overflow-hidden">
                    <Image
                      src={imagePreview || "/placeholder.svg"}
                      alt="Business card preview"
                      width={400}
                      height={250}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                  <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No image uploaded yet</p>
                </div>
              )}

              {/* Contact Preview */}
              <div className="space-y-4">
                <Label>Contact Summary</Label>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">
                      {formData.firstName || formData.lastName
                        ? `${formData.firstName} ${formData.lastName}`.trim()
                        : "No name entered"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{formData.phoneNumber || "No phone number"}</span>
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
