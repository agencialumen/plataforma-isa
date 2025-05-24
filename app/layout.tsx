import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Isabelle Lua - Conteúdo Exclusivo VIP | Plataforma Premium",
  description:
    "Acesse conteúdo exclusivo da Isabelle Lua. Fotos, vídeos em alta qualidade e chat privado. Planos a partir de R$19,90. Assine agora e tenha acesso VIP!",
  keywords:
    "Isabelle Lua, conteúdo exclusivo, VIP, premium, fotos exclusivas, vídeos, chat privado, assinatura, OnlyFans brasileiro",
  authors: [{ name: "Isabelle Lua" }],
  creator: "Isabelle Lua",
  publisher: "Isabelle Lua",
  robots: "index, follow",

  // Open Graph (Facebook, WhatsApp, Telegram)
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://isa-privadinho.netlify.app/",
    siteName: "Isabelle Lua - Conteúdo Exclusivo",
    title: "Isabelle Lua 🔥 Conteúdo Exclusivo VIP",
    description:
      "💋 Acesse meu conteúdo mais íntimo e exclusivo! Fotos sensuais, vídeos em 4K e chat privado comigo. Planos a partir de R$19,90/mês. Entre para o meu mundo VIP! 🌟",
    images: [
      {
        url: "https://isa-privadinho.netlify.app/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Isabelle Lua - Conteúdo Exclusivo VIP",
        type: "image/jpeg",
      },
      {
        url: "https://isa-privadinho.netlify.app/images/profile-cover.jpg",
        width: 1200,
        height: 630,
        alt: "Isabelle Lua Profile",
        type: "image/jpeg",
      },
    ],
  },

  // Twitter Cards
  twitter: {
    card: "summary_large_image",
    site: "@belinha.ofc",
    creator: "@belinha.ofc",
    title: "Isabelle Lua 🔥 Conteúdo Exclusivo VIP",
    description:
      "💋 Acesse meu conteúdo mais íntimo! Fotos sensuais, vídeos 4K e chat privado. Planos VIP a partir de R$19,90. Entre para o meu mundo exclusivo! 🌟",
    images: {
      url: "https://isa-privadinho.netlify.app/images/og-image.jpg",
      alt: "Isabelle Lua - Conteúdo Exclusivo VIP",
    },
  },

  // Verificação e outros
  verification: {
    google: "your-google-verification-code", // Substitua pelo seu código do Google
  },

  // Configurações adicionais
  category: "entertainment",
  classification: "adult",

  // Meta tags adicionais
  other: {
    "theme-color": "#f43f5e",
    "msapplication-TileColor": "#f43f5e",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "format-detection": "telephone=no",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Preload critical resources */}
        <link rel="preload" href="/images/profile-avatar.jpg" as="image" />
        <link rel="preload" href="/images/profile-cover.jpg" as="image" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://isa-privadinho.netlify.app/" />

        {/* Additional meta tags for better SEO */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Isabelle Lua",
              alternateName: "@belinha.ofc",
              description: "Criadora de conteúdo exclusivo premium",
              url: "https://isa-privadinho.netlify.app/",
              image: "https://isa-privadinho.netlify.app/images/profile-avatar.jpg",
              sameAs: ["https://instagram.com/belinha.ofc", "https://twitter.com/belinha.ofc"],
              offers: {
                "@type": "Offer",
                name: "Planos de Assinatura VIP",
                description: "Acesso a conteúdo exclusivo premium",
                price: "19.90",
                priceCurrency: "BRL",
                availability: "https://schema.org/InStock",
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
