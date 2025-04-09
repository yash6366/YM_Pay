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
  billType: string
  provider: string
  accountNumber: string
  customerName: string
  billNumber: string
  dueDate: string
  timestamp: string
  upiTransactionId: string
  paymentId: string
}

export default function BillReceiptPage() {
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
      DigiPay - Bill Payment Receipt
      ----------------------------------------
      Amount: ₹${transactionData.amount}
      Bill Type: ${transactionData.billType}
      Provider: ${transactionData.provider}
      Account Number: ${transactionData.accountNumber}
      Customer Name: ${transactionData.customerName}
      Bill Number: ${transactionData.billNumber}
      Due Date: ${transactionData.dueDate}
      Date & Time: ${transactionData.timestamp}
      UPI Transaction ID: ${transactionData.upiTransactionId}
      Payment ID: ${transactionData.paymentId}
      ----------------------------------------
      Thank you for using DigiPay!
    `

    const blob = new Blob([receiptText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `digipay-bill-receipt-${transactionData.paymentId}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleShare = () => {
    if (!transactionData) return

    const shareText = `I just paid ₹${transactionData.amount} for my ${transactionData.billType} bill using DigiPay! Transaction ID: ${transactionData.upiTransactionId}`

    if (navigator.share) {
      navigator.share({
        title: "DigiPay Bill Payment",
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
          <CardDescription>Your bill has been paid successfully</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-4xl font-bold">₹{transactionData.amount}</p>
              <p className="text-sm text-gray-500 mt-1">Amount Paid</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <p className="text-sm text-gray-500">Bill Type</p>
                <p className="text-sm font-medium capitalize">{transactionData.billType}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-500">Provider</p>
                <p className="text-sm font-medium">{transactionData.provider}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-500">Account Number</p>
                <p className="text-sm font-medium">{transactionData.accountNumber}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-500">Customer Name</p>
                <p className="text-sm font-medium">{transactionData.customerName}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-500">Bill Number</p>
                <p className="text-sm font-medium">{transactionData.billNumber}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-500">Due Date</p>
                <p className="text-sm font-medium">{transactionData.dueDate}</p>
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