"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Zap } from "lucide-react"

export default function ElectricityPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [provider, setProvider] = useState("")
  const [consumerNumber, setConsumerNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!provider || !consumerNumber) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide both provider and consumer number",
      })
      return
    }
    
    setIsLoading(true)
    
    try {
      // In a real app, we would fetch bill details here
      // For now, just redirect to bills page
      router.push(`/dashboard/bills?type=electricity&provider=${provider}&accountNumber=${consumerNumber}`)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch bill details. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex items-center sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-6 w-6 text-gray-700" />
        </Button>
        <h1 className="text-xl font-semibold ml-4 text-gray-800">Electricity Bill Payment</h1>
      </div>

      {/* Main Content */}
      <div className="p-4 md:p-8 max-w-2xl mx-auto">
        <Card className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Page Header */}
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 flex items-center">
            <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center shadow-md mr-6">
              <Zap className="h-8 w-8 text-yellow-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Pay Electricity Bill</h2>
              <p className="text-yellow-100">Quick and secure electricity bill payment</p>
            </div>
          </div>
          
          {/* Form Content */}
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <Label htmlFor="provider" className="text-sm font-medium text-gray-500">Electricity Provider</Label>
                <Select
                  required
                  value={provider}
                  onValueChange={setProvider}
                >
                  <SelectTrigger id="provider" className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500">
                    <SelectValue placeholder="Select your provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BESCOM">BESCOM</SelectItem>
                    <SelectItem value="MSEB">MSEB</SelectItem>
                    <SelectItem value="TATA">TATA Power</SelectItem>
                    <SelectItem value="TORRENT">Torrent Power</SelectItem>
                    <SelectItem value="ADANI">Adani Electricity</SelectItem>
                    <SelectItem value="CESC">CESC</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label htmlFor="consumerNumber" className="text-sm font-medium text-gray-500">Consumer Number</Label>
                <Input
                  id="consumerNumber"
                  value={consumerNumber}
                  onChange={(e) => setConsumerNumber(e.target.value)}
                  placeholder="Enter your consumer number"
                  className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                  required
                />
              </div>

              <div className="pt-6">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full rounded-full px-5 bg-yellow-600 hover:bg-yellow-700"
                >
                  {isLoading ? "Fetching bill..." : "View & Pay Bill"}
                </Button>
              </div>
              
              <div className="border border-gray-100 rounded-lg p-4 bg-gray-50 mt-6">
                <h3 className="font-medium text-gray-700 mb-2">Instructions:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Enter your consumer number exactly as it appears on your bill</li>
                  <li>• Make sure to select the correct electricity provider</li>
                  <li>• You can find your consumer number on your previous electricity bill</li>
                  <li>• Online payments may take up to 24 hours to reflect in your account</li>
                </ul>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 