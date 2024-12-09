"use client";

import LoggedInMentoringMenu from "./LoggedInMentoringMenu";
import NonLoggedInMentoringMenu from "./NonLoggedInMentoringMenu";
import { useUserStore } from "@/store/userStore";

export default function MentoringMenu() {
    const { user, isAuthenticated } = useUserStore();
  return (
    <div>
      {isAuthenticated ? <LoggedInMentoringMenu /> : <NonLoggedInMentoringMenu />}
    </div>
  );
}