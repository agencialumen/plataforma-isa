"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Home, ImageIcon, Video, MessageCircle, Settings, LogOut, Menu, X, Crown, Star, Diamond } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { authService } from "@/lib/auth"
import type { UserSubscription } from "@/lib/supabase"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push("/auth")
        return
      }

      setUser(session.user)

      // Verificar assinatura ativa
      const userSubscription = await authService.checkUserSubscription(session.user.id)

      if (!userSubscription) {
        router.push("/auth?error=no_subscription")
        return
      }

      setSubscription(userSubscription)

      // Registrar acesso ao dashboard
      await authService.logUserAction(session.user.id, "dashboard_access", "/dashboard")
    } catch (error) {
      console.error("Erro na autenticação:", error)
      router.push("/auth")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      if (user) {
        await authService.logUserAction(user.id, "user_logout", "/dashboard")
      }
      await authService.signOut()
      router.push("/")
    } catch (error) {
      console.error("Erro no logout:", error)
    }
  }

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case "basic":
        return <Star className="h-5 w-5 text-amber-400" />
      case "premium":
        return <Crown className="h-5 w-5 text-rose-400" />
      case "diamond":
        return <Diamond className="h-5 w-5 text-blue-400" />
      default:
        return <Star className="h-5 w-5" />
    }
  }

  const getPlanName = (plan: string) => {
    switch (plan) {
      case "basic":
        return "Básico"
      case "premium":
        return "Premium"
      case "diamond":
        return "Diamante"
      default:
        return plan
    }
  }

  const menuItems = [
    { icon: Home, label: "Início", href: "/dashboard" },
    { icon: ImageIcon, label: "Fotos", href: "/dashboard/photos" },
    { icon: Video, label: "Vídeos", href: "/dashboard/videos" },
    { icon: MessageCircle, label: "Chat", href: "/dashboard/chat" },
    { icon: Settings, label: "Configurações", href: "/dashboard/settings" },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-rose-500/30 border-t-rose-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Carregando...</p>
        </div>
      </div>
    )
  }

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
            {subscription && (
              <div className="bg-zinc-700/50 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  {getPlanIcon(subscription.subscription_plan)}
                  <span className="font-medium">Plano {getPlanName(subscription.subscription_plan)}</span>
                </div>
                <p className="text-zinc-400 text-sm">{user?.email}</p>
                <div className="mt-2 text-xs text-zinc-500">
                  Ativo até: {new Date(subscription.expires_at || "").toLocaleDateString("pt-BR")}
                </div>
              </div>
            )}

            {/* Navigation */}
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => {
                    router.push(item.href)
                    setSidebarOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-700/50 transition-all"
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </button>
              ))}
            </nav>

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
        <main className="flex-1 lg:ml-0">{children}</main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
