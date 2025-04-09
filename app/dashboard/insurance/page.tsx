"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Car, Heart, Home } from "lucide-react"

export default function InsurancePage() {
  const [insuranceType, setInsuranceType] = useState("health")
  const router = useRouter()

  const handleInsuranceTypeChange = (value: string) => {
    setInsuranceType(value)
  }

  const handleGetQuote = () => {
    router.push(`/dashboard/insurance/${insuranceType}/quote`)
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <h1 className="mb-6 text-3xl font-bold">Insurance</h1>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setInsuranceType("health")}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-100">
                <Heart className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Health Insurance</h3>
                <p className="text-sm text-gray-500">Protect yourself and your family</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setInsuranceType("car")}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-100">
                <Car className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Car Insurance</h3>
                <p className="text-sm text-gray-500">Comprehensive coverage for your vehicle</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setInsuranceType("life")}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-purple-100">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Life Insurance</h3>
                <p className="text-sm text-gray-500">Secure your family's future</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setInsuranceType("home")}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-orange-100">
                <Home className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Home Insurance</h3>
                <p className="text-sm text-gray-500">Protect your property</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Get Insurance Quote</CardTitle>
          <CardDescription>Fill in the details to get a personalized quote</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div>
              <Label>Insurance Type</Label>
              <Select value={insuranceType} onValueChange={handleInsuranceTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select insurance type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="health">Health Insurance</SelectItem>
                  <SelectItem value="car">Car Insurance</SelectItem>
                  <SelectItem value="life">Life Insurance</SelectItem>
                  <SelectItem value="home">Home Insurance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {insuranceType === "health" && (
              <div className="space-y-4">
                <div>
                  <Label>Age</Label>
                  <Input type="number" placeholder="Enter your age" />
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
            )}

            {insuranceType === "car" && (
              <div className="space-y-4">
                <div>
                  <Label>Car Model</Label>
                  <Input placeholder="Enter car model" />
                </div>
                <div>
                  <Label>Registration Year</Label>
                  <Input type="number" placeholder="YYYY" />
                </div>
              </div>
            )}

            {insuranceType === "life" && (
              <div className="space-y-4">
                <div>
                  <Label>Age</Label>
                  <Input type="number" placeholder="Enter your age" />
                </div>
                <div>
                  <Label>Coverage Amount</Label>
                  <Input type="number" placeholder="Enter coverage amount" />
                </div>
              </div>
            )}

            {insuranceType === "home" && (
              <div className="space-y-4">
                <div>
                  <Label>Property Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="house">Independent House</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Property Value</Label>
                  <Input type="number" placeholder="Enter property value" />
                </div>
              </div>
            )}

            <Button className="w-full" onClick={handleGetQuote}>
              Get Quote
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 