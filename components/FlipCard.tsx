"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, FileText, Edit } from "lucide-react"

interface FlipCardProps {
  card: {
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
  onEdit?: (card: FlipCardProps['card']) => void
}

export function FlipCard({ card, onEdit }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div className="relative h-[400px] w-full perspective-1000 select-none">
      <motion.div
        className="relative w-full h-full preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        tabIndex={0}
        aria-label={isFlipped ? "Back of card" : "Front of card"}
        onClick={() => setIsFlipped((f) => !f)}
        onKeyDown={e => { if (e.key === "Enter" || e.key === " ") setIsFlipped(f => !f) }}
        style={{ cursor: "pointer" }}
      >
        {/* Front Side */}
        <div className="absolute w-full h-full backface-hidden flex flex-col justify-between">
          <Card className="h-full shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    {card.first_name} {card.last_name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <Phone className="h-3 w-3" />
                    {card.phone_number}
                  </CardDescription>
                </div>
                {onEdit && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onEdit(card)
                    }}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                    title="Edit card"
                  >
                    <Edit className="h-4 w-4 text-gray-500" />
                  </button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {card.front_image_url && (
                <div className="relative rounded-lg overflow-hidden bg-gray-100 flex-1 min-h-[200px]">
                  <Image
                    src={card.front_image_url}
                    alt={`${card.first_name} ${card.last_name} business card front`}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              )}
              {card.email && card.email.trim() !== "" && (
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-800 line-clamp-3">{card.email}</p>
                  </div>
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
            </CardContent>
          </Card>
          <div className="text-xs text-gray-400 text-center py-2 bg-gray-50 rounded-b-lg">
            Eklenme: {new Date(card.created_at).toLocaleDateString('tr-TR')}
          </div>
        </div>

        {/* Back Side */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 flex flex-col justify-between">
          <Card className="h-full shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg text-indigo-900">
                    {card.first_name} {card.last_name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1 text-indigo-700">
                    <Phone className="h-3 w-3" />
                    {card.phone_number}
                  </CardDescription>
                </div>
                {onEdit && (  
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onEdit(card)
                    }}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                    title="Kartı düzenle"
                  >
                    <Edit className="h-4 w-4 text-gray-500" />
                  </button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {card.back_image_url && (
                <div className="relative rounded-lg overflow-hidden bg-gray-100 flex-1 min-h-[200px]">
                  <Image
                    src={card.back_image_url}
                    alt={`${card.first_name} ${card.last_name} kartvizit arka`}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              )}
              {card.email && card.email.trim() !== "" && (
                <div className="bg-blue-100 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-800 line-clamp-3">{card.email}</p>
                  </div>
                </div>
              )}              
              {card.note && (
                <div className="bg-indigo-100 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-indigo-800 line-clamp-3">{card.note}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="text-xs text-gray-400 text-center py-2 bg-gray-50 rounded-b-lg">
            Eklenme: {new Date(card.created_at).toLocaleDateString('tr-TR')}
          </div>
        </div>
      </motion.div>
    </div>
  )
} 