import { formatDistanceToNow } from "date-fns"
import { ArrowDownLeft, ArrowUpRight, Wallet, Receipt } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Transaction {
  id: string
  amount: number
  type: "sent" | "received" | "added"
  otherParty: string
  timestamp: string
  description: string
}

interface TransactionListProps {
  transactions: Transaction[]
}

export function TransactionList({ transactions }: TransactionListProps) {
  if (!transactions.length) {
    return (
      <div className="py-12 text-center">
        <Receipt className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">No transactions yet</h3>
        <p className="mt-2 text-gray-500">Get started by sending money or paying bills.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild variant="outline">
            <Link href="/dashboard/send-money">Send Money</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/bills">Pay Bills</Link>
          </Button>
        </div>
      </div>
    )
  }

  const getTransactionTitle = (transaction: Transaction) => {
    if (transaction.type === "added") {
      return "Added to wallet"
    }
    if (transaction.type === "received") {
      return `Received from ${transaction.otherParty}`
    }
    if (transaction.type === "sent") {
      // For sent transactions, use the description as the title if it's a system transaction
      if (transaction.otherParty === "Unknown" || transaction.otherParty === "System") {
        // Extract the purpose from description (e.g., "Mobile recharge for...")
        const purpose = transaction.description.split(" for ")[0]
        return purpose.charAt(0).toUpperCase() + purpose.slice(1)
      }
      return `Sent to ${transaction.otherParty}`
    }
    return `Added to wallet`
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center gap-3">
            {transaction.type === "sent" ? (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                <ArrowUpRight className="h-5 w-5" />
              </div>
            ) : transaction.type === "received" ? (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                <ArrowDownLeft className="h-5 w-5" />
              </div>
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <Wallet className="h-5 w-5" />
              </div>
            )}
            <div>
              <p className="font-medium">
                {getTransactionTitle(transaction)}
              </p>
              {/* Only show full description for system transactions */}
              {(transaction.otherParty === "Unknown" || transaction.otherParty === "System") && (
                <p className="text-sm text-gray-500">
                  {transaction.description.split(" for ")[1]?.replace(/^\(|\)$/g, '')}
                </p>
              )}
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(transaction.timestamp), { addSuffix: true })}
              </p>
            </div>
          </div>
          <div className={`text-right ${transaction.type === "sent" ? "text-red-600" : "text-green-600"}`}>
            <p className="font-medium">
              {transaction.type === "sent" ? "-" : "+"}₹{transaction.amount.toFixed(2)}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

