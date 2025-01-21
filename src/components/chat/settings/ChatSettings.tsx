"use client";

import { useEffect, useState } from 'react';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ChatSettingsProps } from "../types/chat";
import { GroupSettings } from "@/store/groupChat";

interface ExtendedChatSettingsProps extends ChatSettingsProps {
  groupId?: string;
}

export const ChatSettings = ({ 
  isOpen, 
  onClose, 
  settings, 
  onUpdate,
  type,
}: ExtendedChatSettingsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [localSettings, setLocalSettings] = useState<typeof settings>(settings);
  
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings, isOpen]);

  const handleSettingChange = (key: keyof GroupSettings, value: boolean) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Ensure all required fields are present in the settings object
      const completeSettings: GroupSettings = {
        allowFileSharing: localSettings.allowFileSharing,
        allowPinning: localSettings.allowPinning,
        allowReactions: localSettings.allowReactions,
        allowReplies: localSettings.allowReplies,
        muteNotifications: localSettings.muteNotifications,
        onlyAdminsCanPost: localSettings.onlyAdminsCanPost
      };
      
      await onUpdate(completeSettings);
      onClose();
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !isLoading && onClose()}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {type === 'group' ? 'Group Settings' : 'Chat Settings'}
          </AlertDialogTitle>
        </AlertDialogHeader>
        
        <div className="py-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="mute">Mute Notifications</Label>
              <Switch
                id="mute"
                checked={localSettings.muteNotifications}
                onCheckedChange={(checked) => 
                  handleSettingChange('muteNotifications', checked)
                }
                disabled={isLoading}
              />
            </div>

            {type === 'group' && (
              <>
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="files">Allow File Sharing</Label>
                  <Switch
                    id="files"
                    checked={localSettings.allowFileSharing}
                    onCheckedChange={(checked) => 
                      handleSettingChange('allowFileSharing', checked)
                    }
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="pin">Allow Message Pinning</Label>
                  <Switch
                    id="pin"
                    checked={localSettings.allowPinning}
                    onCheckedChange={(checked) => 
                      handleSettingChange('allowPinning', checked)
                    }
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="reactions">Allow Reactions</Label>
                  <Switch
                    id="reactions"
                    checked={localSettings.allowReactions}
                    onCheckedChange={(checked) => 
                      handleSettingChange('allowReactions', checked)
                    }
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="adminsOnly">Only Admins Can Post</Label>
                  <Switch
                    id="adminsOnly"
                    checked={localSettings.onlyAdminsCanPost}
                    onCheckedChange={(checked) => 
                      handleSettingChange('onlyAdminsCanPost', checked)
                    }
                    disabled={isLoading}
                  />
                </div>
              </>
            )}

            {type === 'direct' && (
              <div className="pt-4">
                <Button variant="destructive" className="w-full" disabled={isLoading}>
                  Block User
                </Button>
              </div>
            )}
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};