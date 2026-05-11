// components/CourseCard.jsx

import { BookOpen, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function CourseCard({ course, userId }) {
  const navigate = useNavigate();
  const isOwner = course.creator_id === userId;

  return (
    <div
      onClick={() => navigate(`/courses/${course.id}`)}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
          <BookOpen size={24} />
        </div>
        {isOwner ? (
          <span className="text-xs font-semibold text-green-700 bg-green-100 px-2.5 py-1 rounded">
            Meu curso
          </span>
        ) : (
          <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded">
            ID: #{course.id}
          </span>
        )}
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
        {course.name}
      </h3>
      <p className="text-gray-500 text-sm mb-6 line-clamp-2 min-h-[40px]">
        {course.description || 'Sem descrição disponível.'}
      </p>

      <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Calendar size={14} />
          <span>{new Date(course.start_date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <span>até</span>
          <span>{new Date(course.end_date).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}