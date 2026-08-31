import type { URL } from '../types/api';
import { UrlCard } from './UrlCard';
import { Link2 } from 'lucide-react';

interface UrlListProps {
  urls: URL[];
  onUpdate: () => void;
  onViewHistory: (id: number) => void;
}

export function UrlList({ urls, onUpdate, onViewHistory }: UrlListProps) {
  if (urls.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900/40 dark:backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-white/10 p-16 text-center shadow-sm dark:shadow-xl transition-colors duration-300">
        <div className="mx-auto w-20 h-20 bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6 shadow-sm dark:shadow-inner border border-slate-200 dark:border-white/5 transition-colors">
          <Link2 size={36} />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight transition-colors">No shortened URLs yet</h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto text-base transition-colors">
          Create your first short link using the form above to start tracking clicks and managing your URLs.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {urls.map((url) => (
        <UrlCard 
          key={url.id} 
          url={url} 
          onUpdate={onUpdate} 
          onViewHistory={onViewHistory} 
        />
      ))}
    </div>
  );
}
