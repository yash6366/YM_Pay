"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardNav } from "@/components/dashboard-nav"
import { useToast } from "@/components/ui/use-toast"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me")
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Authentication failed")
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Auth error:", error)
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Please log in again",
        })
        router.replace("/login")
      }
    }

    checkAuth()
  }, [router, toast])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#B8860B] border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardNav />
      <main className="flex-1 bg-gray-50 p-4">{children}</main>
    </div>
  )
}

