import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { StatsCard } from '../components/StatsCard';
import { CreateUrlForm } from '../components/CreateUrlForm';
import { UrlList } from '../components/UrlList';
import { ClickHistory } from '../components/ClickHistory';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { authService } from '../services/authService';
import { urlService } from '../services/urlService';
import type { User, URL } from '../types/api';
import { Link, CheckCircle, MousePointerClick } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

export function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [urls, setUrls] = useState<URL[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [historyUrlId, setHistoryUrlId] = useState<number | null>(null);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      const [userData, urlsData] = await Promise.all([
        authService.getCurrentUser(),
        urlService.getMyUrls()
      ]);
      setUser(userData);
      setUrls(urlsData);
    } catch (err: unknown) {
      const e = err as { response?: { status?: number } };
      if (e.response?.status === 401) {
        authService.logout();
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchData();
  }, [fetchData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center relative overflow-hidden transition-colors duration-300">
        {/* Subtle mesh background for loading state */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-100/50 dark:bg-blue-900/10 rounded-full blur-[120px] pointer-events-none transition-colors duration-300"></div>
        <div className="relative z-10 flex flex-col items-center">
          <LoadingSpinner size={48} className="text-blue-500" />
          <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium tracking-wide">Initializing workspace...</p>
        </div>
      </div>
    );
  }

  const activeUrls = urls.filter(u => u.is_active).length;
  // We're calculating total clicks by summing them up - in a real scenario, this might be a backend endpoint, 
  // but we'll stick to what we have or fetch it individually if needed. We'll leave it as a placeholder here, 
  // or just show total links and active links for now since getting all clicks for all URLs would require many API calls.
  // We can just show basic stats.

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col relative overflow-hidden text-slate-900 dark:text-slate-300 transition-colors duration-300">
      {/* Subtle background pattern - Light mode */}
      <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-0 pointer-events-none transition-opacity duration-300" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      
      {/* Stunning dark mode mesh gradient background - Dark mode */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-300">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-cyan-900/10 rounded-full blur-[140px]"></div>
        <div className="absolute top-[40%] left-[20%] w-[30%] h-[30%] bg-indigo-900/10 rounded-full blur-[100px]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      </div>
      
      <div className="relative z-10 flex flex-col flex-grow">
        <Navbar user={user} />
        
        <main className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl dark:text-3xl font-bold text-slate-900 dark:text-white tracking-tight transition-all">Overview</h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard 
              title="Total Links" 
              value={urls.length} 
              icon={<Link size={22} />} 
            />
            <StatsCard 
              title="Active Links" 
              value={activeUrls} 
              icon={<CheckCircle size={22} />} 
            />
            <StatsCard 
              title="Inactive Links" 
              value={urls.length - activeUrls} 
              icon={<MousePointerClick size={22} />} 
            />
          </div>

          <CreateUrlForm onSuccess={fetchData} />

          <div className="pt-6">
            <h2 className="text-xl dark:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-6 transition-colors">Recent Links</h2>
            <UrlList 
              urls={urls} 
              onUpdate={fetchData} 
              onViewHistory={(id) => setHistoryUrlId(id)} 
            />
          </div>
        </main>
      </div>

      {historyUrlId && (
        <ClickHistory 
          urlId={historyUrlId} 
          onClose={() => setHistoryUrlId(null)} 
        />
      )}
    </div>
  );
}
