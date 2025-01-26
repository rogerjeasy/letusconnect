"use client";

import { api, handleError } from "@/helpers/api";
import { API_CONFIG } from "@/config/api.config";
import { toast } from "react-toastify";
import { GroupForum, Resource } from "@/store/groupForum";



export const createGroup = async (groupData: Partial<GroupForum>): Promise<GroupForum> => {
  try {
    const response = await api.post(API_CONFIG.ENDPOINTS.GROUP_FORUMS.CREATE, groupData);
    toast.success("Group created successfully");
    return response.data.data;
  } catch (error) {
    const errorMessage = handleError(error);
    toast.error("Failed to create group: " + errorMessage);
    throw new Error(errorMessage || "Failed to create group");
  }
};

export const getGroupById = async (id: string): Promise<GroupForum> => {
  try {
    const response = await api.get(API_CONFIG.ENDPOINTS.GROUP_FORUMS.BY_ID(id));
    return response.data.data;
  } catch (error) {
    const errorMessage = handleError(error);
    throw new Error(errorMessage || "Failed to fetch group");
  }
};

export const updateGroup = async (id: string, groupData: Partial<GroupForum>): Promise<GroupForum> => {
  try {
    const response = await api.put(API_CONFIG.ENDPOINTS.GROUP_FORUMS.BY_ID(id), groupData);
    toast.success("Group updated successfully");
    return response.data.data;
  } catch (error) {
    const errorMessage = handleError(error);
    toast.error("Failed to update group: " + errorMessage);
    throw new Error(errorMessage);
  }
};

export const deleteGroup = async (id: string): Promise<void> => {
  try {
    await api.delete(API_CONFIG.ENDPOINTS.GROUP_FORUMS.BY_ID(id));
    toast.success("Group deleted successfully");
  } catch (error) {
    const errorMessage = handleError(error);
    toast.error("Failed to delete group: " + errorMessage);
    throw new Error(errorMessage);
  }
};

export const listGroups = async (): Promise<GroupForum[]> => {
  try {
    const response = await api.get(API_CONFIG.ENDPOINTS.GROUP_FORUMS.LIST);
    return response.data.data;
  } catch (error) {
    const errorMessage = handleError(error);
    throw new Error(errorMessage || "Failed to fetch groups");
  }
};

export const listOwnerAndMemberGroups = async (): Promise<GroupForum[]> => {
  try {
    const response = await api.get(API_CONFIG.ENDPOINTS.GROUP_FORUMS.OWNER_MEMBER);
    return response.data.data;
  } catch (error) {
    const errorMessage = handleError(error);
    throw new Error(errorMessage || "Failed to fetch groups");
  }
};

export const searchGroups = async (query: string): Promise<GroupForum[]> => {
  try {
    const response = await api.get(`${API_CONFIG.ENDPOINTS.GROUP_FORUMS.SEARCH}?q=${query}`);
    return response.data.data;
  } catch (error) {
    const errorMessage = handleError(error);
    throw new Error(errorMessage || "Failed to search groups");
  }
};

export const addMember = async (groupId: string, userId: string): Promise<void> => {
  try {
    await api.post(API_CONFIG.ENDPOINTS.GROUP_FORUMS.MEMBERS.ADD(groupId), { userId });
    toast.success("Member added successfully");
  } catch (error) {
    const errorMessage = handleError(error);
    toast.error("Failed to add member: " + errorMessage);
    throw new Error(errorMessage);
  }
};

export const removeMember = async (groupId: string, userId: string): Promise<void> => {
  try {
    await api.delete(API_CONFIG.ENDPOINTS.GROUP_FORUMS.MEMBERS.REMOVE(groupId, userId));
    toast.success("Member removed successfully");
  } catch (error) {
    const errorMessage = handleError(error);
    toast.error("Failed to remove member: " + errorMessage);
    throw new Error(errorMessage);
  }
};

export const uploadGroupImage = async (groupId: string, file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post(API_CONFIG.ENDPOINTS.GROUP_FORUMS.IMAGES.UPLOAD(groupId), formData);
    toast.success("Image uploaded successfully");
    return response.data.imageUrl;
  } catch (error) {
    const errorMessage = handleError(error);
    toast.error("Failed to upload image: " + errorMessage);
    throw new Error(errorMessage);
  }
};

export const addEvent = async (groupId: string, eventData: Partial<Event>): Promise<Event> => {
  try {
    const response = await api.post(API_CONFIG.ENDPOINTS.GROUP_FORUMS.EVENTS.CREATE(groupId), eventData);
    toast.success("Event added successfully");
    return response.data.data;
  } catch (error) {
    const errorMessage = handleError(error);
    toast.error("Failed to add event: " + errorMessage);
    throw new Error(errorMessage);
  }
};

export const removeEvent = async (groupId: string, eventId: string): Promise<void> => {
  try {
    await api.delete(API_CONFIG.ENDPOINTS.GROUP_FORUMS.EVENTS.DELETE(groupId, eventId));
    toast.success("Event removed successfully");
  } catch (error) {
    const errorMessage = handleError(error);
    toast.error("Failed to remove event: " + errorMessage);
    throw new Error(errorMessage);
  }
};

export const addResource = async (groupId: string, resourceData: Partial<Resource>): Promise<Resource> => {
  try {
    const response = await api.post(API_CONFIG.ENDPOINTS.GROUP_FORUMS.RESOURCES.ADD(groupId), resourceData);
    toast.success("Resource added successfully");
    return response.data.data;
  } catch (error) {
    const errorMessage = handleError(error);
    toast.error("Failed to add resource: " + errorMessage);
    throw new Error(errorMessage);
  }
};

export const removeResource = async (groupId: string, resourceId: string): Promise<void> => {
  try {
    await api.delete(API_CONFIG.ENDPOINTS.GROUP_FORUMS.RESOURCES.REMOVE(groupId, resourceId));
    toast.success("Resource removed successfully");
  } catch (error) {
    const errorMessage = handleError(error);
    toast.error("Failed to remove resource: " + errorMessage);
    throw new Error(errorMessage);
  }
};

export const updateGroupSettings = async (groupId: string, settings: Partial<GroupForum>): Promise<void> => {
  try {
    await api.put(API_CONFIG.ENDPOINTS.GROUP_FORUMS.SETTINGS.UPDATE(groupId), settings);
    toast.success("Settings updated successfully");
  } catch (error) {
    const errorMessage = handleError(error);
    toast.error("Failed to update settings: " + errorMessage);
    throw new Error(errorMessage);
  }
};