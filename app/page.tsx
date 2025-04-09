"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle, Shield, Zap, CreditCard, Smartphone, Receipt, Ticket, ShoppingBag, Gift, TrendingUp } from "lucide-react"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time for animation
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      {isLoading ? (
        <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-[#0A2540] via-[#1A3D5C] to-[#0A2540]">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <motion.img
              src="/images/YM-Pay-logo.jpg"
              alt="YM-Pay Logo"
              className="h-80 w-80 rounded-full p-2 bg-white/10 backdrop-blur-sm ring-2 ring-blue-400/30 shadow-[0_0_30px_rgba(59,130,246,0.3)] object-cover"
              animate={{
                y: [0, -10, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 1.5,
                ease: "easeInOut",
                repeat: Number.POSITIVE_INFINITY,
              }}
            />
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-6 text-4xl font-bold text-white"
            >
              YM-Pay
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-3 text-white text-xl font-light"
            >
              Powering your payments, simplifying your life
            </motion.p>
          </motion.div>
        </div>
      ) : (
        <>
          <header className="bg-gradient-to-r from-[#0A2540] to-[#1A3D5C] py-4 shadow-lg">
            <div className="container mx-auto px-4 flex items-center justify-between">
              <div className="flex items-center">
                <img src="/images/YM-Pay-logo.jpg" alt="YM-Pay Logo" className="h-24 w-24 mr-3 rounded-full p-2 bg-white/10 backdrop-blur-sm ring-2 ring-blue-400/30 shadow-[0_0_30px_rgba(59,130,246,0.3)] object-cover" />
                <h1 className="text-2xl font-bold text-white">YM-Pay</h1>
              </div>
              <div className="hidden md:flex space-x-4">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  <Link href="/login">Login</Link>
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all">
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            </div>
          </header>
          <main className="flex-1">
            <section className="bg-gradient-to-b from-[#0A2540] to-[#1A3D5C] py-24 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10"></div>
              <div className="container mx-auto px-4 text-center relative z-10">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="mb-6 text-5xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent"
                >
                  Fast, Secure Payments
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mb-10 text-xl max-w-2xl mx-auto text-blue-100"
                >
                  Send and receive money instantly with our secure platform. Experience the future of digital payments.
                </motion.p>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex justify-center gap-6"
                >
                  <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
                    <Link href="/signup">Get Started</Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    className="bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 px-8 py-6 text-lg rounded-full border border-white/30 shadow-lg hover:shadow-xl transition-all"
                  >
                    <Link href="/login">Login</Link>
                  </Button>
                </motion.div>
              </div>
            </section>

            <section className="py-20 bg-gray-50">
              <div className="container mx-auto px-4">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="mb-16 text-center text-4xl font-bold text-gray-900"
                >
                  Our Services
                </motion.h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                  {[
                    { title: "Send Money", icon: <Zap className="h-10 w-10 text-blue-500" />, desc: "Transfer instantly to anyone" },
                    { title: "Mobile Recharge", icon: <Smartphone className="h-10 w-10 text-blue-500" />, desc: "Prepaid & postpaid recharges" },
                    { title: "Pay Bills", icon: <Receipt className="h-10 w-10 text-blue-500" />, desc: "Electricity, water & more" },
                    { title: "Book Tickets", icon: <Ticket className="h-10 w-10 text-blue-500" />, desc: "Movies, travel & events" },
                    { title: "Shop Online", icon: <ShoppingBag className="h-10 w-10 text-blue-500" />, desc: "Pay securely at checkout" },
                    { title: "Investments", icon: <TrendingUp className="h-10 w-10 text-blue-500" />, desc: "Grow your wealth" },
                    { title: "Insurance", icon: <Shield className="h-10 w-10 text-blue-500" />, desc: "Protect what matters" },
                    { title: "Rewards", icon: <Gift className="h-10 w-10 text-blue-500" />, desc: "Earn on every transaction" },
                  ].map((service, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex flex-col items-center text-center p-8 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all border border-gray-100 hover:border-blue-500/30 hover:-translate-y-1"
                    >
                      <div className="mb-4">{service.icon}</div>
                      <h3 className="text-xl font-semibold mb-3 text-gray-900">{service.title}</h3>
                      <p className="text-gray-600">{service.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="mb-6 text-4xl font-bold text-gray-900"
                  >
                    Why Choose YM-Pay?
                  </motion.h2>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="mb-10 text-xl text-gray-600"
                  >
                    We provide a secure, fast, and user-friendly platform for all your payment needs.
                  </motion.p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {[
                      { title: "Secure Transactions", desc: "Bank-grade encryption for all your payments" },
                      { title: "Instant Transfers", desc: "Send money in seconds to anyone, anywhere" },
                      { title: "24/7 Support", desc: "Our team is always here to help you" },
                    ].map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                        viewport={{ once: true }}
                        className="p-6 rounded-xl bg-white shadow-md hover:shadow-lg transition-all"
                      >
                        <div className="flex items-center justify-center mb-4">
                          <CheckCircle className="h-8 w-8 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                        <p className="text-gray-600">{feature.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="flex justify-center"
                  >
                    <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
                      <Link href="/signup">Join YM-Pay Today</Link>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </section>
          </main>
          <footer className="bg-[#0A2540] py-10">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center mb-6 md:mb-0">
                  <img src="/images/YM-Pay-logo.jpg" alt="YM-Pay Logo" className="h-20 w-20 mr-3 rounded-full p-2 bg-white/10 backdrop-blur-sm ring-2 ring-blue-400/30 shadow-[0_0_30px_rgba(59,130,246,0.3)] object-cover" />
                  <span className="text-white text-xl font-bold">YM-Pay</span>
                </div>
                <div className="text-center md:text-right text-gray-400">
                  <p>© {new Date().getFullYear()} YM-Pay. All rights reserved.</p>
                </div>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  )
}

