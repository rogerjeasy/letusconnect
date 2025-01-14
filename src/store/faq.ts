"use client";

export interface FAQ {
    id: string;
    question: string;
    response: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    category: string;
    username: string;
    status: string;
}
  
export interface FAQResponse {
    message: string;
    data: FAQ;
}
  
export interface FAQsResponse {
    data: FAQ[];
}