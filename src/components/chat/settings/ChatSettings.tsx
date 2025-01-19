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
  
  export const ChatSettings = ({ 
    isOpen, 
    onClose, 
    settings, 
    onUpdate,
    type 
  }: ChatSettingsProps) => {
    const handleSettingChange = (key: keyof typeof settings, value: boolean) => {
      onUpdate({ [key]: value });
    };
  
    return (
      <AlertDialog open={isOpen} onOpenChange={onClose}>
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
                  checked={settings.muteNotifications}
                  onCheckedChange={(checked) => 
                    handleSettingChange('muteNotifications', checked)
                  }
                />
              </div>
  
              {type === 'group' && (
                <>
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="files">Allow File Sharing</Label>
                    <Switch
                      id="files"
                      checked={settings.allowFileSharing}
                      onCheckedChange={(checked) => 
                        handleSettingChange('allowFileSharing', checked)
                      }
                    />
                  </div>
  
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="pin">Allow Message Pinning</Label>
                    <Switch
                      id="pin"
                      checked={settings.allowPinning}
                      onCheckedChange={(checked) => 
                        handleSettingChange('allowPinning', checked)
                      }
                    />
                  </div>
  
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="reactions">Allow Reactions</Label>
                    <Switch
                      id="reactions"
                      checked={settings.allowReactions}
                      onCheckedChange={(checked) => 
                        handleSettingChange('allowReactions', checked)
                      }
                    />
                  </div>
  
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="adminsOnly">Only Admins Can Post</Label>
                    <Switch
                      id="adminsOnly"
                      checked={settings.onlyAdminsCanPost}
                      onCheckedChange={(checked) => 
                        handleSettingChange('onlyAdminsCanPost', checked)
                      }
                    />
                  </div>
                </>
              )}
  
              {type === 'direct' && (
                <div className="pt-4">
                  <Button variant="destructive" className="w-full">
                    Block User
                  </Button>
                </div>
              )}
            </div>
          </div>
  
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Save Changes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };