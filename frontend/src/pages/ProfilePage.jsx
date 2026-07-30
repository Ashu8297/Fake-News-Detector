import React, { useState, useEffect } from 'react';
import { User, Bookmark, Settings, Calendar, Phone, Mail, ShieldCheck, LogOut } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage({ setActivePage }) {
  const { user, logout } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const res = await axios.get('/api/bookmarks');
      if (res.data && res.data.data) {
        setBookmarks(res.data.data);
      }
    } catch (err) {
      console.log('Bookmarks load note:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      
      {/* Profile Header Card */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-300 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <img
            src={user?.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'default'}`}
            alt="Avatar"
            className="w-20 h-20 rounded-3xl bg-blue-600 border-2 border-blue-500 shadow-xl object-cover"
          />

          <div className="space-y-1 text-center sm:text-left">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">{user?.full_name || 'User Profile'}</h2>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center sm:justify-start space-x-2">
              <Mail className="w-3.5 h-3.5 text-blue-600" />
              <span>{user?.email || 'user@truthlens.ai'}</span>
            </div>

            {user?.phone && (
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center sm:justify-start space-x-2">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>{user.phone}</span>
              </div>
            )}

            <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 text-[10px] font-extrabold uppercase">
                Provider: {user?.provider || 'Email'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300 text-[10px] font-extrabold uppercase">
                Role: {user?.role || 'User'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <button
            onClick={() => setActivePage('settings')}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-900 dark:text-slate-100 text-xs font-bold transition-all"
          >
            <Settings className="w-4 h-4 text-indigo-600" />
            <span>Account Settings</span>
          </button>

          <button
            onClick={() => {
              logout();
              setActivePage('home');
            }}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-300 text-xs font-bold hover:bg-rose-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Bookmarks Section */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-300 dark:border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <Bookmark className="w-5 h-5 text-indigo-600" />
          <span>Saved Bookmarks ({bookmarks.length})</span>
        </h3>

        {bookmarks.length === 0 ? (
          <p className="text-xs font-medium text-slate-700 dark:text-slate-300">No bookmarked articles yet. Click the bookmark icon on any prediction result card to save it here.</p>
        ) : (
          <div className="space-y-3">
            {bookmarks.map((bm) => (
              <div key={bm.id} className="p-4 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-800 space-y-1 text-xs font-bold text-slate-900 dark:text-slate-100">
                <span className="font-extrabold text-blue-600">{bm.prediction} ({bm.confidence}%)</span>
                <p className="text-slate-800 dark:text-slate-200 line-clamp-2">"{bm.news_text}"</p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
