"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Bell, Check, CreditCard, Info, Phone, Shield, Tv } from "lucide-react"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Mobile Recharge Successful",
      description: "Your mobile recharge of â‚¹199 was successful.",
      date: "Today, 10:30 AM",
      type: "transaction",
      read: false,
      icon: Phone,
    },
    {
      id: 2,
      title: "DTH Recharge Failed",
      description: "Your DTH recharge of â‚¹499 failed. Please try again.",
      date: "Yesterday, 3:45 PM",
      type: "transaction",
      read: false,
      icon: Tv,
    },
    {
      id: 3,
      title: "Security Alert",
      description: "We noticed a login from a new device. Please verify if it was you.",
      date: "May 10, 2023",
      type: "security",
      read: true,
      icon: Shield,
    },
    {
      id: 4,
      title: "Cashback Received",
      description: "You received â‚¹50 cashback on your last transaction.",
      date: "May 8, 2023",
      type: "promotion",
      read: true,
      icon: CreditCard,
    },
    {
      id: 5,
      title: "New Feature Available",
      description: "Try our new UPI payment feature for faster transactions.",
      date: "May 5, 2023",
      type: "promotion",
      read: true,
      icon: Info,
    },
  ])

  const [settings, setSettings] = useState({
    transactions: true,
    promotions: true,
    security: true,
    email: true,
    push: true,
    sms: false,
  })

  const handleMarkAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
  }

  const handleClearAll = () => {
    setNotifications([])
  }

  const handleSettingChange = (key: keyof typeof settings) => {
    setSettings({ ...settings, [key]: !settings[key] })
  }

  const getUnreadCount = (type?: string) => {
    return notifications.filter((n) => !n.read && (!type || n.type === type)).length
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <p className="text-muted-foreground">Stay updated with your account activities</p>
      </div>

      <Tabs defaultValue="all">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all" className="relative">
              All
              {getUnreadCount() > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {getUnreadCount()}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="transactions" className="relative">
              Transactions
              {getUnreadCount("transaction") > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {getUnreadCount("transaction")}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="promotions">Promotions</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
              Mark all as read
            </Button>
            <Button variant="outline" size="sm" onClick={handleClearAll}>
              Clear all
            </Button>
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <Card key={notification.id} className={notification.read ? "opacity-70" : ""}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <notification.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{notification.title}</h3>
                          <p className="text-sm text-muted-foreground">{notification.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification.date}</p>
                        </div>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            <Check className="h-4 w-4" />
                            <span className="sr-only">Mark as read</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 flex flex-col items-center justify-center">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No notifications</h3>
                <p className="text-muted-foreground text-center">
                  You're all caught up! We'll notify you when there's something new.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          {notifications.filter((n) => n.type === "transaction").length > 0 ? (
            notifications
              .filter((n) => n.type === "transaction")
              .map((notification) => (
                <Card key={notification.id} className={notification.read ? "opacity-70" : ""}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <notification.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{notification.title}</h3>
                            <p className="text-sm text-muted-foreground">{notification.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">{notification.date}</p>
                          </div>
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              <Check className="h-4 w-4" />
                              <span className="sr-only">Mark as read</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
          ) : (
            <Card>
              <CardContent className="p-8 flex flex-col items-center justify-center">
                <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No transaction notifications</h3>
                <p className="text-muted-foreground text-center">
                  You don't have any transaction notifications at the moment.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="promotions" className="space-y-4">
          {notifications.filter((n) => n.type === "promotion").length > 0 ? (
            notifications
              .filter((n) => n.type === "promotion")
              .map((notification) => (
                <Card key={notification.id} className={notification.read ? "opacity-70" : ""}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <notification.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{notification.title}</h3>
                            <p className="text-sm text-muted-foreground">{notification.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">{notification.date}</p>
                          </div>
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              <Check className="h-4 w-4" />
                              <span className="sr-only">Mark as read</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
          ) : (
            <Card>
              <CardContent className="p-8 flex flex-col items-center justify-center">
                <Info className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No promotional notifications</h3>
                <p className="text-muted-foreground text-center">
                  You don't have any promotional notifications at the moment.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          {notifications.filter((n) => n.type === "security").length > 0 ? (
            notifications
              .filter((n) => n.type === "security")
              .map((notification) => (
                <Card key={notification.id} className={notification.read ? "opacity-70" : ""}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <notification.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{notification.title}</h3>
                            <p className="text-sm text-muted-foreground">{notification.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">{notification.date}</p>
                          </div>
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              <Check className="h-4 w-4" />
                              <span className="sr-only">Mark as read</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
          ) : (
            <Card>
              <CardContent className="p-8 flex flex-col items-center justify-center">
                <Shield className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No security notifications</h3>
                <p className="text-muted-foreground text-center">
                  You don't have any security notifications at the moment.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Manage how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium">Notification Types</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="transactions" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Transaction Notifications
                </Label>
                <Switch
                  id="transactions"
                  checked={settings.transactions}
                  onCheckedChange={() => handleSettingChange("transactions")}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="promotions" className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Promotional Notifications
                </Label>
                <Switch
                  id="promotions"
                  checked={settings.promotions}
                  onCheckedChange={() => handleSettingChange("promotions")}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="security" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Security Alerts
                </Label>
                <Switch
                  id="security"
                  checked={settings.security}
                  onCheckedChange={() => handleSettingChange("security")}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Notification Channels</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="email">Email Notifications</Label>
                <Switch id="email" checked={settings.email} onCheckedChange={() => handleSettingChange("email")} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="push">Push Notifications</Label>
                <Switch id="push" checked={settings.push} onCheckedChange={() => handleSettingChange("push")} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sms">SMS Notifications</Label>
                <Switch id="sms" checked={settings.sms} onCheckedChange={() => handleSettingChange("sms")} />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save Settings</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
