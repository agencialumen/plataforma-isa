"use client"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import NextImage from "next/image"
import { motion } from "framer-motion"
import { useState } from "react"
import { Check, Diamond, Star, Flame } from "lucide-react"

// Configuração centralizada dos planos - fácil de editar
const SUBSCRIPTION_PLANS = [
  {
    id: "basic",
    title: "Plano Básico",
    price: "R$19,90",
    popular: false,
    imageSrc: "https://iili.io/3ZTyBXs.jpg", // Exemplo de imagem externa
    icon: <Star className="h-5 w-5 text-amber-400" />,
    color: "from-amber-500 to-amber-600",
    features: [
      "Acesso a conteúdo exclusivo",
      "Mensagens diretas limitadas",
      "Atualizações semanais",
      "Cancele a qualquer momento",
    ],
    buttonText: "ASSINAR BÁSICO",
    buttonColor: "bg-zinc-700 hover:bg-zinc-600",
    paymentLink: "https://pay.kirvano.com/edf52b8b-6fba-4d9c-9038-a663ce40f862",
  },
  {
    id: "premium",
    title: "Plano Premium",
    price: "R$29,90",
    popular: true,
    imageSrc: "https://iili.io/3ZTyBXs.jpg", // Imagem local
    icon: <Flame className="h-5 w-5 text-rose-400" />,
    color: "from-rose-500 to-red-500",
    features: [
      "Tudo do plano Básico",
      "Mensagens diretas ilimitadas",
      "Conteúdo em alta resolução",
      "Atualizações diárias",
      "Prioridade no atendimento",
    ],
    buttonText: "ASSINAR PREMIUM",
    buttonColor: "bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600",
    paymentLink: "https://pay.kirvano.com/dce77bbb-23cd-4105-82b4-0f37e13fa618",
  },
  {
    id: "diamond",
    title: "Plano Diamante",
    price: "R$99,90",
    popular: false,
    imageSrc: "https://iili.io/3ZTyBXs.jpg", // Imagem local
    icon: <Diamond className="h-5 w-5 text-blue-400" />,
    color: "from-blue-500 to-indigo-500",
    features: [
      "Tudo do plano Premium",
      "Conteúdo exclusivo em 4K",
      "Acesso antecipado a novidades",
      "Chat privado desbloqueado",
      "Possibilidade de encontros",
      "Suporte prioritário 24/7",
    ],
    buttonText: "ASSINAR DIAMANTE",
    buttonColor: "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600",
    paymentLink: "https://pay.kirvano.com/4386d038-4f5f-4b9e-bb04-72a7571bcbec",
  },
]

// Componente de card de assinatura para dispositivos móveis
const MobileSubscriptionCard = ({ plan, isSelected, onSelect }) => {
  const { id, title, price, popular, icon, color, features, buttonText, buttonColor, paymentLink } = plan

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-zinc-900 border-2 ${
        isSelected ? `border-gradient-to-r ${color}` : popular ? "border-rose-500" : "border-zinc-800"
      } rounded-xl overflow-hidden relative mb-4`}
      onClick={() => onSelect(id)}
    >
      {popular && (
        <div
          className={`absolute top-0 right-0 bg-gradient-to-r ${color} text-white text-xs px-3 py-1 rounded-bl-lg font-medium z-10`}
        >
          POPULAR
        </div>
      )}

      <div className="flex justify-between items-center p-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-full bg-gradient-to-r ${color}`}>{icon}</div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">{price}</p>
          <p className="text-zinc-400 text-xs">por mês</p>
        </div>
      </div>

      <div className="p-4">
        <ul className="mb-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 mb-2">
              <Check className="h-5 w-5 text-rose-500" />
              <span className="text-zinc-300 text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        <a
          href={paymentLink}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full py-3 rounded-lg ${buttonColor} text-white font-medium transition-all duration-300 text-sm text-center block`}
        >
          {buttonText}
        </a>
      </div>
    </motion.div>
  )
}

// Componente de card de assinatura para desktop
const DesktopSubscriptionCard = ({ plan, isSelected, onSelect }) => {
  const { id, title, price, popular, imageSrc, icon, color, features, buttonText, buttonColor, paymentLink } = plan

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className={`bg-zinc-900 border-2 ${
        isSelected ? `border-gradient-to-r ${color}` : popular ? "border-rose-500" : "border-zinc-800"
      } rounded-xl overflow-hidden flex flex-col relative cursor-pointer`}
      onClick={() => onSelect(id)}
    >
      {popular && (
        <div
          className={`absolute top-0 right-0 bg-gradient-to-r ${color} text-white text-xs px-3 py-1 rounded-bl-lg font-medium z-10`}
        >
          POPULAR
        </div>
      )}

      <div className="relative">
        <div className="aspect-[16/9] w-full relative overflow-hidden">
          <NextImage
            src={imageSrc || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/70 to-transparent"></div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center gap-2">
          <div className={`p-2 rounded-full bg-gradient-to-r ${color}`}>{icon}</div>
          <h3 className="text-lg font-bold text-white">{title}</h3>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="mb-3 text-center">
          <p className="text-2xl font-bold text-white leading-tight">{price}</p>
          <p className="text-zinc-400 text-xs leading-tight">por mês</p>
        </div>

        <ul className="mb-4 flex-1">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 mb-2 text-sm">
              <Check className="h-5 w-5 text-rose-500" />
              <span className="text-zinc-300">{feature}</span>
            </li>
          ))}
        </ul>

        <a
          href={paymentLink}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full py-3 rounded-lg ${buttonColor} text-white font-medium transition-all duration-300 text-center block`}
        >
          {buttonText}
        </a>
      </div>
    </motion.div>
  )
}

interface SubscriptionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function SubscriptionModal({ open, onOpenChange }: SubscriptionModalProps) {
  const [selectedPlan, setSelectedPlan] = useState("premium")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 p-0 sm:max-w-md md:max-w-3xl w-[95%] mx-auto overflow-y-auto max-h-[90vh]">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-2 bg-gradient-to-r from-rose-400 to-red-500 bg-clip-text text-transparent text-center">
            Escolha seu plano de assinatura
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-center text-sm mb-4">
            Acesse conteúdo exclusivo com um dos nossos planos. Quanto mais premium o plano, mais benefícios você terá.
          </p>

          {/* Layout para dispositivos móveis - visível apenas em telas pequenas */}
          <div className="md:hidden">
            {SUBSCRIPTION_PLANS.map((plan) => (
              <MobileSubscriptionCard
                key={plan.id}
                plan={plan}
                isSelected={selectedPlan === plan.id}
                onSelect={setSelectedPlan}
              />
            ))}
          </div>

          {/* Layout para desktop - visível apenas em telas médias e grandes */}
          <div className="hidden md:grid md:grid-cols-3 gap-4">
            {SUBSCRIPTION_PLANS.map((plan) => (
              <DesktopSubscriptionCard
                key={plan.id}
                plan={plan}
                isSelected={selectedPlan === plan.id}
                onSelect={setSelectedPlan}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
