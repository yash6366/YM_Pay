"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function ReferralPage() {
  const { toast } = useToast();
  const referralCode = "YMP" + Math.random().toString(36).substring(2, 8).toUpperCase();

  const handleShare = async () => {
    const referralLink = `https://ym-pay.vercel.app/refer/${referralCode}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Join YM Pay",
          text: "Use my referral code to sign up!",
          url: referralLink,
        });
      } else {
        await navigator.clipboard.writeText(referralLink);
        toast({
          title: "Copied!",
          description: "Referral link copied to clipboard",
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Refer & Earn</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-2xl font-bold mb-2">{referralCode}</p>
            <p className="text-gray-600">Share this code with your friends</p>
          </div>
          <div className="flex gap-4 justify-center">
            <Button onClick={handleShare} className="flex gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}