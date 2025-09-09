import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "BTN Token - Revolutionary Blockchain Mining",
  description: "Browser-based blockchain mining with AI consensus and P2P networking. Real mainnet deployment.",
  keywords: "blockchain, mining, cryptocurrency, BTN token, AI consensus, P2P network",
  openGraph: {
    title: "BTN Token - Revolutionary Blockchain Mining",
    description: "Browser-based blockchain mining with AI consensus and P2P networking",
    siteName: "BTN Token",
    images: [
      {
        url: "/golden-mining-pickaxe-with-blockchain-background.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BTN Token - Revolutionary Blockchain Mining",
    description: "Browser-based blockchain mining with AI consensus and P2P networking",
    images: ["/golden-mining-pickaxe-with-blockchain-background.jpg"],
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} relative bg-gradient-to-br from-indigo-100/70 via-blue-200/60 to-purple-100/70 min-h-screen overflow-x-hidden perspective-3d preserve-3d`}>
        {/* Layered animated SVG backgrounds */}
        <svg className="absolute top-0 left-0 w-full h-full -z-10 animate-pulse" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bg-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="#6366f1" stopOpacity="0.2" />
              <stop offset="1" stopColor="#a78bfa" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path fill="url(#bg-gradient)" d="M0,160L60,149.3C120,139,240,117,360,138.7C480,160,600,224,720,229.3C840,235,960,181,1080,154.7C1200,128,1320,128,1380,128L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
        </svg>
        <svg className="absolute top-0 left-0 w-full h-1/2 -z-20 animate-[pulse_8s_ease-in-out_infinite]" viewBox="0 0 1440 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="radial-gradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#a5b4fc" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="720" cy="80" rx="600" ry="60" fill="url(#radial-gradient)" />
        </svg>
        <svg className="absolute bottom-0 right-0 w-1/2 h-1/3 -z-20 animate-[pulse_12s_ease-in-out_infinite]" viewBox="0 0 720 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="side-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#c7d2fe" stopOpacity="0.12" />
              <stop offset="1" stopColor="#f0abfc" stopOpacity="0.08" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="720" height="120" fill="url(#side-gradient)" rx="60" />
        </svg>
        {/* Enhanced navigation bar with 3D and parallax */}
        <nav className="w-full flex justify-center gap-8 py-4 bg-white/60 border-b mb-8 backdrop-blur-lg shadow-2xl rounded-b-xl transition-all duration-700 translate-z-3d-nav">
            <Link href="/" className="font-semibold flex items-center gap-2 transition-transform hover:scale-110 hover:-rotate-x-3 hover:shadow-xl duration-500 translate-z-3d-link">
              <Image src="/placeholder-logo.svg" alt="Dashboard" width={24} height={24} className="w-6 h-6 drop-shadow-lg" /> Dashboard
            </Link>
          <a href="/wallet" className="font-semibold flex items-center gap-2 transition-transform hover:scale-110 hover:rotate-y-3 hover:shadow-xl duration-500 translate-z-3d-link">
            <svg className="w-5 h-5 text-indigo-500 drop-shadow-md" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="10" rx="2" /><path d="M16 11h.01" /></svg> Wallet
          </a>
          <a href="/profile" className="font-semibold flex items-center gap-2 transition-transform hover:scale-110 hover:-rotate-y-3 hover:shadow-xl duration-500 translate-z-3d-link">
            <svg className="w-5 h-5 text-purple-500 drop-shadow-md" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" /></svg> Profile
          </a>
        </nav>
        {/* Main content with parallax and 3D card effect */}
        <main className="relative z-10 translate-z-3d-main">
          <Suspense fallback={null}>
            <div className="transition-transform duration-700 will-change-transform translate-z-3d-main">
              {children}
            </div>
          </Suspense>
        </main>
      </body>
    </html>
  )
}
