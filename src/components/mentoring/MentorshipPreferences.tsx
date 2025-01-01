import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { User, Users } from 'lucide-react';

interface MentorshipPreferencesProps {
  lookingForMentor: boolean;
  willingToMentor: boolean;
  onUpdate: (field: "lookingForMentor" | "willingToMentor", value: boolean) => void;
  isEditing: boolean;
}

const MentorshipPreferences = ({
  lookingForMentor,
  willingToMentor,
  onUpdate,
  isEditing
}: MentorshipPreferencesProps) => {
  return (
    <Card className="space-y-4">
      <CardHeader className="space-y-1">
        <h3 className="text-lg font-semibold leading-none tracking-tight">
          Mentorship Preferences
        </h3>
        <p className="text-sm text-gray-500">
          Set your mentorship preferences
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <User className="h-5 w-5 text-gray-500" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                Looking for a Mentor
              </p>
              <p className="text-sm text-gray-500">
                Indicates that you are interested in finding a mentor
              </p>
            </div>
          </div>
          <Switch
            checked={lookingForMentor}
            onCheckedChange={(value) => onUpdate("lookingForMentor", value)}
            disabled={!isEditing}
            className="data-[state=checked]:bg-green-600"
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Users className="h-5 w-5 text-gray-500" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                Willing to Mentor
              </p>
              <p className="text-sm text-gray-500">
                Indicates that you are open to mentoring others
              </p>
            </div>
          </div>
          <Switch
            checked={willingToMentor}
            onCheckedChange={(value) => onUpdate("willingToMentor", value)}
            disabled={!isEditing}
            className="data-[state=checked]:bg-green-600"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MentorshipPreferences;