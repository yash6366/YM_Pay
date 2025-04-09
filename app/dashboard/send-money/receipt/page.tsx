"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Download, Share2 } from "lucide-react"
import { generatePaymentId, generateUpiTransactionId } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

interface ReceiptData {
  amount: string
  receiverName: string
  receiverPhone: string
  description?: string
  timestamp: string
  upiTransactionId: string
  paymentId: string
}

export default function SendMoneyReceiptPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [transactionData, setTransactionData] = useState<ReceiptData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const dataParam = searchParams.get("data")
      if (!dataParam) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No transaction data found",
        })
        router.replace("/dashboard")
        return
      }

      const data = JSON.parse(decodeURIComponent(dataParam))
      setTransactionData({
        ...data,
        timestamp: new Date().toLocaleString(),
        upiTransactionId: generateUpiTransactionId(),
        paymentId: generatePaymentId()
      })
    } catch (error) {
      console.error("Failed to parse transaction data:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load receipt data",
      })
      router.replace("/dashboard")
    } finally {
      setIsLoading(false)
    }
  }, [searchParams, router, toast])

  const handleDownload = () => {
    if (!transactionData) return

    const receiptText = `
      DigiPay - Money Transfer Receipt
      ----------------------------------------
      Amount: ₹${transactionData.amount}
      To: ${transactionData.receiverName}
      Phone: ${transactionData.receiverPhone}
      Date & Time: ${transactionData.timestamp}
      UPI Transaction ID: ${transactionData.upiTransactionId}
      Payment ID: ${transactionData.paymentId}
      ${transactionData.description ? `Description: ${transactionData.description}` : ''}
      ----------------------------------------
      Thank you for using DigiPay!
    `

    const blob = new Blob([receiptText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `digipay-receipt-${transactionData.paymentId}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleShare = () => {
    if (!transactionData) return

    const shareText = `I just sent ₹${transactionData.amount} to ${transactionData.receiverName} using DigiPay! Transaction ID: ${transactionData.upiTransactionId}`

    if (navigator.share) {
      navigator.share({
        title: "DigiPay Money Transfer",
        text: shareText,
      }).catch((error) => console.error("Error sharing:", error))
    } else {
      navigator.clipboard.writeText(shareText)
        .then(() => {
          toast({
            title: "Copied to clipboard",
            description: "Receipt details copied to clipboard",
          })
        })
        .catch((error) => console.error("Error copying to clipboard:", error))
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-md py-8 flex justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent"></div>
      </div>
    )
  }

  if (!transactionData) {
    return null
  }

  return (
    <div className="container mx-auto max-w-md py-8">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
          <CardDescription>Your money has been sent successfully</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-4xl font-bold">₹{transactionData.amount}</p>
              <p className="text-sm text-gray-500 mt-1">Amount Sent</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <p className="text-sm text-gray-500">To</p>
                <p className="text-sm font-medium">{transactionData.receiverName}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="text-sm font-medium">{transactionData.receiverPhone}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-500">Date & Time</p>
                <p className="text-sm font-medium">{transactionData.timestamp}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-500">UPI Transaction ID</p>
                <p className="text-sm font-medium font-mono">{transactionData.upiTransactionId}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-500">Payment ID</p>
                <p className="text-sm font-medium font-mono">{transactionData.paymentId}</p>
              </div>
              {transactionData.description && (
                <div className="flex justify-between">
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="text-sm font-medium">{transactionData.description}</p>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" className="flex-1" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button variant="outline" className="flex-1" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>

            <div className="pt-2">
              <Button className="w-full" onClick={() => router.push("/dashboard")}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 