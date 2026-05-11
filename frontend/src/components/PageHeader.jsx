import { ArrowLeft, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PageHeader({ title, backTo, actions }) {
  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200/80 px-6 py-3 sticky top-0 z-40 shadow-sm">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link
            to={backTo}
            className="p-2 hover:bg-indigo-50 rounded-xl transition-colors text-gray-400 hover:text-indigo-600"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-2">
            <div className="p-1 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-md">
              <GraduationCap size={14} className="text-white" />
            </div>
            <h1 className="text-base font-bold text-gray-800 line-clamp-1">{title}</h1>
          </div>
        </div>

        {actions && (
          <div className="flex gap-1">
            {actions}
          </div>
        )}
      </div>
    </nav>
  );
}