"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Lock } from "lucide-react"

interface BlurredImageProps {
  src: string
  alt: string
  blurAmount: number
}

export function BlurredImage({ src, alt, blurAmount = 10 }: BlurredImageProps) {
  return (
    <motion.div className="relative overflow-hidden group" whileHover={{ scale: 1.01 }} transition={{ duration: 0.3 }}>
      <div className="relative aspect-[4/5] w-full">
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          fill
          className="object-cover"
          style={{
            filter: `blur(${blurAmount}px)`,
          }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-black/50 backdrop-blur-sm p-4 rounded-full">
          <Lock className="h-8 w-8 text-white" />
        </div>
      </div>
    </motion.div>
  )
}
