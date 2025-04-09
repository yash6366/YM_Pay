"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, Gift, Plane, ShoppingBag } from "lucide-react"
import { cn } from "@/lib/utils"

export default function CreditCardPage() {
  const [selectedCard, setSelectedCard] = useState("")
  const router = useRouter()

  const creditCards = [
    {
      id: "rewards",
      name: "Rewards Card",
      icon: Gift,
      color: "bg-purple-100",
      textColor: "text-purple-600",
      benefits: ["5% cashback on shopping", "2% on dining", "1% on other spends"],
      fee: 999,
    },
    {
      id: "travel",
      name: "Travel Card",
      icon: Plane,
      color: "bg-blue-100",
      textColor: "text-blue-600",
      benefits: ["Airport lounge access", "Travel insurance", "Airline miles"],
      fee: 2499,
    },
    {
      id: "shopping",
      name: "Shopping Card",
      icon: ShoppingBag,
      color: "bg-green-100",
      textColor: "text-green-600",
      benefits: ["10% off on partner stores", "No-cost EMI", "Welcome vouchers"],
      fee: 499,
    },
  ]

  const handleApply = () => {
    router.push(`/dashboard/credit-card/${selectedCard}/apply`)
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <h1 className="mb-6 text-3xl font-bold">Credit Cards</h1>
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-8">
        {creditCards.map((card) => {
          const Icon = card.icon
          return (
            <Card
              key={card.id}
              className={cn(
                "cursor-pointer hover:shadow-lg transition-shadow",
                selectedCard === card.id && "ring-2 ring-primary"
              )}
              onClick={() => setSelectedCard(card.id)}
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className={cn("p-3 rounded-full w-fit", card.color)}>
                    <Icon className={cn("h-6 w-6", card.textColor)} />
                  </div>
                  <h3 className="font-semibold text-lg">{card.name}</h3>
                  <ul className="space-y-2">
                    {card.benefits.map((benefit, index) => (
                      <li key={index} className="text-sm text-gray-500">
                        • {benefit}
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm font-medium">
                    Annual fee: ₹{card.fee.toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {selectedCard && (
        <Card>
          <CardHeader>
            <CardTitle>Apply for Credit Card</CardTitle>
            <CardDescription>Fill in your details to apply</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                <div>
                  <Label>Full Name</Label>
                  <Input placeholder="Enter your full name" />
                </div>
                <div>
                  <Label>Date of Birth</Label>
                  <Input type="date" />
                </div>
                <div>
                  <Label>PAN Number</Label>
                  <Input placeholder="Enter PAN number" />
                </div>
                <div>
                  <Label>Annual Income</Label>
                  <Input type="number" placeholder="Enter annual income" />
                </div>
                <div>
                  <Label>Employment Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="salaried">Salaried</SelectItem>
                      <SelectItem value="self-employed">Self Employed</SelectItem>
                      <SelectItem value="business">Business Owner</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>City</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mumbai">Mumbai</SelectItem>
                      <SelectItem value="delhi">Delhi</SelectItem>
                      <SelectItem value="bangalore">Bangalore</SelectItem>
                      <SelectItem value="hyderabad">Hyderabad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button className="w-full" onClick={handleApply}>
                Apply Now
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 