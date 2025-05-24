"use client"
import { Star, Share2, ArrowLeft, CheckCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import SubscriptionModal from "@/components/subscription-modal"
import { motion } from "framer-motion"

// Configuração centralizada - fácil de editar
const PROFILE_CONFIG = {
  username: "Isabelle Lua",
  handle: "@belinha.ofc",
  bio: "🔥 Sou putinha, mas gosto de ser tratada como princesa | 💦 Se for me chamar, vem com tesão e pix.",
  stats: {
    posts: "347",
    photos: "224",
    likes: "68.2K",
  },
  images: {
    avatar: "https://iili.io/3ZAmAap.md.jpg",
    cover: "https://iili.io/3Z7Fp5u.md.jpg",
  },
  verifiedFollowers: [
    {
      name: "Anitta",
      handle: "@anitta",
      avatar: "/images/followers/anitta.jpg",
    },
    {
      name: "Neymar Jr",
      handle: "@neymarjr",
      avatar: "/images/followers/neymar.jpg",
    },
    {
      name: "Bruna Marquezine",
      handle: "@brunamarquezine",
      avatar: "/images/followers/bruna.jpg",
    },
  ],
}

export default function ProfileHeader() {
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [showFollowers, setShowFollowers] = useState(false)
  const { username, handle, bio, stats, images, verifiedFollowers } = PROFILE_CONFIG

  return (
    <>
      <div className="relative">
        {/* Cover Image */}
        <div className="h-64 sm:h-80 w-full relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/90 z-10" />
          <Image src={images.cover || "/placeholder.svg"} alt="Cover" fill className="object-cover" priority />
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-start px-4 md:px-6">
          <Link href="#" className="absolute top-4 left-4 z-20 text-white">
            <ArrowLeft className="h-6 w-6" />
          </Link>

          <div className="flex gap-2 absolute top-4 right-4 z-20">
            <button className="bg-white/10 backdrop-blur-sm p-2 rounded-full">
              <Star className="h-5 w-5 text-white" />
            </button>
            <button className="bg-white/10 backdrop-blur-sm p-2 rounded-full">
              <Share2 className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        {/* Profile Info */}
        <div className="relative z-20 px-4 md:px-6 pb-6 -mt-24">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Avatar */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-zinc-900 overflow-hidden shadow-xl"
            >
              <Image src={images.avatar || "/placeholder.svg"} alt="Profile" fill className="object-cover" />
            </motion.div>

            <div className="flex-1 mt-4 md:mt-16">
              {/* Username and Verification */}
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl md:text-3xl font-bold">{username}</h1>
                <span className="bg-gradient-to-r from-rose-500 to-red-500 text-white text-xs px-2 py-1 rounded-full">
                  VIP
                </span>
              </div>

              {/* Handle */}
              <p className="text-zinc-400 text-sm mb-3">{handle}</p>

              {/* Bio */}
              <p className="text-zinc-200 text-base mb-4 max-w-2xl">{bio}</p>

              {/* CTA Button - Prominent and Attention-Grabbing */}
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="mb-6">
                <Button
                  onClick={() => setShowSubscriptionModal(true)}
                  className="bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white font-bold py-3 px-6 rounded-lg text-base w-full md:w-auto transition-all duration-300 shadow-lg shadow-rose-500/20"
                >
                  ASSINAR PARA VER MAIS
                </Button>
              </motion.div>

              {/* Stats with Hover Effect */}
              <div className="flex items-center gap-6 bg-zinc-800/50 backdrop-blur-sm p-3 rounded-xl">
                <motion.div whileHover={{ y: -3 }} className="text-center cursor-pointer">
                  <p className="font-bold text-xl">{stats.posts}</p>
                  <p className="text-zinc-400 text-sm">Posts</p>
                </motion.div>
                <div className="h-10 w-px bg-zinc-700"></div>
                <motion.div whileHover={{ y: -3 }} className="text-center cursor-pointer">
                  <p className="font-bold text-xl">{stats.photos}</p>
                  <p className="text-zinc-400 text-sm">Fotos</p>
                </motion.div>
                <div className="h-10 w-px bg-zinc-700"></div>
                <motion.div whileHover={{ y: -3 }} className="text-center cursor-pointer">
                  <p className="font-bold text-xl">{stats.likes}</p>
                  <p className="text-zinc-400 text-sm">Likes</p>
                </motion.div>
              </div>

              {/* Verified Followers */}
              <div className="mt-4">
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => setShowFollowers(!showFollowers)}
                >
                  <p className="text-zinc-300 text-sm font-medium">Seguido por perfis verificados</p>
                  <motion.span animate={{ rotate: showFollowers ? 180 : 0 }} className="text-zinc-400">
                    ▼
                  </motion.span>
                </div>

                {showFollowers && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-2 bg-zinc-800/50 backdrop-blur-sm p-3 rounded-xl"
                  >
                    {verifiedFollowers.map((follower, index) => (
                      <div key={index} className="flex items-center gap-3 mb-2 last:mb-0">
                        <div className="relative h-8 w-8 rounded-full overflow-hidden">
                          <Image
                            src={follower.avatar || "/placeholder.svg"}
                            alt={follower.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <p className="text-white text-sm font-medium">{follower.name}</p>
                            <CheckCircle className="h-3 w-3 text-blue-500 fill-blue-500" />
                          </div>
                          <p className="text-zinc-400 text-xs">{follower.handle}</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-zinc-800"></div>
      </div>

      <SubscriptionModal open={showSubscriptionModal} onOpenChange={setShowSubscriptionModal} />
    </>
  )
}
