import { RefreshCw } from 'lucide-react';

export function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <RefreshCw className="animate-spin text-blue-600" size={32} />
    </div>
  );
}