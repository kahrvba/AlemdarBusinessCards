"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, FileText, RotateCcw } from "lucide-react"

interface FlipCardProps {
  card: {
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
}

export function FlipCard({ card }: FlipCardProps) {
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
              <div className="text-xs text-gray-400">Added {new Date(card.created_at).toLocaleDateString()}</div>
            </CardContent>
          </Card>
          <button
            className="w-full py-3 bg-blue-600 text-white text-lg font-bold rounded-b-lg flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            tabIndex={-1}
            aria-label="Flip to back side"
            type="button"
          >
            <RotateCcw className="h-5 w-5" /> Flip to Back
          </button>
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
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {card.back_image_url && (
                <div className="relative rounded-lg overflow-hidden bg-gray-100 flex-1 min-h-[200px]">
                  <Image
                    src={card.back_image_url}
                    alt={`${card.first_name} ${card.last_name} business card back`}
                    fill
                    className="object-contain"
                  />
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
              <div className="text-xs text-indigo-500">Added {new Date(card.created_at).toLocaleDateString()}</div>
            </CardContent>
          </Card>
          <button
            className="w-full py-3 bg-indigo-700 text-white text-lg font-bold rounded-b-lg flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            tabIndex={-1}
            aria-label="Flip to front side"
            type="button"
          >
            <RotateCcw className="h-5 w-5" /> Flip to Front
          </button>
        </div>
      </motion.div>
    </div>
  )
} 