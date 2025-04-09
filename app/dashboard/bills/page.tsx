"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import { generatePaymentId, generateUpiTransactionId } from "@/lib/utils"

interface BillDetails {
  customerName: string
  billNumber: string
  dueDate: string
  amount: number
}

export default function BillsPage() {
  const [loading, setLoading] = useState(false)
  const [billType, setBillType] = useState("electricity")
  const [formData, setFormData] = useState({
    provider: "",
    accountNumber: "",
  })
  const [billDetails, setBillDetails] = useState<BillDetails | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // Handle URL parameters for pre-filling form
  useEffect(() => {
    const provider = searchParams.get("provider")
    const accountNumber = searchParams.get("accountNumber")
    const type = searchParams.get("type") || "electricity"

    if (provider && accountNumber) {
      setBillType(type)
      setFormData({
        provider,
        accountNumber,
      })
      
      // Auto-verify bill if coming from dashboard
      verifyBill()
    }
  }, [searchParams])

  const handleBillTypeChange = (value: string) => {
    setBillType(value)
    setBillDetails(null)
  }

  const verifyBill = async () => {
    if (!formData.provider || !formData.accountNumber) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide both provider and account number",
      })
      return
    }

    setLoading(true)

    try {
      // Simulate API call to verify bill
      // In a real application, this would be a fetch call to your API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock bill details
      const mockBillDetails: BillDetails = {
        customerName: "John Doe",
        billNumber: formData.accountNumber,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        amount: Math.floor(Math.random() * 5000) + 500,
      }

      setBillDetails(mockBillDetails)
      toast({
        title: "Bill Verified",
        description: "Your bill details have been fetched successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to verify bill. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!billDetails) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please verify your bill first",
      })
      return
    }

    setLoading(true)

    try {
      // Simulate API call to process payment
      // In a real application, this would be a fetch call to your API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Create receipt data
      const receiptData = {
        amount: billDetails.amount.toString(),
        billType,
        provider: formData.provider,
        accountNumber: formData.accountNumber,
        customerName: billDetails.customerName,
        billNumber: billDetails.billNumber,
        dueDate: billDetails.dueDate,
        upiTransactionId: generateUpiTransactionId(),
        paymentId: generatePaymentId(),
      }

      // Redirect to receipt page
      router.replace(`/dashboard/bills/receipt?data=${encodeURIComponent(JSON.stringify(receiptData))}`)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process payment. Please try again.",
      })
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-md py-8">
      <Card>
        <CardHeader>
          <CardTitle>Pay Bills</CardTitle>
          <CardDescription>Pay your utility bills easily</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="billType">Bill Type</Label>
              <Select value={billType} onValueChange={handleBillTypeChange}>
                <SelectTrigger id="billType">
                  <SelectValue placeholder="Select bill type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electricity">Electricity</SelectItem>
                  <SelectItem value="water">Water</SelectItem>
                  <SelectItem value="gas">Gas</SelectItem>
                  <SelectItem value="internet">Internet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="provider">Provider</Label>
              <Select
                value={formData.provider}
                onValueChange={(value) => setFormData({ ...formData, provider: value })}
              >
                <SelectTrigger id="provider">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {billType === "electricity" && (
                    <>
                      <SelectItem value="BESCOM">BESCOM</SelectItem>
                      <SelectItem value="MSEB">MSEB</SelectItem>
                      <SelectItem value="TATA">TATA Power</SelectItem>
                    </>
                  )}
                  {billType === "water" && (
                    <>
                      <SelectItem value="BWSSB">BWSSB</SelectItem>
                      <SelectItem value="MSEB">MSEB</SelectItem>
                    </>
                  )}
                  {billType === "gas" && (
                    <>
                      <SelectItem value="HP">HP Gas</SelectItem>
                      <SelectItem value="Indane">Indane</SelectItem>
                    </>
                  )}
                  {billType === "internet" && (
                    <>
                      <SelectItem value="Airtel">Airtel</SelectItem>
                      <SelectItem value="Jio">Jio</SelectItem>
                      <SelectItem value="ACT">ACT</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="accountNumber">
                {billType === "electricity" ? "Consumer Number" : "Account Number"}
              </Label>
              <Input
                id="accountNumber"
                placeholder={`Enter ${billType === "electricity" ? "consumer" : "account"} number`}
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                required
              />
            </div>

            {!billDetails && (
              <Button
                type="button"
                className="w-full"
                onClick={verifyBill}
                disabled={loading || !formData.provider || !formData.accountNumber}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Bill"
                )}
              </Button>
            )}

            {billDetails && (
              <>
                <div className="border rounded-md p-4 space-y-3">
                  <h3 className="font-medium">Bill Details</h3>
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-500">Customer Name</p>
                    <p className="text-sm font-medium">{billDetails.customerName}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-500">Bill Number</p>
                    <p className="text-sm font-medium">{billDetails.billNumber}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-500">Due Date</p>
                    <p className="text-sm font-medium">{billDetails.dueDate}</p>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <p className="text-sm font-medium">Amount</p>
                    <p className="text-sm font-bold">₹{billDetails.amount}</p>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Pay ₹${billDetails.amount}`
                  )}
                </Button>
              </>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

