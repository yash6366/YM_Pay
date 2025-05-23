"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

export default function AboutPage() {
  const router = useRouter()
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex items-center sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-6 w-6 text-gray-700" />
        </Button>
        <h1 className="text-xl font-semibold ml-4 text-gray-800">About Us</h1>
      </div>

      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
            <CardDescription>Simplifying digital payments for everyone</CardDescription>
          </CardHeader>
          <CardContent className="prose">
            <p>
              At YM-Pay, we believe that financial services should be accessible, affordable, and easy to use for everyone. Our mission is to build a digital payment platform that empowers people to make secure transactions without the complexity.
            </p>
            <p>
              Founded in 2023, YM-Pay has grown from a simple mobile wallet to a comprehensive payment platform that serves thousands of users across the country.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Our Values</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Security</h3>
                <p className="text-gray-600">
                  We prioritize the security of your money and data above everything else. Our platform uses advanced encryption and security measures.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Simplicity</h3>
                <p className="text-gray-600">
                  We design our products to be intuitive and easy to use, regardless of your technical knowledge.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Transparency</h3>
                <p className="text-gray-600">
                  We believe in clear communication and no hidden fees. What you see is what you get.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Innovation</h3>
                <p className="text-gray-600">
                  We constantly explore new technologies to improve our service and bring you the best features.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Our Team</CardTitle>
            <CardDescription>The people behind YM-Pay</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-6">
              Our team consists of passionate professionals with backgrounds in fintech, software development, security, and customer service.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-xl">YN</span>
                </div>
                <h4 className="font-semibold">Yash Naidoo</h4>
                <p className="text-sm text-gray-500">Founder & CEO</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-green-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-green-600 font-bold text-xl">MS</span>
                </div>
                <h4 className="font-semibold">Meera Singh</h4>
                <p className="text-sm text-gray-500">CTO</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-purple-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-xl">RK</span>
                </div>
                <h4 className="font-semibold">Raj Kumar</h4>
                <p className="text-sm text-gray-500">Head of Product</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <p className="mb-4">Have questions or feedback?</p>
          <Button asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 