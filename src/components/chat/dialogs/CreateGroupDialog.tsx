"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import { Textarea } from "@/components/ui/textarea";
  import { useState } from "react";
  
  interface CreateGroupDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (groupName: string, description: string) => void;
  }
  
  export const CreateGroupDialog = ({
    isOpen,
    onClose,
    onCreate
  }: CreateGroupDialogProps) => {
    const [groupName, setGroupName] = useState("");
    const [description, setDescription] = useState("");
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (groupName.trim()) {
        onCreate(groupName, description);
        setGroupName("");
        setDescription("");
        onClose();
      }
    };
  
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Create New Group</DialogTitle>
            </DialogHeader>
  
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Group Name</Label>
                <Input
                  id="name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Enter group name"
                />
              </div>
  
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter group description"
                />
              </div>
            </div>
  
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={!groupName.trim()}>
                Create Group
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  };