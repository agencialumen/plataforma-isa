"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Eye, Heart, MessageCircle, Download, Play, Star, TrendingUp, Users } from "lucide-react"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import Image from "next/image"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    newContent: 0,
  })

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session) {
        setUser(session.user)
        // Simular estatísticas (você pode implementar analytics reais)
        setStats({
          totalViews: Math.floor(Math.random() * 10000) + 5000,
          totalLikes: Math.floor(Math.random() * 1000) + 500,
          totalComments: Math.floor(Math.random() * 200) + 100,
          newContent: 12,
        })
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    }
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
    <DashboardLayout>
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

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-rose-500/10 to-red-500/10 border border-rose-500/20 rounded-xl p-6 mb-8"
        >
          <h2 className="text-xl font-bold mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="bg-zinc-700 hover:bg-zinc-600 text-white justify-start">
              <MessageCircle className="h-4 w-4 mr-2" />
              Responder Mensagens
            </Button>
            <Button className="bg-zinc-700 hover:bg-zinc-600 text-white justify-start">
              <Download className="h-4 w-4 mr-2" />
              Upload Novo Conteúdo
            </Button>
            <Button className="bg-zinc-700 hover:bg-zinc-600 text-white justify-start">
              <Users className="h-4 w-4 mr-2" />
              Ver Assinantes
            </Button>
          </div>
        </motion.div>

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

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <h2 className="text-xl font-bold mb-6">Atividade Recente</h2>
          <div className="bg-zinc-800/50 backdrop-blur-md border border-zinc-700 rounded-xl p-6">
            <div className="space-y-4">
              {[
                {
                  action: "Novo assinante",
                  detail: "João se inscreveu no plano Premium",
                  time: "2 min atrás",
                  icon: Users,
                },
                {
                  action: "Nova curtida",
                  detail: 'Maria curtiu "Ensaio Exclusivo - Praia"',
                  time: "5 min atrás",
                  icon: Heart,
                },
                {
                  action: "Nova mensagem",
                  detail: "Pedro enviou uma mensagem privada",
                  time: "10 min atrás",
                  icon: MessageCircle,
                },
                { action: "Visualização", detail: "Ana visualizou seu perfil", time: "15 min atrás", icon: Eye },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-zinc-700/30 transition-colors"
                >
                  <div className="w-10 h-10 bg-zinc-700 rounded-full flex items-center justify-center">
                    <activity.icon className="h-5 w-5 text-zinc-300" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{activity.action}</p>
                    <p className="text-zinc-400 text-sm">{activity.detail}</p>
                  </div>
                  <span className="text-zinc-500 text-xs">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
