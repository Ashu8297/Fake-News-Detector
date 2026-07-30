import React, { useState, useEffect } from 'react';
import { ShieldAlert, Users, Search, Ban, Trash2, KeyRound, CheckCircle2, AlertOctagon, UserCheck } from 'lucide-react';
import { authApi } from '../auth/authApi';

export default function AdminDashboardPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Password Reset Modal
  const [resetModalUser, setResetModalUser] = useState(null);
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await authApi.adminUsers(search);
      if (res.data && res.data.data) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.log('Error fetching admin users list:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (userId) => {
    try {
      const res = await authApi.blockUser(userId);
      setMessage(res.data.message);
      fetchUsers();
    } catch (err) {
      setMessage('Failed to toggle block status.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await authApi.deleteUser(userId);
      setMessage('User deleted successfully.');
      fetchUsers();
    } catch (err) {
      setMessage('Failed to delete user.');
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!resetModalUser || !newAdminPassword) return;
    try {
      await authApi.adminResetPassword(resetModalUser.id, {
        new_password: newAdminPassword
      });
      setMessage(`Password reset for ${resetModalUser.email}.`);
      setResetModalUser(null);
      setNewAdminPassword('');
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Failed to reset password.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-3">
          <ShieldAlert className="w-8 h-8 text-rose-600" />
          <span>Admin User Management Console</span>
        </h1>
        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
          Search users, manage accounts, block/unblock access, and force reset passwords.
        </p>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-blue-100 dark:bg-blue-950/50 text-blue-900 dark:text-blue-300 text-xs font-bold flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage('')} className="font-bold underline text-xs">Dismiss</button>
        </div>
      )}

      {/* User Management Panel */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-300 dark:border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span>Registered Users Directory ({users.length})</span>
          </h3>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Search user name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-200/80 dark:bg-slate-800 text-slate-800 dark:text-slate-200 uppercase font-extrabold">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Contact</th>
                <th className="p-3">Provider</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300 dark:divide-slate-800 text-slate-900 dark:text-slate-100 font-medium">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-100/50 dark:hover:bg-slate-800/50">
                  <td className="p-3 flex items-center space-x-3">
                    <img
                      src={u.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.email}`}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full border border-slate-300"
                    />
                    <div>
                      <div className="font-extrabold text-slate-900 dark:text-white">{u.full_name}</div>
                      <div className="text-[10px] text-slate-600 dark:text-slate-400 font-bold">{u.gender || 'Other'} • DOB: {u.dob || 'N/A'}</div>
                    </div>
                  </td>

                  <td className="p-3">
                    <div className="font-bold">{u.email}</div>
                    <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono font-bold">{u.phone || 'No Phone'}</div>
                  </td>

                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 font-extrabold text-[10px] uppercase">
                      {u.provider || 'email'}
                    </span>
                  </td>

                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                      u.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300' : 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {u.role}
                    </span>
                  </td>

                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                      u.status === 'blocked' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}>
                      {u.status}
                    </span>
                  </td>

                  <td className="p-3 text-right space-x-1.5">
                    <button
                      onClick={() => handleToggleBlock(u.id)}
                      className="p-1.5 rounded-lg bg-amber-100 text-amber-900 dark:bg-amber-950/40 dark:text-amber-300 hover:bg-amber-200"
                      title={u.status === 'blocked' ? 'Unblock User' : 'Block User'}
                    >
                      <Ban className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setResetModalUser(u)}
                      className="p-1.5 rounded-lg bg-blue-100 text-blue-900 dark:bg-blue-950/40 dark:text-blue-300 hover:bg-blue-200"
                      title="Reset Password"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="p-1.5 rounded-lg bg-rose-100 text-rose-900 dark:bg-rose-950/40 dark:text-rose-300 hover:bg-rose-200"
                      title="Delete User"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reset Password Modal */}
      {resetModalUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <KeyRound className="w-5 h-5 text-blue-600" />
              <span>Reset Password for {resetModalUser.email}</span>
            </h3>

            <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">New Password (8+ chars, upper, lower, number, special)</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setResetModalUser(null)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-500/30"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
