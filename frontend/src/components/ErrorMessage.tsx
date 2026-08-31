import { AlertCircle } from 'lucide-react';

export function ErrorMessage({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="flex items-center gap-2 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
      <AlertCircle size={16} />
      <span>{message}</span>
    </div>
  );
}
