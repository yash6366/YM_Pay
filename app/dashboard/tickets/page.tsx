"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export default function TicketsPage() {
  const [ticketType, setTicketType] = useState("movie")
  const [date, setDate] = useState<Date>()
  const router = useRouter()

  const handleTicketTypeChange = (value: string) => {
    setTicketType(value)
  }

  const handleSearch = () => {
    // In a real app, this would search for available tickets
    router.push(`/dashboard/tickets/${ticketType}/search`)
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <h1 className="mb-6 text-3xl font-bold">Book Tickets</h1>
      <Card>
        <CardHeader>
          <CardTitle>Ticket Booking</CardTitle>
          <CardDescription>Book tickets for movies, travel and more</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Tabs value={ticketType} onValueChange={handleTicketTypeChange}>
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="movie">Movie</TabsTrigger>
                <TabsTrigger value="bus">Bus</TabsTrigger>
                <TabsTrigger value="train">Train</TabsTrigger>
                <TabsTrigger value="flight">Flight</TabsTrigger>
              </TabsList>
            </Tabs>

            {ticketType === "movie" && (
              <div className="space-y-4">
                <div>
                  <Label>City</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mumbai">Mumbai</SelectItem>
                      <SelectItem value="delhi">Delhi</SelectItem>
                      <SelectItem value="bangalore">Bangalore</SelectItem>
                      <SelectItem value="hyderabad">Hyderabad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}

            {(ticketType === "bus" || ticketType === "train" || ticketType === "flight") && (
              <div className="space-y-4">
                <div>
                  <Label>From</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mumbai">Mumbai</SelectItem>
                      <SelectItem value="delhi">Delhi</SelectItem>
                      <SelectItem value="bangalore">Bangalore</SelectItem>
                      <SelectItem value="hyderabad">Hyderabad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>To</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mumbai">Mumbai</SelectItem>
                      <SelectItem value="delhi">Delhi</SelectItem>
                      <SelectItem value="bangalore">Bangalore</SelectItem>
                      <SelectItem value="hyderabad">Hyderabad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}

            <Button className="w-full" onClick={handleSearch}>
              Search
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 