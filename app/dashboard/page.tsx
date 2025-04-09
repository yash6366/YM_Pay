"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  HistoryIcon,
  CreditCard,
  Smartphone,
  Receipt,
  Ticket,
  ShoppingBag,
  Zap,
  Shield,
  Gift,
  TrendingUp,
  Users,
  Share2,
  ClipboardCopy,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface UserData {
  firstName: string
  lastName: string
  balance: number
}

export default function DashboardPage() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await fetch("/api/user")

        if (!userResponse.ok) {
          throw new Error("Failed to fetch data")
        }

        const userData = await userResponse.json()
        setUserData(userData)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load dashboard data",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [toast])

  const services = [
    { name: "Mobile Recharge", icon: Smartphone, path: "/dashboard/recharge", color: "bg-sky-100 text-sky-600" },
    { name: "Pay Bills", icon: Receipt, path: "/dashboard/bills", color: "bg-green-100 text-green-600" },
    { name: "Book Tickets", icon: Ticket, path: "/dashboard/tickets", color: "bg-purple-100 text-purple-600" },
    { name: "Shop", icon: ShoppingBag, path: "/dashboard/shop", color: "bg-orange-100 text-orange-600" },
    { name: "Electricity", icon: Zap, path: "/dashboard/electricity", color: "bg-yellow-100 text-yellow-600" },
    { name: "Insurance", icon: Shield, path: "/dashboard/insurance", color: "bg-indigo-100 text-indigo-600" },
    { name: "Credit Card", icon: CreditCard, path: "/dashboard/credit-card", color: "bg-red-100 text-red-600" },
    { name: "Rewards", icon: Gift, path: "/dashboard/rewards", color: "bg-pink-100 text-pink-600" },
  ]

  const handleReferral = async () => {
    const referralLink = "https://ym-pay.vercel.app/";
    const shareData = {
      title: "Join me on YM-Pay!",
      text: `Check out YM-Pay, a great app for payments: ${referralLink}`,
      url: referralLink,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast({
          title: "Shared successfully!",
          description: "Referral link sent.",
        });
      } else {
        await navigator.clipboard.writeText(referralLink);
        toast({
          title: "Link Copied!",
          description: "Referral link copied to clipboard. Share it with your friends!",
        });
      }
    } catch (err) {
      console.error("Share failed:", err);
      try {
        await navigator.clipboard.writeText(referralLink);
        toast({
          title: "Link Copied!",
          description: "Sharing failed. Link copied to clipboard instead.",
        });
      } catch (copyErr) {
        console.error("Copy failed:", copyErr);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not share or copy the referral link.",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-6xl py-6 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, {userData?.firstName} 👋</h1>
          <p className="text-gray-600">Simplifying payments, securing your future - your digital wallet companion.</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Card className="bg-sky-50 border-sky-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Available Balance</p>
                  <p className="text-2xl font-bold">₹{userData?.balance.toFixed(2)}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-sky-100 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-sky-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common actions you might need</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Link href="/dashboard/send-money">
                  <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mb-2">
                        <ArrowUpIcon className="h-5 w-5 text-green-600" />
                      </div>
                      <p className="text-sm font-medium">Send Money</p>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/dashboard/add-money">
                  <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                        <CreditCard className="h-5 w-5 text-purple-600" />
                      </div>
                      <p className="text-sm font-medium">Add Money</p>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/dashboard/transactions">
                  <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center mb-2">
                        <HistoryIcon className="h-5 w-5 text-yellow-600" />
                      </div>
                      <p className="text-sm font-medium">History</p>
                    </CardContent>
                  </Card>
                </Link>
                <Card className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={handleReferral}>
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                    <p className="text-sm font-medium">Refer a friend</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Pay</CardTitle>
              <CardDescription>Pay your bills quickly</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="electricity">
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="electricity">Electricity</TabsTrigger>
                  <TabsTrigger value="mobile">Mobile</TabsTrigger>
                  <TabsTrigger value="dth">DTH</TabsTrigger>
                </TabsList>
                <TabsContent value="electricity" className="space-y-4">
                  <form onSubmit={(e) => {
                    e.preventDefault()
                    const formData = new FormData(e.currentTarget)
                    const consumerNumber = formData.get("consumerNumber")
                    const provider = formData.get("provider")
                    
                    if (!consumerNumber || !provider) {
                      toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Please provide both consumer number and provider",
                      })
                      return
                    }
                    
                    router.push(`/dashboard/bills?type=electricity&provider=${provider}&accountNumber=${consumerNumber}`)
                  }}>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="provider">Provider</Label>
                        <Select name="provider" required onValueChange={(value) => {}}>
                          <SelectTrigger id="provider">
                            <SelectValue placeholder="Select provider" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BESCOM">BESCOM</SelectItem>
                            <SelectItem value="MSEB">MSEB</SelectItem>
                            <SelectItem value="TATA">TATA Power</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="consumerNumber">Consumer Number</Label>
                        <Input
                          id="consumerNumber"
                          name="consumerNumber"
                          placeholder="Enter consumer number"
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        Pay Electricity Bill
                      </Button>
                    </div>
                  </form>
                </TabsContent>
                <TabsContent value="mobile" className="space-y-4">
                  <form onSubmit={(e) => {
                    e.preventDefault()
                    const formData = new FormData(e.currentTarget)
                    const mobileNumber = formData.get("mobileNumber")
                    const operator = formData.get("operator")
                    
                    if (!mobileNumber || !operator) {
                      toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Please provide both mobile number and operator",
                      })
                      return
                    }
                    
                    router.push(`/dashboard/recharge?number=${mobileNumber}&operator=${operator}`)
                  }}>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="mobileNumber">Mobile Number</Label>
                        <Input
                          id="mobileNumber"
                          name="mobileNumber"
                          placeholder="Enter mobile number"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="operator">Operator</Label>
                        <Select name="operator" required onValueChange={(value) => {}}>
                          <SelectTrigger id="operator">
                            <SelectValue placeholder="Select operator" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="airtel">Airtel</SelectItem>
                            <SelectItem value="jio">Jio</SelectItem>
                            <SelectItem value="vi">Vi</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button type="submit" className="w-full">
                        Recharge Mobile
                      </Button>
                    </div>
                  </form>
                </TabsContent>
                <TabsContent value="dth" className="space-y-4">
                  <form onSubmit={(e) => {
                    e.preventDefault()
                    const formData = new FormData(e.currentTarget)
                    const subscriberId = formData.get("subscriberId")
                    const operator = formData.get("dthOperator")
                    
                    if (!subscriberId || !operator) {
                      toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Please provide both subscriber ID and operator",
                      })
                      return
                    }
                    
                    router.push(`/dashboard/bills?type=dth&provider=${operator}&accountNumber=${subscriberId}`)
                  }}>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="subscriberId">Subscriber ID</Label>
                        <Input
                          id="subscriberId"
                          name="subscriberId"
                          placeholder="Enter subscriber ID"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="dthOperator">Operator</Label>
                        <Select name="dthOperator" required onValueChange={(value) => {}}>
                          <SelectTrigger id="dthOperator">
                            <SelectValue placeholder="Select operator" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tata">Tata Play</SelectItem>
                            <SelectItem value="dish">Dish TV</SelectItem>
                            <SelectItem value="airtel">Airtel Digital TV</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button type="submit" className="w-full">
                        Recharge DTH
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Services</CardTitle>
              <CardDescription>All available services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {services.map((service) => (
                  <Link key={service.name} href={service.path}>
                    <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
                      <CardContent className="p-4 flex flex-col items-center justify-center">
                        <div className={`h-10 w-10 rounded-full ${service.color} flex items-center justify-center mb-2`}>
                          <service.icon className="h-5 w-5" />
                        </div>
                        <p className="text-sm font-medium">{service.name}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

