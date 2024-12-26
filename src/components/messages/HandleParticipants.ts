import { api, handleError } from "@/helpers/api";
import { User, useUserStore } from "@/store/userStore";
import { Participants } from "@/store/project";
import { toast } from "react-toastify";

/**
 * Fetch users excluding the current user.
 * @returns A list of participants (filtered users).
 */
export const fetchUsersForGroup = async (): Promise<Participants[]> => {
  try {
    const currentUser = useUserStore.getState().user;
    const response = await api.get("/api/users");

    const fetchedParticipants = response.data.users
      .filter((user: User) => user.uid !== currentUser?.uid)
      .map((user: User) => ({
        userId: user.uid,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        role: "Member",
      }));

    return fetchedParticipants;
  } catch (error) {
    const errorMessage = handleError(error);
    toast.error(errorMessage || "An error occurred while loading users");
    return [];
  }
};