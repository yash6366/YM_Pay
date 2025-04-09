"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ArrowLeft, Share2, HelpCircle, Users } from "lucide-react"
import { motion } from "framer-motion"

interface TransactionReceiptProps {
  title: string
  subtitle: string
  amount: number
  status: "completed" | "failed" | "pending"
  timestamp: string
  avatarText: string
  details: {
    label: string
    value: string
  }[]
  transactionId: string
  showSplitOption?: boolean
}

export default function TransactionReceipt({
  title,
  subtitle,
  amount,
  status,
  timestamp,
  avatarText,
  details,
  transactionId,
  showSplitOption = false,
}: TransactionReceiptProps) {
  const router = useRouter()

  const statusColors = {
    completed: "text-green-600",
    failed: "text-red-600",
    pending: "text-yellow-600",
  }

  return (
    <div className="container mx-auto max-w-sm py-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Header with back button */}
        <div className="flex justify-between items-center">
          <Button variant="ghost" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>

        {/* Main content */}
        <div className="text-center space-y-4">
          {/* Avatar */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-2xl font-bold text-white">
              {avatarText}
            </div>
          </div>

          {/* Title and Subtitle */}
          <div>
            <h2 className="text-lg font-medium">{title}</h2>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>

          {/* Amount */}
          <div className="text-4xl font-light">₹{amount}</div>

          {/* Status */}
          <div className={`flex items-center justify-center gap-2 ${statusColors[status]}`}>
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-sm capitalize">{status}</span>
          </div>

          {/* Timestamp */}
          <div className="text-sm text-gray-500">
            {new Date(timestamp).toLocaleString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              hour12: true
            })}
          </div>

          {/* Transaction details card */}
          <Card className="border-gray-200">
            <CardContent className="p-4 space-y-3">
              <div className="text-left space-y-3 text-sm">
                <div>
                  <p className="text-gray-500">Transaction ID</p>
                  <p className="font-mono">{transactionId}</p>
                </div>
                {details.map((detail, index) => (
                  <div key={index}>
                    <p className="text-gray-500">{detail.label}</p>
                    <p className="font-mono">{detail.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action buttons */}
          <div className="pt-2 pb-4">
            <div className="flex justify-around">
              <Button variant="ghost" size="sm" className="flex-col h-auto py-2">
                <HelpCircle className="h-5 w-5 mb-1" />
                <span className="text-xs">Help</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex-col h-auto py-2">
                <Share2 className="h-5 w-5 mb-1" />
                <span className="text-xs">Share</span>
              </Button>
              {showSplitOption && (
                <Button variant="ghost" size="sm" className="flex-col h-auto py-2">
                  <Users className="h-5 w-5 mb-1" />
                  <span className="text-xs">Split</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 