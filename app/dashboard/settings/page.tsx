"use client"

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
// Import required icons
import { ArrowLeft, User, CircleUser, LogOut, ChevronRight } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();

  // Function to handle signing out
  const handleLogout = async () => {
    try {
      // Call your logout API endpoint
      await fetch("/api/auth/logout", { method: "POST" });
      toast({ title: "Logged out successfully" });
      router.push("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout error:", error);
      toast({ variant: "destructive", title: "Logout failed" });
    }
  };

  // Function to navigate to other pages
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex items-center sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-6 w-6 text-gray-700" />
        </Button>
        <h1 className="text-xl font-semibold ml-4 text-gray-800">Settings</h1>
      </div>

      {/* Options List */}
      <div className="mt-6 bg-white divide-y border-t border-b divide-gray-200 border-gray-200">
        {/* Personal info Item - Updated Link */}
        <div
          className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer"
          // This navigates to the new display page
          onClick={() => handleNavigation('/dashboard/settings/personal-info')}
        >
          <div className="flex items-center">
            <User className="h-5 w-5 text-gray-500 mr-4" />
            <p className="text-base text-gray-700">Personal info</p>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </div>

        {/* Manage Account Item */}
        <div
          className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer"
           // This also navigates to the same edit profile page
          onClick={() => handleNavigation('/dashboard/settings/edit-profile')}
        >
          <div className="flex items-center">
            <CircleUser className="h-5 w-5 text-gray-500 mr-4" />
            <p className="text-base text-gray-700">Manage Account</p>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Sign Out Button */}
      <div className="mt-8 px-4">
         <button
            className="w-full flex items-center p-4 bg-white text-red-600 hover:bg-red-50 rounded-md border border-gray-200 shadow-sm justify-start"
            onClick={handleLogout} // Calls the logout function
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sign out
         </button>
      </div>
    </div>
  );
}
