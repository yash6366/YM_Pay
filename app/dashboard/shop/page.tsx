"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, ShoppingBag } from "lucide-react"

export default function ShopPage() {
  const [category, setCategory] = useState("electronics")
  const router = useRouter()

  const products = {
    electronics: [
      { id: 1, name: "Smartphone", price: 15999, image: "/images/phone.jpg" },
      { id: 2, name: "Laptop", price: 49999, image: "/images/laptop.jpg" },
      { id: 3, name: "Headphones", price: 1999, image: "/images/headphones.jpg" },
    ],
    fashion: [
      { id: 4, name: "T-Shirt", price: 599, image: "/images/tshirt.jpg" },
      { id: 5, name: "Jeans", price: 1299, image: "/images/jeans.jpg" },
      { id: 6, name: "Sneakers", price: 2499, image: "/images/sneakers.jpg" },
    ],
    groceries: [
      { id: 7, name: "Fresh Fruits Pack", price: 499, image: "/images/fruits.jpg" },
      { id: 8, name: "Vegetables Pack", price: 399, image: "/images/vegetables.jpg" },
      { id: 9, name: "Daily Essentials", price: 999, image: "/images/essentials.jpg" },
    ],
  }

  const handleCategoryChange = (value: string) => {
    setCategory(value)
  }

  const handleProductClick = (productId: number) => {
    router.push(`/dashboard/shop/product/${productId}`)
  }

  return (
    <div className="container mx-auto max-w-6xl py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Shop</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search products..."
              className="pl-10 w-[300px]"
            />
          </div>
          <Button variant="outline">
            <ShoppingBag className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Featured Products</CardTitle>
          <CardDescription>Shop from our wide range of products</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Tabs value={category} onValueChange={handleCategoryChange}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="electronics">Electronics</TabsTrigger>
                <TabsTrigger value="fashion">Fashion</TabsTrigger>
                <TabsTrigger value="groceries">Groceries</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(products as Record<string, typeof products.electronics>)[category].map((product) => (
                <Card
                  key={product.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleProductClick(product.id)}
                >
                  <div className="aspect-video bg-gray-100 relative">
                    {/* In a real app, this would be an Image component with actual product images */}
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      Product Image
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-lg font-bold mt-2">₹{product.price.toLocaleString()}</p>
                    <Button className="w-full mt-4">View Details</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 