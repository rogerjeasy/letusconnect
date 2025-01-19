"use client";

import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, Send } from 'lucide-react';
import { MessageInputProps } from '../types/chat';

export const MessageInput = ({ onSend, onAttach, disabled }: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message);
      setMessage('');
    }
  };

  const handleAttachment = () => {
    fileInputRef.current?.click();
  };

  return (
    <form onSubmit={handleSubmit} className="border-t p-4">
      <div className="flex items-center gap-2">
        {onAttach && (
          <>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => e.target.files && onAttach(e.target.files)}
              multiple
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleAttachment}
              disabled={disabled}
            >
              <Paperclip className="h-5 w-5" />
            </Button>
          </>
        )}
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
          disabled={disabled}
        />
        <Button type="submit" size="icon" disabled={disabled || !message.trim()}>
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
};