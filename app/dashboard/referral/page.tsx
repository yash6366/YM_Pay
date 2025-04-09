"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Facebook, Gift, Mail, Share2, Smartphone, Twitter, Users } from "lucide-react"

export default function ReferralPage() {
  const [copied, setCopied] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [email, setEmail] = useState("")

  const referralCode = "FRIEND500"
  const referralLink = `https://finapp.com/refer?code=${referralCode}`

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleInviteByPhone = () => {
    console.log("Inviting by phone:", phoneNumber)
    alert(`Invitation sent to ${phoneNumber}!`)
    setPhoneNumber("")
  }

  const handleInviteByEmail = () => {
    console.log("Inviting by email:", email)
    alert(`Invitation sent to ${email}!`)
    setEmail("")
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Refer & Earn</h1>
        <p className="text-muted-foreground">Invite friends and earn rewards when they join</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Referral Code</CardTitle>
              <CardDescription>Share this code with friends to earn rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Input value={referralCode} readOnly className="font-mono text-lg font-bold text-center" />
                <Button variant="outline" size="icon" onClick={() => handleCopy(referralCode)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Referral Link</CardTitle>
              <CardDescription>Share this link with friends to earn rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Input value={referralLink} readOnly className="text-sm" />
                <Button variant="outline" size="icon" onClick={() => handleCopy(referralLink)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              {copied && <p className="text-sm text-green-600 mt-2">Copied to clipboard!</p>}
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="flex gap-2">
                <Facebook className="h-4 w-4" />
                <span>Facebook</span>
              </Button>
              <Button variant="outline" size="sm" className="flex gap-2">
                <Twitter className="h-4 w-4" />
                <span>Twitter</span>
              </Button>
              <Button variant="outline" size="sm" className="flex gap-2">
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </Button>
              <Button variant="outline" size="sm" className="flex gap-2">
                <Share2 className="h-4 w-4" />
                <span>More</span>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Invite Friends Directly</CardTitle>
              <CardDescription>Send invitations to your friends</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="phone">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="phone">Phone</TabsTrigger>
                  <TabsTrigger value="email">Email</TabsTrigger>
                </TabsList>

                <TabsContent value="phone" className="space-y-4 pt-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <Button onClick={handleInviteByPhone}>Invite</Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    We'll send an SMS with your referral code and a link to download the app.
                  </p>
                </TabsContent>

                <TabsContent value="email" className="space-y-4 pt-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter email address"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button onClick={handleInviteByEmail}>Invite</Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    We'll send an email with your referral code and a link to sign up.
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  1
                </div>
                <div>
                  <h3 className="font-medium">Share Your Code</h3>
                  <p className="text-sm text-muted-foreground">
                    Share your unique referral code or link with friends and family.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  2
                </div>
                <div>
                  <h3 className="font-medium">Friend Signs Up</h3>
                  <p className="text-sm text-muted-foreground">
                    Your friend creates an account using your referral code.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  3
                </div>
                <div>
                  <h3 className="font-medium">Both Get Rewarded</h3>
                  <p className="text-sm text-muted-foreground">
                    Both you and your friend receive â‚¹100 in your wallets.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Referral Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span>Total Referrals</span>
                </div>
                <span className="font-bold">12</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-muted-foreground" />
                  <span>Signed Up</span>
                </div>
                <span className="font-bold">8</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-muted-foreground" />
                  <span>Rewards Earned</span>
                </div>
                <span className="font-bold">â‚¹800</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Terms & Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                <li>Referral bonus is credited after your friend completes their first transaction of â‚¹200 or more.</li>
                <li>Maximum referral bonus per user is â‚¹5,000 per month.</li>
                <li>Referral bonus will be credited within 24 hours of eligible transaction.</li>
                <li>Self-referrals are not allowed and may result in account suspension.</li>
                <li>FinApp reserves the right to modify or terminate the referral program at any time.</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="link" className="px-0">
                View Full Terms
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
