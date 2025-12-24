import { useState } from "react";

export default function PrivacySettings() {
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    shareEcoScore: false,
    allowDataUsage: true,
  });

  const toggle = (key) => {
    setPrivacy({ ...privacy, [key]: !privacy[key] });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Privacy Settings</h2>

      <PrivacyItem
        title="Profile Visibility"
        desc="Allow other residents to see your profile"
        value={privacy.profileVisible}
        onToggle={() => toggle("profileVisible")}
      />

      <PrivacyItem
        title="Share EcoScore"
        desc="Display your EcoScore on society leaderboard"
        value={privacy.shareEcoScore}
        onToggle={() => toggle("shareEcoScore")}
      />

      <PrivacyItem
        title="Data Usage Consent"
        desc="Allow usage data for sustainability insights"
        value={privacy.allowDataUsage}
        onToggle={() => toggle("allowDataUsage")}
      />
    </div>
  );
}

function PrivacyItem({ title, desc, value, onToggle }) {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold">{title}</p>
          <p className="text-sm text-gray-500">{desc}</p>
        </div>
        <button
          onClick={onToggle}
          className={`px-4 py-1 rounded-full ${
            value ? "bg-green-500" : "bg-gray-400"
          }`}
        >
          {value ? "Enabled" : "Disabled"}
        </button>
      </div>
    </div>
  );
}
