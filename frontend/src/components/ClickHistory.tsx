import { useState, useEffect } from 'react';
import { urlService } from '../services/urlService';
import type { Click } from '../types/api';
import { format } from 'date-fns';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { X, Globe, Monitor, Clock } from 'lucide-react';

interface ClickHistoryProps {
  urlId: number;
  onClose: () => void;
}

export function ClickHistory({ urlId, onClose }: ClickHistoryProps) {
  const [clicks, setClicks] = useState<Click[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const data = await urlService.getClickHistory(urlId);
        setClicks(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load click history.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [urlId]);

  return (
    <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-sm dark:backdrop-blur-md flex items-center justify-center z-[100] p-4 transition-all">
      <div className="bg-white dark:bg-slate-900/90 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col overflow-hidden border border-slate-200 dark:border-white/10 dark:shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-colors">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-slate-800/30 transition-colors">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors">Click History</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-white bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full p-1.5 transition-all"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-grow bg-white dark:bg-slate-900/50 transition-colors">
          {isLoading ? (
            <div className="py-16">
              <LoadingSpinner size={36} className="text-slate-900 dark:text-blue-500 transition-colors" />
              <p className="text-center text-slate-500 dark:text-slate-400 mt-4 font-medium transition-colors">Loading history...</p>
            </div>
          ) : error ? (
            <ErrorMessage message={error} />
          ) : clicks.length === 0 ? (
            <div className="text-center py-16">
              <Globe size={56} className="mx-auto text-slate-200 dark:text-slate-700 mb-5 transition-colors" />
              <p className="text-slate-500 dark:text-slate-400 font-medium text-lg tracking-tight transition-colors">No clicks recorded yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {clicks.map((click) => (
                <div key={click.id} className="bg-white dark:bg-slate-800/40 dark:backdrop-blur-sm rounded-xl p-4 flex flex-col sm:flex-row gap-4 border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-md dark:hover:shadow-sm dark:hover:bg-slate-800/80 transition-all">
                  <div className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300 sm:w-1/3 transition-colors">
                    <div className="p-1.5 bg-slate-100 dark:bg-slate-950/50 rounded-lg text-slate-500 dark:text-slate-400 dark:border dark:border-white/5 transition-colors">
                      <Clock size={16} />
                    </div>
                    <span className="font-medium">
                      {format(new Date(click.clicked_at), 'MMM d, yyyy h:mm a')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300 sm:w-1/3 transition-colors">
                    <div className="p-1.5 bg-slate-100 dark:bg-slate-950/50 rounded-lg text-slate-500 dark:text-slate-400 dark:border dark:border-white/5 transition-colors">
                      <Monitor size={16} />
                    </div>
                    <span className="truncate font-medium" title={click.user_agent || 'Unknown'}>
                      {click.user_agent || 'Unknown Device'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300 sm:w-1/3 transition-colors">
                    <div className="p-1.5 bg-slate-100 dark:bg-slate-950/50 rounded-lg text-slate-500 dark:text-slate-400 dark:border dark:border-white/5 transition-colors">
                      <Globe size={16} />
                    </div>
                    <span className="truncate font-medium">
                      {click.referrer ? new URL(click.referrer).hostname : 'Direct'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
