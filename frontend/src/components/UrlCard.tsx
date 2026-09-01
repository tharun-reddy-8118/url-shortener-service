import { useState, useEffect } from 'react';
import type { URL } from '../types/api';
import { urlService } from '../services/urlService';
import { Copy, ExternalLink, BarChart2, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface UrlCardProps {
  url: URL;
  onUpdate: () => void;
  onViewHistory: (id: number) => void;
}

export function UrlCard({ url, onUpdate, onViewHistory }: UrlCardProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [clicks, setClicks] = useState<number | null>(null);

  const shortUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/urls/${url.short_code}`;

  useEffect(() => {
    urlService.getClickCount(url.id)
      .then(res => setClicks(res.total_clicks))
      .catch(() => setClicks(0));
  }, [url.id]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleToggleStatus = async () => {
    try {
      setIsToggling(true);
      if (url.is_active) {
        await urlService.deactivateUrl(url.id);
      } else {
        await urlService.activateUrl(url.id);
      }
      onUpdate();
    } catch (err) {
      console.error('Failed to toggle status', err);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className={`clay-card p-6 transition-all duration-300 bg-white dark:bg-slate-800/50 ${!url.is_active ? 'opacity-60 grayscale' : 'hover:-translate-y-1'}`}>
      <div className="flex justify-between items-start mb-5">
        <div className="flex-grow pr-4">
          <div className="flex items-center gap-3 mb-2">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${url.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' : 'bg-slate-100 text-slate-500 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'}`}>
              {url.is_active ? 'Active' : 'Inactive'}
            </span>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 transition-colors">
              {format(new Date(url.created_at), 'MMM d, yyyy')}
            </span>
          </div>
          <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="text-xl font-bold text-slate-900 dark:text-white hover:text-slate-600 dark:hover:text-blue-400 flex items-center gap-1.5 group transition-colors">
            {shortUrl}
            <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 dark:text-blue-400" />
          </a>
          <p className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-lg mt-1 font-medium transition-colors" title={url.original_url}>
            {url.original_url}
          </p>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="clay-input px-4 py-3 text-center min-w-[90px] transition-colors">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Clicks</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">
              {clicks !== null ? clicks : <Loader2 size={20} className="animate-spin mx-auto text-slate-400 dark:text-slate-600" />}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-5 border-t border-slate-300/30 dark:border-white/5 transition-colors">
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="clay-btn inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all"
          >
            {isCopied ? <CheckCircle size={16} className="text-emerald-500 dark:text-emerald-400" /> : <Copy size={16} />}
            {isCopied ? 'Copied!' : 'Copy'}
          </button>
          
          <button
            onClick={() => onViewHistory(url.id)}
            className="clay-btn inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all"
          >
            <BarChart2 size={16} />
            Analytics
          </button>
        </div>
        
        <button
          onClick={handleToggleStatus}
          disabled={isToggling}
          className={`clay-btn inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all ${
            url.is_active 
              ? 'text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300' 
              : 'text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300'
          }`}
        >
          {isToggling ? (
            <Loader2 size={16} className="animate-spin" />
          ) : url.is_active ? (
            <XCircle size={16} />
          ) : (
            <CheckCircle size={16} />
          )}
          {isToggling 
            ? (url.is_active ? 'Deactivating...' : 'Activating...') 
            : (url.is_active ? 'Deactivate' : 'Activate')
          }
        </button>
      </div>
    </div>
  );
}
