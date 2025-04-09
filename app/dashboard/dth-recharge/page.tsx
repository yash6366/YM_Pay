"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DTHRechargePage() {
  const [subscriberId, setSubscriberId] = useState("")
  const [operator, setOperator] = useState("")
  const [amount, setAmount] = useState("")
  const [selectedPlan, setSelectedPlan] = useState("")

  const operators = [
    { id: "tatasky", name: "Tata Play" },
    { id: "dishtv", name: "Dish TV" },
    { id: "airteldigital", name: "Airtel Digital TV" },
    { id: "sundigital", name: "Sun Direct" },
    { id: "d2h", name: "d2h" },
  ]

  const plans = [
    { id: "plan1", name: "Basic Pack", price: 299, description: "100+ channels for 1 month" },
    { id: "plan2", name: "Entertainment Pack", price: 399, description: "200+ channels for 1 month" },
    { id: "plan3", name: "Premium Pack", price: 599, description: "300+ channels with HD for 1 month" },
    { id: "plan4", name: "Sports Pack", price: 499, description: "All sports channels with HD for 1 month" },
    { id: "plan5", name: "Family Pack", price: 699, description: "All entertainment + kids channels for 1 month" },
  ]

  const handleRecharge = () => {
    // Handle recharge logic here
    console.log({ subscriberId, operator, amount, selectedPlan })
    alert("Recharge initiated successfully!")
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">DTH Recharge</h1>
        <p className="text-muted-foreground">Recharge your DTH connection quickly and securely</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recharge Details</CardTitle>
              <CardDescription>Enter your DTH details to proceed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="operator">DTH Operator</Label>
                <Select value={operator} onValueChange={setOperator}>
                  <SelectTrigger id="operator">
                    <SelectValue placeholder="Select your DTH operator" />
                  </SelectTrigger>
                  <SelectContent>
                    {operators.map((op) => (
                      <SelectItem key={op.id} value={op.id}>
                        {op.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subscriber-id">Subscriber ID / Customer ID</Label>
                <Input
                  id="subscriber-id"
                  placeholder="Enter your subscriber ID"
                  value={subscriberId}
                  onChange={(e) => setSubscriberId(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  You can find your Subscriber ID on your DTH bill or on the TV screen by pressing the info button on
                  your remote.
                </p>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="plans">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="plans">Choose a Plan</TabsTrigger>
              <TabsTrigger value="amount">Enter Amount</TabsTrigger>
            </TabsList>

            <TabsContent value="plans" className="space-y-4 pt-4">
              <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan}>
                {plans.map((plan) => (
                  <div key={plan.id} className="flex">
                    <RadioGroupItem value={plan.id} id={plan.id} className="peer sr-only" />
                    <Label
                      htmlFor={plan.id}
                      className="flex flex-col w-full p-4 border rounded-md cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                    >
                      <div className="flex justify-between">
                        <span className="font-medium">{plan.name}</span>
                        <span className="font-bold">â‚¹{plan.price}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{plan.description}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </TabsContent>

            <TabsContent value="amount" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Recharge Amount</Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 border border-r-0 rounded-l-md bg-muted text-muted-foreground">
                    â‚¹
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    className="rounded-l-none"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <Button
            size="lg"
            className="w-full"
            onClick={handleRecharge}
            disabled={!operator || !subscriberId || (!selectedPlan && !amount)}
          >
            Proceed to Payment
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center gap-2 p-2 border rounded-md">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                  1
                </div>
                <p className="text-center text-sm">Select your DTH operator</p>
              </div>

              <div className="flex flex-col items-center gap-2 p-2 border rounded-md">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                  2
                </div>
                <p className="text-center text-sm">Enter your subscriber ID</p>
              </div>

              <div className="flex flex-col items-center gap-2 p-2 border rounded-md">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                  3
                </div>
                <p className="text-center text-sm">Choose a plan or enter amount</p>
              </div>

              <div className="flex flex-col items-center gap-2 p-2 border rounded-md">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                  4
                </div>
                <p className="text-center text-sm">Complete the payment</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                If you're facing any issues with your DTH recharge, our customer support team is here to help.
              </p>
              <Button variant="outline" className="w-full">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
