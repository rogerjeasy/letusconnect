"use client";

import { create } from "zustand";
import { Participants } from "@/store/project";

interface ParticipantsState {
  participants: Record<string, Participants[]>; 
  setParticipants: (chatId: string, participants: Participants[]) => void;
  addParticipant: (chatId: string, participant: Participants | Participants[]) => void; 
  removeParticipant: (chatId: string, userId: string | string[]) => void; 
  clearParticipants: (chatId?: string) => void; 
}

export const useParticipantsStore = create<ParticipantsState>((set) => ({
  participants: {},

  setParticipants: (chatId, participants) =>
    set((state) => ({
      participants: {
        ...state.participants,
        [chatId]: participants,
      },
    })),

    addParticipant: (chatId, participant) =>
      set((state) => {
        const existingParticipants = state.participants[chatId] || [];
        const newParticipants = Array.isArray(participant) ? participant : [participant];
    
        // Filter out duplicates based on userId
        const uniqueParticipants = newParticipants.filter(
          (newParticipant) =>
            !existingParticipants.some(
              (existingParticipant) => existingParticipant.userId === newParticipant.userId
            )
        );
    
        return {
          participants: {
            ...state.participants,
            [chatId]: [...existingParticipants, ...uniqueParticipants],
          },
        };
      }),    

  removeParticipant: (chatId, userId) =>
    set((state) => ({
      participants: {
        ...state.participants,
        [chatId]: Array.isArray(userId)
          ? (state.participants[chatId] || []).filter(
              (participant) => !userId.includes(participant.userId)
            ) 
          : (state.participants[chatId] || []).filter(
              (participant) => participant.userId !== userId
            ),
      },
    })),

  clearParticipants: (chatId) =>
    set((state) => ({
      participants: chatId
        ? {
            ...state.participants,
            [chatId]: [],
          } 
        : {}, 
    })),
}));