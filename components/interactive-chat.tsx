"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Send, ImageIcon, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import SubscriptionModal from "@/components/subscription-modal"

// Configuração centralizada - fácil de editar
const CHAT_CONFIG = {
  profileImage: "https://iili.io/3ZiexRf.md.jpg",
  title: "Chat Exclusivo",
  subtitle: "Disponível para assinantes do plano Diamante",
  buttonText: "LIBERAR CHAT",
  limitReachedMessage: {
    title: "Limite de conversa atingido",
    description: "Atualize para o plano Diamante para continuar conversando com Isabelle.",
    buttonText: "ASSINAR PLANO DIAMANTE",
  },
  conversationFlow: [
    {
      id: 1,
      type: "model-message",
      text: "Oi amor 😘",
    },
    {
      id: 2,
      type: "user-quick-replies",
      options: [
        { id: "reply1", text: "Oi linda" },
        { id: "reply2", text: "Oi, tudo bem?" },
        { id: "reply3", text: "Quero você" },
      ],
    },
    {
      id: 3,
      type: "model-typing",
      duration: 2000,
    },
    {
      id: 4,
      type: "model-message",
      text: "Que bom ter você aqui, você vai adorar! Estou procurando alguém especial 💋",
    },
    {
      id: 5,
      type: "model-typing",
      duration: 3000,
    },
    {
      id: 6,
      type: "model-message",
      text: "Podemos marcar encontros também, você aceitaria?",
    },
    {
      id: 7,
      type: "user-quick-replies",
      options: [
        { id: "reply4", text: "Sim" },
        { id: "reply5", text: "Claro amor" },
        { id: "reply6", text: "Quando podemos nos ver?" },
      ],
    },
    {
      id: 8,
      type: "model-typing",
      duration: 3500,
    },
    {
      id: 9,
      type: "model-message",
      text: "Pra isso você precisa me acompanhar na minha plataforma com o *Plano Diamante* e ficar entre os top 10 clientes",
    },
    {
      id: 10,
      type: "model-typing",
      duration: 2000,
    },
    {
      id: 11,
      type: "model-image",
      // Usando a imagem local como fallback e a URL externa como principal
      image: "https://iili.io/3tCU6Bt.jpg",
    },
    {
      id: 12,
      type: "limit-reached",
    },
  ],
  inputPlaceholder: "Digite sua mensagem...",
  typingText: "Isabelle está digitando...",
}

// Componente de bolha de mensagem
const MessageBubble = ({ message, isUser }) => {
  // Função para destacar texto entre asteriscos
  const formatHighlightedText = (text) => {
    if (!text.includes("*")) return <p className="text-sm">{text}</p>

    const parts = text.split(/(\*[^*]+\*)/g)
    return (
      <p className="text-sm">
        {parts.map((part, index) => {
          if (part.startsWith("*") && part.endsWith("*")) {
            const highlightedText = part.slice(1, -1)
            return (
              <span key={index} className="font-bold text-blue-300">
                {highlightedText}
              </span>
            )
          }
          return <span key={index}>{part}</span>
        })}
      </p>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}
    >
      {!isUser && (
        <div className="relative h-8 w-8 rounded-full overflow-hidden mr-2 mt-1">
          <Image src={CHAT_CONFIG.profileImage || "/placeholder.svg"} alt="Isabelle" fill className="object-cover" />
        </div>
      )}

      <div
        className={`max-w-[80%] rounded-2xl p-3 ${
          isUser ? "bg-rose-500 text-white rounded-tr-none" : "bg-zinc-700 text-white rounded-tl-none"
        }`}
      >
        {message.text && formatHighlightedText(message.text)}

        {message.image && (
          <div className="relative w-full h-48 rounded-lg overflow-hidden mb-2">
            <img src={message.image || "/placeholder.svg"} alt="Chat image" className="w-full h-full object-cover" />
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Componente de sugestões de resposta rápida
const QuickReplies = ({ options, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-2">
      {options.map((option) => (
        <motion.button
          key={option.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-zinc-700 hover:bg-zinc-600 text-white text-sm py-2 px-4 rounded-full"
          onClick={() => onSelect(option.text)}
        >
          {option.text}
        </motion.button>
      ))}
    </div>
  )
}

// Componente de indicador de digitação
const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-2 text-zinc-400 text-sm mb-3">
      <div className="relative h-8 w-8 rounded-full overflow-hidden mr-2">
        <Image src={CHAT_CONFIG.profileImage || "/placeholder.svg"} alt="Isabelle" fill className="object-cover" />
      </div>
      <div className="bg-zinc-700 rounded-2xl rounded-tl-none p-3 flex items-center">
        <div className="flex gap-1">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, delay: 0 }}
            className="h-2 w-2 bg-zinc-400 rounded-full"
          />
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, delay: 0.2 }}
            className="h-2 w-2 bg-zinc-400 rounded-full"
          />
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, delay: 0.4 }}
            className="h-2 w-2 bg-zinc-400 rounded-full"
          />
        </div>
      </div>
    </div>
  )
}

