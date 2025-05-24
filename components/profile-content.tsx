"use client"
import { MessageCircle, ImageIcon, Film, Heart, MessageSquare, Bookmark, Share } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BlurredImage } from "@/components/blurred-image"
import { BlurredVideo } from "@/components/blurred-video"
import { InteractiveChat } from "@/components/interactive-chat"
import { motion } from "framer-motion"
import { useState } from "react"
import Image from "next/image"

// Configuração centralizada - fácil de editar
const CONTENT_CONFIG = {
  photos: [
    {
      id: "photo1",
      src: "https://iili.io/3Z5kOGe.jpg",
      title: "Dia de praia com as amigas 🏖️",
      likes: "3.2K",
      comments: "128",
      date: "Hoje",
      blurAmount: 10,
    },
    {
      id: "photo2",
      src: "https://iili.io/3Z51VWl.md.jpg",
      title: "Noite especial 💋",
      likes: "5.7K",
      comments: "243",
      date: "Ontem",
      blurAmount: 8,
    },
    {
      id: "photo3",
      src: "https://iili.io/3ZAm79I.md.jpg",
      title: "Ensaio exclusivo 📸",
      likes: "8.1K",
      comments: "312",
      date: "2 dias atrás",
      blurAmount: 12,
    },
  ],
  videos: [
    {
      id: "video1",
      thumbnail: "https://iili.io/3ZRRKuI.md.jpg",
      title: "Banho quente 🚿",
      duration: "03:24",
      views: "12.3K",
      date: "Hoje",
      blurAmount: 10,
    },
    {
      id: "video2",
      thumbnail: "https://iili.io/3Z5Gltf.md.jpg",
      title: "Provando lingerie nova 💕",
      duration: "05:12",
      views: "18.7K",
      date: "Ontem",
      blurAmount: 8,
    },
    {
      id: "video3",
      thumbnail: "https://iili.io/3Z5clHb.jpg",
      title: "Dançando para você 💃",
      duration: "02:45",
      views: "9.5K",
      date: "3 dias atrás",
      blurAmount: 12,
    },
  ],
}

export default function ProfileContent() {
  const { photos, videos } = CONTENT_CONFIG
  const [activeTab, setActiveTab] = useState("photos")

  return (
    <div className="px-4 md:px-6 py-4">
      <Tabs defaultValue="photos" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 bg-zinc-800/50 rounded-xl overflow-hidden p-0 h-auto">
          <TabsTrigger
            value="photos"
            className="py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-red-500 rounded-none flex items-center gap-2"
          >
            <ImageIcon className="h-5 w-5" />
            <span className="font-medium">FOTOS</span>
          </TabsTrigger>
          <TabsTrigger
            value="videos"
            className="py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-red-500 rounded-none flex items-center gap-2"
          >
            <Film className="h-5 w-5" />
            <span className="font-medium">VIDEOS</span>
          </TabsTrigger>
          <TabsTrigger
            value="chat"
            className="py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-red-500 rounded-none flex items-center gap-2"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="font-medium">CHAT</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="photos" className="mt-6">
          <h2 className="text-xl font-bold mb-6 bg-gradient-to-r from-rose-400 to-red-500 bg-clip-text text-transparent">
            Prévia do conteúdo exclusivo
          </h2>

          <div className="space-y-6">
            {photos.map((photo) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-zinc-800/30 rounded-xl overflow-hidden"
              >
                <div className="p-3 flex items-center gap-3">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden">
                    <Image src="https://iili.io/3ZiexRf.jpg" alt="Profile" fill className="object-cover" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Isabelle Lua</p>
                    <p className="text-zinc-400 text-xs">{photo.date}</p>
                  </div>
                </div>

                <BlurredImage src={photo.src} alt={photo.title} blurAmount={photo.blurAmount} />

                <div className="p-4">
                  <p className="text-white mb-3">{photo.title}</p>

                  <div className="flex justify-between items-center">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1 text-zinc-400">
                        <Heart className="h-5 w-5" />
                        <span className="text-sm">{photo.likes}</span>
                      </div>
                      <div className="flex items-center gap-1 text-zinc-400">
                        <MessageSquare className="h-5 w-5" />
                        <span className="text-sm">{photo.comments}</span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Bookmark className="h-5 w-5 text-zinc-400" />
                      <Share className="h-5 w-5 text-zinc-400" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="videos" className="mt-6">
          <h2 className="text-xl font-bold mb-6 bg-gradient-to-r from-rose-400 to-red-500 bg-clip-text text-transparent">
            Vídeos exclusivos
          </h2>

          <div className="space-y-6">
            {videos.map((video) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-zinc-800/30 rounded-xl overflow-hidden"
              >
                <div className="p-3 flex items-center gap-3">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden">
                    <Image src="https://iili.io/3ZAmAap.md.jpg" alt="Profile" fill className="object-cover" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Isabelle Lua</p>
                    <p className="text-zinc-400 text-xs">{video.date}</p>
                  </div>
                </div>

                <BlurredVideo
                  thumbnail={video.thumbnail}
                  duration={video.duration}
                  title={video.title}
                  blurAmount={video.blurAmount}
                />

                <div className="p-4">
                  <p className="text-white mb-3">{video.title}</p>

                  <div className="flex justify-between items-center">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1 text-zinc-400">
                        <Heart className="h-5 w-5" />
                        <span className="text-sm">{video.views}</span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Bookmark className="h-5 w-5 text-zinc-400" />
                      <Share className="h-5 w-5 text-zinc-400" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="chat" className="mt-6">
          <InteractiveChat />
        </TabsContent>
      </Tabs>
    </div>
  )
}
