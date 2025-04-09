"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, User, Wallet, Home, History, Bell } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"

export function DashboardNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })

      toast({
        title: "Logged out successfully",
      })

      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/dashboard/send-money", icon: Wallet, label: "Send Money" },
    { href: "/dashboard/transactions", icon: History, label: "Transactions" },
  ]

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="border-b bg-white shadow-md sticky top-0 z-50"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center text-xl font-bold">
            <motion.img
              src="/images/YM-Pay-logo.jpg"
              alt="YM-Pay Logo"
              className="h-14 w-14 mr-3 rounded-full p-1 bg-white/10 backdrop-blur-sm ring-1 ring-sky-400/20 shadow-[0_0_20px_rgba(14,165,233,0.2)] object-cover"
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
            <span className="bg-gradient-to-r from-sky-600 to-sky-400 bg-clip-text text-transparent font-extrabold text-2xl">
              YM-Pay
            </span>
          </Link>
          <nav className="hidden md:flex md:gap-1">
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    pathname === item.href
                      ? "text-sky-600 bg-sky-50 font-medium"
                      : "text-gray-600 hover:text-sky-600 hover:bg-sky-50"
                  }`}
                >
                  <item.icon className={`h-4 w-4 ${pathname === item.href ? "text-sky-600" : "text-gray-500"}`} />
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-sky-50 text-gray-600 hover:text-sky-600"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            <span className="sr-only">Notifications</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-sky-50 text-gray-600 hover:text-sky-600"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Logout</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="hover:bg-sky-50 text-gray-600 hover:text-sky-600"
          >
            <Link href="/dashboard/profile">
              <User className="h-5 w-5" />
              <span className="sr-only">Profile</span>
            </Link>
          </Button>
        </div>
      </div>
    </motion.header>
  )
}

