"use client";

import { create } from "zustand";
import { Participants } from "@/store/project";

interface ParticipantsState {
  participants: Participants[];
  setParticipants: (participants: Participants[]) => void;
  addParticipant: (participant: Participants) => void;
  removeParticipant: (userId: string) => void;
  clearParticipants: () => void;
}

export const useParticipantsStore = create<ParticipantsState>((set) => ({
  participants: [],

  setParticipants: (participants) =>
    set(() => ({
      participants,
    })),

  addParticipant: (participant) =>
    set((state) => ({
      participants: [...state.participants, participant],
    })),

  removeParticipant: (userId) =>
    set((state) => ({
      participants: state.participants.filter(
        (participant) => participant.userId !== userId
      ),
    })),

  clearParticipants: () =>
    set(() => ({
      participants: [],
    })),
}));