// Componente de limite atingido
const LimitReached = ({ onSubscribe, onOpenSubscriptionModal }) => {
  const { limitReachedMessage } = CHAT_CONFIG

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-zinc-800/70 backdrop-blur-md p-6 rounded-2xl flex flex-col items-center max-w-md text-center mx-auto my-4"
    >
      <div className="bg-zinc-700/50 p-4 rounded-full mb-4">
        <Lock className="h-8 w-8 text-zinc-300" />
      </div>

      <h3 className="text-lg font-medium text-white mb-2">{limitReachedMessage.title}</h3>
      <p className="text-zinc-400 mb-4 text-sm">{limitReachedMessage.description}</p>

      <Button
        onClick={onOpenSubscriptionModal}
        className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium transition-all duration-300 w-full"
      >
        {limitReachedMessage.buttonText}
      </Button>
    </motion.div>
  )
}

export function InteractiveChat() {
  const [message, setMessage] = useState("")
  const [chatStarted, setChatStarted] = useState(false)
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [showQuickReplies, setShowQuickReplies] = useState(false)
  const [quickReplyOptions, setQuickReplyOptions] = useState([])
  const [limitReached, setLimitReached] = useState(false)
  const messagesEndRef = useRef(null)
  const { conversationFlow } = CHAT_CONFIG
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)

  // Referência para controlar se o passo já foi processado
  const processedSteps = useRef(new Set())

  // Função para iniciar o chat
  const startChat = () => {
    setChatStarted(true)
    setCurrentStep(0)
    setMessages([])
    setShowQuickReplies(false)
    setQuickReplyOptions([])
    setLimitReached(false)
    processedSteps.current = new Set()

    // Iniciar o primeiro passo após um pequeno delay
    setTimeout(() => {
      handleStep(0)
    }, 500)
  }

  // Função para lidar com cada passo da conversa
  const handleStep = (stepIndex) => {
    if (stepIndex >= conversationFlow.length) return
    if (processedSteps.current.has(stepIndex)) return

    processedSteps.current.add(stepIndex)
    const step = conversationFlow[stepIndex]

    switch (step.type) {
      case "model-message":
        setMessages((prev) => [...prev, { id: `model-${Date.now()}`, text: step.text, sender: "model" }])
        setCurrentStep(stepIndex + 1)
        break

      case "model-typing":
        setIsTyping(true)
        setTimeout(() => {
          setIsTyping(false)
          setCurrentStep(stepIndex + 1)
        }, step.duration)
        break

      case "model-image":
        setMessages((prev) => [...prev, { id: `model-img-${Date.now()}`, image: step.image, sender: "model" }])
        setCurrentStep(stepIndex + 1)
        break

      case "user-quick-replies":
        setQuickReplyOptions(step.options)
        setShowQuickReplies(true)
        // Não avançamos para o próximo passo até que o usuário selecione uma resposta
        break

      case "limit-reached":
        setLimitReached(true)
        break

      default:
        setCurrentStep(stepIndex + 1)
        break
    }
  }

  // Efeito para processar o próximo passo quando o currentStep mudar
  useEffect(() => {
    if (chatStarted && currentStep < conversationFlow.length && !processedSteps.current.has(currentStep)) {
      handleStep(currentStep)
    }
  }, [chatStarted, currentStep])

  // Função para enviar uma mensagem do usuário
  const sendUserMessage = (text) => {
    setMessages((prev) => [...prev, { id: `user-${Date.now()}`, text, sender: "user" }])
    setShowQuickReplies(false)
    setCurrentStep((prev) => prev + 1)
  }

  // Função para simular assinatura do plano
  const handleSubscribe = () => {
    // Aqui você pode adicionar a lógica para abrir o modal de assinatura
    console.log("Abrir modal de assinatura do plano Diamante")
  }

  // Scroll para a última mensagem
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isTyping, limitReached, showQuickReplies])

  return (
    <div className="bg-zinc-800/30 rounded-xl overflow-hidden h-[600px] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-zinc-700 bg-zinc-800/50 flex items-center gap-3">
        <div className="relative h-10 w-10 rounded-full overflow-hidden">
          <Image src={CHAT_CONFIG.profileImage || "/placeholder.svg"} alt="Profile" fill className="object-cover" />
        </div>
        <div>
          <h3 className="font-medium text-white">{CHAT_CONFIG.title}</h3>
          <p className="text-zinc-400 text-xs">{CHAT_CONFIG.subtitle}</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-4 overflow-y-auto flex flex-col relative">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-red-500/5"></div>

        {!chatStarted ? (
          <div className="flex flex-col items-center justify-center h-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-zinc-800/70 backdrop-blur-md p-6 rounded-2xl flex flex-col items-center max-w-md text-center"
            >
              <div className="bg-zinc-700/50 p-6 rounded-full mb-6">
                <Image
                  src={CHAT_CONFIG.profileImage || "/placeholder.svg"}
                  alt="Isabelle"
                  width={80}
                  height={80}
                  className="rounded-full"
                />
              </div>

              <h3 className="text-xl font-medium text-white mb-3">Chat com Isabelle</h3>
              <p className="text-zinc-400 mb-6">
                Clique no botão abaixo para iniciar uma conversa com Isabelle. Ela está ansiosa para falar com você!
              </p>

              <Button
                onClick={startChat}
                className="bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white font-medium transition-all duration-300 w-full"
              >
                {CHAT_CONFIG.buttonText}
              </Button>
            </motion.div>
          </div>
        ) : (
          <div className="space-y-1 py-2 flex-1">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} isUser={msg.sender === "user"} />
            ))}

            {isTyping && <TypingIndicator />}

            {limitReached && (
              <LimitReached
                onSubscribe={handleSubscribe}
                onOpenSubscriptionModal={() => setShowSubscriptionModal(true)}
              />
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area com Sugestões de Resposta */}
      <div className="border-t border-zinc-700 bg-zinc-800/50">
        {/* Sugestões de resposta rápida */}
        {showQuickReplies && (
          <div className="px-4 pt-3">
            <QuickReplies options={quickReplyOptions} onSelect={sendUserMessage} />
          </div>
        )}

        {/* Input de mensagem */}
        <div className="p-4">
          <div className="relative">
            <input
              type="text"
              placeholder={CHAT_CONFIG.inputPlaceholder}
              className="w-full bg-zinc-700/50 text-zinc-400 rounded-full py-3 pl-4 pr-24 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && message.trim() && chatStarted && showQuickReplies && !limitReached) {
                  sendUserMessage(message)
                  setMessage("")
                }
              }}
              disabled={!chatStarted || isTyping || !showQuickReplies || limitReached}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
              <Button
                size="icon"
                className="h-8 w-8 rounded-full bg-zinc-600 text-zinc-400"
                disabled={!chatStarted || isTyping || limitReached}
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                className="h-8 w-8 rounded-full bg-rose-500 text-white"
                disabled={!message.trim() || !chatStarted || isTyping || !showQuickReplies || limitReached}
                onClick={() => {
                  if (message.trim()) {
                    sendUserMessage(message)
                    setMessage("")
                  }
                }}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <SubscriptionModal open={showSubscriptionModal} onOpenChange={setShowSubscriptionModal} />
    </div>
  )
}
