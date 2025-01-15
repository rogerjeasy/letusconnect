"use client";

import React, { useState, useMemo } from "react";
import { Search, Filter, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FAQ } from "@/store/faq";
import { faqCategories, getLabel } from "../dropdownoptions/faqCategories";
import { getAllFAQs } from "@/services/faq.service";
import { NoFAQResult } from "./NoFAQResult";
import Link from "next/link";

const FAQComponent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [displayCount, setDisplayCount] = useState<number>(10);

  const ITEMS_PER_PAGE = 10;

  // Correct useQuery hook with proper typing
  const { data: faqs = [], isLoading, error } = useQuery<FAQ[], Error>({
    queryKey: ["faqs"],
    queryFn: getAllFAQs,
    staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
    refetchOnWindowFocus: false, // Disable refetching on window focus
  });

  // Function to highlight text based on search query
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;

    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="bg-yellow-200 dark:bg-yellow-800">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
  };

  // Filter FAQs based on search query and category
  const filteredFAQs = useMemo(() => {
    return faqs.filter((faq: FAQ) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.response.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [faqs, searchQuery, selectedCategory]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Rest of the component remains the same */}
      <div className="text-center space-y-4">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Frequently Asked Questions
        </h1>
        <p className="text-xl text-muted-foreground">
          Find answers to common questions about our platform and services
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
        {/* Cards section remains the same */}
        <Card className="group bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-blue-500 dark:text-blue-400 transition-transform duration-300 group-hover:scale-110" />
              <CardTitle className="text-blue-700 dark:text-blue-300">Quick Search</CardTitle>
            </div>
            <CardDescription className="text-blue-600/80 dark:text-blue-300/80">
              Use the search bar below to find specific answers instantly
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="group bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-purple-500 dark:text-purple-400 transition-transform duration-300 group-hover:scale-110" />
              <CardTitle className="text-purple-700 dark:text-purple-300">Categories</CardTitle>
            </div>
            <CardDescription className="text-purple-600/80 dark:text-purple-300/80">
              Browse questions by topic to find relevant information
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="group bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-emerald-500 dark:text-emerald-400 transition-transform duration-300 group-hover:scale-110" />
              <CardTitle className="text-emerald-700 dark:text-emerald-300">Can't Find Answer?</CardTitle>
            </div>
            <CardDescription className="text-emerald-600/80 dark:text-emerald-300/80">
              Contact our support team for additional assistance
            </CardDescription>
            <Link 
              href="/contact-us"
              className="mt-4 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-emerald-600 text-white hover:bg-emerald-700 h-10 px-4 py-2 group-hover:scale-105 duration-300"
            >
              Contact Support
            </Link>
          </CardHeader>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select
          value={selectedCategory}
          onValueChange={setSelectedCategory}
        >
          <SelectTrigger className="w-full md:w-[280px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {faqCategories.map((category) => (
              <SelectItem key={category.key} value={category.key}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredFAQs.length === 0 ? (
        <NoFAQResult onClearFilters={handleClearFilters} />
      ) : (
        <ScrollArea className="h-[700px] rounded-md border p-4">
          <Accordion type="single" collapsible className="space-y-4">
            {filteredFAQs.slice(0, displayCount).map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="border rounded-lg p-2"
              >
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-2 text-left">
                    <div className="flex-1">
                      {highlightText(faq.question, searchQuery)}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="whitespace-nowrap">
                        {getLabel(faqCategories, faq.category)}
                      </Badge>
                      <Badge 
                        variant={faq.status === 'active' ? 'default' : 'secondary'}
                        className="whitespace-nowrap"
                      >
                        {faq.status}
                      </Badge>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <Card>
                    <CardContent className="space-y-4">
                      <div className="prose dark:prose-invert max-w-none">
                        {highlightText(faq.response, searchQuery)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Last updated: {format(new Date(faq.updatedAt), 'PPpp')}
                      </div>
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          {filteredFAQs.length > 10 && (
            <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
              {displayCount > ITEMS_PER_PAGE && (
                <button
                  onClick={() => setDisplayCount(prev => Math.max(ITEMS_PER_PAGE, prev - ITEMS_PER_PAGE))}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                >
                  Show Less
                </button>
              )}
              {displayCount < filteredFAQs.length && (
                <button
                  onClick={() => setDisplayCount(prev => Math.min(filteredFAQs.length, prev + ITEMS_PER_PAGE))}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                  Show More
                </button>
              )}
              <span className="text-sm text-muted-foreground">
                Showing {Math.min(displayCount, filteredFAQs.length)} of {filteredFAQs.length} FAQs
              </span>
            </div>
          )}
        </ScrollArea>
      )}
    </div>
  );
};

export default FAQComponent;