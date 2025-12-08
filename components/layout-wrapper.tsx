"use client"

import { usePathname } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import WhatsAppButton from "@/components/whatsapp-button"

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isAdmin = pathname?.startsWith("/admin")

    return (
        <>
            {!isAdmin && <Header />}
            {children}
            {!isAdmin && <Footer />}
            {!isAdmin && <WhatsAppButton />}
        </>
    )
}
