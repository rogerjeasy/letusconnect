"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";
import { 
  LogIn, 
  UserPlus, 
  Home, 
  Mail, 
  Phone,
  MessageCircle
} from 'lucide-react';
import Image from 'next/image';

const LogoutPage = () => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        
        {/* Goodbye Message Section */}
        <div className="text-center mb-12">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <Image
              src="/api/placeholder/128/128"
              alt="Logo"
              fill
              className="rounded-full"
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            You&apos;ve Been Successfully Logged Out
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Thank you for using our platform. We hope to see you again soon!
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Login Again Card */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <LogIn className="w-6 h-6 text-blue-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-800">Login Again</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Ready to jump back in? Log in to access your account and continue where you left off.
            </p>
            <Button 
              onClick={() => handleNavigation('/login')}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Login
            </Button>
          </div>

          {/* Create New Account Card */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <UserPlus className="w-6 h-6 text-green-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-800">Create Account</h3>
            </div>
            <p className="text-gray-600 mb-4">
              New here? Create a new account to explore all our features and services.
            </p>
            <Button 
              onClick={() => handleNavigation('/register')}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Register
            </Button>
          </div>

          {/* Homepage Card */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <Home className="w-6 h-6 text-purple-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-800">Visit Homepage</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Explore our platform&apos;s features and learn more about what we offer.
            </p>
            <Button 
              onClick={() => handleNavigation('/')}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Go to Homepage
            </Button>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-xl shadow-md p-8 max-w-3xl mx-auto">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Need Help?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center">
              <Mail className="w-8 h-8 text-gray-600 mb-3" />
              <h4 className="font-semibold mb-2">Email Support</h4>
              <p className="text-gray-600 text-sm">support@letusconnect.com</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Phone className="w-8 h-8 text-gray-600 mb-3" />
              <h4 className="font-semibold mb-2">Phone Support</h4>
              <p className="text-gray-600 text-sm">1-800-123-4567</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <MessageCircle className="w-8 h-8 text-gray-600 mb-3" />
              <h4 className="font-semibold mb-2">Live Chat</h4>
              <p className="text-gray-600 text-sm">Available 24/7</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-6 text-gray-600 text-sm">
        © 2024 Your Company Name. All rights reserved.
      </div>
    </div>
  );
};

export default LogoutPage;