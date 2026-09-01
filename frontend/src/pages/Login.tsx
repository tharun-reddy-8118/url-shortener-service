import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { Link2, Loader2, ArrowRight } from 'lucide-react';
import { ErrorMessage } from '../components/ErrorMessage';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authService.login({ username, password });
      authService.setToken(response.access_token);
      navigate('/dashboard');
    } catch (err: unknown) {
      const e = err as { response?: { status?: number } };
      if (e.response?.status === 401) {
        setError('Invalid username or password');
      } else {
        setError('Unable to connect to the server. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950">
      {/* Left side - Stunning Dark Mesh */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-950 p-12 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 text-white font-bold text-2xl tracking-tight">
            <Link2 size={28} className="text-blue-500" />
            <span>ShortLink</span>
          </Link>
        </div>
        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-bold text-white tracking-tight mb-4">
            Manage your links with precision.
          </h1>
          <p className="text-slate-400 text-lg">
            A fast, secure, and modern platform for shortening and tracking URLs.
          </p>
        </div>
        <div className="relative z-10 text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} ShortLink Inc.
        </div>
        
        {/* Ocean Mesh background decoration */}
        <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] bg-blue-900/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-cyan-900/20 rounded-full blur-[140px]"></div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-slate-100 dark:bg-slate-900 p-8 sm:p-12 relative z-10 transition-colors duration-300">
        <div className="w-full max-w-md space-y-8 clay-card p-8 sm:p-10 bg-white dark:bg-slate-800/50">
          <div className="lg:hidden flex justify-center items-center gap-2 text-slate-900 dark:text-white font-bold text-2xl tracking-tight mb-8 transition-colors">
            <Link2 size={28} className="text-blue-500" />
            <span>ShortLink</span>
          </div>
          
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors">Sign in</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 transition-colors">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-all">
                Create one now
              </Link>
            </p>
          </div>

          <form className="space-y-6 mt-8" onSubmit={handleSubmit}>
            {error && <ErrorMessage message={error} />}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="sr-only">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="clay-input block w-full px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm"
                  placeholder="Enter your username"
                />
              </div>

              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="clay-input block w-full px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="clay-primary w-full flex justify-center items-center gap-2 py-3 px-4 rounded-[1rem] text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

