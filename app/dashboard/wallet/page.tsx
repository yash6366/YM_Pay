"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function WalletPage() {
  const [balance, setBalance] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch("/api/user");
        const data = await response.json();
        setBalance(Number(data.balance ?? 0));
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch wallet balance",
        });
      }
    };

    fetchBalance();
  }, [toast]);

  return (
    <div className="container mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>My Wallet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <p className="text-gray-600">Available Balance</p>
            <p className="text-4xl font-bold">₹{Number(balance ?? 0).toFixed(2)}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/dashboard/add-money">
              <Button className="w-full flex gap-2">
                <ArrowDownIcon className="w-4 h-4" />
                Add Money
              </Button>
            </Link>
            <Link href="/dashboard/send-money">
              <Button className="w-full flex gap-2">
                <ArrowUpIcon className="w-4 h-4" />
                Send Money
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}