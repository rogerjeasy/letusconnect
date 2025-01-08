"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Bot,
  Send,
  X,
  MessageSquare,
  Loader2,
  User,
} from "lucide-react";
import { getConversations, sendChatMessage } from '@/services/chatgpt.service';
import { useUserStore } from '@/store/userStore';

interface Message {
    id: string;
    createdAt: string;
    message: string;
    response: string;
    role: 'assistant' | 'user';
  }

const AIAssistant: React.FC = () => {
  const currentUser = useUserStore((state) => state.user);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
        id: 'initial',
        createdAt: new Date().toISOString(),
        message: '',
        response: currentUser 
          ? `Hello ${currentUser.username}! 👋 I'm your AI assistant. How can I help you navigate our website or answer any questions you might have?`
          : 'Hello! 👋 I\'m your AI assistant. How can I help you navigate our website or answer any questions you might have?',
        role: 'assistant'
      }
  ]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentConversationId, setCurrentConversationId] = useState<string | undefined>();
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const initializeChat = async () => {
    setIsInitializing(true);
    if (currentUser) {
      try {
        const conversations = await getConversations();
        if (conversations && conversations.length > 0) {
          const latestConversation = conversations[conversations.length - 1];
          setCurrentConversationId(latestConversation.id);
          
          const mappedMessages: Message[] = latestConversation.messages.flatMap(msg => [
            {
              id: msg.id,
              createdAt: msg.createdAt,
              message: msg.message,
              response: '',
              role: 'user' as const 
            },
            {
              id: msg.id + '_response',
              createdAt: msg.createdAt,
              message: '',
              response: msg.response,
              role: 'assistant' as const
            }
          ]);
          
          setMessages(mappedMessages);
        } else {
          resetToInitialMessage(true);
        }
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
        resetToInitialMessage(true);
      }
    } else {
      resetToInitialMessage(false);
    }
    setIsInitializing(false);
  };

  const resetToInitialMessage = (isLoggedIn: boolean) => {
    const welcomeMessage = isLoggedIn && currentUser
      ? `Hello ${currentUser.username}! 👋 I'm your AI assistant. How can I help you navigate our website or answer any questions you might have?`
      : 'Hello! 👋 I\'m your AI assistant. How can I help you navigate our website or answer any questions you might have?';

    setMessages([{
      id: 'initial',
      createdAt: new Date().toISOString(),
      message: '',
      response: welcomeMessage,
      role: 'assistant'
    }]);
    setCurrentConversationId(undefined);
  };

  // Watch for changes in currentUser
  useEffect(() => {
    initializeChat();
  }, [currentUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      const conversation = await sendChatMessage(userMessage, currentConversationId);
      
      // Get the latest message from the conversation
      const latestMessage = conversation.messages[conversation.messages.length - 1];
      
      // Update conversation ID if this is a new conversation
      if (!currentConversationId) {
        setCurrentConversationId(conversation.id);
      }

      // Update messages with the new exchange
      setMessages(prev => [
        ...prev,
        {
          id: latestMessage.id,
          createdAt: latestMessage.createdAt,
          message: latestMessage.message,
          response: latestMessage.response,
          role: 'user'
        },
        {
          id: latestMessage.id + '_response',
          createdAt: latestMessage.createdAt,
          message: '',
          response: latestMessage.response,
          role: 'assistant'
        }
      ]);
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages(prev => [
        ...prev,
        {
          id: 'error_' + Date.now(),
          createdAt: new Date().toISOString(),
          message: userMessage,
          response: 'Sorry, I encountered an error while processing your message. Please try again.',
          role: 'assistant'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderAvatar = (role: 'assistant' | 'user') => {
    if (role === 'assistant') {
      return (
        <Avatar className="h-8 w-8 bg-gray-600 flex items-center justify-center">
          <Bot className="h-4 w-4 text-white" />
        </Avatar>
      );
    }
   
    if (currentUser && currentUser.profilePicture) {
      return (
        <Avatar className="h-8 w-8 flex items-center justify-center">
          <AvatarImage src={currentUser.profilePicture} alt={currentUser.username} className="object-cover" />
          <AvatarFallback className="bg-blue-600 flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </AvatarFallback>
        </Avatar>
      );
    }
   
    return (
      <Avatar className="h-8 w-8 bg-blue-600 flex items-center justify-center">
        <User className="h-4 w-4 text-white" />
      </Avatar>
    );
};

if (isInitializing) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Card className="w-96 h-96 flex items-center justify-center border-2 shadow-xl">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 relative">
              <div className="w-16 h-16 rounded-full border-4 border-blue-200 animate-spin border-t-blue-600"></div>
            </div>
            <p className="text-gray-600 text-sm">Loading your conversations...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                    <Button
                        className="h-14 w-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 relative"
                        onClick={() => setIsOpen(true)}
                    >
                        <div className="relative">
                        <MessageSquare className="h-6 w-6 text-white" />
                        <div className="absolute -top-4 -right-4">
                            <div className="bg-white rounded-full p-1">
                            <Bot className="h-4 w-4 text-blue-600" />
                            </div>
                        </div>
                        </div>
                    </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        Click Me to Assist You and Guide you through our Website
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            
          </motion.div>
        )}

        {isOpen && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="w-96"
          >
            <Card className="border-2 shadow-xl">
              <div className="p-4 border-b flex justify-between items-center bg-blue-600 text-white rounded-t-lg">
                <div className="flex items-center space-x-2">
                  <Bot className="h-5 w-5" />
                  <span className="font-semibold">AI Assistant</span>
                </div>
                <div className="absolute right-4 bg-red-600 rounded">
                    <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white hover:bg-red-700 rounded-full"
                    onClick={() => setIsOpen(false)}
                    >
                    <X className="h-4 w-4" />
                    </Button>
                </div>
              </div>

              <ScrollArea className="h-96 p-4">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`flex items-start space-x-2 max-w-[80%] ${
                          message.role === 'user' ? 'flex-row-reverse' : ''
                        }`}
                      >
                        {renderAvatar(message.role)}
                        <div className="flex flex-col">
                          <div
                            className={`rounded-lg p-3 ${
                              message.role === 'user'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            {(message.role === 'user' ? message.message : message.response).split(/(\*\*[^*]+\*\*)/).map((part, index) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                                return <strong key={index}>{part.slice(2, -2)}</strong>;
                            }
                            return part;
                            })}
                          </div>
                          <span 
                            className={`text-xs text-gray-500 mt-1 ${
                              message.role === 'user' ? 'text-right' : 'text-left'
                            }`}
                          >
                            {new Date(message.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex items-center space-x-2">
                        {renderAvatar('assistant')}   
                        <div className="bg-gray-100 rounded-lg p-3">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <Input
                    value={input}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIAssistant;