"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Facebook, Gift, Mail, Share2, Smartphone, Twitter, Users, Share, ChevronRight } from "lucide-react"
import { toast } from 'sonner'

interface Referral {
  id: string
  name: string
  email: string
  date: string
  status: 'pending' | 'registered' | 'completed'
}

export default function ReferralPage() {
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalInvites: 0,
    signups: 0,
    completed: 0,
    rewards: '$0',
  })

  useEffect(() => {
    // Mock API call to fetch referrals
    const fetchReferrals = async () => {
      setIsLoading(true)
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock data
        const mockReferrals: Referral[] = [
          {
            id: '1',
            name: 'John Doe',
            email: 'john.doe@example.com',
            date: '2023-09-15T10:30:00',
            status: 'completed',
          },
          {
            id: '2',
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            date: '2023-10-02T14:45:00',
            status: 'registered',
          },
          {
            id: '3',
            name: 'Alice Johnson',
            email: 'alice.johnson@example.com',
            date: '2023-10-10T09:15:00',
            status: 'pending',
          },
          {
            id: '4',
            name: 'Bob Brown',
            email: 'bob.brown@example.com',
            date: '2023-10-12T16:20:00',
            status: 'pending',
          },
        ]
        
        setReferrals(mockReferrals)
        setStats({
          totalInvites: 15,
          signups: 8,
          completed: 5,
          rewards: '$250',
        })
      } catch (error) {
        console.error('Error fetching referrals:', error)
        toast.error('Failed to load referral data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchReferrals()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500'
      case 'registered':
        return 'text-blue-500'
      default:
        return 'text-orange-500'
    }
  }

  const copyReferralLink = () => {
    navigator.clipboard.writeText('https://ym-pay.com/register?ref=USER123')
      .then(() => {
        toast.success('Referral link copied to clipboard')
      })
      .catch(() => {
        toast.error('Failed to copy referral link')
      })
  }

  const shareReferral = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join YM-Pay',
        text: 'Sign up for YM-Pay using my referral link and get a bonus!',
        url: 'https://ym-pay.com/register?ref=USER123',
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error))
    } else {
      toast.info('Share functionality is not available on this device')
    }
  }

  return (
    <div className="container max-w-4xl py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Refer & Earn</h1>
        <p className="text-muted-foreground">
          Invite your friends to YM-Pay and earn rewards when they complete their first transaction.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Total Invites</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-8 w-8 text-primary mr-3" />
              <div className="text-3xl font-bold">{stats.totalInvites}</div>
            </div>
          </CardContent>
        </Card>
        
          <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Successful Sign-ups</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500 mr-3" />
              <div className="text-3xl font-bold">{stats.signups}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Rewards Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Gift className="h-8 w-8 text-green-500 mr-3" />
              <div className="text-3xl font-bold">{stats.rewards}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-10">
            <CardHeader>
              <CardTitle>Your Referral Link</CardTitle>
          <CardDescription>
            Share this link with friends to earn rewards.
          </CardDescription>
            </CardHeader>
            <CardContent>
          <div className="flex gap-2">
            <Input
              value="https://ym-pay.com/register?ref=USER123"
              readOnly
              className="font-mono text-sm"
            />
            <Button variant="outline" size="icon" onClick={copyReferralLink}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
        <CardFooter>
          <Button className="w-full sm:w-auto" onClick={shareReferral}>
            <Share className="h-4 w-4 mr-2" />
            Share Referral Link
              </Button>
            </CardFooter>
          </Card>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Invites</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Referrals</CardTitle>
              <CardDescription>
                Track all your referrals here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : referrals.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <Users className="h-10 w-10 mx-auto mb-4 opacity-20" />
                  <p>No referrals yet</p>
                  <p className="text-sm mt-2">
                    Share your referral link to start earning rewards
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {referrals.map((referral) => (
                    <div key={referral.id} className="py-4 flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{referral.name}</h4>
                        <div className="text-sm text-muted-foreground">{referral.email}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Invited on {formatDate(referral.date)}
              </div>
                </div>
                      <div className="flex items-center">
                        <span className={`text-sm font-medium mr-2 ${getStatusColor(referral.status)}`}>
                          {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                        </span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Referrals</CardTitle>
              <CardDescription>
                Users who haven't completed their first transaction yet.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : referrals.filter(r => r.status === 'pending').length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <Users className="h-10 w-10 mx-auto mb-4 opacity-20" />
                  <p>No pending referrals</p>
                </div>
              ) : (
                <div className="divide-y">
                  {referrals
                    .filter(referral => referral.status === 'pending')
                    .map((referral) => (
                      <div key={referral.id} className="py-4 flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{referral.name}</h4>
                          <div className="text-sm text-muted-foreground">{referral.email}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Invited on {formatDate(referral.date)}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm font-medium mr-2 text-orange-500">
                            Pending
                          </span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
              </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed Referrals</CardTitle>
              <CardDescription>
                Users who completed their first transaction and earned you a reward.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : referrals.filter(r => r.status === 'completed').length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <Gift className="h-10 w-10 mx-auto mb-4 opacity-20" />
                  <p>No completed referrals yet</p>
                </div>
              ) : (
                <div className="divide-y">
                  {referrals
                    .filter(referral => referral.status === 'completed')
                    .map((referral) => (
                      <div key={referral.id} className="py-4 flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{referral.name}</h4>
                          <div className="text-sm text-muted-foreground">{referral.email}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Completed on {formatDate(referral.date)}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm font-medium mr-2 text-green-500">
                            Completed
                          </span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
