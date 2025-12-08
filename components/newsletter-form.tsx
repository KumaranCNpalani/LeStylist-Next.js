"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Success!",
        description: "You've been added to our newsletter.",
      })
      setEmail("")
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <div id="newsletter" className="w-full">
      <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="h-10 rounded-md"
        />
        <Button
          type="submit"
          className="h-10 bg-primary hover:bg-primary/90 text-white font-medium"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Subscribing..." : "Stay Updated"}
        </Button>
      </form>
      <p className="mt-2 text-xs text-muted-foreground">No spam. Just stories and launch updates.</p>
      <Toaster />
    </div>
  )
}
