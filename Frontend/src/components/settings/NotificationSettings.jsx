import { useState } from "react";

export default function NotificationSettings() {
  const [settings, setSettings] = useState({
    email: true,
    sms: false,
    ecoTips: true,
    communityUpdates: true,
  });

  const toggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Notification Settings</h2>

      <SettingItem
        label="Email Notifications"
        value={settings.email}
        onToggle={() => toggle("email")}
      />

      <SettingItem
        label="SMS Alerts"
        value={settings.sms}
        onToggle={() => toggle("sms")}
      />

      <SettingItem
        label="Eco Tips & Awareness"
        value={settings.ecoTips}
        onToggle={() => toggle("ecoTips")}
      />

      <SettingItem
        label="Community Announcements"
        value={settings.communityUpdates}
        onToggle={() => toggle("communityUpdates")}
      />
    </div>
  );
}

function SettingItem({ label, value, onToggle }) {
  return (
    <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
      <span>{label}</span>
      <button
        onClick={onToggle}
        className={`px-4 py-1 rounded-full font-semibold ${
          value ? "bg-green-500 text-black" : "bg-gray-400 text-black"
        }`}
      >
        {value ? "ON" : "OFF"}
      </button>
    </div>
  );
}
