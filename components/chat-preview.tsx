"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import SubscriptionModal from "@/components/subscription-modal"

// Configuração centralizada - fácil de editar
const CHAT_CONFIG = {
  profileImage: "https://iili.io/3ZiexRf.md.jpg",
  title: "Chat Exclusivo",
  subtitle: "Disponível para assinantes",
  lockMessage: {
    title: "Chat bloqueado",
    description:
      "Assine um dos nossos planos para desbloquear o chat e conversar diretamente comigo. Respondo todas as mensagens pessoalmente!",
    buttonText: "ASSINAR PARA DESBLOQUEAR",
  },
  inputPlaceholder: "Mensagem bloqueada. Assine para conversar...",
}

export function ChatPreview() {
  const [message, setMessage] = useState("")
  const { profileImage, title, subtitle, lockMessage, inputPlaceholder } = CHAT_CONFIG
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)

  return (
    <div className="bg-zinc-800/30 rounded-xl overflow-hidden h-[600px] flex flex-col">
      <div className="p-4 border-b border-zinc-700 bg-zinc-800/50 flex items-center gap-3">
        <div className="relative h-10 w-10 rounded-full overflow-hidden">
          <Image src={profileImage || "/placeholder.svg"} alt="Profile" fill className="object-cover" />
        </div>
        <div>
          <h3 className="font-medium text-white">{title}</h3>
          <p className="text-zinc-400 text-xs">{subtitle}</p>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto flex flex-col items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-red-500/5"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-zinc-800/70 backdrop-blur-md p-8 rounded-2xl flex flex-col items-center max-w-md text-center"
        >
          <div className="bg-zinc-700/50 p-6 rounded-full mb-6">
            <Lock className="h-12 w-12 text-zinc-300" />
          </div>

          <h3 className="text-xl font-medium text-white mb-3">{lockMessage.title}</h3>
          <p className="text-zinc-400 mb-6">{lockMessage.description}</p>

          <Button
            size="lg"
            onClick={() => setShowSubscriptionModal(true)}
            className="bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white font-medium transition-all duration-300 w-full"
          >
            {lockMessage.buttonText}
          </Button>
        </motion.div>
      </div>

      <div className="p-4 border-t border-zinc-700 bg-zinc-800/50">
        <div className="relative">
          <input
            type="text"
            placeholder={inputPlaceholder}
            className="w-full bg-zinc-700/50 text-zinc-400 rounded-full py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <Button size="icon" className="h-8 w-8 rounded-full bg-zinc-600 text-zinc-400" disabled>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <SubscriptionModal open={showSubscriptionModal} onOpenChange={setShowSubscriptionModal} />
    </div>
  )
}
