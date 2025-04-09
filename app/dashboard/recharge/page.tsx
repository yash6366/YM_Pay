"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"

export default function RechargePage() {
  const [formData, setFormData] = useState({
    mobileNumber: "",
    operator: "",
    circle: "",
    amount: "",
    planType: "prepaid",
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/transactions/recharge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobileNumber: formData.mobileNumber,
          operator: formData.operator,
          amount: Number.parseFloat(formData.amount),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to process recharge")
      }

      const data = await response.json()

      // Redirect to receipt page with transaction data
      router.push(`/dashboard/recharge/receipt?data=${encodeURIComponent(JSON.stringify(data.data))}`)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Recharge failed",
        description: error instanceof Error ? error.message : "Failed to process recharge",
      })
    } finally {
      setLoading(false)
    }
  }

  const operators = [
    { value: "airtel", label: "Airtel" },
    { value: "jio", label: "Jio" },
    { value: "vi", label: "Vi" },
    { value: "bsnl", label: "BSNL" },
  ]

  const circles = [
    { value: "delhi", label: "Delhi NCR" },
    { value: "mumbai", label: "Mumbai" },
    { value: "kolkata", label: "Kolkata" },
    { value: "maharashtra", label: "Maharashtra" },
    { value: "tamilnadu", label: "Tamil Nadu" },
    { value: "karnataka", label: "Karnataka" },
  ]

  const popularPlans = [
    {
      operator: "jio",
      amount: 239,
      validity: "28 days",
      data: "1.5GB/day",
      description: "Unlimited calls, 100 SMS/day",
    },
    {
      operator: "airtel",
      amount: 299,
      validity: "28 days",
      data: "2GB/day",
      description: "Unlimited calls, 100 SMS/day",
    },
    {
      operator: "vi",
      amount: 249,
      validity: "28 days",
      data: "1.5GB/day",
      description: "Unlimited calls, 100 SMS/day",
    },
    { operator: "jio", amount: 749, validity: "90 days", data: "2GB/day", description: "Unlimited calls, 100 SMS/day" },
  ]

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="mb-6 text-3xl font-bold">Mobile Recharge</h1>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Recharge Details</CardTitle>
              <CardDescription>Enter your mobile number and select a plan</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="planType">Plan Type</Label>
                  <RadioGroup
                    value={formData.planType}
                    onValueChange={(value) => handleSelectChange("planType", value)}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="prepaid" id="prepaid" />
                      <Label htmlFor="prepaid">Prepaid</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="postpaid" id="postpaid" />
                      <Label htmlFor="postpaid">Postpaid</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobileNumber">Mobile Number</Label>
                  <Input
                    id="mobileNumber"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    placeholder="Enter 10 digit mobile number"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="operator">Operator</Label>
                  <Select value={formData.operator} onValueChange={(value) => handleSelectChange("operator", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select operator" />
                    </SelectTrigger>
                    <SelectContent>
                      {operators.map((operator) => (
                        <SelectItem key={operator.value} value={operator.value}>
                          {operator.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="circle">Circle</Label>
                  <Select value={formData.circle} onValueChange={(value) => handleSelectChange("circle", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select circle" />
                    </SelectTrigger>
                    <SelectContent>
                      {circles.map((circle) => (
                        <SelectItem key={circle.value} value={circle.value}>
                          {circle.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="Enter amount"
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Processing..." : "Recharge Now"}
                </Button>
                <Button type="button" variant="ghost" onClick={() => router.push("/dashboard")}>
                  Cancel
                </Button>
              </CardFooter>
            </form>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Popular Plans</CardTitle>
              <CardDescription>Choose from recommended plans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {popularPlans.map((plan, index) => (
                  <div
                    key={index}
                    className="flex flex-col rounded-lg border p-4 hover:border-primary hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        amount: plan.amount.toString(),
                        operator: plan.operator,
                      })
                    }
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-lg">₹{plan.amount}</span>
                      <span className="text-sm text-gray-500">Validity: {plan.validity}</span>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">{plan.data}</p>
                      <p className="text-gray-600">{plan.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

