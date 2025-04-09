"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ThumbsUp } from "lucide-react"

export default function FeedbackPage() {
  const [rating, setRating] = useState<string>("")
  const [feedbackType, setFeedbackType] = useState<string>("")
  const [feedbackText, setFeedbackText] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [submitted, setSubmitted] = useState<boolean>(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ rating, feedbackType, feedbackText, email })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="container mx-auto py-12">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <ThumbsUp className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Thank You for Your Feedback!</h2>
            <p className="text-muted-foreground mb-4">
              We appreciate you taking the time to share your thoughts with us. Your feedback helps us improve our
              services.
            </p>
            <Button onClick={() => setSubmitted(false)}>Submit Another Response</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Share Your Feedback</h1>
        <p className="text-muted-foreground">Help us improve our services by sharing your experience</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>How would you rate your experience?</CardTitle>
              <CardDescription>
                Select a rating that best describes your overall experience with our app
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={rating} onValueChange={setRating} className="flex flex-wrap gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <div key={value} className="flex items-center">
                    <RadioGroupItem value={value.toString()} id={`rating-${value}`} className="peer sr-only" />
                    <Label
                      htmlFor={`rating-${value}`}
                      className="flex flex-col items-center justify-center w-16 h-16 rounded-md border-2 cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                    >
                      <span className="text-2xl font-bold">{value}</span>
                      <span className="text-xs text-muted-foreground">
                        {value === 1
                          ? "Poor"
                          : value === 2
                            ? "Fair"
                            : value === 3
                              ? "Good"
                              : value === 4
                                ? "Very Good"
                                : "Excellent"}
                      </span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What would you like to share?</CardTitle>
              <CardDescription>Select the type of feedback you want to provide</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={feedbackType} onValueChange={setFeedbackType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select feedback type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="suggestion">Suggestion</SelectItem>
                  <SelectItem value="bug">Bug Report</SelectItem>
                  <SelectItem value="compliment">Compliment</SelectItem>
                  <SelectItem value="complaint">Complaint</SelectItem>
                  <SelectItem value="feature">Feature Request</SelectItem>
                </SelectContent>
              </Select>

              <div className="space-y-2">
                <Label htmlFor="feedback">Your Feedback</Label>
                <Textarea
                  id="feedback"
                  placeholder="Please share your thoughts, ideas, or concerns..."
                  rows={5}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Optional: Leave your email if you'd like us to follow up</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  We'll only use your email to respond to your feedback. We won't share it with anyone else.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end mt-6">
          <Button type="submit" disabled={!rating || !feedbackType || !feedbackText}>
            Submit Feedback
          </Button>
        </div>
      </form>

      <Card>
        <CardHeader>
          <CardTitle>Why Your Feedback Matters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            At FinApp, we're committed to providing the best possible experience for our users. Your feedback helps us:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>Identify areas where we can improve</li>
            <li>Develop new features that meet your needs</li>
            <li>Fix bugs and issues that affect your experience</li>
            <li>Understand what we're doing well and should continue</li>
          </ul>
          <p className="text-muted-foreground">
            We review all feedback regularly and use it to guide our product development decisions.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
