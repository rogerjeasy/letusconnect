import { GroupChat } from "@/store/groupChat";
import { DirectMessage } from "@/store/message";

export const IsUserAdminOrOwner = (chat: GroupChat | DirectMessage, userId: string): boolean => {
    if ('participants' in chat) {
        const onlyAdminsCanPost = chat.groupSettings?.onlyAdminsCanPost;
        if (!onlyAdminsCanPost) return true;
        
        const userParticipant = chat.participants?.find(p => p.userId === userId);
        return userParticipant?.role === 'admin' || userParticipant?.role === 'owner';
    }
    
    return true;
};