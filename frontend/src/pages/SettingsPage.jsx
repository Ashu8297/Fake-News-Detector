import React, { useState } from 'react';
import { Settings, Lock, Phone, User, Trash2, LogOut, ShieldAlert, CheckCircle2, AlertOctagon } from 'lucide-react';
import { authApi } from '../auth/authApi';
import { useAuth } from '../context/AuthContext';

export default function SettingsPage({ setActivePage, showToast }) {
  const { user, setUser, logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileImage, setProfileImage] = useState(user?.profile_image || '');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const handleUpdateSecurity = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');

    try {
      const res = await authApi.updateProfile({
        current_password: currentPassword || undefined,
        new_password: newPassword || undefined,
        phone,
        profile_image: profileImage
      });

      if (res.data && res.data.user) {
        setUser(res.data.user);
        setMsg('Account settings updated successfully.');
        showToast('Settings saved!');
        setCurrentPassword('');
        setNewPassword('');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update settings.');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to permanently delete your account? This action cannot be undone.')) return;
    try {
      await authApi.deleteAccount();
      showToast('Account deleted.');
      logout();
      setActivePage('home');
    } catch (err) {
      showToast('Failed to delete account.', 'error');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-3">
          <Settings className="w-8 h-8 text-indigo-600" />
          <span>Account Settings & Security</span>
        </h1>
        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
          Manage password credentials, contact phone numbers, and profile settings.
        </p>
      </div>

      <form onSubmit={handleUpdateSecurity} className="glass-panel p-8 rounded-3xl space-y-6 border border-slate-300 dark:border-slate-800">
        {msg && (
          <div className="p-3.5 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{msg}</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-100 text-rose-900 text-xs font-bold flex items-center space-x-2">
            <AlertOctagon className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Contact Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Contact & Avatar Settings</h3>
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Phone Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555 123 4567"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Profile Image Avatar URL</label>
            <input
              type="text"
              value={profileImage}
              onChange={(e) => setProfileImage(e.target.value)}
              placeholder="https://api.dicebear.com/7.x/avataaars/svg?seed=avatar"
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Password Security */}
        <div className="space-y-4 pt-4 border-t border-slate-300 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Change Password</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-300 dark:border-slate-800">
          <button
            type="button"
            onClick={handleDeleteAccount}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-300 text-xs font-bold hover:bg-rose-200"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Account</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/30"
          >
            Save Account Settings
          </button>
        </div>
      </form>

    </div>
  );
}
