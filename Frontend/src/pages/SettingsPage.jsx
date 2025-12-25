import { useState, useEffect } from 'react';
import Card from '../components/atoms/Card';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';
import Icon from '../components/atoms/Icon';

import NotificationSettings from "../components/settings/NotificationSettings";
import PrivacySettings from "../components/settings/PrivacySettings";

// Services
import userService from '../services/userService';

// =============================================================================
// TOAST COMPONENT
// =============================================================================

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';

  return (
    <div className={`fixed bottom-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50`}>
      <Icon name={type === 'success' ? 'check_circle' : 'error'} size={20} />
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-75">
        <Icon name="close" size={18} />
      </button>
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Profile state
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    flat: '',
  });

  /**
   * Fetch user profile
   */
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const user = await userService.getProfile();
      if (user) {
        // Split name into first/last for form
        const nameParts = (user.name || '').split(' ');
        setProfile({
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          email: user.email || '',
          phone: user.phone || '',
          flat: user.flat || '',
          initials: userService.getUserInitials(user.name),
        });
      }
    } catch (error) {
      console.error('Fetch profile error:', error);
      setToast({ message: 'Failed to load profile', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  /**
   * Handle profile save
   */
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData(e.target);
    const name = `${formData.get('firstName')} ${formData.get('lastName')}`.trim();

    try {
      await userService.updateProfile({
        name,
        phone: formData.get('phone'),
      });
      setToast({ message: 'Profile updated successfully!', type: 'success' });
    } catch (error) {
      console.error('Save profile error:', error);
      setToast({ message: error.message || 'Failed to save profile', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  /**
   * Handle password change
   */
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData(e.target);
    const currentPassword = formData.get('currentPassword');
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');

    if (newPassword !== confirmPassword) {
      setToast({ message: 'New passwords do not match', type: 'error' });
      setSaving(false);
      return;
    }

    if (newPassword.length < 6) {
      setToast({ message: 'Password must be at least 6 characters', type: 'error' });
      setSaving(false);
      return;
    }

    try {
      await userService.changePassword(currentPassword, newPassword);
      setToast({ message: 'Password changed successfully!', type: 'success' });
      e.target.reset();
    } catch (error) {
      console.error('Change password error:', error);
      setToast({ message: error.message || 'Failed to change password', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

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
                                    ${activeTab === tab
                    ? 'bg-primary text-black font-bold'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'
                  }`}
              >
                <Icon
                  name={
                    tab === 'profile' ? 'person'
                      : tab === 'security' ? 'lock'
                        : tab === 'notifications' ? 'notifications'
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
              {loading ? (
                <div className="animate-pulse">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="size-24 rounded-full bg-gray-200 dark:bg-gray-700" />
                    <div>
                      <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                      <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded" />
                    ))}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveProfile}>
                  <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                    <div className="relative">
                      <div className="size-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-3xl font-bold text-gray-500">
                          {profile.initials || 'U'}
                        </span>
                      </div>
                      <button type="button" className="absolute bottom-0 right-0 p-1.5 bg-primary rounded-full border-2 border-white text-black">
                        <Icon name="edit" size={16} />
                      </button>
                    </div>
                    <div className="text-center md:text-left">
                      <h2 className="text-xl font-bold dark:text-white">
                        {profile.firstName} {profile.lastName}
                      </h2>
                      <p className="text-gray-500">Resident • {profile.flat || 'Unit N/A'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="First Name"
                      name="firstName"
                      defaultValue={profile.firstName}
                    />
                    <Input
                      label="Last Name"
                      name="lastName"
                      defaultValue={profile.lastName}
                    />
                    <Input
                      label="Email Address"
                      name="email"
                      defaultValue={profile.email}
                      disabled
                      className="opacity-60"
                    />
                    <Input
                      label="Phone Number"
                      name="phone"
                      defaultValue={profile.phone}
                    />
                  </div>

                  <div className="mt-8 flex justify-end">
                    <Button type="submit" disabled={saving}>
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              )}
            </Card>
          )}

          {/* SECURITY */}
          {activeTab === 'security' && (
            <Card>
              <h2 className="text-xl font-bold mb-6 dark:text-white">
                Security Settings
              </h2>

              <form onSubmit={handleChangePassword} className="space-y-6 max-w-md">
                <Input type="password" name="currentPassword" label="Current Password" required />
                <Input type="password" name="newPassword" label="New Password" required />
                <Input type="password" name="confirmPassword" label="Confirm New Password" required />

                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Updating...' : 'Update Password'}
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <Card>
              <NotificationSettings />
            </Card>
          )}

          {/* PRIVACY */}
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
