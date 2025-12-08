import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import "./globals.css"
import LayoutWrapper from "@/components/layout-wrapper"
import { Toaster } from "sonner"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Lé Stylist Family Salon & Bridal Studio | Premium Beauty Services in Avadi, Tamil Nadu",
  description:
    "Experience premium salon services and bridal makeovers at Lé Stylist Family Salon & Bridal Studio in Avadi. Book appointments for haircuts, styling, makeup, spa treatments, and more.",
  keywords: "salon, bridal studio, haircut, styling, makeup, spa, Avadi, Tamil Nadu, beauty salon, Lé Stylist, Family Salon",
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="stylesheet" href="https://fonts.cdnfonts.com/css/footlight-mt-light" />
        <link rel="stylesheet" href="https://fonts.cdnfonts.com/css/edwardian-script-itc" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <LayoutWrapper>
          <main>{children}</main>
        </LayoutWrapper>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
