import React from 'react';
import { 
  ShieldCheck, 
  Home, 
  Search, 
  BarChart3, 
  History, 
  TrendingUp, 
  GitCompare, 
  Info, 
  User, 
  ShieldAlert, 
  Sun, 
  Moon, 
  Bot 
} from 'lucide-react';

export default function Navbar({ activePage, setActivePage, isDark, setIsDark, toggleChat, currentUser }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'predict', label: 'Predict', icon: Search },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'compare', label: 'Compare', icon: GitCompare },
    { id: 'history', label: 'History', icon: History },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <nav className="sticky top-0 z-40 glass-panel border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActivePage('home')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform duration-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                TruthLens AI
              </span>
              <span className="block text-[9px] font-semibold tracking-widest text-slate-500 dark:text-slate-400 uppercase">
                Fact Checking Platform
              </span>
            </div>
          </div>

          {/* Nav Items */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-2">
            {/* AI Assistant Drawer Trigger */}
            <button
              onClick={toggleChat}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800/50 text-xs font-semibold border border-indigo-200 dark:border-indigo-800 transition-colors"
            >
              <Bot className="w-4 h-4 text-indigo-500" />
              <span className="hidden sm:inline">AI Chatbot</span>
            </button>

            {/* Profile / Admin Button */}
            <button
              onClick={() => setActivePage('profile')}
              className={`p-2 rounded-xl text-xs font-semibold transition-colors ${
                activePage === 'profile'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
              title="User Profile"
            >
              <User className="w-4 h-4" />
            </button>

            {/* Dark/Light Mode Switcher */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:ring-2 ring-blue-500/50 transition-all"
              title="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Row */}
        <div className="lg:hidden flex justify-around py-2 border-t border-slate-200 dark:border-slate-800 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`flex flex-col items-center px-2 py-1 rounded-lg text-[10px] font-medium transition-colors ${
                  isActive ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500'
                }`}
              >
                <Icon className="w-4 h-4 mb-0.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
