import { api, handleError } from "@/helpers/api";
import { User, useUserStore } from "@/store/userStore";
import { Participants } from "@/store/project";
import { toast } from "react-toastify";
import { getAllUsers } from "@/services/users.services";

/**
 * Fetch users excluding the current user.
 * @param returnAlsoUsers - If true, both participants and users will be returned.
 * @returns A list of participants, and optionally users if the flag is true.
 */
export const fetchUsersForGroup = async (
    returnAlsoUsers: boolean = false
): Promise<{ participants: Participants[]; users?: User[] }> => {
  try {
    const currentUser = useUserStore.getState().user;
    const response = await getAllUsers();

    const fetchedParticipants = response
      .filter((user: User) => user.uid !== currentUser?.uid)
      .map((user: User) => ({
        userId: user.uid,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        role: "Member",
      }));

    if (returnAlsoUsers) {
      const fetchedUsers = response.filter(
        (user: User) => user.uid !== currentUser?.uid
      );

      return { participants: fetchedParticipants, users: fetchedUsers };
    }

    return { participants: fetchedParticipants };
  } catch (error) {
    const errorMessage = handleError(error);
    toast.error(errorMessage || "An error occurred while loading users");
    return { participants: [] };
  }
};