import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PageHeader({ title, backTo, actions }) {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link
            to={backTo}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-blue-600"
          >
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-xl font-bold text-gray-800 line-clamp-1">{title}</h1>
        </div>

        {actions && (
          <div className="flex gap-2">
            {actions}
          </div>
        )}
      </div>
    </nav>
  );
}