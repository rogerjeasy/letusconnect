"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertCircle,
  Bell,
  Briefcase,
  Globe,
  Key,
  Layout,
  Lock,
  Mail,
  MessageSquare,
  Settings,
  Users
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import DevelopmentModal from "@/components/utils/DevelopmentModal"

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("account");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    // Implement save functionality
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and set your preferences.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 mb-8">
            <TabsTrigger value="account">
              <Key className="h-4 w-4 mr-2" />
              Account
            </TabsTrigger>
            <TabsTrigger value="privacy">
              <Lock className="h-4 w-4 mr-2" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="communication">
              <MessageSquare className="h-4 w-4 mr-2" />
              Communication
            </TabsTrigger>
            <TabsTrigger value="professional">
              <Briefcase className="h-4 w-4 mr-2" />
              Professional
            </TabsTrigger>
            <TabsTrigger value="network">
              <Users className="h-4 w-4 mr-2" />
              Network
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <Layout className="h-4 w-4 mr-2" />
              Appearance
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[800px]">
            {/* Account Settings */}
            <TabsContent value="account">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Email Preferences</CardTitle>
                    <CardDescription>Manage your email settings and communication preferences.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="primaryEmail">Primary Email</Label>
                        <Input id="primaryEmail" placeholder="your@email.com" className="max-w-xs" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Marketing Emails</Label>
                          <p className="text-sm text-muted-foreground">Receive updates about new features and opportunities.</p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Password Management</CardTitle>
                    <CardDescription>Update your password and security settings.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DevelopmentModal 
                      buttonText="Change Password"
                      buttonVariant="outline"
                      title="Password Management Coming Soon"
                      description="We're implementing secure password management features. Soon you'll be able to change your password and set up additional security measures."
                      icon="construction"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Two-Factor Authentication</CardTitle>
                    <CardDescription>Add an extra layer of security to your account.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DevelopmentModal 
                      buttonText="Enable 2FA"
                      buttonVariant="outline"
                      title="Two-Factor Authentication Coming Soon"
                      description="We're working on implementing secure two-factor authentication to protect your account."
                      icon="construction"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    <CardDescription>Permanently delete or deactivate your account.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Deactivate Account</h4>
                        <p className="text-sm text-muted-foreground">Temporarily disable your account.</p>
                      </div>
                      <DevelopmentModal 
                        buttonText="Deactivate"
                        buttonVariant="outline"
                        title="Account Deactivation Coming Soon"
                        description="Account deactivation functionality is currently under development."
                        icon="alert"
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-destructive">Delete Account</h4>
                        <p className="text-sm text-muted-foreground">Permanently delete your account and all data.</p>
                      </div>
                      <DevelopmentModal 
                        buttonText="Delete Account"
                        buttonVariant="destructive"
                        title="Account Deletion Coming Soon"
                        description="Account deletion functionality is currently under development. This will permanently remove all your data."
                        icon="alert"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Privacy Controls */}
            <TabsContent value="privacy">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Visibility</CardTitle>
                    <CardDescription>Control who can see your profile and information.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Public Profile</Label>
                        <p className="text-sm text-muted-foreground">Make your profile visible to everyone.</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="space-y-2">
                      <Label>Who can view your profile</Label>
                      <Select defaultValue="connections">
                        <SelectTrigger>
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="everyone">Everyone</SelectItem>
                          <SelectItem value="connections">Connections only</SelectItem>
                          <SelectItem value="nobody">Nobody</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Connection Settings</CardTitle>
                    <CardDescription>Manage who can connect with you.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Connection Requests</Label>
                        <p className="text-sm text-muted-foreground">Allow others to send you connection requests.</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="space-y-2">
                      <Label>Who can send you messages</Label>
                      <Select defaultValue="connections">
                        <SelectTrigger>
                          <SelectValue placeholder="Select messaging permissions" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="everyone">Everyone</SelectItem>
                          <SelectItem value="connections">Connections only</SelectItem>
                          <SelectItem value="nobody">Nobody</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Notification Preferences */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Email Notifications</CardTitle>
                  <CardDescription>Choose what emails you want to receive.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>New Connections</Label>
                      <p className="text-sm text-muted-foreground">When someone connects with you.</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Messages</Label>
                      <p className="text-sm text-muted-foreground">When you receive a new message.</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Event Invitations</Label>
                      <p className="text-sm text-muted-foreground">When you&apos;re invited to an event.</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Job Opportunities</Label>
                      <p className="text-sm text-muted-foreground">New job postings matching your interests.</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Weekly Digest</Label>
                      <p className="text-sm text-muted-foreground">Weekly summary of activities and opportunities.</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Communication Settings */}
            <TabsContent value="communication">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Language & Region</CardTitle>
                    <CardDescription>Set your preferred language and timezone.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Language</Label>
                      <Select defaultValue="en">
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Timezone</Label>
                      <Select defaultValue="utc">
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="utc">UTC</SelectItem>
                          <SelectItem value="est">EST</SelectItem>
                          <SelectItem value="pst">PST</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Calendar Integration</CardTitle>
                    <CardDescription>Sync your calendar for events and meetings.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DevelopmentModal 
                      buttonText="Connect Calendar"
                      buttonVariant="outline"
                      title="Calendar Integration Coming Soon"
                      description="We're working on adding calendar integration features to help you manage your events and meetings."
                      icon="construction"
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Professional Preferences */}
            <TabsContent value="professional">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Career Preferences</CardTitle>
                    <CardDescription>Set your professional interests and job preferences.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Open to Opportunities</Label>
                        <p className="text-sm text-muted-foreground">Let recruiters know you&apos;re open to new opportunities.</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="space-y-2">
                      <Label>Industry Preferences</Label>
                      <Select defaultValue="tech">
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tech">Technology</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Expected Salary Range</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="range1">$50k - $75k</SelectItem>
                          <SelectItem value="range2">$75k - $100k</SelectItem>
                          <SelectItem value="range3"></SelectItem>
                          <SelectItem value="range3">$100k - $150k</SelectItem>
                          <SelectItem value="range4">$150k+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Job Alerts</CardTitle>
                    <CardDescription>Customize your job notification preferences.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Job Alerts</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications for matching job opportunities.</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="space-y-2">
                      <Label>Alert Frequency</Label>
                      <Select defaultValue="daily">
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="realtime">Real-time</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Network Settings */}
            <TabsContent value="network">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Connection Preferences</CardTitle>
                    <CardDescription>Manage your networking preferences.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Connection Suggestions</Label>
                        <p className="text-sm text-muted-foreground">Receive suggestions for new connections.</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Profile Visibility in Search</Label>
                        <p className="text-sm text-muted-foreground">Allow your profile to appear in search results.</p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Group Settings</CardTitle>
                    <CardDescription>Manage your group participation settings.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Group Invitations</Label>
                        <p className="text-sm text-muted-foreground">Allow others to invite you to groups.</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Group Activity Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive updates from your groups.</p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Content Sharing</CardTitle>
                    <CardDescription>Control how your content is shared.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Default Share Settings</Label>
                      <Select defaultValue="connections">
                        <SelectTrigger>
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="connections">Connections only</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Appearance Settings */}
            <TabsContent value="appearance">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Theme Settings</CardTitle>
                    <CardDescription>Customize your visual experience.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Theme Mode</Label>
                      <Select defaultValue="system">
                        <SelectTrigger>
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Dashboard Layout</CardTitle>
                    <CardDescription>Customize your dashboard view.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Default View</Label>
                      <Select defaultValue="grid">
                        <SelectTrigger>
                          <SelectValue placeholder="Select layout" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="grid">Grid</SelectItem>
                          <SelectItem value="list">List</SelectItem>
                          <SelectItem value="compact">Compact</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Accessibility</CardTitle>
                    <CardDescription>Customize accessibility settings.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Reduced Motion</Label>
                        <p className="text-sm text-muted-foreground">Minimize animations throughout the interface.</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>High Contrast</Label>
                        <p className="text-sm text-muted-foreground">Increase contrast for better visibility.</p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsPage;