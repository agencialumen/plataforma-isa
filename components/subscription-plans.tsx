"use client"
import { Canvas } from "@react-three/fiber"
import type React from "react"

import { OrbitControls, Environment, Float, Text } from "@react-three/drei"
import { motion } from "framer-motion"
import { Suspense, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import type * as THREE from "three"
import { authService } from "@/lib/auth"

// Basic Plan 3D Model
const BasicModel = () => {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3
      meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group>
        <mesh ref={meshRef} castShadow receiveShadow>
          <torusGeometry args={[1, 0.4, 16, 32]} />
          <meshStandardMaterial
            color="#f87171"
            metalness={0.7}
            roughness={0.2}
            emissive="#ef4444"
            emissiveIntensity={0.2}
          />
        </mesh>
        <Text
          position={[0, -2, 0]}
          fontSize={0.5}
          color="white"
          font="/fonts/Inter_Bold.json"
          anchorX="center"
          anchorY="middle"
        >
          BÁSICO
        </Text>
      </group>
    </Float>
  )
}

// Premium Plan 3D Model
const PremiumModel = () => {
  const group = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.getElapsedTime() * 0.4
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={group}>
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#f43f5e"
            metalness={0.8}
            roughness={0.1}
            emissive="#e11d48"
            emissiveIntensity={0.3}
          />
        </mesh>
        <Text
          position={[0, -2, 0]}
          fontSize={0.5}
          color="white"
          font="/fonts/Inter_Bold.json"
          anchorX="center"
          anchorY="middle"
        >
          PREMIUM
        </Text>
      </group>
    </Float>
  )
}

// Diamond Plan 3D Model
const DiamondModel = () => {
  const group = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.getElapsedTime() * 0.5
      group.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.2
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.6}>
      <group ref={group}>
        <mesh castShadow receiveShadow>
          <octahedronGeometry args={[1, 0]} />
          <meshPhysicalMaterial
            color="#fcd34d"
            metalness={1}
            roughness={0.1}
            emissive="#f59e0b"
            emissiveIntensity={0.3}
            clearcoat={1}
            clearcoatRoughness={0.1}
            transmission={0.2}
          />
        </mesh>
        <Text
          position={[0, -2, 0]}
          fontSize={0.5}
          color="white"
          font="/fonts/Inter_Bold.json"
          anchorX="center"
          anchorY="middle"
        >
          DIAMANTE
        </Text>
      </group>
    </Float>
  )
}

// 3D Scene Component
const Scene = ({ children }: { children: React.ReactNode }) => {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      <Suspense fallback={null}>
        {children}
        <Environment preset="city" />
      </Suspense>
      <OrbitControls enableZoom={false} autoRotate={false} />
    </Canvas>
  )
}

// Subscription card component
const SubscriptionCard = ({ title, price, features, buttonText, model, popular = false, paymentLink, plan }) => {
  const handlePurchase = async () => {
    try {
      // Gerar ID único para o pagamento
      const paymentId = `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Criar registro de pagamento pendente
      const amount = Number.parseFloat(price.replace("R$", "").replace(",", "."))
      await authService.createPendingPayment("", plan, paymentId, amount)

      // Redirecionar para o checkout com o payment_id
      const checkoutUrl = `${paymentLink}?payment_id=${paymentId}&plan=${plan}`
      window.open(checkoutUrl, "_blank")
    } catch (error) {
      console.error("Erro ao processar compra:", error)
      // Fallback: abrir link direto
      window.open(paymentLink, "_blank")
    }
  }

  return (
    <motion.div
      whileHover={{
        y: -10,
        boxShadow: "0 20px 25px -5px rgba(244, 63, 94, 0.1), 0 10px 10px -5px rgba(244, 63, 94, 0.04)",
      }}
      transition={{ duration: 0.3 }}
      className={`bg-zinc-800 border ${popular ? "border-rose-500" : "border-zinc-700"} rounded-2xl overflow-hidden flex flex-col relative`}
    >
      {popular && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-rose-500 to-red-500 text-white text-xs px-4 py-1 rounded-bl-lg font-medium z-10">
          POPULAR
        </div>
      )}

      <div className="h-60 relative">
        <Scene>{model}</Scene>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <div className="mb-4">
          <p className="text-3xl font-bold text-white">{price}</p>
          <p className="text-zinc-400 text-sm">por mês</p>
        </div>

        <ul className="mb-6 flex-1">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 mb-2">
              <span className="text-rose-500 font-bold">✓</span>
              <span className="text-zinc-300 text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={handlePurchase}
          className={`w-full py-3 rounded-lg ${popular ? "bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600" : "bg-zinc-700 hover:bg-zinc-600"} text-white font-medium transition-all duration-300 text-center`}
        >
          {buttonText}
        </button>
      </div>
    </motion.div>
  )
}

export default function SubscriptionPlans() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="subscription">
      <SubscriptionCard
        title="Plano Básico"
        price="R$19,90"
        features={[
          "Acesso a conteúdo exclusivo",
          "Mensagens diretas limitadas",
          "Atualizações semanais",
          "Cancele a qualquer momento",
        ]}
        buttonText="ASSINAR BÁSICO"
        model={<BasicModel />}
        paymentLink="https://pay.kirvano.com/edf52b8b-6fba-4d9c-9038-a663ce40f862"
        plan="basic"
      />

      <SubscriptionCard
        title="Plano Premium"
        price="R$29,90"
        features={[
          "Tudo do plano Básico",
          "Mensagens diretas ilimitadas",
          "Conteúdo em alta resolução",
          "Atualizações diárias",
          "Prioridade no atendimento",
        ]}
        buttonText="ASSINAR PREMIUM"
        model={<PremiumModel />}
        popular={true}
        paymentLink="https://pay.kirvano.com/dce77bbb-23cd-4105-82b4-0f37e13fa618"
        plan="premium"
      />

      <SubscriptionCard
        title="Plano Diamante"
        price="R$99,90"
        features={[
          "Tudo do plano Premium",
          "Conteúdo exclusivo em 4K",
          "Acesso antecipado a novidades",
          "Chamadas de vídeo exclusivas",
          "Benefícios personalizados",
          "Suporte prioritário 24/7",
        ]}
        buttonText="ASSINAR DIAMANTE"
        model={<DiamondModel />}
        paymentLink="https://pay.kirvano.com/4386d038-4f5f-4b9e-bb04-72a7571bcbec"
        plan="diamond"
      />
    </div>
  )
}
