"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Gift, ShoppingBag, Ticket, Utensils } from "lucide-react"

export default function RewardsPage() {
  const [category, setCategory] = useState("all")
  const router = useRouter()

  const rewards = {
    shopping: [
      { id: 1, name: "₹500 Amazon Voucher", points: 2500, image: "/images/amazon.jpg" },
      { id: 2, name: "₹1000 Flipkart Voucher", points: 5000, image: "/images/flipkart.jpg" },
      { id: 3, name: "₹200 Myntra Voucher", points: 1000, image: "/images/myntra.jpg" },
    ],
    food: [
      { id: 4, name: "₹200 Swiggy Voucher", points: 1000, image: "/images/swiggy.jpg" },
      { id: 5, name: "₹300 Zomato Voucher", points: 1500, image: "/images/zomato.jpg" },
      { id: 6, name: "₹500 Restaurant Voucher", points: 2500, image: "/images/restaurant.jpg" },
    ],
    entertainment: [
      { id: 7, name: "2 Movie Tickets", points: 3000, image: "/images/movie.jpg" },
      { id: 8, name: "1 Month Netflix", points: 4000, image: "/images/netflix.jpg" },
      { id: 9, name: "3 Months Spotify", points: 3500, image: "/images/spotify.jpg" },
    ],
  }

  const allRewards = [
    ...rewards.shopping,
    ...rewards.food,
    ...rewards.entertainment,
  ]

  const displayRewards = category === "all" ? allRewards : (rewards as Record<string, typeof allRewards>)[category]

  const handleRedeem = (rewardId: number) => {
    router.push(`/dashboard/rewards/redeem/${rewardId}`)
  }

  return (
    <div className="container mx-auto max-w-6xl py-8">
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Available Points</p>
              <p className="text-3xl font-bold">12,500</p>
              <p className="text-sm text-gray-500">= ₹1,250</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Points Earned This Month</p>
              <p className="text-3xl font-bold">2,300</p>
              <p className="text-sm text-green-600">+800 points from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Points Redeemed</p>
              <p className="text-3xl font-bold">5,000</p>
              <p className="text-sm text-gray-500">Last redeemed: 2 days ago</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rewards Catalog</CardTitle>
          <CardDescription>Redeem your points for exciting rewards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Tabs value={category} onValueChange={setCategory}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All Rewards</TabsTrigger>
                <TabsTrigger value="shopping">Shopping</TabsTrigger>
                <TabsTrigger value="food">Food</TabsTrigger>
                <TabsTrigger value="entertainment">Entertainment</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayRewards.map((reward) => (
                <Card
                  key={reward.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-video bg-gray-100 relative">
                    {/* In a real app, this would be an Image component with actual reward images */}
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      Reward Image
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{reward.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {reward.points.toLocaleString()} points
                    </p>
                    <Button
                      className="w-full mt-4"
                      onClick={() => handleRedeem(reward.id)}
                      disabled={reward.points > 12500} // Compare with available points
                    >
                      {reward.points > 12500 ? "Insufficient Points" : "Redeem"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>How to Earn More Points</CardTitle>
          <CardDescription>Complete these activities to earn reward points</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <ShoppingBag className="h-8 w-8 text-purple-600 mb-2" />
                <h3 className="font-semibold">Shop</h3>
                <p className="text-sm text-gray-500">Earn 1 point per ₹10 spent</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <Utensils className="h-8 w-8 text-blue-600 mb-2" />
                <h3 className="font-semibold">Dine</h3>
                <p className="text-sm text-gray-500">2X points on restaurant bills</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <Ticket className="h-8 w-8 text-green-600 mb-2" />
                <h3 className="font-semibold">Book Tickets</h3>
                <p className="text-sm text-gray-500">5X points on movie tickets</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <Gift className="h-8 w-8 text-red-600 mb-2" />
                <h3 className="font-semibold">Refer Friends</h3>
                <p className="text-sm text-gray-500">1000 points per referral</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 