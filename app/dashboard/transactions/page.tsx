"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TransactionList } from "@/components/transaction-list"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchTransactions, DisplayTransaction } from "@/app/actions/transactions"

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<DisplayTransaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const data = await fetchTransactions()
        setTransactions(data)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load transactions",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadTransactions()
  }, [toast])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#B8860B] border-t-transparent"></div>
      </div>
    )
  }

  const sentTransactions = transactions.filter((t) => t.type === "sent")
  const receivedTransactions = transactions.filter((t) => t.type === "received")
  const addedTransactions = transactions.filter((t) => t.type === "added")

  return (
    <div className="container mx-auto max-w-4xl py-6">
      <h1 className="mb-6 text-3xl font-bold">Transaction History</h1>

      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>Your payment history for the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="sent">Sent</TabsTrigger>
              <TabsTrigger value="received">Received</TabsTrigger>
              <TabsTrigger value="added">Added</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <TransactionList transactions={transactions} />
            </TabsContent>
            <TabsContent value="sent">
              <TransactionList transactions={sentTransactions} />
            </TabsContent>
            <TabsContent value="received">
              <TransactionList transactions={receivedTransactions} />
            </TabsContent>
            <TabsContent value="added">
              <TransactionList transactions={addedTransactions} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

