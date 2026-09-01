import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { Link2, Loader2, ArrowRight } from 'lucide-react';
import { ErrorMessage } from '../components/ErrorMessage';

export function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      await authService.register({ username, email, password });
      const loginResponse = await authService.login({ username, password });
      authService.setToken(loginResponse.access_token);
      navigate('/dashboard');
    } catch (err: unknown) {
      const e = err as { response?: { status?: number, data?: { detail?: string } } };
      if (e.response?.status === 409) {
        setError(e.response.data?.detail || 'Username or email already exists');
      } else {
        setError('Registration failed. Please try again.');
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
            Join the future of links.
          </h1>
          <p className="text-slate-400 text-lg">
            Create an account to track clicks, manage URLs, and get valuable insights.
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
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-slate-100 dark:bg-slate-900 p-8 sm:p-12 overflow-y-auto relative z-10 transition-colors duration-300">
        <div className="w-full max-w-md space-y-8 my-auto py-8 clay-card p-8 sm:p-10 bg-white dark:bg-slate-800/50">
          <div className="lg:hidden flex justify-center items-center gap-2 text-slate-900 dark:text-white font-bold text-2xl tracking-tight mb-8 transition-colors">
            <Link2 size={28} className="text-blue-500" />
            <span>ShortLink</span>
          </div>
          
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors">Create account</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 transition-colors">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-all">
                Sign in here
              </Link>
            </p>
          </div>

          <form className="space-y-5 mt-8" onSubmit={handleSubmit}>
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
                  placeholder="Choose a username"
                />
              </div>

              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="clay-input block w-full px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm"
                  placeholder="you@example.com"
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
                  placeholder="Password (Min 6 chars)"
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="clay-input block w-full px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm"
                  placeholder="Repeat password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="clay-primary w-full flex justify-center items-center gap-2 py-3 px-4 mt-2 rounded-[1rem] text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Sign up <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

