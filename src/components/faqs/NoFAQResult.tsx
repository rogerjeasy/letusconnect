"use client";
import React from 'react';
import { Search, Filter, ArrowRight, Mail, Bot, MessageSquare, ArrowUp, Clock, HeadphonesIcon } from 'lucide-react';
import { Link } from '@nextui-org/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '../ui/button';

interface NoFAQResultProps {
    onClearFilters: () => void;
    onToggleChatBot: () => void;
  }
  
  export const NoFAQResult: React.FC<NoFAQResultProps> = ({ onClearFilters, onToggleChatBot }) => {
    const handleScrollToTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

  return (
    <Card className="w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 border-2">
      <CardHeader>
        <div className="flex items-center justify-center">
          <div className="bg-primary/10 p-3 rounded-full">
            <Search className="h-6 w-6 text-primary" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <CardTitle className="text-xl">No Matching Results Found</CardTitle>
          <CardDescription className="text-base">
            We could not find any FAQs matching your current search criteria
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* AI Assistant and Support Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* AI Assistant Option */}
          <div className="flex flex-col gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-blue-700 dark:text-blue-300">Ask Our AI Assistant</h3>
            </div>
            <p className="text-sm text-blue-600/80 dark:text-blue-300/80">
              Get instant answers from our AI-powered assistant
            </p>
            <Button
              onClick={onToggleChatBot}
              className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 h-9 px-4 py-2 w-full sm:w-auto transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              Chat with AI Assistant
            </Button>
          </div>

          {/* Support Team Option */}
          <div className="flex flex-col gap-3 p-4 rounded-lg bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2">
              <HeadphonesIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <h3 className="font-semibold text-purple-700 dark:text-purple-300">Contact Support Team</h3>
            </div>
            <p className="text-sm text-purple-600/80 dark:text-purple-300/80">
              Get personalized help from our support team
            </p>
            <Link
              href="/contact-us"
              className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 h-9 px-4 py-2 w-full sm:w-auto transition-colors"
            >
              <Mail className="h-4 w-4" />
              Contact Support
            </Link>
          </div>
        </div>

        {/* Search Suggestions */}
        <div className="space-y-4">
          <div className="bg-background/80 rounded-lg p-4 space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Filter className="h-4 w-4 text-primary" />
              Search Suggestions:
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                Check spelling in your search
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                Use fewer or different keywords
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                Try selecting a different category
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                Browse through all categories
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onClearFilters}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Filter className="h-4 w-4" />
              Clear All Filters
            </button>
            
            <button
              onClick={handleScrollToTop}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <ArrowUp className="h-4 w-4" />
              Back to Top
            </button>
          </div>
        </div>

        {/* Support Availability */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground border-t dark:border-slate-800 pt-4">
          <Clock className="h-4 w-4" />
          Our support team is available 24/7 to assist you
        </div>
      </CardContent>
    </Card>
  );
};