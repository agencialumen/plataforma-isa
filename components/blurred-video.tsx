"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Lock } from "lucide-react"

interface BlurredVideoProps {
  thumbnail: string
  duration: string
  title: string
  blurAmount: number
}

export function BlurredVideo({ thumbnail, duration, title, blurAmount = 10 }: BlurredVideoProps) {
  return (
    <motion.div className="relative overflow-hidden group" whileHover={{ scale: 1.01 }} transition={{ duration: 0.3 }}>
      <div className="relative aspect-video w-full">
        <Image
          src={thumbnail || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover"
          style={{
            filter: `blur(${blurAmount}px)`,
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 to-red-500/10"></div>

        <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
          {duration}
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/50 backdrop-blur-sm p-4 rounded-full">
            <Lock className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
