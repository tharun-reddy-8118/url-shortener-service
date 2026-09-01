import { useState, useEffect } from 'react';
import { urlService } from '../services/urlService';
import type { Click } from '../types/api';
import { format } from 'date-fns';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { X, Globe, Monitor, Clock, BarChart2 } from 'lucide-react';

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
      <div className="clay-card relative w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden transition-colors duration-300 bg-white dark:bg-slate-900">
        <div className="flex items-center justify-between p-6 border-b border-slate-300/30 dark:border-white/5 transition-colors">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2 transition-colors">
            <BarChart2 className="text-blue-500" />
            Click Analytics
          </h2>
          <button
            onClick={onClose}
            className="clay-btn p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
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
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="clay-input p-5 transition-colors">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 transition-colors">Total Clicks</p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{clicks.length}</p>
                </div>
                <div className="clay-input p-5 transition-colors">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 transition-colors">Unique IPs</p>
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{new Set(clicks.map(c => c.ip_address).filter(Boolean)).size}</p>
                </div>
              </div>

              <div className="space-y-3">
                {clicks.map((click) => (
                  <div key={click.id} className="clay-card p-4 flex flex-col sm:flex-row gap-4 transition-all hover:-translate-y-0.5">
                    <div className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300 sm:w-1/3 transition-colors">
                      <div className="p-1.5 clay-input text-slate-500 dark:text-slate-400 transition-colors">
                        <Clock size={16} />
                      </div>
                      <span className="font-medium">
                        {format(new Date(click.clicked_at), 'MMM d, yyyy h:mm a')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300 sm:w-1/3 transition-colors">
                      <div className="p-1.5 clay-input text-slate-500 dark:text-slate-400 transition-colors">
                        <Monitor size={16} />
                      </div>
                      <span className="truncate font-medium" title={click.user_agent || 'Unknown'}>
                        {click.user_agent || 'Unknown Device'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300 sm:w-1/3 transition-colors">
                      <div className="p-1.5 clay-input text-slate-500 dark:text-slate-400 transition-colors">
                        <Globe size={16} />
                      </div>
                      <span className="truncate font-medium">
                        {click.referrer ? new URL(click.referrer).hostname : 'Direct'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
