import { useState } from 'react';
import { urlService } from '../services/urlService';
import { Link, Loader2 } from 'lucide-react';
import { ErrorMessage } from './ErrorMessage';

export function CreateUrlForm({ onSuccess }: { onSuccess: () => void }) {
  const [originalUrl, setOriginalUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalUrl) return;

    try {
      setIsLoading(true);
      setError('');
      await urlService.createUrl({ original_url: originalUrl });
      setOriginalUrl('');
      onSuccess();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      setError(e.response?.data?.detail || 'Failed to shorten URL');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="clay-card p-8 transition-colors duration-300 bg-indigo-50/30 dark:bg-slate-800/50">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 tracking-tight transition-colors">Create a new short link</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Link size={18} className="text-slate-400 dark:text-slate-500 transition-colors" />
            </div>
            <input
              type="url"
              required
              placeholder="https://example.com/very-long-url-that-needs-shortening"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              className="clay-input block w-full pl-11 pr-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !originalUrl}
            className="clay-primary inline-flex justify-center items-center px-8 py-3 text-sm font-semibold rounded-[1rem] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Shortening...
              </>
            ) : (
              'Shorten URL'
            )}
          </button>
        </div>
        {error && <ErrorMessage message={error} />}
      </form>
    </div>
  );
}
