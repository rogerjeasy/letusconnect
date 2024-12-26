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
    set((state) => ({
      participants: {
        ...state.participants,
        [chatId]: Array.isArray(participant)
          ? [...(state.participants[chatId] || []), ...participant] 
          : [...(state.participants[chatId] || []), participant],
      },
    })),

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