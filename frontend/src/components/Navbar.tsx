import { Link, useNavigate } from 'react-router-dom';
import { Link2, LogOut, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import type { User } from '../types/api';

export function Navbar({ user }: { user: User | null }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/dashboard" className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xl tracking-tight transition-colors duration-300">
              <Link2 size={24} className="text-blue-500" />
              <span>ShortLink</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/50 dark:hover:bg-slate-700/50 rounded-lg transition-all"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            {user && (
              <div className="flex items-center gap-4 sm:gap-6">
                <span className="hidden sm:inline text-sm text-slate-600 dark:text-slate-400 transition-colors duration-300">
                  Welcome, <span className="font-semibold text-slate-900 dark:text-white">{user.username}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/50 rounded-lg transition-all"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
