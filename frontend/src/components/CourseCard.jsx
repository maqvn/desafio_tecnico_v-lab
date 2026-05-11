// components/CourseCard.jsx

import { BookOpen, Calendar, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function CourseCard({ course, userId }) {
  const navigate = useNavigate();
  const isOwner = course.creator_id === userId;

  return (
    <div
      onClick={() => navigate(`/courses/${course.id}`)}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl hover:shadow-indigo-100 hover:-translate-y-1 transition-all duration-200 cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-gradient-to-br group-hover:from-indigo-600 group-hover:to-violet-600 group-hover:text-white transition-all duration-200 group-hover:shadow-md group-hover:shadow-indigo-200">
          <BookOpen size={22} />
        </div>
        {isOwner ? (
          <span className="text-xs font-semibold text-indigo-700 bg-indigo-100 px-2.5 py-1 rounded-full">
            Meu curso
          </span>
        ) : (
          <ArrowUpRight size={16} className="text-gray-300 group-hover:text-indigo-400 transition-colors" />
        )}
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-indigo-700 transition-colors">
        {course.name}
      </h3>
      <p className="text-gray-500 text-sm mb-6 line-clamp-2 min-h-[40px]">
        {course.description || 'Sem descrição disponível.'}
      </p>

      <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Calendar size={13} />
          <span>{new Date(course.start_date).toLocaleDateString('pt-BR')}</span>
        </div>
        <span className="text-gray-300">→</span>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <span>{new Date(course.end_date).toLocaleDateString('pt-BR')}</span>
        </div>
      </div>
    </div>
  );
}