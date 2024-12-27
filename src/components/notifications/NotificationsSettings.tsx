"use client";

import React, { useState } from "react";
import { Switch, Button, Card, CardBody, Input } from "@nextui-org/react";

interface NotificationTypePreference {
  type: string;
  enabled: boolean;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  preferences: NotificationTypePreference[];
  autoArchiveDays: number;
}

const NotificationsSettings: React.FC = () => {
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    preferences: [
      { type: "Messages", enabled: true },
      { type: "Events", enabled: true },
      { type: "Reminders", enabled: false },
      { type: "System", enabled: true },
      { type: "Custom", enabled: false },
    ],
    autoArchiveDays: 7,
  });

  const handleToggle = (type: string) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      preferences: prevSettings.preferences.map((preference) =>
        preference.type === type
          ? { ...preference, enabled: !preference.enabled }
          : preference
      ),
    }));
  };

  const handleNotificationToggle = (field: "emailNotifications" | "pushNotifications") => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [field]: !prevSettings[field],
    }));
  };

  const handleAutoArchiveChange = (days: number) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      autoArchiveDays: days,
    }));
  };

  const handleSave = () => {
    console.log("Saved Settings:", settings);
    // Add logic to save settings to a backend or localStorage
  };

  return (
    <div className="p-6">
      <Card className="shadow-lg p-6 max-w-4xl mx-auto">
        <CardBody>
          <h2 className="text-2xl font-bold mb-6 text-center">🔧 Notification Settings</h2>

          {/* Toggle Email & Push Notifications */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">General Preferences</h3>
            <div className="flex justify-between items-center mb-4">
              <p>Email Notifications</p>
              <Switch
                isSelected={settings.emailNotifications}
                onChange={() => handleNotificationToggle("emailNotifications")}
              />
            </div>
            <div className="flex justify-between items-center">
              <p>Push Notifications</p>
              <Switch
                isSelected={settings.pushNotifications}
                onChange={() => handleNotificationToggle("pushNotifications")}
              />
            </div>
          </div>

          {/* Toggle Preferences for Notification Types */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Notification Types</h3>
            {settings.preferences.map((preference) => (
              <div key={preference.type} className="flex justify-between items-center mb-4">
                <p>{preference.type}</p>
                <Switch
                  isSelected={preference.enabled}
                  onChange={() => handleToggle(preference.type)}
                />
              </div>
            ))}
          </div>

          {/* Auto-Archive Notifications */}
        <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Custom Actions</h3>
        <div className="flex justify-between items-center">
            <p>Auto-Archive Notifications After (Days)</p>
            <Input
            type="number"
            value={settings.autoArchiveDays.toString()} // Convert number to string
            min="1"
            max="30"
            onChange={(e) => handleAutoArchiveChange(Number(e.target.value))} // Convert back to number
            className="w-20"
            />
        </div>
        </div>


          {/* Save Button */}
          <div className="flex justify-center">
            <Button color="primary" onClick={handleSave}>
              Save Settings
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default NotificationsSettings;