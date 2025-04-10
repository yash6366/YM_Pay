"use client";

import { useState, useEffect } from "react";
import { 
  Bell, 
  Check, 
  ChevronDown, 
  CreditCard, 
  Info, 
  Mail, 
  MoreHorizontal, 
  Settings, 
  ShieldAlert, 
  Trash2, 
  X 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/use-toast";

interface Notification {
  id: string;
  type: 'transaction' | 'account' | 'system' | 'marketing';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    // Simulate API call to fetch notifications
    const fetchNotifications = async () => {
      setIsLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Mock notifications data
      const mockNotifications: Notification[] = [
        {
          id: "1",
      type: "transaction",
          title: "Payment Successful",
          message: "Your payment of $250.00 to Electric Company was successful.",
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: false,
          actionUrl: "/dashboard/transactions"
        },
        {
          id: "2",
          type: "account",
          title: "Profile Updated",
          message: "Your account information has been successfully updated.",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
          read: true
        },
        {
          id: "3",
          type: "system",
      title: "Security Alert",
          message: "We detected a login from a new device. Please verify if this was you.",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
          read: false,
          actionUrl: "/dashboard/security"
        },
        {
          id: "4",
          type: "marketing",
          title: "New Feature Available",
          message: "Try our new budget planning tool to manage your finances better.",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
          read: false,
          actionUrl: "/dashboard/budget"
        },
        {
          id: "5",
          type: "transaction",
          title: "Upcoming Payment",
          message: "You have a scheduled payment of $75.00 to Internet Provider due tomorrow.",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
          read: true
        },
      ];
      
      setNotifications(mockNotifications);
      setIsLoading(false);
    };

    fetchNotifications();
  }, []);

  const filteredNotifications = activeTab === "all" 
    ? notifications 
    : notifications.filter(n => n.type === activeTab);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    toast({
      title: "Notification marked as read",
      duration: 2000,
    });
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    toast({
      title: "Notification deleted",
      duration: 2000,
    });
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    toast({
      title: "All notifications cleared",
      duration: 2000,
    });
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMinutes < 60) {
      return `${diffMinutes} min ago`;
    } else if (diffHours < 24) {
      return `${diffHours} h ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'transaction':
        return <CreditCard className="h-5 w-5" />;
      case 'account':
        return <Settings className="h-5 w-5" />;
      case 'system':
        return <ShieldAlert className="h-5 w-5" />;
      case 'marketing':
        return <Mail className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
        <h1 className="text-3xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadCount} new
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
                <ChevronDown className="h-4 w-4 ml-2" />
                          </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Notification Preferences</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Email Notifications
              </DropdownMenuItem>
              <DropdownMenuItem>
                Push Notifications
              </DropdownMenuItem>
              <DropdownMenuItem>
                Notification Frequency
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={clearAllNotifications}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All Notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
                      </div>
                    </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="all">
            All
            {unreadCount > 0 && <Badge variant="outline" className="ml-2">{unreadCount}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="transaction">Transactions</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          {isLoading ? (
            <Card>
              <CardContent className="flex justify-center items-center h-60">
                <Spinner size="lg" />
              </CardContent>
            </Card>
          ) : filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col justify-center items-center h-60 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No notifications</h3>
                <p className="text-muted-foreground">
                  You don't have any {activeTab !== "all" ? activeTab : ""} notifications at the moment.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <Card key={notification.id} className={notification.read ? "bg-card" : "bg-accent/10"}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-full ${
                          notification.type === 'transaction' ? 'bg-green-100 text-green-600' :
                          notification.type === 'account' ? 'bg-blue-100 text-blue-600' :
                          notification.type === 'system' ? 'bg-red-100 text-red-600' :
                          'bg-purple-100 text-purple-600'
                        }`}>
                          {getIconForType(notification.type)}
                      </div>
                          <div>
                          <CardTitle className="text-base font-semibold">{notification.title}</CardTitle>
                          <CardDescription className="text-xs">
                            {formatDate(notification.timestamp)}
                          </CardDescription>
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {!notification.read && (
                            <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                              <Check className="h-4 w-4 mr-2" />
                              Mark as read
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => deleteNotification(notification.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="text-sm">{notification.message}</p>
                  </CardContent>
                  {notification.actionUrl && (
                    <CardFooter className="pt-0">
                      <Button variant="link" className="p-0 h-auto text-sm" asChild>
                        <a href={notification.actionUrl}>View details</a>
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}