"use client";

import React from 'react';
import { GroupForum } from "@/store/groupForum";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarDays, Users, BookOpen, ScrollText } from 'lucide-react';
import { format } from 'date-fns';

interface GroupDetailsProps {
  group: GroupForum;
}

const GroupDetails = ({ group }: GroupDetailsProps) => {
  const memberCount = (group.members?.length || 0) + (group.admins?.length || 0);
  const eventCount = group.events?.length || 0;
  const resourceCount = group.resources?.length || 0;

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      {/* Header Section */}
      <div className="mb-8">
        <div className="relative rounded-lg overflow-hidden h-48 md:h-64 bg-gradient-to-r from-primary/10 to-primary/5">
          {group.imageUrl && (
            <img
              src={group.imageUrl}
              alt={group.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center -mt-8 md:-mt-16 px-4 relative z-10">
          <div className="bg-background rounded-lg p-4 shadow-lg mb-4 md:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold">{group.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              {group.category?.name && <Badge variant="secondary">{group.category.name}</Badge>}
              {group.privacy && <Badge variant="outline">{group.privacy}</Badge>}
              {group.size && <Badge className="bg-primary/10">{group.size}</Badge>}
            </div>
          </div>
          
          <div className="flex gap-4 items-center bg-background rounded-lg p-4 shadow-lg">
            <div className="text-center">
              <p className="text-2xl font-bold">{memberCount}</p>
              <p className="text-sm text-muted-foreground">Members</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{eventCount}</p>
              <p className="text-sm text-muted-foreground">Events</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{resourceCount}</p>
              <p className="text-sm text-muted-foreground">Resources</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="about" className="space-y-4">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>About {group.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{group.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {group.category && (
                  <div className="space-y-2">
                    <p className="font-semibold">Category</p>
                    <div className="flex items-center gap-2">
                      <Badge>{group.category.name}</Badge>
                      <span className="text-sm text-muted-foreground">{group.category.description}</span>
                    </div>
                  </div>
                )}
                {group.topics && group.topics.length > 0 && (
                  <div className="space-y-2">
                    <p className="font-semibold">Topics</p>
                    <div className="flex flex-wrap gap-2">
                      {group.topics.map(topic => (
                        <Badge key={topic.id} style={{ backgroundColor: topic.color }}>
                          {topic.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>Members ({memberCount})</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.admins?.map(admin => (
                    <div key={admin.uid} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/10">
                      <Avatar>
                        <AvatarImage src={admin.profilePicture} />
                        <AvatarFallback>{admin.username?.charAt(0) || 'A'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{admin.username}</p>
                        <Badge variant="secondary">Admin</Badge>
                      </div>
                    </div>
                  ))}
                  {group.members?.map(member => (
                    <div key={member.userId} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/5">
                      <Avatar>
                        <AvatarFallback>M</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Member</p>
                        <p className="text-sm text-muted-foreground">
                          Joined {format(new Date(member.joinedAt), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events ({eventCount})</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {group.events?.map(event => (
                    <Card key={event.id}>
                      <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div>
                            <h3 className="font-semibold">{event.title}</h3>
                            <p className="text-sm text-muted-foreground">{event.description}</p>
                          </div>
                          <div className="flex flex-col gap-2 text-sm">
                            <div className="flex items-center gap-2">
                              <CalendarDays className="h-4 w-4" />
                              <span>{format(new Date(event.startTime), 'MMM dd, yyyy HH:mm')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <span>{event.attendees?.length || 0} attendees</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle>Resources ({resourceCount})</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {group.resources?.map(resource => (
                    <Card key={resource.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <BookOpen className="h-8 w-8 text-primary" />
                          <div>
                            <h3 className="font-semibold">{resource.title}</h3>
                            <p className="text-sm text-muted-foreground">{resource.description}</p>
                            <div className="mt-2">
                              <Badge variant="secondary">{resource.type}</Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules">
          <Card>
            <CardHeader>
              <CardTitle>Group Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {group.rules?.map(rule => (
                  <div key={rule.id} className="flex gap-4 p-4 rounded-lg bg-secondary/5">
                    <ScrollText className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <h3 className="font-semibold">{rule.title}</h3>
                      <p className="text-sm text-muted-foreground">{rule.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GroupDetails;