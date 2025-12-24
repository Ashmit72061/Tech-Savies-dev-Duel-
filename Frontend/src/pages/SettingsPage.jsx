import { useState } from 'react';
import Card from '../components/atoms/Card';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';
import Icon from '../components/atoms/Icon';

import NotificationSettings from "../components/settings/NotificationSettings";
import PrivacySettings from "../components/settings/PrivacySettings";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold dark:text-white">Account Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar */}
        <div>
          <Card padding="p-2">
            {['profile', 'security', 'notifications', 'privacy'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center gap-3 transition-colors capitalize
                  ${
                    activeTab === tab
                      ? 'bg-primary text-black font-bold'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'
                  }`}
              >
                <Icon
                  name={
                    tab === 'profile'
                      ? 'person'
                      : tab === 'security'
                      ? 'lock'
                      : tab === 'notifications'
                      ? 'notifications'
                      : 'visibility_off'
                  }
                  size={20}
                />
                {tab}
              </button>
            ))}
          </Card>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">

          {/* PROFILE */}
          {activeTab === 'profile' && (
            <Card>
              <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                <div className="relative">
                  <div className="size-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-3xl font-bold text-gray-500">JD</span>
                  </div>
                  <button className="absolute bottom-0 right-0 p-1.5 bg-primary rounded-full border-2 border-white text-black">
                    <Icon name="edit" size={16} />
                  </button>
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-xl font-bold dark:text-white">John Doe</h2>
                  <p className="text-gray-500">Resident • Unit 402</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="First Name" defaultValue="John" />
                <Input label="Last Name" defaultValue="Doe" />
                <Input label="Email Address" defaultValue="john.doe@example.com" />
                <Input label="Phone Number" defaultValue="+1 234 567 890" />
              </div>

              <div className="mt-8 flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </Card>
          )}

          {/* SECURITY */}
          {activeTab === 'security' && (
            <Card>
              <h2 className="text-xl font-bold mb-6 dark:text-white">
                Security Settings
              </h2>

              <div className="space-y-6 max-w-md">
                <Input type="password" label="Current Password" />
                <Input type="password" label="New Password" />
                <Input type="password" label="Confirm New Password" />

                <div className="flex justify-end pt-4">
                  <Button>Update Password</Button>
                </div>
              </div>
            </Card>
          )}

          {/* NOTIFICATIONS ✅ */}
          {activeTab === 'notifications' && (
            <Card>
              <NotificationSettings />
            </Card>
          )}

          {/* PRIVACY ✅ */}
          {activeTab === 'privacy' && (
            <Card>
              <PrivacySettings />
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}
