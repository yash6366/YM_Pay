"use client"

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Edit, User as UserIcon } from "lucide-react";

interface UserDisplayInfo {
  firstName: string;
  lastName: string;
  email?: string;
  dob?: string;   // Display as formatted string
  phone: string;
}

export default function PersonalInfoPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [userInfo, setUserInfo] = useState<UserDisplayInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current profile data
  useEffect(() => {
    const fetchInfo = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/user"); // Use your existing user fetch endpoint
        if (!response.ok) throw new Error("Failed to fetch user information");
        const data = await response.json();

        // Format date for display (e.g., DD Mon YYYY) if it exists
        let formattedDob = "Not Provided";
        if (data.dob) {
           try {
              formattedDob = new Date(data.dob).toLocaleDateString('en-GB', {
                 day: '2-digit', month: 'short', year: 'numeric'
              });
           } catch (e) {
              console.error("Error formatting date:", e);
              // Leave as "Not Provided" or use a fallback
           }
        }

        setUserInfo({
          firstName: data.firstName || "N/A",
          lastName: data.lastName || "N/A",
          email: data.email || "Not Provided",
          dob: formattedDob,
          phone: data.phone || "N/A",
        });
      } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Failed to load user information" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchInfo();
  }, [toast]);


  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!userInfo) {
     return (
       <div className="min-h-screen bg-gray-100 p-4">
         {/* Header */}
         <div className="bg-white shadow-sm p-4 flex items-center sticky top-0 z-10 mb-6">
           <Button variant="ghost" size="icon" onClick={() => router.back()}>
             <ArrowLeft className="h-6 w-6 text-gray-700" />
           </Button>
           <h1 className="text-xl font-semibold ml-4 text-gray-800">Personal Info</h1>
         </div>
         <p className="text-center text-red-500">Could not load user information.</p>
       </div>
     );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-6 w-6 text-gray-700" />
          </Button>
          <h1 className="text-xl font-semibold ml-4 text-gray-800">Personal Info</h1>
        </div>
        {/* Edit Button */}
        <Button
            variant="outline"
            size="sm"
            className="rounded-full px-4"
            onClick={() => router.push('/dashboard/settings/edit-profile')}
         >
             <Edit className="h-4 w-4 mr-2" /> Edit
         </Button>
      </div>

      {/* Info Display */}
      <div className="p-4 md:p-8 max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 flex flex-col items-center">
            <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center shadow-md mb-3">
              <UserIcon className="h-12 w-12 text-blue-500" />
            </div>
            <h2 className="text-xl font-semibold text-white">{userInfo.firstName} {userInfo.lastName}</h2>
            <p className="text-blue-100">{userInfo.email}</p>
          </div>
          
          {/* Info Content */}
          <div className="divide-y divide-gray-100">
            <div className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">First Name</p>
                <p className="text-base font-medium mt-1">{userInfo.firstName}</p>
              </div>
            </div>
            
            <div className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Last Name</p>
                <p className="text-base font-medium mt-1">{userInfo.lastName}</p>
              </div>
            </div>
            
            <div className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-base font-medium mt-1">{userInfo.email}</p>
              </div>
            </div>
            
            <div className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                <p className="text-base font-medium mt-1">{userInfo.dob}</p>
              </div>
            </div>
            
            <div className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Phone Number</p>
                <p className="text-base font-medium mt-1">{userInfo.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
