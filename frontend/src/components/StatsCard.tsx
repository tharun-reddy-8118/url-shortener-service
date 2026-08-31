import type { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
}

export function StatsCard({ title, value, icon, trend }: StatsCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900/40 dark:backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-white/10 p-6 shadow-sm hover:shadow-md dark:shadow-xl dark:hover:bg-slate-800/50 dark:hover:border-white/20 hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs sm:text-sm font-medium dark:font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest transition-colors">{title}</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{value}</p>
        </div>
        <div className="p-3 bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-blue-400 rounded-xl dark:border dark:border-white/5 shadow-none dark:shadow-inner transition-colors">
          {icon}
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center text-sm">
          <span className="text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-400/10 border border-emerald-100 dark:border-emerald-400/20 px-2 py-0.5 rounded-full transition-colors">{trend}</span>
          <span className="text-slate-500 ml-2">from last month</span>
        </div>
      )}
    </div>
  );
}
