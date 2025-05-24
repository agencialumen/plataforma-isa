"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Eye, EyeOff, Lock, Mail, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { authService } from "@/lib/auth"

export default function AuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const paymentId = searchParams.get("payment_id")
  const plan = searchParams.get("plan")

  const [isLogin, setIsLogin] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      if (isLogin) {
        // Login
        await authService.signIn(formData.email, formData.password)
        setSuccess("Login realizado com sucesso!")
        setTimeout(() => router.push("/dashboard"), 1500)
      } else {
        // Registro
        if (formData.password !== formData.confirmPassword) {
          throw new Error("As senhas não coincidem")
        }

        if (!paymentId) {
          throw new Error("ID de pagamento não encontrado. Realize uma compra primeiro.")
        }

        await authService.signUpWithPayment(formData.email, formData.password, paymentId)
        setSuccess("Conta criada com sucesso! Redirecionando...")
        setTimeout(() => router.push("/dashboard"), 1500)
      }
    } catch (err: any) {
      setError(err.message || "Erro inesperado")
    } finally {
      setLoading(false)
    }
  }

  const getPlanInfo = () => {
    const plans = {
      basic: { name: "Básico", price: "R$ 19,90", color: "text-amber-400" },
      premium: { name: "Premium", price: "R$ 29,90", color: "text-rose-400" },
      diamond: { name: "Diamante", price: "R$ 99,90", color: "text-blue-400" },
    }
    return plans[plan as keyof typeof plans] || null
  }

  const planInfo = getPlanInfo()

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-zinc-800/50 backdrop-blur-md border border-zinc-700 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 bg-gradient-to-r from-rose-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Lock className="h-10 w-10 text-white" />
            </motion.div>

            <h1 className="text-2xl font-bold text-white mb-2">
              {isLogin ? "Entrar na Plataforma" : "Criar Sua Conta VIP"}
            </h1>

            {planInfo && !isLogin && (
              <div className="bg-zinc-700/50 rounded-lg p-3 mb-4">
                <p className="text-zinc-300 text-sm">Plano selecionado:</p>
                <p className={`font-bold ${planInfo.color}`}>
                  {planInfo.name} - {planInfo.price}/mês
                </p>
              </div>
            )}

            <p className="text-zinc-400 text-sm">
              {isLogin ? "Acesse seu conteúdo exclusivo" : "Complete seu cadastro para acessar o conteúdo VIP"}
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4 flex items-center gap-2"
            >
              <AlertCircle className="h-4 w-4 text-red-400" />
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-4 flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4 text-green-400" />
              <p className="text-green-400 text-sm">{success}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-zinc-300 text-sm font-medium mb-2">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-zinc-700/50 border border-zinc-600 rounded-lg py-3 pl-10 pr-4 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-zinc-300 text-sm font-medium mb-2">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                  className="w-full bg-zinc-700/50 border border-zinc-600 rounded-lg py-3 pl-10 pr-12 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                  placeholder="Sua senha"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password (only for signup) */}
            {!isLogin && (
              <div>
                <label className="block text-zinc-300 text-sm font-medium mb-2">Confirmar Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full bg-zinc-700/50 border border-zinc-600 rounded-lg py-3 pl-10 pr-4 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                    placeholder="Confirme sua senha"
                    minLength={6}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white font-medium py-3 rounded-lg transition-all duration-300 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {isLogin ? "Entrando..." : "Criando conta..."}
                </div>
              ) : isLogin ? (
                "Entrar"
              ) : (
                "Criar Conta VIP"
              )}
            </Button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              {isLogin ? (
                <>
                  Não tem conta? <span className="text-rose-400 font-medium">Criar conta</span>
                </>
              ) : (
                <>
                  Já tem conta? <span className="text-rose-400 font-medium">Fazer login</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
