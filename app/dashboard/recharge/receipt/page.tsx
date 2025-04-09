"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Download, Share2 } from "lucide-react"
import { generatePaymentId, generateUpiTransactionId } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

interface ReceiptData {
  amount: number
  mobileNumber: string
  operator: string
  timestamp: string
  upiTransactionId: string
  paymentId: string
}

export default function RechargeReceiptPage() {
  const [receipt, setReceipt] = useState<ReceiptData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    try {
      const data = searchParams.get("data")
      if (!data) throw new Error("No receipt data found")
      
      const parsedData = JSON.parse(decodeURIComponent(data))
      setReceipt({
        ...parsedData,
        timestamp: new Date().toLocaleString(),
        upiTransactionId: generateUpiTransactionId(),
        paymentId: generatePaymentId()
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not load receipt details. Redirecting to dashboard...",
      })
      setTimeout(() => router.push("/dashboard"), 2000)
    } finally {
      setLoading(false)
    }
  }, [searchParams, router, toast])

  const handleDownload = () => {
    if (!receipt) return

    const receiptText = `
      DigiPay - Mobile Recharge Receipt
      ----------------------------------------
      Amount: ₹${receipt.amount.toFixed(2)}
      Mobile Number: ${receipt.mobileNumber}
      Operator: ${receipt.operator.toUpperCase()}
      Date & Time: ${receipt.timestamp}
      UPI Transaction ID: ${receipt.upiTransactionId}
      Payment ID: ${receipt.paymentId}
      ----------------------------------------
      Thank you for using DigiPay!
    `

    const blob = new Blob([receiptText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `digipay-recharge-receipt-${receipt.paymentId}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Receipt Downloaded",
      description: "The receipt has been downloaded to your device.",
    })
  }

  const handleShare = async () => {
    if (!receipt) return

    const shareText = `I just recharged ₹${receipt.amount.toFixed(2)} for ${receipt.mobileNumber} using DigiPay! Transaction ID: ${receipt.upiTransactionId}`

    try {
      if (navigator.share) {
        await navigator.share({
          title: "DigiPay Mobile Recharge",
          text: shareText,
        })
      } else {
        await navigator.clipboard.writeText(shareText)
        toast({
          title: "Copied to clipboard",
          description: "Receipt details copied to clipboard",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Share Failed",
        description: "Unable to share the receipt.",
      })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto max-w-md py-8 flex justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent"></div>
      </div>
    )
  }

  if (!receipt) {
    return null
  }

  return (
    <div className="container mx-auto max-w-md py-8">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle className="text-2xl text-green-600">Recharge Successful!</CardTitle>
          <CardDescription>Your mobile recharge was successful</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-4xl font-bold">₹{receipt.amount.toFixed(2)}</p>
              <p className="text-sm text-gray-500 mt-1">Amount Paid</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <p className="text-sm text-gray-500">Mobile Number</p>
                <p className="text-sm font-medium">{receipt.mobileNumber}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-500">Operator</p>
                <p className="text-sm font-medium">{receipt.operator.toUpperCase()}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-500">Date & Time</p>
                <p className="text-sm font-medium">{receipt.timestamp}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-500">UPI Transaction ID</p>
                <p className="text-sm font-medium font-mono">{receipt.upiTransactionId}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-500">Payment ID</p>
                <p className="text-sm font-medium font-mono">{receipt.paymentId}</p>
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