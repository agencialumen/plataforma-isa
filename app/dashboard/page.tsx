"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Eye, Heart, MessageCircle, Play, Star, TrendingUp, Crown, LogOut, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function DashboardPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [stats] = useState({
    totalViews: 8547,
    totalLikes: 1234,
    totalComments: 156,
    newContent: 12,
  })

  const handleLogout = () => {
    router.push("/")
  }

  const featuredContent = [
    {
      id: 1,
      type: "photo",
      title: "Ensaio Exclusivo - Praia",
      thumbnail: "/images/preview1.jpg",
      views: "2.3K",
      likes: "456",
      isNew: true,
    },
    {
      id: 2,
      type: "video",
      title: "Vídeo Especial - Bastidores",
      thumbnail: "/images/video-thumb1.jpg",
      duration: "05:24",
      views: "1.8K",
      likes: "312",
      isNew: true,
    },
    {
      id: 3,
      type: "photo",
      title: "Sessão Íntima",
      thumbnail: "/images/preview2.jpg",
      views: "3.1K",
      likes: "678",
      isNew: false,
    },
  ]

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      {/* Mobile Header */}
      <div className="lg:hidden bg-zinc-800/50 backdrop-blur-md border-b border-zinc-700 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-red-500 rounded-full flex items-center justify-center">
            <Crown className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold">Isabelle VIP</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-zinc-400 hover:text-white"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{
            x: sidebarOpen ? 0 : "-100%",
            opacity: sidebarOpen ? 1 : 0,
          }}
          className={`fixed lg:relative lg:translate-x-0 lg:opacity-100 inset-y-0 left-0 z-50 w-64 bg-zinc-800/50 backdrop-blur-md border-r border-zinc-700 lg:block ${
            sidebarOpen ? "block" : "hidden lg:block"
          }`}
        >
          <div className="p-6">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-rose-500 to-red-500 rounded-full flex items-center justify-center">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl">Isabelle VIP</span>
            </div>

            {/* User Info */}
            <div className="bg-zinc-700/50 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-5 w-5 text-rose-400" />
                <span className="font-medium">Plano Premium</span>
              </div>
              <p className="text-zinc-400 text-sm">usuario@email.com</p>
              <div className="mt-2 text-xs text-zinc-500">Ativo até: 20/02/2024</div>
            </div>

            {/* Logout */}
            <div className="absolute bottom-6 left-6 right-6">
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="w-full justify-start text-zinc-400 hover:text-white hover:bg-zinc-700/50"
              >
                <LogOut className="h-5 w-5 mr-3" />
                Sair
              </Button>
            </div>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="p-6 max-w-7xl mx-auto">
            {/* Welcome Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Bem-vinda de volta! 👋</h1>
              <p className="text-zinc-400">Aqui está o que aconteceu desde sua última visita</p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { icon: Eye, label: "Visualizações", value: stats.totalViews.toLocaleString(), color: "text-blue-400" },
                { icon: Heart, label: "Curtidas", value: stats.totalLikes.toLocaleString(), color: "text-rose-400" },
                {
                  icon: MessageCircle,
                  label: "Comentários",
                  value: stats.totalComments.toLocaleString(),
                  color: "text-green-400",
                },
                { icon: Star, label: "Novo Conteúdo", value: stats.newContent.toString(), color: "text-amber-400" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-zinc-800/50 backdrop-blur-md border border-zinc-700 rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    <TrendingUp className="h-4 w-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                    <p className="text-zinc-400 text-sm">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Featured Content */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Conteúdo em Destaque</h2>
                <Button variant="ghost" className="text-rose-400 hover:text-rose-300">
                  Ver Tudo
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredContent.map((content, index) => (
                  <motion.div
                    key={content.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="bg-zinc-800/50 backdrop-blur-md border border-zinc-700 rounded-xl overflow-hidden hover:border-rose-500/50 transition-all group"
                  >
                    <div className="relative aspect-video">
                      <Image
                        src={content.thumbnail || "/placeholder.svg"}
                        alt={content.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {content.isNew && (
                        <div className="absolute top-2 left-2 bg-rose-500 text-white text-xs px-2 py-1 rounded-full">
                          NOVO
                        </div>
                      )}

                      {content.type === "video" && (
                        <>
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="h-12 w-12 text-white" />
                          </div>
                          {content.duration && (
                            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                              {content.duration}
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="font-medium text-white mb-2 line-clamp-2">{content.title}</h3>
                      <div className="flex items-center justify-between text-zinc-400 text-sm">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {content.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {content.likes}
                          </span>
                        </div>
                        <Button size="sm" variant="ghost" className="text-rose-400 hover:text-rose-300">
                          Ver
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
