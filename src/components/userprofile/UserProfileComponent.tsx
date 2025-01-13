import React, { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Briefcase, Book, Award, MapPin, Globe, Mail, Phone, Check, UserCheck, Users, Activity, RefreshCcw } from 'lucide-react';
import { User, useUserStore, WorkExperience } from "@/store/userStore";
import { Skill } from "@/store/skills";
import { ExpertiseSkill } from "@/store/areaOfExpertise";
import { format } from "date-fns";
import { useRouter } from 'next/navigation';
import { Tooltip } from '@nextui-org/react';
import { useUserConnections } from '../connectstudents/GetUserConnectionNumbers';

interface UserProfileProps {
  user: User;
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const userWorkExperience = useUserStore((state) => state.workExperience);
  const router = useRouter();
  const { count, loading, error, refetch } = useUserConnections({
    userId: user.uid,
    maxRetries: 3,
    retryDelay: 1000
  });



  const renderConnectionBadge = () => {
    const content = loading ? (
      <span className="flex items-center gap-1">
        <RefreshCcw className="h-4 w-4 animate-spin" />
        Loading...
      </span>
    ) : error ? (
      <span className="flex items-center gap-1 cursor-pointer" onClick={refetch}>
        <RefreshCcw className="h-4 w-4" />
        Retry
      </span>
    ) : (
      <span className="flex items-center gap-1">
        <Users className="h-4 w-4" />
        {count} {count <= 1 ? 'Connection' : 'Connections'}
      </span>
    );

    return (
      <Tooltip 
        content={error || "Click to see connections"} 
        placement="top"
      >
        <Badge
          variant="outline"
          className={`flex gap-1 ${!error && 'cursor-pointer'}`}
          onClick={() => {
            if (!error && !loading) {
              router.push(`/connections/${user.uid}`);
            }
          }}
        >
          {content}
        </Badge>
      </Tooltip>
    );
  };
  
  return (
    // p-6 max-w-5xl mx-auto pt-28
    <div className="container mx-auto p-4 space-y-6">
      <Card className="w-full max-w-4xl mx-auto mt-10 flex flex-col">
        <CardHeader className="flex flex-col items-center text-center pb-4">
            <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={user.profilePicture} alt={`${user.firstName} ${user.lastName}`} />
                <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
            </Avatar>
            <div className="space-y-4 w-full">
                <div className="flex flex-col items-center gap-2">
                    <CardTitle className="text-2xl">
                        {user.firstName && user.lastName 
                            ? `${user.firstName} ${user.lastName}`
                            : user.username}
                    </CardTitle>
                    <div className="flex flex-wrap justify-center gap-2">
                        {user.role?.map((role) => (
                            <Badge key={role} variant="secondary">{role}</Badge>
                        ))}
                    </div>
                </div>
                <CardDescription className="text-lg">{user.currentJobTitle || 'No job title'}</CardDescription>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center justify-center gap-1">
                        <Mail className="h-4 w-4" />
                        {user.email || 'Email not available'}
                    </div>
                    <div className="flex items-center justify-center gap-1">
                        <Phone className="h-4 w-4" />
                        {user.phoneNumber || 'Phone not available'}
                    </div>
                </div>
                </div>
        </CardHeader>

        <CardContent className="space-y-2">
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-4">
                <Badge variant="outline" className="flex gap-1">
                <Activity className="h-4 w-4" />
                {user.isActive ? 'Active' : 'Inactive'}
                </Badge>
                <Badge variant="outline" className="flex gap-1">
                <Check className="h-4 w-4" />
                {user.isVerified ? 'Verified' : 'Unverified'}
                </Badge>
                {renderConnectionBadge()}

                {user.lookingForMentor && (
                <Badge variant="secondary">Looking for Mentor</Badge>
                )}
                {user.willingToMentor && (
                <Badge variant="secondary">Available to Mentor</Badge>
                )}
            </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{user.bio}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {user.interests?.map((interest) => (
                  <Badge key={interest} variant="outline">{interest}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Areas of Expertise</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {user.areasOfExpertise?.map((expertise: ExpertiseSkill) => (
                <Badge key={expertise} variant="secondary">
                  {expertise}
                </Badge>
              ))}
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <Book className="h-4 w-4" />
                <span className="font-medium">{user.program}</span>
              </div>
              <Badge variant="outline">Class of {user.graduationYear}</Badge>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Skills & Languages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Technical Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.skills?.map((skill: Skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.languages?.map((language) => (
                      <Badge key={language} variant="outline">{language}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Work Experience</CardTitle>
            </CardHeader>
            <CardContent>
              {userWorkExperience?.workExperiences.map((work: WorkExperience) => (
                <div key={work.id} className="space-y-2">
                  <div className="flex justify-between">
                    <h4 className="font-medium">{work.position}</h4>
                    <span className="text-sm text-muted-foreground">
                      {work.startDate && format(new Date(work.startDate), 'MMM yyyy')} - 
                      {work.endDate ? format(new Date(work.endDate), 'MMM yyyy') : 'Present'}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{work.company}</p>
                  <p className="text-sm text-muted-foreground">{work.city}, {work.country}</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {work.responsibilities.map((resp, idx) => (
                      <li key={idx}>{resp}</li>
                    ))}
                    {work.achievements.map((achievement, idx) => (
                      <li key={`achievement-${idx}`} className="text-green-600">{achievement}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Certifications & Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Certifications</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.certifications?.map((cert) => (
                      <Badge key={cert} variant="secondary">{cert}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Projects</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.projects?.map((project) => (
                      <Badge key={project} variant="outline">{project}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;