"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export default function SendMoneyPage() {
  const [loading, setLoading] = useState(false)
  const [phone, setPhone] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate inputs
    if (!phone || !amount) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide both phone number and amount",
      })
      return
    }
    
    setLoading(true)

    try {
      const response = await fetch("/api/transactions/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiverPhone: phone,
          amount: parseFloat(amount),
          description,
        }),
      })

      const data = await response.json()

      if (data.success) {
        const receiptData = {
          amount,
          receiverName: data.data.receiverName,
          receiverPhone: phone,
          description,
        }

        // Use replace instead of push to prevent back navigation
        router.replace(`/dashboard/send-money/receipt?data=${encodeURIComponent(JSON.stringify(receiptData))}`)
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || "Failed to send money. Please try again.",
        })
        setLoading(false)
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      })
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-md py-8">
      <Card>
        <CardHeader>
          <CardTitle>Send Money</CardTitle>
          <CardDescription>Send money to any phone number</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter recipient's phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                pattern="[0-9]{10}"
                title="Please enter a valid 10-digit phone number"
              />
            </div>

            <div>
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                step="0.01"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                placeholder="Add a note"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Money"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

