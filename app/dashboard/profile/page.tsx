"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation';
import { 
  User, 
  ArrowLeft, 
  MoreVertical, 
  QrCode, 
  LinkIcon, 
  Settings, 
  HelpCircle, 
  Wallet,
  Users
} from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { QRCodeCanvas } from 'qrcode.react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

interface UserProfile {
  firstName: string
  lastName: string
  phone: string
  upiId?: string
  balance?: number
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    phone: "",
    upiId: "",
    balance: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const { toast } = useToast()
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true); // Start loading
      try {
        const response = await fetch("/api/user")
        if (!response.ok) {
          throw new Error("Failed to fetch profile")
        }
        const data = await response.json()
        setProfile({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          phone: data.phone || "",
          balance: data.balance || 0,
          // Generate the full UPI intent URL for the QR code
          upiId: `upi://pay?pa=${data.phone}@ympay&pn=${encodeURIComponent(data.firstName + ' ' + data.lastName)}&mc=0000&tid=&tr=&tn=Payment&am=&cu=INR`
        })
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile data",
        })
      } finally {
        setIsLoading(false); // Stop loading
      }
    }
    fetchProfile()
  }, [toast])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100"> {/* Light bg */}
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    )
  }

  const handleReferral = async () => {
    const referralLink = "https://ym-5ndqpk4ub-yashwanthnaidum2408-gmailcoms-projects.vercel.app/";
    const shareData = {
      title: "Join me on YM-Pay!",
      text: `Check out YM-Pay, a great app for payments: ${referralLink}`,
      url: referralLink,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast({
          title: "Shared successfully!",
          description: "Referral link sent.",
        });
      } else {
        await navigator.clipboard.writeText(referralLink);
        toast({
          title: "Link Copied!",
          description: "Referral link copied to clipboard. Share it with your friends!",
        });
      }
    } catch (err) {
      console.error("Share failed:", err);
      try {
        await navigator.clipboard.writeText(referralLink);
      toast({
          title: "Link Copied!",
          description: "Sharing failed. Link copied to clipboard instead.",
        });
      } catch (copyErr) {
        console.error("Copy failed:", copyErr);
      toast({
        variant: "destructive",
        title: "Error",
          description: "Could not share or copy the referral link.",
        });
      }
    }
  };

  const handleAction = (action: string) => {
    if (action === 'QR code') {
      setIsQrModalOpen(true);
    } else if (action === 'Settings') {
      router.push('/dashboard/settings');
    } else if (action === 'Invite a friend') {
      handleReferral();
    } else {
       toast({
         title: "Action Triggered",
         description: `${action} clicked (placeholder).`,
       })
    }
  }

  // Helper to extract VPA for display
  const getVpaDisplay = (upiId: string | undefined): string => {
    if (!upiId) return 'Not set';
    try {
      const url = new URL(upiId);
      return url.searchParams.get('pa') || 'Not set';
    } catch {
      // Fallback if it's somehow not a valid URL (though it should be)
      return upiId.split('pa=')[1]?.split('&')[0] || 'Not set';
    }
  }

  return (
    <div className="min-h-screen bg-gray-100"> {/* Light bg */}
      {/* Header - Adjusted for light theme */}
      <div className="bg-white shadow-sm flex items-center justify-between p-4 sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
          <ArrowLeft className="h-6 w-6 text-gray-700" />
        </Button>
        <h1 className="text-xl font-semibold text-gray-800">Profile</h1>
        <Button variant="ghost" size="icon" onClick={() => handleAction('More options')}>
          <MoreVertical className="h-6 w-6 text-gray-700" />
        </Button>
              </div>

      {/* Profile Info - Adjusted for light theme */}
      <div className="px-4 pt-6 pb-6 bg-white border-b">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">{profile.firstName.toUpperCase()} {profile.lastName.toUpperCase()}</h1>
            <p className="text-sm text-gray-500 mt-1">UPI ID: {getVpaDisplay(profile.upiId)}</p>
            <div className="flex items-center mt-2">
              <p className="text-lg text-gray-700 mr-2">{profile.phone}</p>
              <Button 
                variant="outline"
                size="sm"
                className="border-blue-500 text-blue-600 hover:bg-blue-50 text-xs h-7 px-2"
                onClick={() => handleAction('Link UPI number')}
              >
                <LinkIcon className="h-3 w-3 mr-1" />
                Link UPI number
              </Button>
            </div>
            </div>
          <div className="relative">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
              <User className="h-10 w-10 text-blue-600" />
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-white hover:bg-gray-100 border shadow-sm"
              onClick={() => handleAction('QR code')} 
            >
              <QrCode className="h-5 w-5 text-blue-600" />
            </Button>
          </div>
        </div>
      </div>

      {/* Wallet Balance Section - Adjusted for light theme */}
      <div className="px-4 py-4 bg-blue-50 mt-4 mx-4 rounded-lg border border-blue-100">
        <div className="flex items-center">
          <Wallet className="h-6 w-6 text-blue-600 mr-3" />
          <div>
             <p className="text-sm text-blue-800">Wallet Balance</p>
             <p className="text-xl font-semibold text-blue-900">₹{profile.balance?.toFixed(2) ?? '0.00'}</p>
          </div>
        </div>
      </div>

      {/* Options List - Adjusted for light theme */}
      <div className="mt-6 bg-white mx-4 rounded-lg border divide-y divide-gray-200">
        <div className="flex items-center p-4 hover:bg-gray-50 cursor-pointer rounded-t-lg" onClick={() => handleAction('QR code')}>
          <QrCode className="h-6 w-6 text-gray-500 mr-4" />
          <div className="flex-grow">
            <p className="text-base font-medium text-gray-700">Your QR code</p>
            <p className="text-xs text-gray-500">Use to receive money from any UPI app</p>
          </div>
        </div>
        <div className="flex items-center p-4 hover:bg-gray-50 cursor-pointer" onClick={() => handleAction('Invite a friend')}>
          <Users className="h-6 w-6 text-gray-500 mr-4" />
          <p className="text-base font-medium text-gray-700 flex-grow">Invite a friend</p>
        </div>
        <div className="flex items-center p-4 hover:bg-gray-50 cursor-pointer" onClick={() => handleAction('Settings')}>
          <Settings className="h-6 w-6 text-gray-500 mr-4" />
          <p className="text-base font-medium text-gray-700 flex-grow">Settings</p>
        </div>
        <div className="flex items-center p-4 hover:bg-gray-50 cursor-pointer rounded-b-lg" onClick={() => handleAction('Get help')}>
          <HelpCircle className="h-6 w-6 text-gray-500 mr-4" />
          <p className="text-base font-medium text-gray-700 flex-grow">Get help</p>
        </div>
      </div>

      {/* QR Code Modal - Kept light for contrast */}
      <Dialog open={isQrModalOpen} onOpenChange={setIsQrModalOpen}>
        <DialogContent className="bg-white text-gray-900 sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-semibold">Scan QR to Pay</DialogTitle>
            <DialogDescription className="text-center text-sm text-gray-500">
              Scan this QR code using any UPI app to pay {profile.firstName.toUpperCase()} {profile.lastName.toUpperCase()}.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-6">
            {profile.upiId ? (
              <QRCodeCanvas 
                value={profile.upiId}
                size={256} 
                bgColor={"#ffffff"} 
                fgColor={"#000000"} 
                level={"L"} 
                includeMargin={true} 
              />
            ) : (
              <p className="text-red-500">UPI ID not available.</p> 
            )}
            <p className="mt-4 font-medium">{profile.firstName} {profile.lastName}</p>
            <p className="text-sm text-gray-600 font-mono break-all">{getVpaDisplay(profile.upiId)}</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsQrModalOpen(false)} className="w-full bg-blue-600 hover:bg-blue-700 text-white">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

