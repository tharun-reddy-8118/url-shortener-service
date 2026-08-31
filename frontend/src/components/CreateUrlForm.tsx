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
    <div className="bg-white dark:bg-slate-900/40 dark:backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-white/10 p-8 shadow-sm dark:shadow-xl transition-colors duration-300">
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
              className="block w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm shadow-none dark:shadow-inner"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !originalUrl}
            className="inline-flex justify-center items-center px-8 py-3 border border-transparent text-sm font-semibold rounded-xl shadow-sm dark:shadow-[0_0_15px_rgba(59,130,246,0.3)] text-white bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 dark:focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap transition-all"
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
