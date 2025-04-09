"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowDownUp, ArrowUpRight, CreditCard, Download, Plus, Wallet } from "lucide-react"

export default function WalletPage() {
  const [amount, setAmount] = useState("")

  const transactions = [
    {
      id: 1,
      type: "credit",
      amount: 500,
      description: "Added money via UPI",
      date: "Today, 10:30 AM",
    },
    {
      id: 2,
      type: "debit",
      amount: 199,
      description: "Mobile Recharge - Airtel",
      date: "Yesterday, 3:45 PM",
    },
    {
      id: 3,
      type: "debit",
      amount: 499,
      description: "DTH Recharge - Tata Play",
      date: "May 10, 2023",
    },
    {
      id: 4,
      type: "credit",
      amount: 100,
      description: "Cashback - Mobile Recharge",
      date: "May 8, 2023",
    },
    {
      id: 5,
      type: "credit",
      amount: 1000,
      description: "Added money via Net Banking",
      date: "May 5, 2023",
    },
  ]

  const paymentMethods = [
    {
      id: 1,
      name: "HDFC Bank",
      type: "Debit Card",
      number: "****4567",
      expiry: "12/25",
    },
    {
      id: 2,
      name: "ICICI Bank",
      type: "Credit Card",
      number: "****8901",
      expiry: "09/24",
    },
    {
      id: 3,
      name: "SBI",
      type: "UPI",
      number: "user@ybl",
      expiry: "",
    },
  ]

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Wallet</h1>
        <p className="text-muted-foreground">Manage your wallet balance and transactions</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
            <CardContent className="p-6">
              <div className="flex flex-col space-y-2">
                <p className="text-sm font-medium">Available Balance</p>
                <h2 className="text-4xl font-bold">â‚¹12,345.67</h2>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <Button className="flex gap-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Money</span>
                </Button>
                <Button variant="outline" className="flex gap-2">
                  <ArrowUpRight className="h-4 w-4" />
                  <span>Send Money</span>
                </Button>
                <Button variant="outline" className="flex gap-2">
                  <Download className="h-4 w-4" />
                  <span>Withdraw</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add Money to Wallet</CardTitle>
              <CardDescription>Choose an amount and payment method</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
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

              <div className="flex flex-wrap gap-2">
                {[100, 200, 500, 1000, 2000].map((value) => (
                  <Button
                    key={value}
                    variant="outline"
                    onClick={() => setAmount(value.toString())}
                    className={amount === value.toString() ? "border-primary bg-primary/5" : ""}
                  >
                    â‚¹{value}
                  </Button>
                ))}
              </div>

              <div className="space-y-2">
                <Label>Payment Method</Label>
                <div className="grid gap-2">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className="flex items-center justify-between p-3 border rounded-md cursor-pointer hover:bg-muted"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <CreditCard className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{method.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {method.type} â€¢ {method.number}
                            {method.expiry && ` â€¢ Expires ${method.expiry}`}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Use
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" className="flex gap-2">
                    <Plus className="h-4 w-4" />
                    <span>Add New Payment Method</span>
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" disabled={!amount}>
                Proceed to Add Money
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Transaction History</CardTitle>
                <Button variant="ghost" size="sm" className="flex gap-1 h-7">
                  <ArrowDownUp className="h-4 w-4" />
                  <span className="sr-only md:not-sr-only">Filter</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-start justify-between border-b pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        transaction.type === "credit" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                      }`}
                    >
                      {transaction.type === "credit" ? (
                        <ArrowDownUp className="h-4 w-4" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">{transaction.date}</p>
                    </div>
                  </div>
                  <p className={`font-medium ${transaction.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                    {transaction.type === "credit" ? "+" : "-"}â‚¹{transaction.amount}
                  </p>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="link" className="w-full">
                View All Transactions
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Wallet Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Wallet className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Auto Top-up</h3>
                  <p className="text-sm text-muted-foreground">
                    Set up automatic recharges when your balance falls below a certain amount.
                  </p>
                  <Button variant="link" className="h-auto p-0 text-sm">
                    Enable Auto Top-up
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <CreditCard className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Wallet Card</h3>
                  <p className="text-sm text-muted-foreground">
                    Get a physical card linked to your wallet for offline payments.
                  </p>
                  <Button variant="link" className="h-auto p-0 text-sm">
                    Apply for Card
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
