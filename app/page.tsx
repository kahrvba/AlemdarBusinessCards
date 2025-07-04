"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { User, Phone, FileText, ImageIcon, Search, Grid3X3, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { FlipCard } from "@/components/FlipCard"

interface BusinessCard {
  id: string
  first_name: string
  last_name: string
  phone_number: string
  email?: string
  note?: string
  front_image_url?: string
  back_image_url?: string
  created_at: string
  updated_at: string
}

export default function BusinessCardManager() {
  const [cards, setCards] = useState<BusinessCard[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [editingCard, setEditingCard] = useState<BusinessCard | null>(null)

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    note: "",
    front_image_url: "",
    back_image_url: "",
  })
  const [frontImageFile, setFrontImageFile] = useState<File | null>(null)
  const [backImageFile, setBackImageFile] = useState<File | null>(null)
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
      const url = editingCard ? `/api/cards/${editingCard.id}` : "/api/cards"
      const method = editingCard ? "PUT" : "POST"
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error("Failed to save card")
      
      const updatedCard = await res.json()
      
      // Update local state immediately
      if (editingCard) {
        setCards(prevCards => 
          prevCards.map(card => 
            card.id === editingCard.id ? updatedCard : card
          )
        )
      } else {
        setCards(prevCards => [updatedCard, ...prevCards])
      }
      
      setFormData({
        first_name: "",
        last_name: "",
        phone_number: "",
        email: "",
        note: "",
        front_image_url: "",
        back_image_url: "",
      })
      setFrontImageFile(null)
      setBackImageFile(null)
      setEditingCard(null)
      setIsSubmitting(false)
      setSaveStatus("success")
      setSaveMessage(editingCard ? "Kartvizit başarıyla güncellendi!" : "Kartvizit başarıyla kaydedildi!")
    } catch {
      setIsSubmitting(false)
      setSaveStatus("error")
      setSaveMessage("Kartvizit kaydedilemedi. Lütfen tekrar deneyin.")
    }
  }

  const handleEdit = (card: BusinessCard) => {
    setEditingCard(card)
    setFormData({
      first_name: card.first_name,
      last_name: card.last_name,
      phone_number: card.phone_number,
      email: card.email || "",
      note: card.note || "",
      front_image_url: card.front_image_url || "",
      back_image_url: card.back_image_url || "",
    })
  }

  const handleCancelEdit = () => {
    setEditingCard(null)
    setFormData({
      first_name: "",
      last_name: "",
      phone_number: "",
      email: "",
      note: "",
      front_image_url: "",
      back_image_url: "",
    })
    setFrontImageFile(null)
    setBackImageFile(null)
    setSaveStatus(null)
    setSaveMessage("")
  }

  const filteredCards = cards.filter((card) =>
    card.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.phone_number.includes(searchTerm) ||
    (card.email && card.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (card.note && card.note.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Kartvizit Yöneticisi</h1>
          <p className="text-gray-600">Kartvizitlerinizi ve kişilerinizi yönetin</p>
        </div>

        {/* Main Layout - Horizontal */}
        <div className="space-y-10">
          {/* Left Side - Upload Form */}
          <div className="w-full">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {editingCard ? "Kişi Bilgilerini Düzenle" : "Kişi Bilgileri"}
                </CardTitle>
                <CardDescription>
                  {editingCard ? "Kişi bilgilerini güncelleyin" : "Kartvizitten kişi bilgilerini girin"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Saving/loading indicator and status message */}
                {isSubmitting && (
                  <div className="flex items-center gap-2 mb-4 text-blue-700 text-lg font-bold">
                    <Loader2 className="animate-spin h-6 w-6" /> {editingCard ? "Kart güncelleniyor, lütfen bekleyin..." : "Kart kaydediliyor, lütfen bekleyin..."}
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
                      <Label htmlFor="first_name">ısım soyısım </Label>
                      <Input
                        id="first_name"
                        name="first_name"
                        type="text"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        placeholder="Ad soyad girin"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name">fırma </Label>
                      <Input
                        id="last_name"
                        name="last_name"
                        type="text"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        placeholder="Firma adı girin"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone_number" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        telefon numarası 
                      </Label>
                      <Input
                        id="phone_number"
                        name="phone_number"
                        type="tel"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        placeholder="Telefon numarası girin"
                        required
                      />
                    </div>
             
                  </div>

                  {/* Horizontal Layout - Second Row */}
                  <div className="  grid grid-cols-1 md:grid-cols-3 gap-4">

                             <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        email adresi
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Email adresi girin"
                        required
                      />
                                          <div className="space-y-2">
                      <Label htmlFor="note" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        hıkaye 
                      </Label>
                      <Textarea
                        id="note"
                        name="note"
                        value={formData.note}
                        onChange={handleInputChange}
                        placeholder="Bu kişi hakkında not veya hikaye ekleyin..."
                        className="min-h-[80px] resize-none"
                        required
                      />
                    </div>
                    </div>
                    <div className="space-y-2">
                      <Label>fotoğraf</Label>
                      <div className="grid grid-cols-1 gap-2">
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
                              {isUploadingFront ? 'Yükleniyor...' : frontImageFile ? frontImageFile.name : 'Ön'}
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
                            {isUploadingBack ? 'Yükleniyor...' : backImageFile ? backImageFile.name : 'arka'}
                          </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit and Cancel Buttons */}
                  <div className="flex gap-3">
                    <Button type="submit" className="flex-1" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <span className="flex items-center gap-2"><Loader2 className="animate-spin h-5 w-5" /> {editingCard ? "Güncelleniyor..." : "Kaydediliyor..."}</span>
                      ) : editingCard ? "Kartviziti Güncelle" : "kartvızıtı kaydet"}
                    </Button>
                    {editingCard && (
                      <Button type="button" variant="outline" onClick={handleCancelEdit} disabled={isSubmitting}>
                        İptal
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Cards Display */}
          <div className="lg:col-span-1">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="ısım, telefon, not , fırma arama "
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Cards Grid */}
            <div className="space-y-6">
              {filteredCards.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Grid3X3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {searchTerm ? "Kart bulunamadı" : "Henüz kartvizit yok"}
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {searchTerm ? "Arama terimlerinizi ayarlamayı deneyin" : "İlk kartvizitinizi ekleyerek başlayın"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredCards.map((card) => (
                    <FlipCard key={card.id} card={card} onEdit={handleEdit} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
