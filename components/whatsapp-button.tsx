import Link from "next/link"
import { MessageCircle } from "lucide-react"

export default function WhatsAppButton() {
  return (
    <Link
      href="https://wa.me/918939501637"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg whatsapp-button"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </Link>
  )
}
