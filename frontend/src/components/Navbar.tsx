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
    <nav className="sticky top-0 z-50 clay-card rounded-none border-t-0 border-x-0 border-b border-slate-300/50 dark:border-white/5 transition-colors duration-300 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl">
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
              className="clay-btn p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
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
                  className="clay-btn flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
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
