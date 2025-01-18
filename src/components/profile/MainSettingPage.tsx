"use client";

import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Bell,
  Briefcase,
  Key,
  Layout,
  Lock,
  Menu,
  MessageSquare,
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
import { useUserStore } from '@/store/userStore';

interface NavigationItem {
    id: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
  }

  interface SettingsPageProps {
    initialTab?: string;
  }

  const SettingsPage: React.FC<SettingsPageProps> = ({ initialTab = 'account' }) => {
    const [activeContent, setActiveContent] = useState(initialTab);
    const { user, isAuthenticated, loading, checkSession } = useUserStore();
    const [isOpen, setIsOpen] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
  
    useEffect(() => {
      const current = searchParams.get('current');
      if (current) {
        setActiveContent(current);
        // setIsOpen(true);
      }
    }, [searchParams]);

    useEffect(() => {
        if (!isAuthenticated) {
          checkSession();
        }
      }, [checkSession, isAuthenticated]);
  
    const navigationItems: NavigationItem[] = [
      { id: "account", icon: Key, label: "Account" },
      { id: "privacy", icon: Lock, label: "Privacy" },
      { id: "notifications", icon: Bell, label: "Notifications" },
      { id: "communication", icon: MessageSquare, label: "Communication" },
      { id: "professional", icon: Briefcase, label: "Professional" },
      { id: "network", icon: Users, label: "Network" },
      { id: "appearance", icon: Layout, label: "Appearance" },
    ];
  
    const handleNavClick = (contentId: string) => {
      setActiveContent(contentId);
      setIsOpen(false);
      router.push(`/platform-settings?current=${contentId}`);
    };

    const renderContent = () => {
        switch (activeContent) {
            case "account":
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Account Settings</h2>
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
                                            <Input id="primaryEmail" placeholder={user?.email} className="max-w-xs" disabled={true} />
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
                    </div>
                );
    
            case "privacy":
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Privacy Settings</h2>
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
                    </div>
                );
    
            case "notifications":
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Notification Preferences</h2>
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
                                        <p className="text-sm text-muted-foreground">When you are invited to an event.</p>
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
                    </div>
                );
    
            case "communication":
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Communication Preferences</h2>
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
                    </div>
                );
    
            case "professional":
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Professional Settings</h2>
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
                    </div>
                );
    
            case "network":
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Network Settings</h2>
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
                </div>
            );

        case "appearance":
            return (
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold">Appearance Settings</h2>
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
                </div>
            );

        default:
            return null;
    }
};

if (loading) {
    return (
      <section className="bg-gradient-to-r from-blue-50 via-white to-blue-50 py-16">
        <div className="container mx-auto px-6 lg:px-20 text-center">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

return (
    <div className="container mx-auto py-4 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground mt-2">
              Manage your account settings and set your preferences.
            </p>
          </div>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <Button variant="outline" size="icon" className="lg:hidden" onClick={() => setIsOpen(true)}>
              <Menu className="h-4 w-4" />
            </Button>
            <SheetContent side="left" className="w-64">
              <SheetHeader>
                <SheetTitle>Settings Navigation</SheetTitle>
              </SheetHeader>
              <div className="mt-4 flex flex-col space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant={activeContent === item.id ? "default" : "ghost"}
                      className="justify-start"
                      onClick={() => handleNavClick(item.id)}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </Button>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
  
        <div className="flex gap-6">
          {/* Desktop Navigation */}
          <div className="hidden lg:flex flex-col space-y-2 w-48">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeContent === item.id ? "default" : "ghost"}
                  className="justify-start"
                  onClick={() => handleNavClick(item.id)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              );
            })}
          </div>
  
          {/* Content Area */}
          <div className="flex-1 min-h-[600px] p-4 border rounded-lg">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;