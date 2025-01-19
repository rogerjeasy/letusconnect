"use client";

import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, Send, Smile } from 'lucide-react';
import { MessageInputProps } from '../types/chat';
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { AttachmentDropdown } from './AttachmentDropdown';

export const MessageInput = ({ onSend, onAttach, disabled }: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

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

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleAttachDocument = () => {
    console.log("Document attached");
  };
  
  const handleAttachPhotos = () => {
    console.log("Photos attached");
  };
  
  const handleAttachCamera = () => {
    console.log("Camera opened");
  };
  
  const handleAttachLocation = () => {
    console.log("Location shared");
  };

  return (
    <form onSubmit={handleSubmit} className="border-t p-4">
      <div className="flex items-center gap-2">
        {onAttach && (
          <AttachmentDropdown
          onAttachDocument={handleAttachDocument}
          onAttachPhotos={handleAttachPhotos}
          onAttachCamera={handleAttachCamera}
          onAttachLocation={handleAttachLocation}
        />
        )}
        <div className="relative">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            disabled={disabled}
          >
            <Smile className="h-5 w-5" color="#f39c12" />
          </Button>
          {showEmojiPicker && (
            <div className="absolute bottom-14 left-0 z-10 bg-white shadow-lg rounded-md">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>
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