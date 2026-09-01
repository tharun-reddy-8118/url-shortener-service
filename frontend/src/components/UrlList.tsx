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
      <div className="clay-card p-16 text-center transition-colors duration-300 bg-white dark:bg-slate-800/50">
        <div className="mx-auto w-20 h-20 clay-input text-slate-800 dark:text-blue-400 flex items-center justify-center mb-6 transition-colors">
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
